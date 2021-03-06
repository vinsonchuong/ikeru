/* @flow */
import type { TimeSeries, TimeSeriesPoint } from '../'

export default function<Data>(
  timeSeries: TimeSeries<Data>,
  group: (TimeSeriesPoint<Data>) => number,
  transform: (number, TimeSeries<Data>) => TimeSeriesPoint<Data>
): TimeSeries<Data> {
  const groups = []
  let currentGroup
  for (const point of timeSeries) {
    if (!currentGroup || group(point) !== currentGroup.time) {
      currentGroup = { time: group(point), points: [point] }
      groups.push(currentGroup)
    } else {
      currentGroup.points.push(point)
    }
  }

  return groups.map(({ time, points }) => transform(time, points))
}
