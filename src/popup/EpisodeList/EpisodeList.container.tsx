import * as React from 'react';

import { EpisodeListComponent } from './EpisodeList.component';
import { useSelectedMedia } from '../state';
import { Episode, MediaType, MessageType } from '../../types';

type Props = {

};

export const EpisodeListContainer: React.FC<Props> = ({}) => {
  const selectedMedia = useSelectedMedia();

  if (!selectedMedia || selectedMedia.type !== MediaType.Series) {
    return <div className='episode-panel' />;
  }

  const lastWatchedEpisode = selectedMedia.episodes[selectedMedia.lastWatched[0] - 1][selectedMedia.lastWatched[1] - 1];

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

  const markEpisodeWatched = (episode: Episode) => {
    chrome.runtime.sendMessage({
      type: MessageType.EpisodeWatched,
      payload: {
        series: selectedMedia,
        season: episode.season,
        episode: episode.episode,
      },
    });
  };

  const markEpisodeUnwatched = (episode: Episode) => {
    chrome.runtime.sendMessage({
      type: MessageType.EpisodeUnwatched,
      payload: {
        series: selectedMedia,
        season: episode.season,
        episode: episode.episode,
      },
    });
  };

  const handleRemoveSeries = () => {
    chrome.runtime.sendMessage({
      type: MessageType.RemoveSeries,
      payload: {
        series: selectedMedia,
      },
    });
  }

  return (
    <EpisodeListComponent
      episodes={selectedMedia.episodes}
      nextEpisode={nextEpisode}
      currentEpisode={lastWatchedEpisode.progress.finished ? null : lastWatchedEpisode}
      buildEpisodeUrl={buildEpisodeUrl}
      markEpisodeWatched={markEpisodeWatched}
      markEpisodeUnwatched={markEpisodeUnwatched}
      removeSeries={handleRemoveSeries}
    />
  );
};