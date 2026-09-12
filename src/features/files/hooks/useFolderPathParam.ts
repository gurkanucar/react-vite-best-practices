import { useSearchParams } from 'react-router'
import { ROOT_PATH } from '@/features/files/types'

/**
 * The open folder lives in the address bar, so a folder can be linked and the browser's
 * back button walks the navigation history the reader expects.
 */
export function useFolderPathParam() {
  const [searchParams, setSearchParams] = useSearchParams()
  const path = searchParams.get('path') ?? ROOT_PATH

  const openFolder = (nextPath: string) => {
    setSearchParams((current) => {
      const next = new URLSearchParams(current)

      if (nextPath === ROOT_PATH) {
        next.delete('path')
      } else {
        next.set('path', nextPath)
      }

      return next
    })
  }

  return { path, openFolder }
}
