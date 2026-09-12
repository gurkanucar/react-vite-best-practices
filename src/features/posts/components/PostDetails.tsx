import { Descriptions, Typography } from 'antd'
import type { PostDto } from '@/features/posts/types'
import { useMessages } from '@/i18n/messages'

interface PostDetailsProps {
  post: PostDto
}

export function PostDetails({ post }: PostDetailsProps) {
  const messages = useMessages()

  return (
    <Descriptions column={1} bordered size="small">
      <Descriptions.Item label={messages.posts.id}>{post.id}</Descriptions.Item>
      <Descriptions.Item label={messages.posts.user}>{post.userId}</Descriptions.Item>
      <Descriptions.Item label={messages.posts.titleColumn}>{post.title}</Descriptions.Item>
      <Descriptions.Item label={messages.posts.body}>
        <Typography.Paragraph style={{ marginBottom: 0, whiteSpace: 'pre-wrap' }}>
          {post.body}
        </Typography.Paragraph>
      </Descriptions.Item>
    </Descriptions>
  )
}
