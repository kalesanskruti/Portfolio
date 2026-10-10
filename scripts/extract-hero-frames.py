"""Extract cursor-tracking frames from the Flow video, key out the red
background (border-connected only, so lips/blush survive), unmix red spill
and write transparent WebP frames + a manifest of look-direction vectors.

Usage (needs: pip install opencv-python-headless):
    python scripts/extract-hero-frames.py <video.mp4> public/hero/frames <preview.jpg>

ANCHORS / RUNS below are hand-labelled for the current video; re-label them
(look at a contact sheet of the video) if you generate a new one."""
import cv2, numpy as np, json, os, sys

VID, OUT, PREVIEW = sys.argv[1], sys.argv[2], sys.argv[3]
os.makedirs(OUT, exist_ok=True)

# Hand-labelled look direction per anchor frame (viewer space: +x right, +y up).
ANCHORS = {
    0: (0, 0), 12: (0.05, 0.05),
    17: (0.2, 0.4), 21: (0.35, 0.55), 27: (0.45, 0.6), 33: (0.55, 0.55),
    39: (0.6, 0.5), 45: (0.7, 0.4), 48: (0.75, 0.25), 51: (0.8, 0.15),
    54: (0.85, 0.0), 57: (0.85, -0.2), 60: (0.8, -0.35), 64: (0.85, -0.45),
    96: (0.0, -0.7), 99: (-0.1, -0.6), 102: (-0.3, -0.3), 105: (-0.6, -0.1),
    108: (-0.75, 0.0), 111: (-0.85, 0.05),
    149: (-0.75, 0.2), 153: (-0.6, 0.25), 156: (-0.45, 0.25), 159: (-0.3, 0.2),
    162: (-0.15, 0.1), 165: (0, 0), 191: (0, 0),
}
# Usable runs (skip blink at 14-16, back-of-head 66-95, full profile 113-148)
RUNS = [(0, 13), (17, 64), (96, 109), (149, 191)]
STEP = 1
SCALE = 1.0  # full source resolution
QUALITY = 86
MIN_TURN = 0.3  # the player only uses eye contact (CENTER) + clearly turned frames
CENTER = 3

def label(i):
    ks = sorted(ANCHORS)
    for a, b in zip(ks, ks[1:]):
        if a <= i <= b:
            t = (i - a) / (b - a) if b > a else 0
            pa, pb = np.array(ANCHORS[a]), np.array(ANCHORS[b])
            return tuple(np.round(pa + (pb - pa) * t, 3))
    return ANCHORS[ks[-1]]

cap = cv2.VideoCapture(VID); frames = []
while True:
    ok, f = cap.read()
    if not ok: break
    frames.append(f)

wanted = sorted({i for a, b in RUNS for i in range(a, b + 1, STEP) if np.hypot(*label(i)) >= MIN_TURN} | {CENTER})

