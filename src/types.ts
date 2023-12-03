export enum MessageType {
  PersistSeries = 'persist-series',
  PersistMovie = 'persist-movie',
};

export enum MediaType {
  Movies = 'movies',
  Series = 'series',
}

export type Progress = {
  current: number;
  total: number;
};

export type Movie = {
  type: MediaType.Movies 
  title: string;
  url: string;
  progress: Progress;
};

export type Episode = {
  title: string;
  season: number;
  episode: number;
  progress: Progress;
};

export type Series = {
  type: MediaType.Series; 
  title: string;
  url: string;
  lastWatched: [number, number];
  episodes: Episode[][];
};

export type Media = Movie | Series;

export type StorageCache = {
  [MediaType.Movies]: {
    [key: string]: Movie;
  };
  [MediaType.Series]: {
    [key: string]: Series;
  };
}