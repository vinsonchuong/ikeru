/* @flow */
import test from 'ava'
import { join } from 'ikeru/time-series'

test('combining multiple time series by time', t => {
  const series1 = [
    { time: Date.parse('2019-01-01'), value: 1 },
    { time: Date.parse('2019-01-02'), value: 2 },
    { time: Date.parse('2019-01-03'), value: 3 }
  ]

  const series2 = [
    { time: Date.parse('2019-01-01'), value: 4 },
    { time: Date.parse('2019-01-02'), value: 5 },
    { time: Date.parse('2019-01-03'), value: 6 }
  ]

  t.deepEqual(
    join([series1, series2], (time, [p1, p2]) => ({
      time,
      value: p1.value + p2.value
    })),
    [
      { time: Date.parse('2019-01-01'), value: 5 },
      { time: Date.parse('2019-01-02'), value: 7 },
      { time: Date.parse('2019-01-03'), value: 9 }
    ]
  )
})
