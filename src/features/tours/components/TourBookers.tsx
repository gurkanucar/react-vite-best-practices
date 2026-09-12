import { Avatar, Flex, Table, Tag, Typography } from 'antd'
import type { ColumnsType } from 'antd/es/table'
import { initialsOf } from '@/features/profile/types'
import type { Tour, TourBooker } from '@/features/tours/types'
import { useMessages } from '@/i18n/messages'

const statusColors: Record<TourBooker['statusId'], string> = {
  confirmed: 'success',
  pending: 'processing',
  cancelled: 'error',
}

export function TourBookers({ tour }: { tour: Tour }) {
  const messages = useMessages()

  const columns: ColumnsType<TourBooker> = [
    {
      title: messages.tours.booker,
      dataIndex: 'name',
      key: 'name',
      render: (name: string) => (
        <Flex align="center" gap={12}>
          <Avatar>{initialsOf(name)}</Avatar>
          <Typography.Text>{name}</Typography.Text>
        </Flex>
      ),
    },
    { title: messages.tours.bookedAt, dataIndex: 'bookedAt', key: 'bookedAt' },
    { title: messages.tours.guests, dataIndex: 'guests', key: 'guests', align: 'right' },
    {
      title: messages.tours.status,
      dataIndex: 'statusId',
      key: 'status',
      render: (statusId: TourBooker['statusId']) => (
        <Tag color={statusColors[statusId]}>{messages.tours.bookerStatuses[statusId]}</Tag>
      ),
    },
  ]

  return (
    <Table<TourBooker>
      rowKey="id"
      columns={columns}
      dataSource={tour.bookers}
      pagination={false}
      size="middle"
      scroll={{ x: 'max-content' }}
    />
  )
}
