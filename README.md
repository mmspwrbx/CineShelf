# CineShelf

---

## 📖 Overview / Обзор

**CineShelf** is a modern, visually‑rich web application for managing your personal collection of movies and TV series. It provides a **virtual DVD‑case UI** with 3‑D animations, detailed metadata, rating, review, tagging, and episode‑by‑episode tracking. The app syncs automatically with external sources such as **TVMaze** to fetch up‑to‑date season and episode information.

---

## 🎯 Purpose / Назначение

- Keep track of every film and TV series you own or plan to watch.
- Store personal ratings, reviews, watch dates, and private notes.
- Organise items with tags, favourite flag, and custom status (watched / watching / plan‑to‑watch).
- For TV series, track individual episode ratings and watch progress.
- Visualise your library as a classic **DVD shelf** or a modern grid view.

---

## 👥 Who is it for? / Для кого?

| Audience | Why it fits |
|----------|------------|
| **Film & TV enthusiasts** who want a beautiful, interactive way to catalog their collection. | |
| **Collectors** who enjoy the nostalgic DVD‑case look with 3‑D flip animations. | |
| **Binge‑watchers** who need per‑episode rating and progress tracking. | |
| **Home media managers** seeking a self‑hosted, offline‑first solution (data stored locally via `storage` service). | |
| **Developers & hobbyists** interested in a TypeScript/React codebase that showcases advanced UI patterns (custom animations, dynamic API sync, localisation). | |

---

## ✨ Key Features / Основные возможности

- **Dual view modes** – grid view and DVD‑case shelf view with smooth 3‑D opening animation.
- **Rich movie details** – poster, title, year, runtime, plot, director, actors, genres, source IDs.
- **Rating system** – 0‑10 star rating for movies and per‑episode rating for series.
- **Review & notes** – free‑form text fields, private notes, watch count, watch date.
- **Tag management** – add, remove, and filter by custom tags.
- **Series support** – automatic episode list sync from TVMaze, season/episode navigation, per‑episode rating.
- **Dashboard statistics** – quick overview of total movies, watched count, favourite items, etc.
- **Search modal** – fuzzy search across titles, tags, and metadata.
- **Settings panel** – language selection (i18n), view‑mode persistence, other app preferences.
- **Responsive design** – works on desktop browsers with dark‑mode friendly colors.
- **Localization** – UI strings are provided via `services/translations` (currently English & Russian).
- **Local storage** – all data saved in the browser’s localStorage via a thin `storage` abstraction, works offline.

---

## 🛠️ Tech Stack / Технологический стек

- **Frontend**: React (TSX) + TypeScript
- **Icons**: lucide‑react
- **Styling**: Vanilla CSS (custom design system, dark theme, glass‑morphism style)
- **State management**: React hook state (`useState`, `useEffect`, `useMemo`)
- **Persistence**: LocalStorage wrapper (`services/storage`)
- **External API**: TVMaze (episode sync)
- **Internationalisation**: Simple translation service (`services/translations`) supporting `en` and `ru`.

---

## 🚀 Getting Started / Начало работы

```bash
# Clone the repository (replace with your actual repo URL)
git clone https://github.com/yourusername/CineShelf.git
cd CineShelf

# Install dependencies (uses npm)
npm install

# Run the development server
npm run dev
```

The app will be available at `http://localhost:3000` (or whichever port Vite/Next.js reports).

---

## 📂 Project Structure (high‑level) / Структура проекта (в общем)

```
src/
│   App.tsx               # Root component – state, view mode, main tabs
│   index.css             # Global CSS with the premium design tokens
│   services/
│   │   storage.ts        # LocalStorage wrapper
│   │   translations.ts   # i18n helper
│   components/
│       DvdDetailModal.tsx   # 3‑D DVD‑case modal with all movie/series UI
│       DvdShelfView.tsx      # Shelf view layout
│       LibraryFilters.tsx    # Filter & sort controls
│       MovieCard.tsx         # Card for grid view
│       MovieDetailModal.tsx  # Simple detail overlay (non‑DVD view)
│       SearchModal.tsx       # Search dialog
│       DashboardStats.tsx    # Stats overview panel
│       SettingsPanel.tsx     # Settings UI
│   types/
│       index.d.ts            # TypeScript types (LibraryMovie, etc.)
```

---

## 📸 Screenshots (placeholders) / Скриншоты (заполнители)

> *Add screenshots of the grid view, DVD‑case view, and the episode tracker later.*

---

## 📜 License

This project is open‑source – feel free to fork, modify, and use it for personal collections.

---

*Happy cataloguing!*  
*Приятного каталогизирования!*
