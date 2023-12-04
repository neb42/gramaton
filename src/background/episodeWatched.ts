import { Series } from "../types";
import { getSlug } from "./utils";

export const episodeWatched = async (
  series: Series,
  season: number,
  episode: number,
) => {
  const slug = getSlug(series.url);
  const key = `series/${slug}`;
  const e = series.episodes[season - 1][episode - 1];
  const newProgress = {
    current: e.progress.total,
    total: e.progress.total,
    finished: true,
  };
  series.episodes[season - 1][episode - 1].progress = newProgress;
  await chrome.storage.sync.set({ [key]: series });
};