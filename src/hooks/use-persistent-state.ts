"use client";

import { useState, useEffect, useCallback, Dispatch, SetStateAction } from 'react';

export function usePersistentState<T>(key: string, defaultValue: T): [T, Dispatch<SetStateAction<T>>] {
  const [value, setValue] = useState<T>(defaultValue);

  useEffect(() => {
    const item = window.localStorage.getItem(key);
    if (item) {
      try {
        setValue(JSON.parse(item));
      } catch (e) {
        console.error(`Error parsing localStorage key "${key}":`, e);
        window.localStorage.removeItem(key);
      }
    }
  }, [key]);
  
  const setPersistentValue = useCallback<Dispatch<SetStateAction<T>>>((newValue) => {
    setValue((current) => {
      const result = newValue instanceof Function ? newValue(current) : newValue;
      try {
        window.localStorage.setItem(key, JSON.stringify(result));
      } catch (e) {
        console.error(`Error setting localStorage key "${key}":`, e);
      }
      return result;
    });
  }, [key]);

  return [value, setPersistentValue];
}
