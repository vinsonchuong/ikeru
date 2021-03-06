/* @flow */
import test from 'ava'
import { startOfMonth } from 'date-fns'
import { downsample } from 'ikeru/time-series'

process.env.TZ = 'UTC'

test('downsampling a time series', t => {
  const series = [
    { time: Date.parse('2019-01-01'), value: +1 },
    { time: Date.parse('2019-01-02'), value: -2 },
    { time: Date.parse('2019-01-03'), value: +4 },

    { time: Date.parse('2019-02-01'), value: +3 },
    { time: Date.parse('2019-02-02'), value: -1 },
    { time: Date.parse('2019-02-03'), value: +2 },

    { time: Date.parse('2019-03-01'), value: +2 },
    { time: Date.parse('2019-03-02'), value: -9 },
    { time: Date.parse('2019-03-03'), value: +5 }
  ]

  t.deepEqual(
    downsample(
      series,
      point => startOfMonth(point.time).getTime(),
      (time, points) => ({
        time,
        value: points.reduce((total, point) => total + point.value, 0)
      })
    ),
    [
      { time: Date.parse('2019-01-01'), value: +3 },
      { time: Date.parse('2019-02-01'), value: +4 },
      { time: Date.parse('2019-03-01'), value: -2 }
    ]
  )
})
