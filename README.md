# Vấn Đề

Cá nhân tôi dùng Remote Desktop để truy cập máy tình ở nhà qua Internet. Thi thoảng nhà mạng thay đổi IP của tôi, khi tôi khởi động lại moderm thì IP cũng thay đổi

# Script Theo Dõi IP

Script PowerShell để theo dõi địa chỉ IP của tôi và gửi thông báo qua Telegram khi IP thay đổi

## Tính Năng

- **Phát Hiện IP Tự Động**: Sử dụng API ipify.org để lấy địa chỉ IP công cộng hiện tại
- **Phát Hiện Thay Đổi**: So sánh IP hiện tại với IP đã lưu trước đó
- **Thông Báo Telegram**: Gửi thông báo khi IP thay đổi hoặc lần chạy đầu tiên
- **Hỗ Trợ UTF-8**: Hỗ trợ encoding đúng chuẩn cho ký tự tiếng Việt
- **Xử Lý Lỗi**: Xử lý lỗi mạng một cách mềm mại

## Yêu Cầu

- Windows PowerShell 5.1 hoặc PowerShell Core 6+
- Kết nối Internet
- Bot Token và Chat ID của Telegram

## Thiết Lập

### 1. Tạo Telegram Bot

1. Mở Telegram và tìm kiếm `@BotFather`
2. Gửi lệnh `/newbot`
3. Làm theo hướng dẫn để tạo bot của bạn
4. Lưu bot token (định dạng: `123456789:ABCdefGHIjklMNOpqrsTUVwxyz`)

### 2. Lấy Chat ID

1. Gửi một tin nhắn cho bot của bạn
2. Truy cập: `https://api.telegram.org/bot<BotTokenCuaBan>/getUpdates`
3. Tìm object `chat` và sao chép giá trị `id`

### 3. Cấu Hình Script

Chỉnh sửa file `getip.ps1` và thay thế các biến sau:

```powershell
$botToken = "YOUR_BOT_TOKEN"  # Thay bằng bot token thực của bạn
$chatId = "YOUR_CHAT_ID"      # Thay bằng chat ID thực của bạn
```

## Cách Sử Dụng

### Chạy Thủ Công

```cmd
powershell -ExecutionPolicy Bypass -File getip.ps1
```

### Chạy Tự Động (Task Scheduler)

1. Mở Task Scheduler (`taskschd.msc`)
2. Tạo Basic Task
3. Đặt trigger (ví dụ: mỗi 5 phút)
4. Đặt action để khởi động chương trình:
   - Program: `powershell.exe`
   - Arguments: `-ExecutionPolicy Bypass -File "C:\Users\mhqb365\ip-monitor\getip.ps1"`
5. Nhớ thay `C:\Users\mhqb365\ip-monitor\getip.ps1` bằng đường dẫn nơi bạn lưu dự án

## Cách Hoạt Động

1. **Lấy IP**: Lấy IP công cộng hiện tại từ API ipify.org
2. **Lưu Trữ**: Lưu IP cuối cùng đã biết trong `%APPDATA%\last_ip.txt`
3. **So Sánh**: So sánh IP hiện tại với IP đã lưu
4. **Thông Báo**: Gửi tin nhắn Telegram nếu:
   - Lần chạy đầu tiên (hiển thị "Current IP: x.x.x.x")
   - IP đã thay đổi (hiển thị "New IP: x.x.x.x")
5. **Ghi Log**: Xuất thông báo trạng thái với timestamp

## Cấu Trúc File

```
ip-monitor/
├── getip.ps1          # Script chính
└── README.md          # File này
└── LICENSE            Giấy phép MIT
```

## File Cấu Hình

- **Lưu Trữ IP**: `%APPDATA%\last_ip.txt` - Lưu địa chỉ IP cuối cùng đã biết

## Xử Lý Lỗi

Script xử lý các tình huống lỗi sau:

- **Lỗi Mạng**: Nếu không thể lấy IP công cộng, script thoát một cách mềm mại
- **Lỗi Telegram API**: Nếu gửi tin nhắn thất bại, lỗi được ghi log nhưng script tiếp tục
- **Lỗi Truy Cập File**: Sử dụng xử lý lỗi khi đọc/ghi file IP

## Ví Dụ Kết Quả

### Lần Chạy Đầu Tiên
```
Current IP: 192.168.1.100
```

### IP Đã Thay Đổi
```
New IP: 192.168.1.101
```

### Không Có Thay Đổi
```
⏳ IP unchanged (192.168.1.100) at 2025-08-08 14:30:15
```

## Lưu Ý Bảo Mật

- **Bảo Mật Token**: Giữ bot token an toàn và không bao giờ chia sẻ
- **Quyền File**: Script lưu IP trong thư mục AppData của người dùng
- **Riêng Tư Mạng**: Sử dụng HTTPS cho tất cả các lệnh gọi API

## Khắc Phục Sự Cố

### Các Vấn Đề Thường Gặp

1. **Lỗi Execution Policy**
   ```cmd
   Set-ExecutionPolicy -ExecutionPolicy RemoteSigned -Scope CurrentUser
   ```

2. **Bot Token Không Hợp Lệ**
   - Kiểm tra định dạng token và quyền
   - Đảm bảo bot đang hoạt động

3. **Vấn Đề Chat ID**
   - Đảm bảo bạn đã gửi ít nhất một tin nhắn cho bot
   - Sử dụng đúng định dạng chat ID (chỉ số)

4. **Kết Nối Mạng**
   - Kiểm tra kết nối internet
   - Kiểm tra cài đặt firewall

### Chế Độ Debug

Để xem kết quả chi tiết, chạy với verbose logging:

```cmd
powershell -ExecutionPolicy Bypass -File getip.ps1 -Verbose
```

## Đóng Góp

Hãy thoải mái gửi issues và yêu cầu cải tiến!

## Giấy Phép

Dự án này là mã nguồn mở và có sẵn dưới [Giấy phép MIT](LICENSE).
