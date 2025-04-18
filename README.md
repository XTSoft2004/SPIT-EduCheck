# SPIT EduCheck - Hệ thống điểm danh hỗ trợ lớp học

## 📌 Giới thiệu
SPIT EduCheck là hệ thống quản lý điểm danh đơn giản dành cho sinh viên đi hỗ trợ các lớp học. Hệ thống cho phép ghi nhận sự tham gia thông qua việc upload ảnh làm bằng chứng sau mỗi buổi hỗ trợ.

## ✨ Tính năng nổi bật
### Đối với sinh viên đi hỗ trợ
- 📸 Upload ảnh sau khi hoàn thành hỗ trợ
- 📋 Xem lịch sử các buổi đã tham gia
- 🕒 Theo dõi thời gian hỗ trợ

### Đối với quản trị viên
- 👥 Quản lý danh sách sinh viên
- 👥 Quản lý danh sách lớp học
- ✅ Xác minh các buổi hỗ trợ
- 📊 Xuất báo cáo thống kê
- 🗓️ Quản lý lịch hỗ trợ

## 🌟 Tính năng chính

- 📸 **Upload ảnh sau khi hỗ trợ lớp học**: Tình nguyện viên có thể tải lên ảnh của mình sau khi hoàn thành công việc hỗ trợ.
- 📅 **Quản lý lịch sử hỗ trợ theo ngày**: Quản trị viên có thể theo dõi các lần hỗ trợ của tình nguyện viên.
- 👥 **Phân quyền người dùng**: Bao gồm quyền truy cập của quản trị viên và tình nguyện viên.
- 📊 **Thống kê số lần hỗ trợ**: Hiển thị thống kê về số lần hỗ trợ của từng tình nguyện viên.
- 🔍 **Tìm kiếm và kiểm tra thông tin hỗ trợ**: Quản trị viên có thể tìm kiếm và xác minh các thông tin hỗ trợ đã được ghi nhận.

---

## 🛠️ Cài đặt

### 1. Clone repository

Đầu tiên, bạn cần clone repository này về máy tính của mình:

```bash
git clone https://github.com/XTSoft2004/SPIT-EduCheck.git
cd SPIT-EduCheck
```


### 2. Thiết lập `appsettings.json` ở Server_Manager

Để cấu hình kết nối cơ sở dữ liệu, logging, JWT settings và các cấu hình khác cho ứng dụng, bạn có thể sử dụng file `appsettings.json`. Dưới đây là cấu hình mẫu:

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
### 3. Cài đặt ChamCongCLB

```bash
npm install
# hoặc
yarn install
```

---
### 4. Chạy ở chế độ development

```bash
npm run dev
# hoặc
yarn dev
```
Truy cập tại: http://localhost:3000

---
## 📦 Build production

```bash
npm run build
npm start
```


### 📝 Hướng dẫn sử dụng

- Đăng nhập vào hệ thống bằng tài khoản được cấp.
- Chọn "Điểm danh hỗ trợ" sau khi hoàn thành công việc hỗ trợ.
- Upload ảnh chứng minh đã hỗ trợ.
- Xác nhận thông tin điểm danh.
- Quản trị viên có thể kiểm tra danh sách hỗ trợ trong phần quản lý.

### 🛠️ Công nghệ sử dụng

- **Frontend**: NextJS, Tailwind
- **Backend**: ASP.NET Core API
- **Database**: SQL Server

## 🌐 Link demo

📍 **Truy cập tại:**  
👉 [http://chamcong.spit-husc.io.vn/](http://chamcong.spit-husc.io.vn/)

## 🤝 Đóng góp

Chúng tôi luôn chào đón những đóng góp từ cộng đồng! 💪  
Hãy làm theo các bước sau để đóng góp vào dự án:

1. 🍴 **Fork** dự án về tài khoản của bạn  
2. 🌱 **Tạo branch mới** để phát triển tính năng:
   ```bash
   git checkout -b feature/ten-tinh-nang
   ```
3. 💾 **Commit thay đổi của bạn:**
    ```bash
    git commit -m "Thêm tính năng mới"
    ```
4. 🚀 **Push lên GitHub:**
    ```bash
    git push origin feature/ten-tinh-nang
    ```
5. 📥 **Tạo một Pull Request để được review và merge**
🙌 Đừng quên mô tả rõ ràng thay đổi của bạn trong phần mô tả PR để giúp việc review dễ dàng hơn nhé!

## 👥 Thành viên phát triển

| Tên                    | Vai trò                                  |
|------------------------|-------------------------------------------|
| **Trần Xuân Trường**         | Phát triển Fontend, Backend, Nội dung      |
| **Trương Đình Phúc** | Phát triển Fontend, nội dung        |

---

## 📄 Giấy phép

Dự án được phát hành theo giấy phép [MIT License](LICENSE).

---

## 📬 Liên hệ

- 💻 **Facebook**: [Trần Xuân Trường](https://www.facebook.com/xuantruong.war.clone.code)  
- ✉️ **Email**: tranxuantruong420@gmail.com

---

> 🧠 *"Copyright © 2024, Trần Xuân Trường, Trương Đình Phúc"* — SPIT Team 💙
