import * as React from 'react';
import { Episode, MessageType } from '../../types';

import './EpisodeList.css';


type Props = {
  episodes: Episode[][];
  nextEpisode: Episode | null;
  currentEpisode: Episode | null;
  buildEpisodeUrl: (episode: Episode) => string;
  markEpisodeWatched: (episode: Episode) => void;
  markEpisodeUnwatched: (episode: Episode) => void;
  removeSeries: () => void;
};

type EpisodeListItemProps = {
  episode: Episode;
} & Pick<Props, 'buildEpisodeUrl' | 'markEpisodeWatched' | 'markEpisodeUnwatched'>;

const EpisodeListItem = ({
  episode,
  buildEpisodeUrl,
  markEpisodeWatched,
  markEpisodeUnwatched,
}: EpisodeListItemProps) => {
  const Progress = () => {
    if (episode.progress.finished) {
      return (
        <span className='episode-progress-100'>Watched</span>
      );
    }

    if (episode.progress.current === 0) {
      return (
        <span className='episode-progress-0'>Not watched</span>
      );
    }

    if (episode.progress.current > 0) {
      return (
        <progress className='episode-progress' value={episode.progress.current} max={episode.progress.total} />
      );
    }

    return null;
  };

  const handleMarkEpisodeWatched = (e: React.MouseEvent<HTMLButtonElement, MouseEvent>) => {
    e.preventDefault();
    e.stopPropagation();
    markEpisodeWatched(episode);
  };

  const handleMarkEpisodeUnwatched = (e: React.MouseEvent<HTMLButtonElement, MouseEvent>) => {
    e.preventDefault();
    e.stopPropagation();
    markEpisodeUnwatched(episode);
  };

  return (
    <a href={buildEpisodeUrl(episode)} target='_blank' rel='noopener noreferrer'>
      <li className='episode-list-item'>
          <span>{episode.season}.{episode.episode}. {episode.title}</span>
          <Progress />
        <div className="episode-list-item-actions">
          <button onClick={handleMarkEpisodeWatched}>Watched</button>
          <button onClick={handleMarkEpisodeUnwatched}>Unwatched</button>
        </div>
      </li>
    </a>
  );
};

export const EpisodeListComponent: React.FC<Props> = ({
  episodes,
  nextEpisode,
  currentEpisode,
  buildEpisodeUrl,
  markEpisodeWatched,
  markEpisodeUnwatched,
  removeSeries,
}) => {
  const commonListItemProps = { buildEpisodeUrl, markEpisodeWatched, markEpisodeUnwatched };
  return (
    <div className='episode-panel'>
      <div className='episode-list'>
        {currentEpisode && (
          <details className='season-list-item' open={true}>
            <summary>Last watched</summary>
            <ul className='episode-list'>
              <EpisodeListItem episode={currentEpisode} {...commonListItemProps} />
            </ul>
          </details>
        )}
        {nextEpisode && (
          <details className='season-list-item' open={true}>
            <summary>Next Episode</summary>
            <ul className='episode-list'>
              <EpisodeListItem episode={nextEpisode} {...commonListItemProps} />
            </ul>
          </details>
        )}
        {!nextEpisode && (
          <details className='season-list-item' open={true}>
            <summary>Next Episode</summary>
            <ul className='episode-list'>
              <li className='episode-list-item-buttons'>
                <a
                  href={buildEpisodeUrl({
                    ...episodes[episodes.length - 1][episodes[episodes.length - 1].length - 1],
                    episode: episodes[episodes.length - 1][episodes[episodes.length - 1].length - 1].episode + 1,
                  })}
                  target='_blank'
                  rel='noopener noreferrer'
                >
                  Check next episode
                </a>
                <a
                  href={buildEpisodeUrl({
                    ...episodes[episodes.length - 1][episodes[episodes.length - 1].length - 1],
                    episode: 1,
                    season: episodes[episodes.length - 1][episodes[episodes.length - 1].length - 1].season + 1,
                  })}
                  target='_blank'
                  rel='noopener noreferrer'
                >
                  Check next season
                </a>
              </li>
            </ul>
          </details>
        )}
        {episodes.map((season, seasonIndex) => (
          <details className='season-list-item' open={false}>
            <summary>Season {seasonIndex + 1}</summary>
            <ul className='episode-list'>
              {season.map((episode, episodeIndex) => (
                <EpisodeListItem key={episodeIndex} episode={episode} {...commonListItemProps} />
              ))}
            </ul>
          </details>
        ))}
        <button className="remove-series" onClick={removeSeries}>Remove series</button>
      </div>
    </div>
  );
};
