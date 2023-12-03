import * as React from 'react';

import { EpisodeListComponent } from './EpisodeList.component';
import { useSelectedMedia } from '../state';
import { Episode, MediaType } from '../../types';

type Props = {

};

export const EpisodeListContainer: React.FC<Props> = ({}) => {
  const selectedMedia = useSelectedMedia();

  if (!selectedMedia || selectedMedia.type !== MediaType.Series) {
    return <div className='episode-panel' />;
  }

  const lastWatchedEpisode = selectedMedia.episodes[selectedMedia.lastWatched[0] - 1][selectedMedia.lastWatched[1] - 1];

  const finishedLastWatchedEpisode = lastWatchedEpisode.progress.current >= (lastWatchedEpisode.progress.total * 0.95);

  const nextEpisode = (() => {
    const nEpisodesInSeason = selectedMedia.episodes[lastWatchedEpisode.season - 1].length;
    if (lastWatchedEpisode.episode < nEpisodesInSeason) {
      return selectedMedia.episodes[lastWatchedEpisode.season - 1][lastWatchedEpisode.episode];
    }

    const nSeasons = selectedMedia.episodes.length;
    if (lastWatchedEpisode.season < nSeasons) {
      return selectedMedia.episodes[lastWatchedEpisode.season][0];
    }

    return null;
  })();

  const buildEpisodeUrl = (episode: Episode) => `${selectedMedia.url}?season=${episode.season}&episode=${episode.episode}`;

  return (
    <EpisodeListComponent
      episodes={selectedMedia.episodes}
      nextEpisode={nextEpisode}
      currentEpisode={finishedLastWatchedEpisode ? null : lastWatchedEpisode}
      buildEpisodeUrl={buildEpisodeUrl}
    />
  );
};