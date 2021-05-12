import { useMemo } from 'react'
import { tableSettingsActions } from 'store/tableSettings'
import { useDispatchTyped } from './dispatchTyped.hook'
import { useSelectorTyped } from './selectorTyped.hook'

export const useTableSettings = (table: string, columns: string[]) => {
  const dispatch = useDispatchTyped()
  // eslint-disable-next-line react-hooks/exhaustive-deps
  useMemo(() => dispatch(tableSettingsActions.initTable({ table, columns })), [])
  const state = useSelectorTyped(s => s.tableSettings[table])
  const toggle = (column: string) => dispatch(tableSettingsActions.toggleColumnVisibility({ table, column }))
  return [state, toggle]
}
