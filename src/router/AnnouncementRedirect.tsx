import { Navigate, useParams } from 'react-router'

/** Announcements used to live under the corporate site; old links land on the tech park's copy. */
export function AnnouncementRedirect({ root }: { root: '/showcases' | '/preview' }) {
  const { slug } = useParams<{ slug: string }>()
  return <Navigate replace to={`${root}/technopark/announcements${slug ? `/${slug}` : ''}`} />
}
