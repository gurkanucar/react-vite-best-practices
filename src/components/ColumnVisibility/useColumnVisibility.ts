import type { ColumnsType } from 'antd/es/table'
import { usePreferencesStore } from '@/store/preferences-store'

export interface ColumnOption {
  key: string
  label: string
}

/**
 * Which columns a reader wants to see is a personal preference rather than shareable list
 * state, so it lives in the persisted store instead of the URL. A table with no stored
 * entry falls back to the defaults its page passes in.
 */
export function useColumnVisibility<T>(tableKey: string, defaultHiddenKeys: string[] = []) {
  const storedHiddenKeys = usePreferencesStore((state) => state.hiddenColumns[tableKey])
  const setHiddenColumns = usePreferencesStore((state) => state.setHiddenColumns)
  const hiddenKeys = storedHiddenKeys ?? defaultHiddenKeys

  return {
    hiddenKeys,
    toggleColumn: (columnKey: string, visible: boolean) =>
      setHiddenColumns(
        tableKey,
        visible ? hiddenKeys.filter((key) => key !== columnKey) : [...hiddenKeys, columnKey],
      ),
    resetColumns: () => setHiddenColumns(tableKey, defaultHiddenKeys),
    visibleColumns: (columns: ColumnsType<T>) =>
      columns.filter((column) => !hiddenKeys.includes(String(column.key))),
  }
}
