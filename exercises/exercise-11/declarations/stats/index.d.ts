declare module 'stats' {
  /**
   * 这里要注意使用这个。
   */
  type Comparator<T> = (a: T, b: T) => number
  /**
   * 目前总结的规律是，先看参数中的数据类型。
   * 比如这里的input在实际中的类型是 User[]，那么这里就替换为T。
   */
  function getMaxIndex<T>(input: T[], comparator: Comparator<T>): number
  /**
   * 这里要返回 T1 这个数组中的元素
   */
  function getMaxElement<T>(input: T[], comparator: Comparator<T>): T | null
  /**
   * 这里的类型和 getMaxIndex 一样。
   * 这里不写 export 也可以。
   */
  const getMinIndex: typeof getMaxIndex
  const getMinElement: typeof getMaxElement
  const getMedianIndex: typeof getMaxIndex
  const getMedianElement: typeof getMaxElement
  /**
   *
   * 这里先写参数，再考虑类型。
   *
   * @template T
   * @param {T[]} input
   * @param {(param: T) => number} getValue
   * @returns {number}
   */
  function getAverageValue<T>(
    input: T[],
    getValue: (param: T) => number
  ): number
}
