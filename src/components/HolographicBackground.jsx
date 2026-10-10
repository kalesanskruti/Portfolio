import { useEffect, useRef } from 'react'
import { applyPalette, HUE_SPEED, inkHueAt } from '../theme/dynamicPalette'

// Full-page "holographic ink" WebGL shader: dark domain-warped ink with
// oil-slick iridescence + film grain. Reacts to cursor, scroll and theme.

const VERT = 'attribute vec2 a;void main(){gl_Position=vec4(a,0,1);}'

const FRAG = `precision highp float;
uniform vec2 r;     // resolution (px)
uniform float t;    // time (s)
uniform vec2 m;     // smoothed mouse (px, origin bottom-left)
uniform float s;    // scroll progress (viewport heights)
uniform float l;    // 1.0 = light theme
float h(vec2 p){return fract(sin(dot(p,vec2(127.1,311.7)))*43758.5453);}
float n(vec2 p){vec2 i=floor(p),f=fract(p);f=f*f*(3.-2.*f);
  return mix(mix(h(i),h(i+vec2(1,0)),f.x),mix(h(i+vec2(0,1)),h(i+1.),f.x),f.y);}
float fbm(vec2 p){float v=0.,a=.5;for(int i=0;i<4;i++){v+=a*n(p);p=p*2.02+vec2(1.7,9.2);a*=.5;}return v;}
void main(){
  vec2 p=gl_FragCoord.xy/r.y*1.6;
  p.y-=s*.35;
  vec2 mp=m/r.y*1.6; mp.y-=s*.35;
  vec2 q=vec2(fbm(p+t*.04),fbm(p+vec2(5.2,1.3)-t*.03));
  vec2 w=vec2(fbm(p+3.5*q+vec2(1.7,9.2)+t*.05),fbm(p+3.5*q+vec2(8.3,2.8)));
  w+=.15*exp(-length(p-mp)*2.)*vec2(1.,-1.);
  float f=fbm(p+4.*w);
  // One dominant hue that cycles over time (+ small local variation).
  // HUE_SPEED is shared with src/theme/dynamicPalette.js so the UI matches.
  float hue=t*${HUE_SPEED.toFixed(4)}+(f*1.4+length(w)*.8)*.12;
  vec3 ir=.5+.5*cos(6.28*(hue+vec3(0.,.33,.67)));
  float mask=smoothstep(.35,.95,f*f*2.);
  float g=(h(gl_FragCoord.xy+fract(t*7.))-.5)*.03;
  vec3 dark=vec3(.01,.01,.016)+ir*mask*.38+pow(mask,6.)*.25;
  vec3 light=vec3(.975,.975,.985)-(1.-ir)*mask*.22;
  vec3 col=mix(dark,light,l);
  vec2 uv=gl_FragCoord.xy/r;
  col*=mix(1.,1.-length(uv-.5)*.55,1.-l);   // soft vignette in dark mode
  gl_FragColor=vec4(col+g,1);
}`

// Performance budget: the ink is soft and slow, so it is rendered at a fraction
// of the screen resolution and at most 30 fps — visually identical, a fraction
// of the GPU cost (leaves the main thread free for the character + scrolling).
const RENDER_SCALE = 0.4
const MIN_SCALE = 0.28 // auto-downgrade floor on slow GPUs
const FRAME_MS = 1000 / 30
const PALETTE_MS = 500 // re-tint the UI at most twice a second

