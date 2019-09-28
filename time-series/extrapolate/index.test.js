/* @flow */
import test from 'ava'
import { addDays, subDays } from 'date-fns'
import { extrapolate } from 'ikeru/time-series'

process.env.TZ = 'utc'

test('adding to the ends of a time series', t => {
  const series = [
    { time: Date.parse('2019-01-15') },
    { time: Date.parse('2019-01-16') }
  ]

  t.deepEqual(
    extrapolate(
      series,
      start => [{ time: subDays(new Date(start.time), 1).getTime() }],
      end => [{ time: addDays(new Date(end.time), 1).getTime() }]
    ),
    [
      { time: Date.parse('2019-01-14') },
      { time: Date.parse('2019-01-15') },
      { time: Date.parse('2019-01-16') },
      { time: Date.parse('2019-01-17') }
    ]
  )
})
