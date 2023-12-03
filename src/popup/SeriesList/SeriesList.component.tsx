import * as React from 'react';

import { Series } from '../../types';

import './SeriesList.css';

type Props = {
  series: Series[];
  selectedSeries: Series | null;
  onSeriesClick: (series: Series) => void;
};

export const SeriesListComponent: React.FC<Props> = ({
  series,
  selectedSeries,
  onSeriesClick,
}) => {
  return (
    <div className='series-panel'>
      <ul className="series-list">
        {series.map((series) => (
          <li
            key={series.url}
            className={`series-list-item ${selectedSeries && selectedSeries.url === series.url ? 'active' : ''}`}
            onClick={() => onSeriesClick(series)}
          >
            {series.title}
          </li>
        ))}
      </ul>
    </div>
  );
};
