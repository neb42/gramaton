import { getStorage } from '../storage'; 
import { MediaType, Media, Movie, Series } from '../types';

export class BaseWatcher {
  protected url: string;
  protected slug: string;

  constructor(url: string) {
    this.url = url.split('?')[0];
    this.slug = this.getSlug(url);
  };

  protected getSlug = (url: string): string => url.split('?')[0].split('/')[4];

  protected getFromCache: {
    (mediaType: MediaType.Movies, slug: string): Promise<Movie | null>;
    (mediaType: MediaType.Series, slug: string): Promise<Series | null>;
  } = async (mediaType: MediaType, slug: string): Promise<any | null> => {
    const key = `${mediaType}/${slug}`;
    const storageCache = await getStorage().get(key);
    if (!storageCache || Object.keys(storageCache).length === 0) return null;
    const media = storageCache[key];
    if (!media || Object.keys(media).length === 0) return null;
    return media;
  };

  protected setToCache: {
    (mediaType: MediaType.Movies, slug: string, movie: Movie): Promise<void>;
    (mediaType: MediaType.Series, slug: string, series: Series): Promise<void>;
  } = async (mediaType: MediaType, slug: string, media: Media): Promise<void> => {
    const key = `${mediaType}/${slug}`;
    await getStorage().set({ [key]: media });
  };

  protected getVideoElement = (): HTMLVideoElement | null => {
    const video = document.querySelector('video.jw-video');
    if (!video) return null;
    return video as HTMLVideoElement;
  };
};