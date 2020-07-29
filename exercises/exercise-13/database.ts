export class Database<T> {
  protected filename: string
  protected fullTextSearchFieldNames: unknown[]

  constructor(filename: string, fullTextSearchFieldNames: string[]) {
    this.filename = filename
    this.fullTextSearchFieldNames = fullTextSearchFieldNames
  }

  /**
   * 这里不懂怎么搞了。
   */
  async find(query): Promise<T[]> {
    return []
  }
}
