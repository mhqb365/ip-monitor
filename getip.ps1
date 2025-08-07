[Console]::OutputEncoding = [System.Text.Encoding]::UTF8

# === Cấu hình ===
$botToken = "YOUR_BOT_TOKEN"
$chatId = "YOUR_CHAT_ID"
$ipFile = "$env:APPDATA\last_ip.txt"  # nơi lưu IP cũ

# === Lấy IP công cộng hiện tại ===
try {
    $currentIP = Invoke-RestMethod -Uri "https://api.ipify.org"
} catch {
    Write-Output "Cannot get public IP"
    exit
}

# === Lấy thời gian hiện tại ===
$timestamp = Get-Date -Format "yyyy-MM-dd HH:mm:ss"

# === Kiểm tra IP cũ ===
$firstRun = $false
if (Test-Path $ipFile) {
    $lastIP = Get-Content $ipFile -ErrorAction SilentlyContinue
} else {
    $lastIP = ""
    $firstRun = $true
}

# === So sánh và gửi tin nhắn nếu cần ===
if ($firstRun -or ($currentIP -ne $lastIP)) {
    if ($firstRun) {
        $msg = "Current IP: $currentIP"
    } else {
        $msg = "New IP: $currentIP"
    }

    # === Gửi tin nhắn với encoding chuẩn UTF-8 ===
    try {
        $body = @{
            chat_id = $chatId
            text    = $msg
        } | ConvertTo-Json -Compress -Depth 3

        Invoke-RestMethod -Uri "https://api.telegram.org/bot$botToken/sendMessage" `
                          -Method POST `
                          -Body $body `
                          -ContentType "application/json; charset=utf-8"
        # Ghi IP mới
        Set-Content -Path $ipFile -Value $currentIP
    } catch {
        Write-Output "Error sending Telegram message"
    }
} else {
    Write-Output "⏳ IP unchanged ($currentIP) at $timestamp"
}
