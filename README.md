# UI Skeleton (Placeholders Only)

This repo contains **placeholders** for all files in the agreed structure—ready to push to GitHub and start branching.
No implementations are included; add markup/logic per feature when you pick a task.

## Structure
- `/assets/css/base.css` and `/assets/css/utilities.css` — ready-to-use tokens + utilities.
- `/assets/css/components/*` and `/assets/css/pages/*` — placeholder files for each component/page.
- `/assets/js/**` — placeholder modules (no logic) so imports/routing can be wired later.
- Root and `/admin` HTML pages — minimal shells linking base styles.

## Getting Started
```bash
git init -b main
git add .
git commit -m "chore: UI skeleton placeholders"
git remote add origin https://github.com/<you>/<repo>.git
git push -u origin main
```

Create branches per task: `feat/home`, `feat/checkout`, `feat/admin-products`, etc.
