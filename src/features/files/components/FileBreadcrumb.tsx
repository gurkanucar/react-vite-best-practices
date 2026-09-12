import { HomeOutlined } from '@ant-design/icons'
import { Breadcrumb, Button } from 'antd'
import { ancestorPaths, pathName, ROOT_PATH } from '@/features/files/types'
import { useMessages } from '@/i18n/messages'

interface FileBreadcrumbProps {
  path: string
  onNavigate: (path: string) => void
}

/**
 * A crumb navigates without changing the document location itself, so it is a button.
 * An anchor without an `href` is not reachable by keyboard, which is the whole point of
 * a breadcrumb for anyone not using a mouse.
 */
function Crumb({
  label,
  icon,
  onClick,
}: {
  label: string
  icon?: React.ReactNode
  onClick: () => void
}) {
  return (
    <Button type="link" size="small" icon={icon} onClick={onClick} style={{ padding: 0 }}>
      {label}
    </Button>
  )
}

export function FileBreadcrumb({ path, onNavigate }: FileBreadcrumbProps) {
  const messages = useMessages()
  const trail = ancestorPaths(path)

  return (
    <Breadcrumb
      items={[
        {
          title: (
            <Crumb
              label={messages.files.allFiles}
              icon={<HomeOutlined aria-hidden="true" />}
              onClick={() => onNavigate(ROOT_PATH)}
            />
          ),
        },
        ...trail.map((segment, index) => ({
          // The folder the reader is already in is text, not a link back to itself.
          title:
            index === trail.length - 1 ? (
              pathName(segment)
            ) : (
              <Crumb label={pathName(segment)} onClick={() => onNavigate(segment)} />
            ),
        })),
      ]}
    />
  )
}
