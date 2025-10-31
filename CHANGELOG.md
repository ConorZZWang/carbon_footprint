# 📄 Changelog

All notable changes to this project will be documented in this file.

🧭 **Format:** Based on [Keep a Changelog](https://keepachangelog.com/en/1.0.0/)  
📌 **Versioning:** Adheres to [Semantic Versioning](https://semver.org/)

---

## [Unreleased]

### 🚧 Added
- Admin and Maintainer functionality *(WIP)*
- User data saving *(planned)*
- Editable table component for procurement module
- UI mockups for dashboard and emissions overview

---

## [0.1.5] – 2025-03-10

### ✨ Added
- Finalized carbon emission graph for dashboard
- Created waste and transport table components
- Added results graph with scoring and date/university title

### 🔄 Changed
- Adjusted table layout and scrollability
- Refactored admin and maintainer styles into shared files

### 🐛 Fixed
- Timeout issue in backend server build
- Linting errors in `LoginPage.js`

---

## [0.1.4] – 2025-02-26

### ✨ Added
- XLSX upload endpoint and parser integration
- Carbon emission calculation logic in backend
- MongoDB schema for emissions and suppliers

### 🔄 Changed
- Improved frontend upload UI
- Added error handling for blank spreadsheets

### 🐛 Fixed
- Crash on uploading empty XLSX file

---

## [0.1.3] – 2025-02-12

### ✨ Added
- Procurement UI table
- `.env.example` for backend
- Separate MongoDB configs for environments

### 🔄 Changed
- Folder restructuring (`/api` moved into backend)

### 🐛 Fixed
- Build failure due to missing TypeScript types

---

## [0.1.2] – 2025-01-29

### ✨ Added
- Sidebar and navigation header
- Landing page scaffold
- React Router setup

### 🔄 Changed
- Migrated backend to TypeScript
- Cleaned out unused console logs

### 🐛 Fixed
- Broken route links in React Router

---

## [0.1.1] – 2025-01-15

### ✨ Added
- GitLab CI/CD pipeline setup
- React build command with environment override
- Backend runtime using `ts-node`
- MongoDB connection logic
- XLSX parsing capability

### 🔄 Changed
- Frontend CI image to `node:18-alpine`
- Job rules to run only on `dev`

### 🐛 Fixed
- Removed long-running backend command in CI (`ts-node` launch)

---

## [0.1.0] – 2024-12-18

### 🧪 Added
- Initial frontend/backend project scaffold
- Basic Express.js backend and React client
- `.gitignore`, `README.md`, and license

### 🧹 Changed
- Refactored file/folder structure
- Updated basic configuration placeholders

### 🐞 Fixed
- Startup errors due to missing `package.json` scripts

---

## 📌 Template for Future Releases

```md
## [x.x.x] – YYYY-MM-DD

### ✨ Added
- ...

### 🔄 Changed
- ...

### 🐛 Fixed
- ...
```
