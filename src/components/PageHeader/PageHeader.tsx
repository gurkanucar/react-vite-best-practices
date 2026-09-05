import { Flex, Typography } from 'antd'
import type { ReactNode } from 'react'

interface PageHeaderProps {
  title: string
  description: string
  extra?: ReactNode
}

export function PageHeader({ title, description, extra }: PageHeaderProps) {
  return (
    <Flex className="page-heading" align="start" justify="space-between" gap={24} wrap>
      <div>
        <Typography.Title level={1}>{title}</Typography.Title>
        <Typography.Paragraph>{description}</Typography.Paragraph>
      </div>
      {extra}
    </Flex>
  )
}
