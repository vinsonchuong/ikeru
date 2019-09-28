/* @flow */
import test from 'ava'
import { interpolate } from 'ikeru/time-series'
import { differenceInDays, addDays } from 'date-fns'

process.env.TZ = 'utc'

test('filling in gaps in a time series', t => {
  const series = [
    { time: Date.parse('2019-01-01') },
    { time: Date.parse('2019-01-03') },
    { time: Date.parse('2019-01-04') },
    { time: Date.parse('2019-01-06') },
    { time: Date.parse('2019-01-09') }
  ]

  t.deepEqual(
    interpolate(series, (before, after) => {
      const newPoints = []
      let point = before
      while (differenceInDays(new Date(after.time), point.time) > 1) {
        point = {
          time: addDays(new Date(point.time), 1).getTime()
        }
        newPoints.push(point)
      }
      return newPoints
    }),
    [
      { time: Date.parse('2019-01-01') },
      { time: Date.parse('2019-01-02') },
      { time: Date.parse('2019-01-03') },
      { time: Date.parse('2019-01-04') },
      { time: Date.parse('2019-01-05') },
      { time: Date.parse('2019-01-06') },
      { time: Date.parse('2019-01-07') },
      { time: Date.parse('2019-01-08') },
      { time: Date.parse('2019-01-09') }
    ]
  )
})

test('not breaking on an empty or single point time series', t => {
  t.deepEqual(interpolate([], () => []), [])

  t.deepEqual(interpolate([{ time: Date.parse('2019-01-01') }], () => []), [
    { time: Date.parse('2019-01-01') }
  ])
})
