import { MediaType, MessageType } from "../types";

const getSlug = (url: string): string => url.split('?')[0].split('/')[4];

chrome.runtime.onMessage.addListener(async (message, sender, sendResponse) => {
  console.log('[Background] Message: ', message)
  switch (message.type) {
    case MessageType.PersistSeries: { 
      const { series, currentSeason, currentEpisode, currentTime, duration } = message.payload;
      if (!series || !currentSeason || !currentEpisode || !currentTime || !duration) return true;
      if (currentTime < 10) return true;
      const newProgress = {
        current: currentTime,
        total: duration,
      };
      series.episodes[currentSeason - 1][currentEpisode - 1].progress = newProgress;
      series.lastWatched = [currentSeason, currentEpisode];
      await chrome.storage.sync.set({ [`${MediaType.Series}/${getSlug(series.url)}`]: series });
      return true;
    }
    default:
      return true;
  }
});
