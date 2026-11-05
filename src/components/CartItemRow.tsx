import React, { useEffect, useRef, useState } from "react";
import { Pressable, StyleSheet, Text, View } from "react-native";
import { useDebounce } from "../hooks/useDebounce";
import { CartItem } from "../types";
import { colors, formatPrice, radius } from "../theme";

interface Props {
  item: CartItem;
  onChangeQty: (bookId: number, quantity: number) => void;
  onRemove: (bookId: number) => void;
}

export function CartItemRow({ item, onChangeQty, onRemove }: Props) {
  const [qty, setQty] = useState(item.quantity);
  const debouncedQty = useDebounce(qty, 300);
  const latest = useRef({ item, onChangeQty });
  latest.current = { item, onChangeQty };
  useEffect(() => { setQty(item.quantity); }, [item.quantity]);
  useEffect(() => {
    const current = latest.current;
    if (debouncedQty !== current.item.quantity) current.onChangeQty(current.item.bookId, debouncedQty);
  }, [debouncedQty]);
  const canDec = qty > 1;
  const canInc = qty < item.stock;
  return (
    <View style={styles.row}>
      <View style={[styles.cover, { backgroundColor: item.color }]}>
        <Text style={styles.emoji}>{item.emoji}</Text>
      </View>
      <View style={styles.info}>
        <Text style={styles.title} numberOfLines={2}>{item.title}</Text>
        <Text style={styles.price}>{formatPrice(item.price)}</Text>
        <View style={{ flexDirection: "row", alignItems: "center", gap: 12, marginTop: 6 }}>
          <Pressable disabled={!canDec} style={{ opacity: canDec ? 1 : 0.35, padding: 6 }} onPress={() => setQty((q) => Math.max(1, q - 1))} accessibilityLabel="Giảm"><Text style={styles.qty}>−</Text></Pressable>
          <Text style={styles.qty}>{qty}</Text>
          <Pressable disabled={!canInc} style={{ opacity: canInc ? 1 : 0.35, padding: 6 }} onPress={() => setQty((q) => Math.min(item.stock, q + 1))} accessibilityLabel="Tăng"><Text style={styles.qty}>+</Text></Pressable>
          <Text style={{ color: colors.muted }}>Còn {item.stock}</Text>
        </View>
      </View>
      <Pressable onPress={() => onRemove(item.bookId)} hitSlop={8} accessibilityLabel="Xóa khỏi giỏ">
        <Text style={styles.trash}>🗑️</Text>
      </Pressable>
    </View>
  );
}

const styles = StyleSheet.create({
  row: { flexDirection: "row", alignItems: "center", backgroundColor: colors.card, borderRadius: radius.md, padding: 10, marginHorizontal: 12, marginVertical: 5, gap: 10 },
  cover: { width: 54, height: 72, borderRadius: radius.sm, alignItems: "center", justifyContent: "center" },
  emoji: { fontSize: 26 },
  info: { flex: 1, gap: 2 },
  title: { fontWeight: "700", color: colors.text },
  price: { color: colors.indigo, fontWeight: "800" },
  qty: { fontWeight: "800", color: colors.navy, fontSize: 16 },
  trash: { fontSize: 22 },
});
