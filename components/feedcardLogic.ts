import { useCurrentUser } from "@/hooks/user";

export const setItemWithExpiration = (
  key: string,
  value: string,
  expirationMinutes: number
) => {
  const now = new Date();
  const item = {
    value: value,
    expiration: now.getTime() + expirationMinutes * 60 * 1000, // in milliseconds
  };
  window.localStorage.setItem(key, JSON.stringify(item));
};

// Get data from localStorage and check expiration
export const getItemWithExpiration = (key: string) => {
  const itemStr = localStorage.getItem(key);
  if (!itemStr) {
    return null;
  }

  const item = JSON.parse(itemStr);
  const now = new Date();

  if (now.getTime() > item.expiration) {
    // Item has expired
    localStorage.removeItem(key);
    return null;
  }
  return item.value;
};
