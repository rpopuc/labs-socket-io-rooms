import { ref, watch } from "vue"

export function useStorage(key: string, defaultValue: any = null) {
  let storedValue = read();
  let value = storedValue ? ref(storedValue) : ref(defaultValue);

  write();

  watch(value, write, { deep: true });

  function read() {
    const value = localStorage.getItem(key)
    if (!value) {
      return ''
    }
    return JSON.parse(value)
  }

  function write() {
    if (value.value === "") {
      localStorage.removeItem(key);
      return;
    }

    localStorage.setItem(key, JSON.stringify(value.value));
  }

  return value;
}
