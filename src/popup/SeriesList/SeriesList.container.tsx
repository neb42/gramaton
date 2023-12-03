import * as React from 'react';

import { SeriesListComponent } from './SeriesList.component';
import { useSelectMedia, useSelectedMedia, useSeries } from '../state';

type Props = {
};

export const SeriesListContainer: React.FC<Props> = ({}) => {
  const series = useSeries();
  const selectMedia = useSelectMedia();
  const selectedMedia = useSelectedMedia();

  if (selectedMedia && selectedMedia.type !== 'series') 
    throw new Error('Selected media is not a series');

  return (
    <SeriesListComponent
      series={series}
      selectedSeries={selectedMedia}
      onSeriesClick={selectMedia}
    />
  );
};