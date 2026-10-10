# Portfolio

Personal portfolio built with **React + Vite + Tailwind CSS + Framer Motion**.

## Run locally

```bash
npm install
npm run dev        # http://localhost:5173
npm run build      # production build into dist/
```

## Editing content

All text, links and lists live in **`src/data/portfolio.js`** — search for `TODO`.

| What | Where |
|---|---|
| Name, roles, tagline, email, phone | `profile` |
| Profile photo | put file in `public/images/`, update `profile.avatar` + `about.photo` |
| Resume | save as `public/resume.pdf` |
| Bio | `about.paragraphs` |
| Tech strip / skill cards | `techStack`, `skillCategories` |
| Projects (+ filter tabs) | `projects`, `projectCategories` |
| Experience / Education timeline | `experience`, `education` |
| Achievements / Certifications toggle | `achievements`, `certifications` |
| Social cards + "Follow Me" icons | `socials` |
| Contact form (Formspree) | `contact.formspreeId` |
| Chat assistant name & quick replies | `chat` |

Skill icons use [Devicon](https://devicon.dev) names, e.g. `devicon('react')`.

## Sections

Navbar · Hero · About (+ tech marquee) · Skills · Portfolio · Experience & Education · Achievements · Social Handles · Contact · Footer · Chat assistant · Back-to-top

## Deploy (Vercel)

1. Push to GitHub.
2. On vercel.com → *Add New Project* → import this repo (framework auto-detected as Vite).
3. Every push to `main` redeploys automatically.

