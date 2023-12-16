export const getStorage = (): chrome.storage.StorageArea => {
  if (typeof chrome !== "undefined" && chrome.storage) {
    return chrome.storage.local;
  } else {
    throw new Error("Storage API not found");
  }
}