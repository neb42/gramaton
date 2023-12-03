import * as React from 'react';
import { Episode } from '../../types';

import './EpisodeList.css';


type Props = {
  episodes: Episode[][];
  nextEpisode: Episode | null;
  currentEpisode: Episode | null;
  buildEpisodeUrl: (episode: Episode) => string;
};

const EpisodeListItem = ({ episode, buildEpisodeUrl }: { episode: Episode, buildEpisodeUrl: Props['buildEpisodeUrl']  }) => {
  const Progress = () => {
    if (episode.progress.current === 0) {
      return (
        <span className='episode-progress-0'>Not watched</span>
      );
    }

    if (episode.progress.current >= (episode.progress.total * 0.95)) {
      return (
        <span className='episode-progress-100'>Watched</span>
      );
    }

    if (episode.progress.current > 0) {
      return (
        <progress className='episode-progress' value={episode.progress.current} max={episode.progress.total} />
      );
    }

    return null;
  };

  return (
    <a href={buildEpisodeUrl(episode)} target='_blank' rel='noopener noreferrer'>
      <li className='episode-list-item'>
        <span>{episode.episode}. {episode.title}</span>
        <Progress />
      </li>
    </a>
  );
};

export const EpisodeListComponent: React.FC<Props> = ({
  episodes,
  nextEpisode,
  currentEpisode,
  buildEpisodeUrl,
}) => {
  return (
    <div className='episode-panel'>
      <div className='episode-list'>
        {currentEpisode && (
          <details className='season-list-item' open={true}>
            <summary>Last watched</summary>
            <ul className='episode-list'>
              <EpisodeListItem episode={currentEpisode} buildEpisodeUrl={buildEpisodeUrl} />
            </ul>
          </details>
        )}
        {nextEpisode && (
          <details className='season-list-item' open={true}>
            <summary>Next Episode</summary>
            <ul className='episode-list'>
              <EpisodeListItem episode={nextEpisode} buildEpisodeUrl={buildEpisodeUrl} />
            </ul>
          </details>
        )}
        {episodes.map((season, seasonIndex) => (
          <details key={seasonIndex} className='season-list-item' open={false}>
            <summary>Season {seasonIndex + 1}</summary>
            <ul className='episode-list'>
              {season.map((episode, episodeIndex) => (
                <EpisodeListItem key={episodeIndex} episode={episode} buildEpisodeUrl={buildEpisodeUrl} />
              ))}
            </ul>
          </details>
        ))}
      </div>
    </div>
  );
};
