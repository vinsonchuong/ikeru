/* @flow */
import type { TimeSeries, TimeSeriesPoint } from 'ikeru/time-series'

export default function<Data>(
  timeSeriesList: Array<TimeSeries<Data>>,
  combine: (number, Array<TimeSeriesPoint<Data>>) => TimeSeriesPoint<Data>
): TimeSeries<Data> {
  return timeSeriesList[0].map(({ time }, i) =>
    combine(time.valueOf(), timeSeriesList.map(timeSeries => timeSeries[i]))
  )
}
