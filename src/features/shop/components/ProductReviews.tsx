import { LikeOutlined } from '@ant-design/icons'
import { Avatar, Button, Divider, Flex, Progress, Rate, Typography } from 'antd'
import type { Product } from '@/features/shop/types'
import { initialsOf } from '@/features/profile/types'
import { useMessages } from '@/i18n/messages'

export function ProductReviews({ product }: { product: Product }) {
  const messages = useMessages()
  /** A plausible distribution for the summary bars; a real one would come with the reviews. */
  const distribution = [62, 24, 9, 3, 2]

  return (
    <Flex vertical gap={16}>
      <Flex gap={32} wrap align="center">
        <Flex vertical align="center">
          <Typography.Title level={2} className="product-review-score">
            {product.rating.toFixed(1)}
          </Typography.Title>
          <Rate disabled value={product.rating} />
          <Typography.Text type="secondary">
            {messages.shop.reviewCount.replace('{count}', String(product.reviews.length))}
          </Typography.Text>
        </Flex>

        <Flex vertical gap={4} className="product-review-bars">
          {distribution.map((percent, index) => (
            <Flex key={percent} align="center" gap={8}>
              <Typography.Text type="secondary">{5 - index}</Typography.Text>
              <Progress percent={percent} showInfo={false} size="small" />
              <Typography.Text type="secondary">{percent}%</Typography.Text>
            </Flex>
          ))}
        </Flex>
      </Flex>

      <Divider className="product-divider" />

      {product.reviews.map((review) => (
        <Flex key={review.id} gap={12} align="start">
          <Avatar>{initialsOf(review.author)}</Avatar>

          <Flex vertical gap={4} className="product-review-body">
            <Flex justify="space-between" gap={8} wrap>
              <Typography.Text strong>{review.author}</Typography.Text>
              <Typography.Text type="secondary">{review.postedAt}</Typography.Text>
            </Flex>
            <Rate disabled value={review.rating} />
            <Typography.Text type="secondary">
              {messages.shop.reviewBodies[review.bodyId as keyof typeof messages.shop.reviewBodies]}
            </Typography.Text>
            <div>
              <Button type="text" size="small" icon={<LikeOutlined aria-hidden="true" />}>
                {messages.shop.helpful.replace('{count}', String(review.helpful))}
              </Button>
            </div>
          </Flex>
        </Flex>
      ))}
    </Flex>
  )
}
