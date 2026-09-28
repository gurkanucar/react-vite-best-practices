import { CloseOutlined, SwapOutlined } from '@ant-design/icons'
import { Button, Typography } from 'antd'
import { useNavigate } from 'react-router'
import {
  estateComparePath,
  estatePhotoUrl,
  findListing,
  type Listing,
} from '@/features/showcases/data/estate'
import { useEstateStore } from '@/features/showcases/hooks/useEstateStore'
import { useEstateText } from '@/features/showcases/hooks/useEstateText'

/** The homes picked for comparison, kept in view at the bottom of the results. */
export function EstateCompareTray({ standalone }: { standalone: boolean }) {
  const { text, titleOf } = useEstateText()
  const ids = useEstateStore((state) => state.compare)
  const remove = useEstateStore((state) => state.removeCompare)
  const clear = useEstateStore((state) => state.clearCompare)
  const navigate = useNavigate()
  const picked = ids.map(findListing).filter((listing): listing is Listing => Boolean(listing))
  if (picked.length === 0) return null

  return (
    <section className="estate-compare-tray" aria-label={text.compareTray.open}>
      <ul className="estate-compare-tray__items">
        {picked.map((listing) => (
          <li key={listing.id}>
            <img src={estatePhotoUrl(listing.photos[0]!.id, 160)} alt="" />
            <Button
              size="small"
              shape="circle"
              className="estate-compare-tray__remove"
              icon={<CloseOutlined />}
              aria-label={text.compareTray.remove(titleOf(listing))}
              onClick={() => remove(listing.id)}
            />
          </li>
        ))}
      </ul>
      <Typography.Text strong className="estate-compare-tray__title">
        {text.compareTray.title(picked.length)}
      </Typography.Text>
      <div className="estate-compare-tray__actions">
        <Button type="text" onClick={clear}>
          {text.compareTray.clear}
        </Button>
        <Button
          type="primary"
          icon={<SwapOutlined aria-hidden="true" />}
          disabled={picked.length < 2}
          onClick={() => void navigate(estateComparePath(standalone, ids))}
        >
          {text.compareTray.open} ({picked.length})
        </Button>
      </div>
    </section>
  )
}
