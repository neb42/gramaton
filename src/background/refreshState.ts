import { MessageType } from "../types";

export const refreshState = async () => {
  await chrome.runtime.sendMessage({ type: MessageType.RefreshState });
};