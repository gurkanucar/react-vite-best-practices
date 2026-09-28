import { App } from 'antd'
import type { Listing } from '@/features/showcases/data/estate'
import { useEstateStore } from '@/features/showcases/hooks/useEstateStore'
import { useEstateText } from '@/features/showcases/hooks/useEstateText'

/** Saving and comparing, with the short confirmation each one gives. */
export function useEstateActions() {
  const { text } = useEstateText()
  const { message } = App.useApp()
  const favourites = useEstateStore((state) => state.favourites)
  const compare = useEstateStore((state) => state.compare)
  const toggleFavouriteInStore = useEstateStore((state) => state.toggleFavourite)
  const toggleCompareInStore = useEstateStore((state) => state.toggleCompare)

  return {
    favourites,
    compare,
    isSaved: (listing: Listing) => favourites.includes(listing.id),
    isCompared: (listing: Listing) => compare.includes(listing.id),
    toggleFavourite: (listing: Listing) => {
      const saved = toggleFavouriteInStore(listing.id)
      void message.success({
        key: 'estate-save',
        content: saved ? text.compareTray.saved : text.compareTray.unsaved,
      })
    },
    toggleCompare: (listing: Listing) => {
      const result = toggleCompareInStore(listing.id)
      if (result === 'full')
        void message.warning({ key: 'estate-compare', content: text.compareTray.full })
      else
        void message.info({
          key: 'estate-compare',
          content: result === 'added' ? text.compareTray.added : text.compareTray.removed,
        })
    },
  }
}
