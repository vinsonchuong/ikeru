/* @flow */
import type { TimeSeries, TimeSeriesPoint } from '../'

export default function<Data>(
  series: TimeSeries<Data>,
  generateBefore: (TimeSeriesPoint<Data>) => TimeSeries<Data>,
  generateAfter: (TimeSeriesPoint<Data>) => TimeSeries<Data>
) {
  return [
    ...generateBefore(series[0]),
    ...series,
    ...generateAfter(series[series.length - 1])
  ]
}
