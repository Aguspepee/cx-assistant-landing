# Cx Assistant — Landing Page (React + TypeScript + Vite)

A fast, static marketing site for **Cx Assistant** built with **React**, **TypeScript**, **Vite**, **MUI**, and (optionally) **Three.js**.  
No backend. It links to the main Cx Assistant app when needed.

## 👋 What you’ll do (in order)

1) Install tools (Node.js, Git, VS Code)  
2) Get the code (clone the repo)  
3) Run the site locally  
4) Make a small change  
5) Save your work with Git (commit) and send it to GitHub (push)

---

## 1) Install the tools

### Node.js (the JavaScript runtime)
- Install the **LTS** version from: https://nodejs.org  
- After install, check it:
  - **Windows (PowerShell):**
    ```powershell
    node -v
    npm -v
    ```
  - **macOS (Terminal):**
    ```bash
    node -v
    npm -v
    ```
  You should see versions (e.g., `v20.x`, `10.x`).

### Git (version control)
- Download: https://git-scm.com/downloads  
- Check it:
  ```bash
  git --version
  ```

### VS Code (code editor)
- Download: https://code.visualstudio.com  
- Optional extensions (recommended):
  - **ESLint**
  - **Prettier – Code formatter**
  - **TypeScript and JavaScript Language Features** (built-in)

> ✅ If you prefer no command line at first, you can use **GitHub Desktop**: https://desktop.github.com

---

## 2) Get the code (clone the repo)

Choose **one** method.

### Option A — Git (command line)
1. Open **PowerShell** (Windows) or **Terminal** (macOS).
2. Choose a folder, then run:
   ```bash
   git clone https://github.com/Aguspepee/cx-assistant-landing.git
   cd cx-assistant-landing
   ```

### Option B — GitHub Desktop (no terminal)
1. Open **GitHub Desktop** → **File → Clone repository…**
2. Paste the repo URL:  
   `https://github.com/Aguspepee/cx-assistant-landing.git`
3. Choose a local path and click **Clone**.
4. Click **Open in Visual Studio Code**.

---

## 3) Install dependencies & run

In the project folder:

```bash
npm install
npm run dev
```

Then open the printed local URL (usually `http://localhost:5173`) in your browser.

> If port is busy, Vite offers a new one automatically.

---

## 4) Make a small change

- Open `src/components/HeroSection.tsx` (or your actual file) in VS Code.  
- Change the main headline text.  
- Save the file — the browser should update automatically.

---

## 5) Save & share your work (Git basics)

You’ll do this loop often: **pull → branch → commit → push → PR**.

### 5.1 Pull the latest (start of the day)
```bash
git pull origin main
```

### 5.2 Create your own branch (safe playground)
```bash
git checkout -b feature/update-hero-text
```

### 5.3 Save your change (commit)
```bash
git add .
git commit -m "Update hero headline copy"
```

### 5.4 Send it to GitHub (push)
```bash
git push -u origin feature/update-hero-text
```

### 5.5 Open a Pull Request (PR)
- Go to the repo on GitHub → you’ll see a banner to **“Compare & pull request”**.  
- Add a short description and click **Create pull request**.  
- Another teammate reviews and merges into `main`.

> **Shortcut (GitHub Desktop):**  
> *Commit to feature branch → Push origin → Open Pull Request* (buttons provided).

---

## 🔁 Daily flow (TL;DR)

1. `git pull origin main`  
2. `git checkout -b feature/my-task` (once per task)  
3. Make changes → `git add .` → `git commit -m "Message"`  
4. `git push -u origin feature/my-task`  
5. Open PR on GitHub

---

## 🧠 Mini Git glossary

- **Repository (repo):** The project and its history.  
- **Clone:** Download the repo to your machine.  
- **Branch:** A separate line of work (safe playground).  
- **Commit:** A saved snapshot of your changes.  
- **Push:** Send your commits to GitHub.  
- **Pull:** Bring the latest changes from GitHub to your computer.  
- **Pull Request (PR):** Ask to merge your branch into `main`.

---

## 🧩 Project scripts

```bash
npm run dev      # start local server (Vite)
npm run build    # production build (output in /dist)
npm run preview  # preview the built app
```

---

## ✨ Code style

- We use **Prettier** for formatting.  
- If Prettier and ESLint are configured, VS Code will format on save.  
- Keep components small and focused. Name branches like `feature/...` or `fix/...`.

---

## 🧪 Quick checks before PR

- Page loads without errors (`npm run dev`).  
- No TypeScript errors in VS Code.  
- Responsiveness: check desktop and mobile width.

---

## 🆘 Troubleshooting

**`npm: command not found`**
- Node.js not installed or terminal not restarted after install.

**`ERR_MODULE_NOT_FOUND` or missing imports**
- Run `npm install`.
- Make sure you’re in the project folder.

**Port already in use**
- Close other dev servers or accept the new port Vite suggests.

**Permission denied (macOS)**
- Try `sudo npm install` (last resort). Prefer fixing folder permissions properly.

---

## 🔐 Environment variables

Not needed for this static site. If we add any later, you’ll create a `.env` file like:
```
VITE_API_BASE_URL=https://example.com
```

---

## 🚀 Deployment

- Build locally: `npm run build`  
- The `/dist` folder is ready to deploy (Netlify, Vercel, Nginx, etc.).  
- For Hostinger/Nginx: point the site root to `/dist` after building.

---

## ✅ First task ideas for newcomers

- Change headline and subtext in the hero section.  
- Adjust spacing/padding in the layout.  
- Swap a placeholder image/video.  
- Tweak button copy or links.

---

## 👥 Maintainers

- **Agustín Sánchez** — project lead  
- **Sean** — collaborator

---

## 🗂️ First Pull Request checklist

✅ Create a branch with a meaningful name (e.g., `feature/add-footer`)  
✅ Make a small visible change  
✅ Run `npm run dev` and confirm it works  
✅ `git add . && git commit -m "Description"`  
✅ `git push -u origin feature/add-footer`  
✅ Open a Pull Request and tag Agustín for review
