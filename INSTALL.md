# 🛠️ Installation Guide

This guide explains how to set up and run the project locally for development and testing.

---

## 📦 Prerequisites

Make sure the following are installed on your system:

- [Git](https://git-scm.com/)
- [Node.js](https://nodejs.org/) (v18 or later)
- [npm](https://www.npmjs.com/) (comes with Node.js)
- [MongoDB](https://www.mongodb.com/) (local or cloud)
- (Optional) [Docker](https://www.docker.com/) & [Docker Compose](https://docs.docker.com/compose/)

---

## 🚀 Clone the Repository

bash
git clone https://stgit.dcs.gla.ac.uk/team-project-h/2024/ese1/ese1-main.git
cd ese1-main


## 🌐 Frontend Setup

> 🎨 The frontend is built using React. Follow these steps to get it running:

```bash
cd client           # Navigate to the frontend directory
npm install         # Install dependencies
npm start           # Launch the development server
```

---

## 🔧 Backend Setup & Start


- cd /backend

```
- Install required packages

npm install cors  
npm install --save-dev @types/cors  
npm install xlsx  
npm install --save-dev @types/xlsx  
```
- Install global dependencies
```
npm install -g ts-node  
npm install -g typescript  
```
- Run the server
```
npx ts-node server.ts  
```
---

## 📁 Project Structure

```bash
/
├── client/          # React frontend
├── backend/         # Node.js/TypeScript backend
├── .gitlab-ci.yml   # GitLab CI pipeline
├── INSTALL.md       # This file
├── CONTRIBUTING.md
└── README.md
