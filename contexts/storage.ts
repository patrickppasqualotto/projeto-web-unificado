// Storage wrapper: usa AsyncStorage em React Native se estiver disponível,
// caso contrário usa window.localStorage (para web). Faz o require dinamicamente
// usando eval("require") para evitar resolução estática do bundler quando a
// dependência não estiver instalada.

type StorageLike = {
  getItem(key: string): Promise<string | null> | string | null;
  setItem(key: string, value: string): Promise<void> | void;
  removeItem(key: string): Promise<void> | void;
};

let nativeStorage: StorageLike | null = null;

try {
  // usar eval to avoid static analysis by bundlers when package is not installed
  // eslint-disable-next-line @typescript-eslint/no-implied-eval
  const req = eval("require");
  nativeStorage = req('@react-native-async-storage/async-storage');
} catch (err) {
  nativeStorage = null;
}

const isWeb = typeof window !== 'undefined' && typeof window.localStorage !== 'undefined';

async function getItem(key: string): Promise<string | null> {
  if (nativeStorage) {
    return await (nativeStorage as any).getItem(key);
  }
  if (isWeb) {
    const v = window.localStorage.getItem(key);
    return v === null ? null : v;
  }
  return null;
}

async function setItem(key: string, value: string): Promise<void> {
  if (nativeStorage) {
    return await (nativeStorage as any).setItem(key, value);
  }
  if (isWeb) {
    window.localStorage.setItem(key, value);
    return;
  }
}

async function removeItem(key: string): Promise<void> {
  if (nativeStorage) {
    return await (nativeStorage as any).removeItem(key);
  }
  if (isWeb) {
    window.localStorage.removeItem(key);
    return;
  }
}

export { getItem, setItem, removeItem };
