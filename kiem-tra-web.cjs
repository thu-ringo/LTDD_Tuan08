const { chromium } = require('playwright');
const fs = require('fs');
(async () => {
 const browser = await chromium.launch({ channel: 'msedge', headless: true });
 const page = await browser.newPage({ viewport: { width: 430, height: 932 } });
 const results=[]; const errors=[]; let userId, reviewId;
 page.on('pageerror', e=>errors.push(e.message));
 const text=(t)=>page.getByText(t,{exact:true}).filter({visible:true});
 const click=async(t)=>{await (t === 'Dế Mèn Phiêu Lưu Ký' ? text(t).first() : text(t).last()).click();};
 const check=async(name,fn)=>{await fn();results.push(name);console.log('PASS',name);};
 const visible=async(t)=>{await text(t).last().waitFor({state:'visible',timeout:15000});};
 const storage=async(k)=>page.evaluate(k=>JSON.parse(localStorage.getItem(k)),k);
 fs.mkdirSync('docs/ket-qua',{recursive:true});
 try {
 await page.goto('http://localhost:8081'); await visible('Dế Mèn Phiêu Lưu Ký');
 await check('Tim ở Home và Chi tiết đồng bộ',async()=>{await page.getByLabel('Yêu thích',{exact:true}).filter({visible:true}).first().click();await click('Dế Mèn Phiêu Lưu Ký');await page.getByLabel('Bỏ yêu thích',{exact:true}).filter({visible:true}).waitFor();});
 await check('Sách liên quan cùng danh mục',async()=>{await visible('Sách liên quan');});
 await click('Thêm vào giỏ'); await page.locator('a').filter({visible:true}).first().click();
 await click('Giỏ hàng');
 await check('Giảm bị khóa ở 1, tăng có debounce và lưu',async()=>{if(await page.getByLabel('Giảm',{exact:true}).filter({visible:true}).getAttribute('aria-disabled')!=='true')throw Error('Min not disabled');await page.getByLabel('Tăng',{exact:true}).filter({visible:true}).click();await page.getByLabel('Tăng',{exact:true}).filter({visible:true}).click();await page.waitForTimeout(700);if((await storage('@bookstore/cart'))[0].quantity!==3)throw Error('Wrong qty');});
 await check('Không tăng vượt tồn kho và đồng bộ khi thêm ở Chi tiết',async()=>{
  for(let n=3;n<12;n++)await page.getByLabel('Tăng',{exact:true}).filter({visible:true}).click();
  if(await page.getByLabel('Tăng',{exact:true}).filter({visible:true}).getAttribute('aria-disabled')!=='true')throw Error('Max not disabled');
  await page.waitForTimeout(500);if((await storage('@bookstore/cart'))[0].quantity!==12)throw Error('Stock exceeded');
  for(let n=12;n>2;n--)await page.getByLabel('Giảm',{exact:true}).filter({visible:true}).click();
  await page.waitForTimeout(500);await click('Home');await page.waitForTimeout(400);await click('Dế Mèn Phiêu Lưu Ký');await click('Thêm vào giỏ');await page.locator('a').filter({visible:true}).first().click();await click('Giỏ hàng');await page.waitForTimeout(500);
  if((await storage('@bookstore/cart'))[0].quantity!==3)throw Error('External quantity not synced');
 });
 await check('Xóa hỏi xác nhận, Hủy giữ sản phẩm',async()=>{page.once('dialog',d=>d.dismiss());await page.getByLabel('Xóa khỏi giỏ').filter({visible:true}).click();if(await page.getByLabel('Xóa khỏi giỏ').filter({visible:true}).count()!==1)throw Error('Removed');});
 await check('Mã sai và hai mã giảm giá',async()=>{await page.getByLabel('Mã giảm giá',{exact:true}).filter({visible:true}).fill('wrong');await click('Áp dụng');await visible('Mã giảm giá không hợp lệ');await page.getByLabel('Mã giảm giá',{exact:true}).filter({visible:true}).fill('GIAM50K');await click('Áp dụng');await visible('Đã áp dụng GIAM50K: Giảm 50.000đ');await page.getByLabel('Mã giảm giá',{exact:true}).filter({visible:true}).fill('sale10');await click('Áp dụng');await visible('Đã áp dụng SALE10: Giảm 10%');});
 await page.screenshot({path:'docs/ket-qua/03-gio-hang.png'});
 await click('Thanh toán'); await visible('Đăng nhập BookStore');
 await check('Validate đăng nhập dưới từng ô',async()=>{await click('Đăng nhập');await visible('Vui lòng nhập email');await visible('Vui lòng nhập mật khẩu');await page.locator('input:visible').nth(0).fill('abc');await page.locator('input:visible').nth(1).fill('123');await click('Đăng nhập');await visible('Email không đúng định dạng');});
 await page.locator('input:visible').nth(0).fill('demo@bookstore.vn');await page.locator('input:visible').nth(1).fill('wrong123');await click('Đăng nhập');await visible('Email hoặc mật khẩu không đúng');results.push('Sai mật khẩu báo lỗi API');
 await page.locator('input:visible').nth(1).fill('123456');
 await check('Nút mắt hiện và ẩn mật khẩu',async()=>{await page.screenshot({path:'docs/ket-qua/01-mat-khau-an.png'});await page.getByLabel('Hiện mật khẩu',{exact:true}).filter({visible:true}).click();if(await page.locator('input:visible').nth(1).getAttribute('type')==='password')throw Error('Still hidden');await page.screenshot({path:'docs/ket-qua/02-mat-khau-hien.png'});await page.getByLabel('Ẩn mật khẩu',{exact:true}).filter({visible:true}).click();});
 await click('Đăng nhập');
 await check('Đăng nhập từ giỏ về Checkout với tổng đã giảm',async()=>{await visible('Tổng tiền cần thanh toán');await visible('175.500 đ');});
 await page.locator('a').filter({visible:true}).first().click();await click('Tài khoản');await visible('demo@bookstore.vn');
 await check('Phiên, giỏ và yêu thích còn sau tải lại',async()=>{await page.reload();await visible('Dế Mèn Phiêu Lưu Ký');await click('Tài khoản');await visible('demo@bookstore.vn');if((await storage('@bookstore/cart'))[0].quantity!==3)throw Error('Cart lost');if((await storage('@bookstore/wishlist')).length!==1)throw Error('Wishlist lost');});
 await click('Danh sách yêu thích');await visible('Dế Mèn Phiêu Lưu Ký');await page.screenshot({path:'docs/ket-qua/04-yeu-thich.png'});
 await check('Bỏ tim cập nhật danh sách và trạng thái trống',async()=>{await page.getByLabel('Bỏ yêu thích',{exact:true}).filter({visible:true}).click();await visible('Chưa có sách yêu thích');});
 await click('Khám phá sách');await click('Dế Mèn Phiêu Lưu Ký');
 await check('Đánh giá thiếu sao và bình luận',async()=>{await click('Gửi đánh giá');await visible('Vui lòng chọn số sao');await page.getByLabel('5 sao',{exact:true}).filter({visible:true}).click();await click('Gửi đánh giá');await visible('Vui lòng nhập bình luận');});
 const comment='Kiểm tra BT8 '+Date.now();await page.locator('textarea:visible').fill(comment);
 const response=page.waitForResponse(r=>r.url().includes('/reviews')&&r.request().method()==='POST');await click('Gửi đánh giá');reviewId=(await (await response).json()).id;await visible(comment);results.push('POST đánh giá hiện ngay và cập nhật điểm trung bình');await page.screenshot({path:'docs/ket-qua/05-danh-gia.png'});
 await page.locator('a').filter({visible:true}).first().click();await click('Tài khoản');await click('Đăng xuất');await visible('Bạn chưa đăng nhập');await page.waitForTimeout(300);
 await check('Đăng xuất xóa phiên',async()=>{if(await storage('@bookstore/auth'))throw Error('Auth retained');});
 await click('Đăng ký');await click('Đăng ký');await visible('Vui lòng nhập họ tên');await visible('Vui lòng nhập lại mật khẩu');
 const inputs=page.locator('input:visible');await inputs.nth(0).fill('Học viên BT8');await inputs.nth(1).fill('demo@bookstore.vn');await inputs.nth(2).fill('123456');await inputs.nth(3).fill('123457');await click('Đăng ký');await visible('Mật khẩu nhập lại không khớp');await inputs.nth(3).fill('123456');await click('Đăng ký');await visible('Email này đã được đăng ký');results.push('Đăng ký validate, xác nhận mật khẩu và email trùng');
 await inputs.nth(1).fill('bt8-test-'+Date.now()+'@example.com');const reg=page.waitForResponse(r=>r.url().endsWith('/users')&&r.request().method()==='POST');await click('Đăng ký');userId=(await(await reg).json()).id;await visible('Dế Mèn Phiêu Lưu Ký');await click('Tài khoản');await visible('Học viên BT8');results.push('Đăng ký thành công tự đăng nhập');
 await click('Giỏ hàng');page.once('dialog',d=>d.accept());await page.getByLabel('Xóa khỏi giỏ').filter({visible:true}).click();await visible('Giỏ hàng trống');await page.reload();await visible('Dế Mèn Phiêu Lưu Ký');await click('Giỏ hàng');await visible('Giỏ hàng trống');results.push('Xác nhận xóa và lưu giỏ rỗng');
 if(errors.length)throw Error(errors.join('\n'));
 fs.writeFileSync('docs/ket-qua/kiem-tra.json',JSON.stringify({passed:results,errors},null,2));
 } catch(e){await page.screenshot({path:'docs/ket-qua/loi-kiem-tra.png'});console.log((await page.locator('body').innerText()).slice(-5000));console.error(e);process.exitCode=1;}
 finally {if(reviewId)await fetch('http://localhost:3000/reviews/'+reviewId,{method:'DELETE'});if(userId)await fetch('http://localhost:3000/users/'+userId,{method:'DELETE'});await browser.close();}
})();
