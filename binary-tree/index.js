/* @flow */

export type BinaryTree<Node: {}> = {
  ...$Exact<Node>,
  left: ?BinaryTree<Node>,
  right: ?BinaryTree<Node>
}
