import {useEffect, useState} from "react";

// Custom hook that debounces a value, updating after a delay once the user stops typing
export default function useDebounce<T>(value: T, delay: number = 300): T {
  const [debouncedValue, setDebouncedValue] = useState<T>(value);

  useEffect(() => {
    const timeoutId = setTimeout(() => {
      setDebouncedValue(value);
    }, delay);

    // Cleanup the timeout on every value or delay change
    return () => clearTimeout(timeoutId);
  }, [value, delay]);

  return debouncedValue;
}
