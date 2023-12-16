import { MediaType, MessageType, Series } from '../types';
import { BaseWatcher } from './utils';

export class SeriesWatcher extends BaseWatcher {
  static openEpisode = (url: string) => {
    const season = new URL(url).searchParams.get('season');
    const episode = new URL(url).searchParams.get('episode');
    if (!season || !episode) return;
    const seasonElement = document.querySelector(`.tv-details-seasons li[data-season="${season}"]`);
    if (!seasonElement) return;
    (seasonElement as HTMLLIElement).click();
    const episodeElement = document.querySelector(`.tv-details-episodes li[data-episode="${episode}"]`);
    if (!episodeElement) return;
    (episodeElement as HTMLLIElement).click();
    const videoElement = document.querySelector('video.jw-video');
    if (!videoElement) return;
    videoElement.scrollIntoView();
  };

  private currentSeason: number = 0;
  private currentEpisode: number = 0;
  private currentTime: number = 0;
  private duration: number = 0;

  private series: Series = {
    type: MediaType.Series,
    title: '',
    url: '',
    lastWatched: [0, 0],
    episodes: [],
  };

  public start = async () => {
    const seriesInCache = await this.getFromCache(MediaType.Series, this.slug);
    const parsedSeries = this.parseSeries(this.url);
    const mergedSeries = seriesInCache ? this.mergeSeries(seriesInCache, parsedSeries) : parsedSeries;
    this.series = mergedSeries;

    if (seriesInCache) {
      await this.setToCache(MediaType.Series, this.slug, this.series);
    }

    const observer = new MutationObserver((mutations) => {
      mutations.forEach((mutation) => {
        switch (mutation.type) {
          case 'childList': {
            if (mutation.addedNodes.length > 0) {
              mutation.addedNodes.forEach((node) => {
                if (node instanceof HTMLVideoElement) {
                  // this.initEpisode();
                }
              });
            }
            break;
          }
          case 'attributes': {
            if (mutation.target instanceof HTMLVideoElement && mutation.attributeName === 'src') {
              this.initEpisode();
            }
            break;
          }
          default:
            break;
        }
      });
    });

    const getVideoContainer = (): HTMLDivElement | null => {
      return document.getElementById('video') as HTMLDivElement;
    };
    const videoContainer = getVideoContainer();
    if (videoContainer) {
      observer.observe(videoContainer, {
        childList: true,
        attributes: true,
        subtree: true,
      });
    }

    window.addEventListener('beforeunload', () => {
      chrome.runtime.sendMessage({
        type: MessageType.PersistSeries, 
        payload: {
          series: this.series,
          currentSeason: this.currentSeason,
          currentEpisode: this.currentEpisode,
          currentTime: this.currentTime,
          duration: this.duration,
        },
      });
    });
  };

  private initEpisode = async () => {
    const newSeason = this.getCurrentSeason();
    const newEpisode = this.getCurrentEpisode();

    if (newSeason !== this.currentSeason || newEpisode !== this.currentEpisode) {
      await this.persistProgress();
      this.currentSeason = newSeason;
      this.currentEpisode = newEpisode;
    }

    const videoElement = this.getVideoElement();
    if (!videoElement) return;
    this.currentTime = videoElement.currentTime;
    this.duration = videoElement.duration;
    videoElement.addEventListener('timeupdate', this.handleTimeUpdate);
    videoElement.addEventListener('durationchange', this.handleDurationChange);
    videoElement.addEventListener('pause', this.persistProgress);
  };

  private persistProgress = async () => {
    chrome.runtime.sendMessage({
      type: MessageType.PersistSeries, 
      payload: {
        series: this.series,
        currentSeason: this.currentSeason,
        currentEpisode: this.currentEpisode,
        currentTime: this.currentTime,
        duration: this.duration,
      },
    });
    // if (this.currentTime < 10) return;
    // const newProgress = {
    //   current: this.currentTime,
    //   total: this.duration,
    // };
    // this.series.episodes[this.currentSeason - 1][this.currentEpisode - 1].progress = newProgress;
    // this.series.lastWatched = [this.currentSeason, this.currentEpisode];
    // await this.setToCache(MediaType.Series, this.slug, this.series);
  };

  private handleTimeUpdate = (event: Event) => {
    this.currentTime = (event.target as HTMLVideoElement).currentTime;
  };

  private handleDurationChange = (event: Event) => {
    this.duration = (event.target as HTMLVideoElement).duration;
  }

  private getCurrentEpisode = (): number => {
    const episode = document.querySelector('.tv-details-episodes li.active')?.getAttribute('data-episode');
    if (!episode) throw new Error('Could not find current episode');
    return Number(episode);
  };

  private getCurrentSeason = (): number => {
    const season = document.querySelector('.tv-details-seasons li.active')?.getAttribute('data-season');
    if (!season) throw new Error('Could not find current season');
    return Number(season);
  };

  private parseSeries = (url: string): Series => {
    const seasons = [...document.querySelectorAll('.tv-details-seasons li')]
      .map((li) => li.getAttribute('data-season'))
      .filter((s): s is string => s !== null && Number(s) > 0)
      .map(s => Number(s))
      .sort((a, b) => a - b);
  
    const episodes = seasons.map((season) => {
      return [...document.querySelectorAll(`.tv-details-episodes ol[id="season${season}"] li`)]
        .map((li) => {
          const episode = li.getAttribute('data-episode') ?? '';
          const title = li.textContent ?? 'Unknown';
          return {
            title,
            season: Number(season),
            episode: Number(episode),
            progress: {
              current: 0,
              total: 0,
              finished: false,
            },
          };
        })
        .filter((s) => s.episode > 0)
        .sort((a, b) => a.episode - b.episode);
    });
  
    const title = document.querySelector('.movie-info h1')?.textContent ?? 'Unknown';
  
    return {
      type: MediaType.Series,
      title,
      url,
      lastWatched: [0, 0],
      episodes,
    };
  };
  
  private mergeSeries = (seriesInCache: Series, parsedSeries: Series): Series => {
    const mergedEpisodes = parsedSeries.episodes.map((season, seasonIndex) => {
      return season.map((episode, episodeIndex) => {
        const episodeInCache = seriesInCache.episodes[seasonIndex]?.[episodeIndex];
        if (!episodeInCache) return episode;
        return {
          ...episode,
          progress: episodeInCache.progress,
        };
      });
    });
  
    return {
      ...parsedSeries,
      lastWatched: seriesInCache.lastWatched,
      episodes: mergedEpisodes,
    };
  };
}