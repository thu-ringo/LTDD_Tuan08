import React from "react";
import { Pressable, Text, View } from "react-native";
import { colors } from "../theme";

interface Props { value: number; size?: number; onChange?: (v: number) => void; }
export function RatingStars({ value, size = 18, onChange }: Props) {
  const filled = Math.round(value);
  return <View style={{ flexDirection: "row", gap: 3 }}>
    {[1, 2, 3, 4, 5].map((n) => {
      const star = <Text key={n} style={{ fontSize: size, color: n <= filled ? colors.warning : colors.line }}>★</Text>;
      return onChange ? <Pressable key={n} hitSlop={4} accessibilityRole="button" accessibilityLabel={`${n} sao`} accessibilityState={{ selected: n === filled }} onPress={() => onChange(n)}>{star}</Pressable> : star;
    })}
  </View>;
}
