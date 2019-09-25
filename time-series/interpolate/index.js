/* @flow */
import type { TimeSeries, TimeSeriesPoint } from '../'

export default function<Data>(
  timeSeries: TimeSeries<Data>,
  generate: (TimeSeriesPoint<Data>, TimeSeriesPoint<Data>) => TimeSeries<Data>
): TimeSeries<Data> {
  if (timeSeries.length < 2) {
    return timeSeries
  }

  const interpolated = []
  let index = 0
  while (index < timeSeries.length - 1) {
    const before = timeSeries[index]
    const after = timeSeries[index + 1]
    interpolated.push(before, ...generate(before, after))
    index++
  }
  interpolated.push(timeSeries[timeSeries.length - 1])
  return interpolated
}