export default function HolographicBackground() {
  const canvasRef = useRef(null)
  const fallbackRef = useRef(null)

  useEffect(() => {
    const canvas = canvasRef.current
    const gl = canvas.getContext('webgl', { antialias: false, alpha: false, powerPreference: 'low-power' })
    if (!gl) {
      fallbackRef.current.style.display = 'block'
      applyPalette(inkHueAt(0), true)
      return
    }
    applyPalette(inkHueAt(0), true)

    const compile = (type, src) => {
      const sh = gl.createShader(type)
      gl.shaderSource(sh, src)
      gl.compileShader(sh)
      if (!gl.getShaderParameter(sh, gl.COMPILE_STATUS)) throw new Error(gl.getShaderInfoLog(sh))
      return sh
    }

    let program
    try {
      program = gl.createProgram()
      gl.attachShader(program, compile(gl.VERTEX_SHADER, VERT))
      gl.attachShader(program, compile(gl.FRAGMENT_SHADER, FRAG))
      gl.linkProgram(program)
    } catch (err) {
      console.error('Holographic background shader failed:', err)
      fallbackRef.current.style.display = 'block'
      applyPalette(inkHueAt(0), true)
      return
    }

    gl.useProgram(program)
    const buf = gl.createBuffer()
    gl.bindBuffer(gl.ARRAY_BUFFER, buf)
    gl.bufferData(gl.ARRAY_BUFFER, new Float32Array([-1, -1, 1, -1, -1, 1, 1, 1]), gl.STATIC_DRAW)
    const aLoc = gl.getAttribLocation(program, 'a')
    gl.enableVertexAttribArray(aLoc)
    gl.vertexAttribPointer(aLoc, 2, gl.FLOAT, false, 0, 0)
    const u = Object.fromEntries(['r', 't', 'm', 's', 'l'].map((k) => [k, gl.getUniformLocation(program, k)]))

    const reduceMotion = window.matchMedia('(prefers-reduced-motion: reduce)').matches
    let scale = RENDER_SCALE
    let target = null
    const mouse = [0, 0]
    let raf = 0
    const start = performance.now()

    const resize = () => {
      canvas.width = Math.round(window.innerWidth * scale)
      canvas.height = Math.round(window.innerHeight * scale)
      gl.viewport(0, 0, canvas.width, canvas.height)
      if (reduceMotion) draw(0)
    }

    const onMove = (e) => {
      target = [e.clientX * scale, (window.innerHeight - e.clientY) * scale]
    }
    const onLeave = () => (target = null)

    function draw(time) {
      const W = canvas.width
      const H = canvas.height
      // drift on its own when the cursor isn't over the page
      const tx = target ? target[0] : W * (0.5 + 0.3 * Math.cos(time * 0.4))
      const ty = target ? target[1] : H * (0.55 + 0.25 * Math.sin(time * 0.55))
      mouse[0] += (tx - mouse[0]) * 0.06
      mouse[1] += (ty - mouse[1]) * 0.06
      gl.uniform2f(u.r, W, H)
      gl.uniform1f(u.t, time)
      gl.uniform2f(u.m, mouse[0], mouse[1])
      gl.uniform1f(u.s, window.scrollY / window.innerHeight)
      gl.uniform1f(u.l, document.documentElement.classList.contains('dark') ? 0 : 1)
      gl.drawArrays(gl.TRIANGLE_STRIP, 0, 4)
    }

    let frames = 0
    let slowFrames = 0
    let lastDraw = 0
    let lastPalette = 0
    const loop = (now) => {
      raf = requestAnimationFrame(loop)
      if (now - lastDraw < FRAME_MS - 2) return // 30 fps cap
      // Auto-downgrade resolution on slow devices
      if (frames < 60) {
        if (lastDraw && now - lastDraw > FRAME_MS * 1.8) slowFrames++
        if (++frames === 60 && slowFrames > 20 && scale > MIN_SCALE) {
          scale = MIN_SCALE
          resize()
        }
      }
      lastDraw = now
      const time = (now - start) / 1000
      draw(time)
      if (now - lastPalette > PALETTE_MS) {
        lastPalette = now
        applyPalette(inkHueAt(time)) // re-tint the UI to the ink's current hue
      }
    }

    const onVisibility = () => {
      cancelAnimationFrame(raf)
      if (!document.hidden && !reduceMotion) raf = requestAnimationFrame(loop)
    }

    // Redraw the static frame when the theme flips in reduced-motion mode
    const themeObserver = new MutationObserver(() => reduceMotion && draw(0))
    themeObserver.observe(document.documentElement, { attributes: true, attributeFilter: ['class'] })

    resize()
    window.addEventListener('resize', resize)
    window.addEventListener('pointermove', onMove, { passive: true })
    document.addEventListener('pointerleave', onLeave)
    document.addEventListener('visibilitychange', onVisibility)
    if (!reduceMotion) raf = requestAnimationFrame(loop)

    return () => {
      cancelAnimationFrame(raf)
      themeObserver.disconnect()
      window.removeEventListener('resize', resize)
      window.removeEventListener('pointermove', onMove)
      document.removeEventListener('pointerleave', onLeave)
      document.removeEventListener('visibilitychange', onVisibility)
      gl.deleteBuffer(buf)
      gl.deleteProgram(program)
    }
  }, [])

  return (
    <div aria-hidden="true" className="pointer-events-none fixed inset-0 -z-10">
      <canvas ref={canvasRef} className="h-full w-full" />
      {/* Static fallback when WebGL is unavailable */}
      <div
        ref={fallbackRef}
        style={{ display: 'none' }}
        className="absolute inset-0 bg-[radial-gradient(ellipse_at_20%_30%,rgba(56,189,248,0.18),transparent_50%),radial-gradient(ellipse_at_80%_70%,rgba(217,70,239,0.18),transparent_50%)] bg-gray-50 dark:bg-[#05050a]"
      />
    </div>
  )
}
