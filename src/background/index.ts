import { MessageType } from "../types";
import { episodeUnwatched } from "./episodeUnwatched";
import { episodeWatched } from "./episodeWatched";
import { persistSeries } from "./persistSeries";
import { removeSeries } from "./removeSeries";

const refreshState = async () => {
  await chrome.runtime.sendMessage({ type: MessageType.RefreshState });
};

chrome.runtime.onMessage.addListener(async (message, sender, sendResponse) => {
  switch (message.type) {
    case MessageType.PersistSeries: { 
      const { series, currentSeason, currentEpisode, currentTime, duration } = message.payload;
      if (!series || !currentSeason || !currentEpisode || !currentTime || !duration) return true;
      await persistSeries(series, currentSeason, currentEpisode, currentTime, duration);
      return true;
    }
    case MessageType.EpisodeUnwatched: {
      const { series, season, episode } = message.payload;
      if (!series || !season || !episode) return true;
      await episodeUnwatched(series, season, episode);
      await refreshState();
      return true;
    }
    case MessageType.EpisodeWatched: {
      const { series, season, episode } = message.payload;
      if (!series || !season || !episode) return true;
      await episodeWatched(series, season, episode);
      await refreshState();
      return true;
    }
    case MessageType.RemoveSeries: {
      const { series } = message.payload;
      if (!series) return true;
      await removeSeries(series);
      await refreshState();
      return true;
    }
    default:
      return true;
  }
});
