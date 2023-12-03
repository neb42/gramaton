import { State, useSelectMedia, useSelectMediaType, useSelectedMedia } from './state';
import { SeriesList } from './SeriesList';
import { EpisodeList } from './EpisodeList';
import { Tabs } from './Tabs';
import { MediaType } from '../types';

export const Root = (): JSX.Element => {
  const selectMediaType = useSelectMediaType();
  const selectMedia = useSelectMedia();
  const selectedMedia = useSelectedMedia();

  const handleTabChange = (index: number) => {
    if (index === 0) {
      selectMediaType(MediaType.Series);
      if (selectedMedia && selectedMedia.type !== MediaType.Series) selectMedia(null);
    } else if (index === 1) {
      selectMediaType(MediaType.Movies);
      if (selectedMedia && selectedMedia.type !== MediaType.Movies) selectMedia(null);
    }
  };

  return (
    <State>
      <div className="root-container">
        <h1>gramaton - Currently watching</h1>
        <Tabs headers={['Series', 'Movies']} onTabChange={handleTabChange}>
          <div className="root-content">
            <SeriesList />
            <EpisodeList />
          </div>
          <div className="root-content">
            <span>Coming soon</span>
          </div>
        </Tabs>
      </div>
    </State>
  );
};