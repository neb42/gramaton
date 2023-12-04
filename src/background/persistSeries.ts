import { MediaType, Series } from "../types";
import { getSlug } from "./utils";


export const persistSeries = async (
  series: Series,
  currentSeason: number,
  currentEpisode: number,
  currentTime: number,
  duration: number,
) => {
  if (currentTime < 10) return true;
  const newProgress = {
    current: currentTime,
    total: duration,
    finished: duration === 0 ? false : currentTime >= (duration * 0.95),
  };
  series.episodes[currentSeason - 1][currentEpisode - 1].progress = newProgress;
  series.lastWatched = [currentSeason, currentEpisode];
  await chrome.storage.sync.set({ [`${MediaType.Series}/${getSlug(series.url)}`]: series });
};