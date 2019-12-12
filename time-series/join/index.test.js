/* @flow */
import test from 'ava'
import { sumBy } from 'lodash'
import { join } from 'ikeru/time-series'

test('combining multiple time series by time', t => {
  const series1 = [
    { time: Date.parse('2019-01-01'), value: 1 },
    { time: Date.parse('2019-01-02'), value: 2 },
    { time: Date.parse('2019-01-03'), value: 3 },
    { time: Date.parse('2019-01-04'), value: 4 }
  ]

  const series2 = [
    { time: Date.parse('2019-01-02'), value: 2 },
    { time: Date.parse('2019-01-03'), value: 3 }
  ]

  t.deepEqual(
    join([series1, series2], (time, points) => ({
      time,
      value: sumBy(points, 'value')
    })),
    [
      { time: Date.parse('2019-01-01'), value: 1 },
      { time: Date.parse('2019-01-02'), value: 4 },
      { time: Date.parse('2019-01-03'), value: 6 },
      { time: Date.parse('2019-01-04'), value: 4 }
    ]
  )
})

test('allowing for an empty set of time series', t => {
  t.deepEqual(
    join([], () => {
      throw new Error('Error')
    }),
    []
  )
})
