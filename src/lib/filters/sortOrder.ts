import type { SortOrder } from 'antd/es/table/interface'

/**
 * Both tables sort on the server and read the active column back out of the URL, so the
 * arrow in the header cannot disagree with the request that was sent. The mapping from
 * the URL's `asc`/`desc` to Ant Design's `ascend`/`descend` lives here rather than being
 * written out once per table.
 */
export function sortOrderFor(
  field: string,
  sortBy: string | undefined,
  order: 'asc' | 'desc' | undefined,
): SortOrder {
  if (sortBy !== field) return null

  return order === 'desc' ? 'descend' : 'ascend'
}
