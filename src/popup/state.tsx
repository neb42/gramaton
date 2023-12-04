import * as React from 'react';

import { MediaType, Series, Movie, StorageCache, Media, MessageType } from '../types';

export type State = {
  series: Series[];
  movies: Movie[];
  mediaType: MediaType;
  selectedMedia: Media | null;
  selectMedia: (media: Media | null) => void;
  selectMediaType: (mediaType: MediaType) => void;
};

export const initialState: State = {
  mediaType: MediaType.Series,
  series: [],
  movies: [],
  selectedMedia: null,
  selectMedia: () => {},
  selectMediaType: () => {},
};

export const StateContext = React.createContext<State>(initialState);

export const StateProvider = StateContext.Provider;

export const StateConsumer = StateContext.Consumer;

export const useStateContext = () => React.useContext(StateContext);

export const useSeries = () => {
  const { series } = useStateContext();
  return series;
};

export const useMovies = () => {
  const { movies } = useStateContext();
  return movies;
};

export const useMediaType = () => {
  const { mediaType } = useStateContext();
  return mediaType;
};

export const useSelectMediaType = () => {
  const { selectMediaType } = useStateContext();
  return selectMediaType;
};

export const useSelectedMedia = () => {
  const { selectedMedia } = useStateContext();
  return selectedMedia;
};

export const useSelectMedia = () => {
  const { selectMedia } = useStateContext();
  return selectMedia;
};

export const State = ({ children }: any) => {
  const [mediaType, setMediaType] = React.useState<MediaType>(MediaType.Series);
  const [series, setSeries] = React.useState<Series[]>([]);
  const [movies, setMovies] = React.useState<Movie[]>([]);
  const [selectedMedia, setSelectedMedia] = React.useState<Media | null>(null);

  const loadFromStorage = React.useCallback(() => {
    chrome.storage.sync.get((storageCache) => {
      const [series, movies] = Object.entries(storageCache).reduce<[Series[], Movie[]]>((acc, [key, value]) => {
        const [mediaType, slug] = key.split('/');
        if (!slug) return acc;
        if (mediaType === MediaType.Series) {
          return [
           [...acc[0], value as Series],
            acc[1],
          ];
        } else if (mediaType === MediaType.Movies) {
          return [
            acc[0],
            [...acc[1], value as Movie],
          ];
        }
        return acc;
      }, [[], []]);
      setSeries(series);
      setMovies(movies);
    });
  }, []);

  React.useEffect(() => {
   loadFromStorage(); 
   chrome.runtime.onMessage.addListener((message) => {
      if (message.type === MessageType.RefreshState) {
        loadFromStorage();
      }
    });
  }, []);

  React.useEffect(() => {
    if (selectedMedia) {
      if (selectedMedia.type === MediaType.Series) {
        const s = series.find((s) => s.url === selectedMedia.url);
        if (s) setSelectedMedia(s);
        else setSelectedMedia(null);
      } else if (selectedMedia.type === MediaType.Movies) {
        const m = movies.find((m) => m.url === selectedMedia.url);
        if (m) setSelectedMedia(m);
        else setSelectedMedia(null);
      }
    }
  }, [JSON.stringify(series), JSON.stringify(movies)]);

  return (
    <StateProvider value={{
      mediaType,
      series,
      movies,
      selectedMedia,
      selectMedia: setSelectedMedia,
      selectMediaType: setMediaType,
    }}>
      {children}
    </StateProvider>
  );
};