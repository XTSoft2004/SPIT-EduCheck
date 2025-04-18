# SPIT EduCheck - Attendance System for Class Support

## 📌 Introduction
**SPIT EduCheck** is a simple attendance management system designed for students who assist with classroom support. The system allows participants to record their attendance by uploading proof images after each support session.

## ✨ Key Features

### For Supporting Students
- 📸 Upload proof images after completing class support
- 📋 View history of participated sessions
- 🕒 Track support time

### For Administrators
- 👥 Manage student list
- 👥 Manage class list
- ✅ Verify support sessions
- 📊 Export statistical reports
- 🗓️ Manage support schedules

## 🌟 Main Functionalities

- 📸 **Upload images after class support**: Volunteers can upload their photos after completing a support session.
- 📅 **Manage support history by date**: Admins can track each support activity of volunteers.
- 👥 **User role management**: Includes admin and volunteer access rights.
- 📊 **Support statistics**: Display the number of times each volunteer has participated.
- 🔍 **Search and verify support info**: Admins can search and verify the recorded support data.

---

## 🛠️ Installation

### 1. Clone the repository

```bash
git clone https://github.com/XTSoft2004/SPIT-EduCheck.git
cd SPIT-EduCheck
```


### 2. Configure `appsettings.json` in Server_Manager
To configure database connection, logging, JWT settings, and other configurations for your app, you can use the `appsettings.json` file. Here is a sample configuration:

```json
{
  "ConnectionStrings": {
    "DefaultConnection": "Data Source={DOMAIN};Initial Catalog={DATABASE_NAME};User ID={Username};Password={Password};TrustServerCertificate=True;MultipleActiveResultSets=True"
  },
  "Logging": {
    "LogLevel": {
      "Default": "Information",
      "Microsoft.AspNetCore": "Warning"
    }
  },
  "JwtSettings": {
    "Secret": "{Secret}",
    "Issuer": "{Issuer}",
    "Audience": "{Audience}",
    "ExpireToken": 1,
    "ExpireRefreshToken": 5
  },
  "AllowedHosts": "*",
  "Kestrel": {
    "Endpoints": {
      "Http": {
        "Url": "http://0.0.0.0:5000"
      }
    }
  }
}
```


---
### 3. Install ChamCongCLB

```bash
npm install
# hoặc
yarn install
```

---
### 4. Run in development mode
```bash
npm run dev
# hoặc
yarn dev
```
Visit: http://localhost:3000

---
## 📦 Build production

```bash
npm run build
npm start
```


## 📝 User Guide
- Log in with your provided account.
- Choose "Attendance Check" after completing a support session.
- Upload a proof image.
- Confirm the attendance information.
- Admins can review attendance records in the management section.

### 🛠️ Technology Stack

- **Frontend**: NextJS, Tailwind
- **Backend**: ASP.NET Core API
- **Database**: SQL Server

## 🌐 Demo Website Link

📍 **Truy cập tại:**  
👉 [http://chamcong.spit-husc.io.vn/](http://chamcong.spit-husc.io.vn/)

## 🤝 Contributing

We always welcome contributions from the community! 💪
Follow these steps to contribute to the project:

1. 🍴 **Fork** the project to your GitHub account
2. 🌱 **Create a new branch** for your feature:
   ```bash
   git checkout -b feature/feature-name
   ```
3. 💾 **Commit your changes:**
    ```bash
    git commit -m "Thêm tính năng mới"
    ```
4. 🚀 **Push to GitHub:**
    ```bash
    git push origin feature/feature-name
    ```
5. 📥 **Create a Pull Request for review and merge**
🙌 Don’t forget to clearly describe your changes in the PR to make reviewing easier!

## 👥 Development Team

| Name                    | Role                                  |
|------------------------|-------------------------------------------|
| **Trần Xuân Trường**         | 	Frontend & Backend Developer, Content      |
| **Trương Đình Phúc** | Frontend Developer, Content        |

---

## 📄 License

This project is released under the [MIT License](LICENSE).

---

## 📬 Contact

- 💻 **Facebook**: [Trần Xuân Trường](https://www.facebook.com/xuantruong.war.clone.code)  
- ✉️ **Email**: tranxuantruong420@gmail.com

---

> 🧠 *"Copyright © 2024, Trần Xuân Trường, Trương Đình Phúc"* — SPIT Team 💙
