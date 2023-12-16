import { getStorage } from "../storage";
import { Series } from "../types";
import { getSlug } from "./utils";

export const episodeUnwatched = async (
  series: Series,
  season: number,
  episode: number,
) => {
  const slug = getSlug(series.url);
  const key = `series/${slug}`;
  const e = series.episodes[season - 1][episode - 1];
  const newProgress = {
    current: 0,
    total: e.progress.total,
    finished: false,
  };
  series.episodes[season - 1][episode - 1].progress = newProgress;
  if (series.lastWatched[0] === season && series.lastWatched[1] === episode) {
    series.lastWatched = [0, 0];
  }
  await getStorage().set({ [key]: series });
};