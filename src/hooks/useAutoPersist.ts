import { useEffect } from "react";
import { saveJSON } from "../storage/storage";

export function useAutoPersist<T>(key: string, value: T, ready: boolean) {
  useEffect(() => {
    if (ready) void saveJSON(key, value);
  }, [key, value, ready]);
}
