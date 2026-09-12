import { Flex, Typography } from 'antd'
import type { ReactNode } from 'react'

interface PageHeaderProps {
  title: string
  /** Optional: screens where the title carries enough leave it off to save the space. */
  description?: string
  extra?: ReactNode
}

export function PageHeader({ title, description, extra }: PageHeaderProps) {
  return (
    <Flex className="page-heading" align="start" justify="space-between" gap={24} wrap>
      <div>
        <Typography.Title level={1}>{title}</Typography.Title>
        {description && <Typography.Paragraph>{description}</Typography.Paragraph>}
      </div>
      {extra}
    </Flex>
  )
}
