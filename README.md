# BookStore – Bài thực hành Buổi 8

Đã hoàn thành BT8.1–BT8.8, hai thử thách C1/C2 và phần câu hỏi bổ sung theo đề Word.
Giữ nguyên giao diện và cấu trúc Expo / React Native / TypeScript / Redux của starter.

## Chạy ứng dụng

Yêu cầu Node.js 20 trở lên. Cài thư viện bằng `npm install`, sau đó mở hai terminal:

```bash
npm run api
```

```bash
npm run web
# hoặc npm start để chạy trên Expo Go
```

Tài khoản thử: `demo@bookstore.vn` / `123456`.
Trên điện thoại, máy tính và điện thoại cần cùng Wi-Fi; ứng dụng tự lấy IP từ Expo hostUri.
Có thể đặt `EXPO_PUBLIC_API_URL=http://<IP-máy-tính>:3000` nếu cần.

## Phần đã làm

- Đăng nhập, đăng ký: lỗi ngay dưới từng ô, lỗi API, loading; nút mắt cạnh ô mật khẩu.
- AsyncStorage: khôi phục phiên, giỏ hàng, yêu thích trước khi bật ready; đăng xuất xóa phiên.
- Bảo vệ Checkout ở cả giỏ hàng và màn Checkout; giữ tổng tiền khi chuyển qua đăng nhập/đăng ký.
- Sao tương tác, điểm trung bình, gửi đánh giá và cập nhật ngay tại màn chi tiết.
- Số lượng giỏ dùng state cục bộ và debounce 300 ms, khóa nút theo tồn kho, đồng bộ từ store.
- Xóa có xác nhận trên web và thiết bị; lưu được cả giỏ rỗng.
- Tim dùng chung Redux; màn yêu thích có loading, lỗi/Thử lại và trạng thái trống.
- Sách liên quan cùng danh mục; SALE10 giảm 10%, GIAM50K giảm tối đa 50.000đ.
- `TraLoi.md`: trả lời đủ năm câu bổ sung; ảnh kết quả trong `docs/ket-qua/`.

## Kiểm tra

```bash
npm run typecheck
```

Kịch bản web dùng Edge headless. Khi cần chạy lại, cài công cụ kiểm thử tạm:

```bash
npm install --no-save --package-lock=false playwright
# chạy API và web ở hai terminal trước
node kiem-tra-web.cjs
```

Kịch bản tự tạo và xóa tài khoản/đánh giá thử; kết quả lưu tại `docs/ket-qua/kiem-tra.json`.
Đăng nhập trong bài tập là giả lập theo đề: client so mật khẩu và tự tạo token.
Checkout là khung tối giản hiển thị tổng tiền; form đặt hàng thuộc buổi sau.
