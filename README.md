# Portfolio - Rogério Bayer

[![Tests](https://github.com/rogeriobayer/bayer.ooo/actions/workflows/tests.yml/badge.svg)](https://github.com/rogeriobayer/bayer.ooo/actions/workflows/tests.yml)
[![CI](https://github.com/rogeriobayer/bayer.ooo/actions/workflows/ci.yml/badge.svg)](https://github.com/rogeriobayer/bayer.ooo/actions/workflows/ci.yml)

Personal portfolio developed with Next.js featuring multi-language support (Portuguese, English, and French).

## 🚀 Technologies Used

- **Next.js** - React framework for production
- **React** - JavaScript library for user interfaces
- **Tailwind CSS** - Utility-first CSS framework
- **Framer Motion** - Animation library for React
- **Lucide React** - Icon library (where applicable)

## 📁 Project Structure

```
src/
├── app/
│   ├── components/          # React components
│   ├── contexts/           # React contexts (LanguageContext)
│   ├── data/              # Data configurations and translations
│   ├── hooks/             # Custom hooks
│   ├── utils/             # Utilities and animation configs
│   └── page.js            # Main page entry
```

## 🌐 Features

### Main Components
- **Header** - Navigation and language selector
- **Apresentation** - Personal introduction and highlights
- **Summary** - Professional overview
- **SkillsSummary** - Core technical skills
- **History** - Career timeline
- **Projects** - Featured work with interactive modals
- **Footer** - Social links and site info

### Language System
- Dynamic language switching
- React context for state management
- Organized translation files in `src/app/data/translations.js`

### Animations
- Smooth transitions and interactive elements using Framer Motion
- Centralized animation configurations in `animationConfig.js`

## 🚀 Getting Started

1. **Install dependencies:**
```bash
npm install
```

2. **Run in development mode:**
```bash
npm run dev
```

3. **Build for production:**
```bash
npm run build
npm start
```

The project runs on port **3001** by default.

## 📝 Available Scripts

- `npm run dev` - Starts development server
- `npm run build` - Creates production build
- `npm run start` - Starts production server
- `npm run lint` - Runs ESLint code check

