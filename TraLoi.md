# Trả lời câu hỏi bổ sung – Buổi 8

## 1. Cờ ready
Lần render đầu, giỏ hàng trong Redux là mảng rỗng, còn dữ liệu cũ ở AsyncStorage. Nếu effect ghi ngay, mảng rỗng có thể đè lên dữ liệu cũ trước khi việc đọc hoàn tất. Đọc và hydrate store xong mới bật ready để bắt đầu lưu các thay đổi.

## 2. Token giả
Mật khẩu lưu thô trong db.json và được API trả về để client tự so sánh nên có thể bị đọc. Token do client tạo cũng có thể bị giả mạo. Hệ thống thật để server kiểm tra mật khẩu đã băm, cấp và xác minh token có thời hạn; ứng dụng di động lưu token bằng SecureStore (Keychain/Keystore) thay cho AsyncStorage.

## 3. Hai effect trong CartItemRow
State qty chỉ lấy item.quantity ở lần khởi tạo. Nếu thêm cùng sách ở Chi tiết trong khi dòng giỏ hàng còn mounted, store tăng số lượng nhưng số hiển thị sẽ cũ nếu thiếu effect đồng bộ. Effect đồng bộ cập nhật qty khi store đổi; effect debounce gửi số lượng vừa chọn sau 300 ms.

## 4. Một nguồn state
Nếu mỗi HeartButton giữ useState riêng, bấm tim ở Home sẽ không đổi tim ở Chi tiết. Redux giữ một danh sách id duy nhất; mọi nút cùng đọc danh sách đó và dùng toggle nên cập nhật đồng bộ.

## 5. Hiện/ẩn mật khẩu
LoginScreen có state showPassword, ô Mật khẩu nhận secureTextEntry={!showPassword}. Nút 👁 đổi trạng thái và nhãn Hiện mật khẩu / Ẩn mật khẩu; mặc định mật khẩu được ẩn. Ảnh kết quả: [mật khẩu ẩn](docs/ket-qua/01-mat-khau-an.png) và [mật khẩu hiện](docs/ket-qua/02-mat-khau-hien.png).
