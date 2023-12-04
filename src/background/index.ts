import { MessageType } from "../types";
import { episodeUnwatched } from "./episodeUnwatched";
import { episodeWatched } from "./episodeWatched";
import { migrateData } from "./migrateData";
import { persistSeries } from "./persistSeries";
import { refreshState } from "./refreshState";
import { removeSeries } from "./removeSeries";

chrome.runtime.onMessage.addListener(async (message, sender, sendResponse) => {
  try {
    switch (message.type) {
      case MessageType.Init: {
        await migrateData();
        await refreshState();
        return true;
      }
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
  } catch (error) {
    // console.error(error);
    return false;
  }
});
