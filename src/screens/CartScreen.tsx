import React, { useState } from "react";
import { FlatList, StyleSheet, Text, TextInput, View } from "react-native";
import { Header } from "../components/Header";
import { CartItemRow } from "../components/CartItemRow";
import { PrimaryButton } from "../components/PrimaryButton";

import { EmptyState } from "../components/EmptyState";
import { useAuth, useCart } from "../store/hooks";
import { confirmDialog } from "../utils/dialog"; // đã viết sẵn — dùng ở BT8.7a
import { TabScreenProps } from "../navigation/types";
import { colors, formatPrice } from "../theme";

export function CartScreen({ navigation }: TabScreenProps<"Cart">) {
  const { items, totalPrice, setQty, remove } = useCart();
  const { isLoggedIn } = useAuth();
  const [couponInput, setCouponInput] = useState("");
  const [coupon, setCoupon] = useState<string | null>(null);
  const [couponMsg, setCouponMsg] = useState("");
  const discount = coupon === "SALE10" ? Math.round(totalPrice * 0.1) : coupon === "GIAM50K" ? Math.min(50000, totalPrice) : 0;
  const finalTotal = totalPrice - discount;
  const applyCoupon = () => {
    const code = couponInput.trim().toUpperCase();
    if (code === "SALE10" || code === "GIAM50K") {
      setCoupon(code);
      setCouponMsg(`Đã áp dụng ${code}: ${code === "SALE10" ? "Giảm 10%" : "Giảm 50.000đ"}`);
    } else {
      setCoupon(null); setCouponMsg("Mã giảm giá không hợp lệ");
    }
  };
  const askRemove = (bookId: number) => {
    const item = items.find((i) => i.bookId === bookId);
    confirmDialog("Xóa sản phẩm", `Xóa "${item?.title ?? "sản phẩm"}" khỏi giỏ hàng?`, () => remove(bookId));
  };
  const goCheckout = () => {
    if (isLoggedIn) navigation.navigate("Checkout", { total: finalTotal });
    else navigation.navigate("Login", { redirectTo: "Checkout", total: finalTotal });
  };

  return (
    <View style={styles.container}>
      <Header title="🛒 Giỏ hàng" />
      <FlatList
        data={items}
        keyExtractor={(i) => String(i.bookId)}
        renderItem={({ item }) => <CartItemRow item={item} onChangeQty={setQty} onRemove={askRemove} />}
        contentContainerStyle={{ paddingVertical: 8, flexGrow: 1 }}
        ListEmptyComponent={
          <EmptyState emoji="🛒" title="Giỏ hàng trống" message="Hãy chọn vài cuốn sách yêu thích nhé." actionLabel="Khám phá sách" onAction={() => navigation.navigate("Home")} />
        }
      />
      {items.length > 0 && (
        <View style={styles.footer}>
          <View style={{ flexDirection: "row", gap: 8 }}>
            <TextInput style={{ flex: 1, borderWidth: 1, borderColor: colors.line, borderRadius: 10, padding: 10, color: colors.text }} placeholder="Mã giảm giá (SALE10)" accessibilityLabel="Mã giảm giá" value={couponInput} onChangeText={setCouponInput} autoCapitalize="characters" onSubmitEditing={applyCoupon} />
            <PrimaryButton title="Áp dụng" onPress={applyCoupon} />
          </View>
          {couponMsg ? <Text style={{ color: coupon ? "#15803D" : colors.danger }}>{couponMsg}</Text> : null}
          <View style={styles.line}><Text style={styles.muted}>Giảm giá</Text><Text style={styles.value}>−{formatPrice(discount)}</Text></View>
          <View style={styles.line}><Text style={styles.muted}>Tạm tính</Text><Text style={styles.value}>{formatPrice(totalPrice)}</Text></View>
          <View style={styles.line}><Text style={styles.total}>Tổng cộng</Text><Text style={styles.total}>{formatPrice(finalTotal)}</Text></View>
          <PrimaryButton title="Thanh toán" onPress={goCheckout} />
        </View>
      )}
    </View>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1, backgroundColor: colors.bg },
  footer: { backgroundColor: "#fff", padding: 14, gap: 8, borderTopWidth: 1, borderTopColor: colors.line },
  line: { flexDirection: "row", justifyContent: "space-between" },
  muted: { color: colors.muted },
  value: { fontWeight: "700", color: colors.text },
  total: { fontSize: 17, fontWeight: "800", color: colors.navy },
});
