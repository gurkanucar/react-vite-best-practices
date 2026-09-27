import { Avatar, Flex, Tooltip, Typography } from 'antd'
import { agents } from '@/features/helpdesk/data'
import { useHelpdeskText } from '@/features/helpdesk/hooks'
import { initials, type Contact } from '@/features/helpdesk/types'

export function AgentAvatar({ agentId, withName }: { agentId?: string; withName?: boolean }) {
  const { text } = useHelpdeskText()
  const agent = agents.find((candidate) => candidate.id === agentId)

  if (!agent) {
    return (
      <Typography.Text type="secondary" className="helpdesk-unassigned">
        {text.unassigned}
      </Typography.Text>
    )
  }

  const avatar = (
    <Avatar size="small" style={{ backgroundColor: agent.color }} aria-hidden={withName}>
      {initials(agent.name)}
    </Avatar>
  )

  return withName ? (
    <Flex align="center" gap={8}>
      {avatar}
      <Typography.Text>{agent.name}</Typography.Text>
    </Flex>
  ) : (
    <Tooltip title={agent.name}>
      <span aria-label={agent.name}>{avatar}</span>
    </Tooltip>
  )
}

export function RequesterCell({ contact }: { contact?: Contact }) {
  if (!contact) return null

  return (
    <Flex align="center" gap={10} className="helpdesk-requester">
      <Avatar size={32} className="helpdesk-requester__avatar">
        {initials(contact.name)}
      </Avatar>
      <div className="helpdesk-requester__text">
        <Typography.Text>{contact.name}</Typography.Text>
        <Typography.Text type="secondary">{contact.company}</Typography.Text>
      </div>
    </Flex>
  )
}
