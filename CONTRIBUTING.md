# 🌱 Contributing to Carbon Footprint

Thanks for considering contributing! 🎉 We welcome all kinds of input — whether it’s reporting bugs, writing code, improving documentation, or suggesting new features.

---

## 📦 Project Setup

To get started locally:

```bash
git clone https://stgit.dcs.gla.ac.uk/team-project-h/2024/ese1/ese1-main.git
cd ese1-main
```

### Frontend

```bash
cd client
npm install
```

### Backend

> 💡 Note: Replace the placeholder path below with the actual backend folder path.

```bash
cd <BACKEND_DIRECTORY_PATH>

npm install cors
npm install --save-dev @types/cors
npm install xlsx
npm install --save-dev @types/xlsx
npm install -g ts-node
npm install -g typescript

# Start the server
npx ts-node server.ts
```

👉 For more detailed setup instructions, see [`INSTALL.md`](./INSTALL.md)

---

## 🌿 How to Contribute

1. **Fork** the repository  
2. **Clone** your fork and create a new branch:

```bash
git checkout -b feature/your-feature-name
```

3. Make your changes  
4. **Commit** using clear messages (see below)  
5. **Push** to your fork:

```bash
git push origin feature/your-feature-name
```

6. Open a **Merge Request** (MR) targeting the `dev` branch

---

## 🧪 Code Style & Guidelines

- Use consistent formatting (we use **Prettier** + **ESLint**)
- Write descriptive variable and function names
- Keep functions short and focused
- Follow the existing file structure
- Test your changes locally before committing

---

## 📝 Commit Message Format

We follow a simplified commit format based on what was done:

**Examples:**

```bash
added: new carbon calculator UI
fixed: NaN issue in emissions total
updated: README with setup steps
removed: unused emissions helper function
```

---

## 📬 Opening a Merge Request

When opening an MR:

- Target the `dev` branch
- Include a clear description of what you changed and why
- Mention related issues (e.g., `Closes #12`)
- Assign a reviewer or tag a team member if needed  
- Expect review within **2–3 working days**

---

## 🐞 Reporting Issues

Found a bug or want to request a feature?

- Use the **GitLab Issues** tab
- Provide as much detail as possible
- Include screenshots or logs where applicable
- Use labels like `bug`, `enhancement`, or `question`

---

## 🤝 Code of Conduct

We follow a Code of Conduct to ensure a respectful and inclusive environment for everyone.

---

## ✅ Additional Notes

- Keep MRs focused — *one feature or fix per MR*
- Ensure your code passes any **CI tests** before merging
- If unsure about anything, ask in a comment or open an issue

---

Thanks again for contributing 💙  
**Happy coding!**
