import { Series } from "../types";
import { getSlug } from "./utils";

export const removeSeries = async (series: Series) => {
  const slug = getSlug(series.url);
  const key = `series/${slug}`;
  await chrome.storage.sync.remove(key);
}