import {
  HeartFilled,
  HeartOutlined,
  MessageOutlined,
  MoreOutlined,
  PictureOutlined,
  ShareAltOutlined,
  SmileOutlined,
} from '@ant-design/icons'
import { Avatar, Button, Card, Dropdown, Flex, Image, Input, Tooltip, Typography } from 'antd'
import { useState } from 'react'
import { profileOwner } from '@/features/profile/data'
import { initialsOf, type ProfilePost } from '@/features/profile/types'
import { useMessages } from '@/i18n/messages'

interface PostCardProps {
  post: ProfilePost
}

export function PostCard({ post }: PostCardProps) {
  const messages = useMessages()
  const [liked, setLiked] = useState(false)
  const likeCount = post.likes + (liked ? 1 : 0)

  return (
    <Card
      title={
        <Flex align="center" gap={12}>
          <Avatar>{initialsOf(profileOwner.name)}</Avatar>
          <div>
            <Typography.Text strong>{profileOwner.name}</Typography.Text>
            <br />
            <Typography.Text type="secondary" className="post-card__meta">
              {post.postedAt}
            </Typography.Text>
          </div>
        </Flex>
      }
      extra={
        <Dropdown
          trigger={['click']}
          menu={{
            items: [
              { key: 'save', label: messages.profile.savePost },
              { key: 'copy', label: messages.profile.copyLink },
              { type: 'divider' },
              { key: 'report', label: messages.profile.reportPost, danger: true },
            ],
          }}
        >
          <Button
            type="text"
            aria-label={messages.profile.postActions}
            icon={<MoreOutlined aria-hidden="true" />}
          />
        </Dropdown>
      }
    >
      <Typography.Paragraph>
        {messages.profile.posts[post.bodyId as keyof typeof messages.profile.posts]}
      </Typography.Paragraph>

      <Image src={post.image} alt="" className="post-card__image" />

      <Flex justify="space-between" align="center" gap={8} wrap className="post-card__actions">
        <Flex align="center" gap={8}>
          <Button
            type="text"
            aria-pressed={liked}
            onClick={() => setLiked((current) => !current)}
            icon={
              liked ? (
                <HeartFilled aria-hidden="true" style={{ color: 'var(--ant-color-error)' }} />
              ) : (
                <HeartOutlined aria-hidden="true" />
              )
            }
          >
            {likeCount}
          </Button>
          <Avatar.Group max={{ count: 3 }} size="small">
            {post.likedBy.map((name) => (
              <Tooltip key={name} title={name}>
                <Avatar size="small">{initialsOf(name)}</Avatar>
              </Tooltip>
            ))}
          </Avatar.Group>
        </Flex>

        <Flex gap={4}>
          <Button
            type="text"
            aria-label={messages.profile.comment}
            icon={<MessageOutlined aria-hidden="true" />}
          />
          <Button
            type="text"
            aria-label={messages.profile.share}
            icon={<ShareAltOutlined aria-hidden="true" />}
          />
        </Flex>
      </Flex>

      {post.comments.length > 0 && (
        /*
         * A plain stack rather than `Listy`: its item wrapper adds its own padding and a
         * hover surface, which around a tinted comment block reads as a second box with a
         * gap between the two. Comments here are a handful, not a virtualised list.
         */
        <Flex vertical gap={8} className="post-card__comments">
          {post.comments.map((comment) => (
            <Flex key={comment.id} gap={12} align="start" className="post-card__comment">
              <Avatar>{initialsOf(comment.author)}</Avatar>

              <div className="post-card__comment-body">
                <Flex justify="space-between" align="center" gap={8}>
                  <Typography.Text strong>{comment.author}</Typography.Text>

                  <Flex align="center" gap={8}>
                    <Typography.Text type="secondary" className="post-card__meta">
                      {comment.postedAt}
                    </Typography.Text>
                    <Dropdown
                      trigger={['click']}
                      menu={{
                        items: [
                          { key: 'reply', label: messages.profile.replyToComment },
                          { key: 'copy', label: messages.profile.copyComment },
                          { type: 'divider' },
                          {
                            key: 'report',
                            label: messages.profile.reportComment,
                            danger: true,
                          },
                        ],
                      }}
                    >
                      <Button
                        type="text"
                        size="small"
                        aria-label={`${messages.profile.commentActions}: ${comment.author}`}
                        icon={<MoreOutlined aria-hidden="true" />}
                      />
                    </Dropdown>
                  </Flex>
                </Flex>

                <Typography.Text type="secondary">
                  {
                    messages.profile.comments[
                      comment.bodyId as keyof typeof messages.profile.comments
                    ]
                  }
                </Typography.Text>
              </div>
            </Flex>
          ))}
        </Flex>
      )}

      <Flex gap={8} align="center" className="post-card__reply">
        <Avatar>{initialsOf(profileOwner.name)}</Avatar>
        <Input
          placeholder={messages.profile.commentPlaceholder}
          suffix={
            <Flex gap={4}>
              <PictureOutlined aria-hidden="true" />
              <SmileOutlined aria-hidden="true" />
            </Flex>
          }
        />
      </Flex>
    </Card>
  )
}
