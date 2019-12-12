/* @flow */

export type TournamentTree<Value> =
  | {|
      parent1: TournamentTree<Value>,
      parent2: TournamentTree<Value>,
      key: number,
      value: ?Value
    |}
  | {| queue: Array<Value>, key: number, value: ?Value |}
