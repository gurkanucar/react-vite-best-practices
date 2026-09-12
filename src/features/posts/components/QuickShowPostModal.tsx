import { Alert, Button, Flex, Modal } from 'antd'
import { Link } from 'react-router'
import { LoadingState } from '@/components/LoadingState/LoadingState'
import { PostDetails } from '@/features/posts/components/PostDetails'
import { usePostQuery } from '@/features/posts/hooks'
import { useMessages } from '@/i18n/messages'

interface QuickShowPostModalProps {
  postId: number | null
  onClose: () => void
}

export function QuickShowPostModal({ postId, onClose }: QuickShowPostModalProps) {
  const messages = useMessages()
  const open = postId !== null
  const postQuery = usePostQuery(postId ?? 0, open)

  return (
    <Modal
      destroyOnHidden
      open={open}
      title={messages.posts.quickShowTitle}
      onCancel={onClose}
      footer={
        <Flex gap={8} justify="flex-end">
          {open && (
            <Link to={`/posts/${postId}`}>
              <Button type="primary">{messages.posts.openDetail}</Button>
            </Link>
          )}
          <Button onClick={onClose}>{messages.common.cancel}</Button>
        </Flex>
      }
    >
      {postQuery.isPending && <LoadingState />}

      {postQuery.isError && (
        <Alert
          showIcon
          type="error"
          title={messages.posts.detailLoadError}
          description={postQuery.error.message}
        />
      )}

      {postQuery.isSuccess && <PostDetails post={postQuery.data} />}
    </Modal>
  )
}