def key(f):
    img = f.astype(np.float32)
    b, g, r = img[..., 0], img[..., 1], img[..., 2]
    redness = r - np.maximum(g, b)
    border = np.concatenate([img[:8].reshape(-1, 3), img[-8:].reshape(-1, 3), img[:, :8].reshape(-1, 3), img[:, -8:].reshape(-1, 3)])
    bg = np.median(border, axis=0)
    lo, hi = 115.0, 175.0
    alpha = np.clip((hi - redness) / (hi - lo), 0, 1)
    # only background connected to the frame border may become transparent
    bgmask = (alpha < 0.5).astype(np.uint8)
    n, lab = cv2.connectedComponents(bgmask, connectivity=4)
    edge = set(np.unique(np.concatenate([lab[0], lab[-1], lab[:, 0], lab[:, -1]])))
    edge.discard(0) if bgmask[0, 0] == 0 else None
    keep_bg = np.isin(lab, list(edge)) & (bgmask == 1)
    alpha = np.where((bgmask == 1) & ~keep_bg, 1.0, alpha)
    # also restore semi-transparent pixels that are not near the real background
    near = cv2.dilate(keep_bg.astype(np.uint8), np.ones((9, 9), np.uint8)).astype(bool)
    alpha = np.where(~near, 1.0, alpha)
    # pure background red seen through gaps in the curls is always transparent
    # (lips/blush are far less saturated, so they stay opaque)
    alpha = np.where(redness > 150, 0.0, alpha)
    near = near | (redness > 150)
    alpha = cv2.GaussianBlur(alpha, (3, 3), 0)
    # un-mix the red background from edge pixels
    a3 = np.clip(alpha, 0.05, 1)[..., None]
    col = np.clip((img - (1 - a3) * bg) / a3, 0, 255)
    # The red studio light tints the whole head of hair, not just its edges.
    # Remove that red cast everywhere EXCEPT a protected face/neck area (skin
    # detection, generously dilated) so lips and blush keep their natural colour.
    # gentle cap on edge pixels first (last bits of background colour)
    spill = cv2.dilate(near.astype(np.uint8), np.ones((7, 7), np.uint8)).astype(bool)
    gb = np.maximum(col[..., 1], col[..., 0])
    col[..., 2] = np.where(spill, np.minimum(col[..., 2], gb * 1.45 + 12), col[..., 2])

    hsv = cv2.cvtColor(np.clip(col, 0, 255).astype(np.uint8), cv2.COLOR_BGR2HSV).astype(np.float32)
    hh, ss, vv = hsv[..., 0], hsv[..., 1], hsv[..., 2]  # OpenCV hue: 0..180
    skin = ((hh >= 4) & (hh <= 22) & (ss >= 35) & (ss <= 175) & (vv >= 120) & (alpha > 0.9)).astype(np.uint8)
    skin = cv2.morphologyEx(skin, cv2.MORPH_OPEN, np.ones((5, 5), np.uint8))
    face = cv2.morphologyEx(skin, cv2.MORPH_CLOSE, cv2.getStructuringElement(cv2.MORPH_ELLIPSE, (35, 35)))  # fills lips/eyes
    face = cv2.dilate(face, cv2.getStructuringElement(cv2.MORPH_ELLIPSE, (9, 9))).astype(np.float32)
    face = cv2.GaussianBlur(face, (0, 0), 6)  # soft edge → no visible boundary
    # hair: hues pushed towards pure red (by the red light) are rotated back to a
    # natural brown and slightly desaturated; brown/skin tones are left alone
    hr = np.minimum(hh, 180 - hh)  # distance from pure red
    w = np.clip((11 - hr) / 6, 0, 1) * (1 - face)
    BROWN = 11.0  # ≈22° hue
    red_side = hh > 90  # magenta-red side wraps around 180
    new_h = np.where(red_side, hh + (180 + BROWN - hh) * w, hh + (BROWN - hh) * w) % 180
    hsv[..., 0] = new_h
    hsv[..., 1] = ss * (1 - 0.3 * w)
    col = cv2.cvtColor(np.clip(hsv, 0, 255).astype(np.uint8), cv2.COLOR_HSV2BGR).astype(np.float32)
    return np.dstack([col, alpha * 255]).astype(np.uint8)

# crop box: width follows the HEAD + HAIR (upper part of the frame) across all
# frames — the wide jacket below is cut and faded out by the player, which
# keeps every frame small enough to hold the full set at full resolution.
xs, ys = [], []
keyed = {}
for i in wanted:
    k = key(frames[i]); keyed[i] = k
    head = k[: int(k.shape[0] * 0.6), :, 3] > 20
    yy, xx = np.where(head)
    xs += [xx.min(), xx.max()]
    ys += [np.where(k[..., 3] > 20)[0].min()]
x0, x1 = max(0, min(xs) - 24), min(frames[0].shape[1], max(xs) + 24)
y0, y1 = max(0, min(ys) - 8), frames[0].shape[0]
print('crop', x0, y0, x1, y1, 'frames', len(wanted))

manifest = {'width': int(round((x1 - x0) * SCALE)), 'height': int(round((y1 - y0) * SCALE)), 'center': None, 'frames': []}
total = 0
for i in wanted:
    k = keyed[i][y0:y1, x0:x1]
    if SCALE != 1.0:
        k = cv2.resize(k, None, fx=SCALE, fy=SCALE, interpolation=cv2.INTER_AREA)
    name = f'f{i:03d}.webp'
    cv2.imwrite(os.path.join(OUT, name), k, [cv2.IMWRITE_WEBP_QUALITY, QUALITY])
    total += os.path.getsize(os.path.join(OUT, name))
    dx, dy = label(i)
    entry = {'src': name, 'x': float(dx), 'y': float(dy)}
    if i == CENTER: manifest['center'] = name
    manifest['frames'].append(entry)
json.dump(manifest, open(os.path.join(OUT, 'manifest.json'), 'w'), indent=1)
print('total KB', total // 1024)

# preview: keyed frames composited on a dark purple backdrop
tiles = []
for i in wanted[::max(1, len(wanted) // 24)][:24]:
    k = keyed[i][y0:y1, x0:x1].astype(np.float32)
    bgc = np.zeros_like(k[..., :3]); bgc[:] = (60, 20, 40)
    a = k[..., 3:4] / 255
    comp = (k[..., :3] * a + bgc * (1 - a)).astype(np.uint8)
    t = cv2.resize(comp, (240, int(240 * comp.shape[0] / comp.shape[1])))
    cv2.putText(t, str(i), (5, 20), cv2.FONT_HERSHEY_SIMPLEX, .6, (0, 255, 255), 2); tiles.append(t)
while len(tiles) % 6: tiles.append(np.zeros_like(tiles[0]))
cv2.imwrite(PREVIEW, np.vstack([np.hstack(tiles[r:r + 6]) for r in range(0, len(tiles), 6)]), [cv2.IMWRITE_JPEG_QUALITY, 85])
