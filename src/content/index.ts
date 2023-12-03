import { SeriesWatcher } from './series';
import { MediaType } from '../types';

const urlBlacklist = [
  'https://gramaton.io/series',
  'https://gramaton.io/series/new',
  'https://gramaton.io/series/movies',
];

const getMediaType = (url: string): MediaType => url.split('/')[3] as MediaType;

const main = async () => { 
  const url = window.location.href;

  if (urlBlacklist.includes(url.split('?')[0])) return;

  const mediaType = getMediaType(url);

  switch (mediaType) {
    case MediaType.Series:
      const seriesWatcher = new SeriesWatcher(url);
      await seriesWatcher.start();
      SeriesWatcher.openEpisode(url);
      break;
    case MediaType.Movies:
      break;
    default:
      break;
  }
};

main();