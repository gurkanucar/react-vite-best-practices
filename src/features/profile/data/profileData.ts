import beach from '@/features/profile/assets/post-beach.svg'
import coast from '@/features/profile/assets/post-coast.svg'
import sunset from '@/features/profile/assets/post-sunset.svg'
import type {
  Follower,
  Friend,
  ProfilePerson,
  ProfilePost,
  SocialLink,
} from '@/features/profile/types'

export const profileOwner: ProfilePerson = {
  id: 'owner',
  name: 'Jaydon Frankie',
  roleId: 'cto',
}

export const profileStats = { followers: 1_947, following: 9_124 }

export const profileFacts = {
  email: 'jaydon.frankie@example.com',
  location: 'United Kingdom',
  company: 'Gleichner, Mueller and Tromp',
  school: 'Nikolaus - Leuschke',
}

export const socialLinks: SocialLink[] = [
  { id: 'facebook', url: 'https://www.facebook.com/example' },
  { id: 'instagram', url: 'https://www.instagram.com/example' },
  { id: 'linkedin', url: 'https://www.linkedin.com/in/example' },
  { id: 'twitter', url: 'https://www.twitter.com/example' },
]

export const profilePosts: ProfilePost[] = [
  {
    id: 'post-1',
    bodyId: 'sunset',
    image: sunset,
    postedAt: '2026-09-12',
    likes: 20,
    likedBy: ['Lainey Davidson', 'Cristopher Cardenas', 'Melanie Noble', 'Maya Chen'],
    comments: [
      { id: 'c-1', author: 'Lainey Davidson', bodyId: 'short', postedAt: '2026-09-10' },
      { id: 'c-2', author: 'Cristopher Cardenas', bodyId: 'long', postedAt: '2026-09-09' },
    ],
  },
  {
    id: 'post-2',
    bodyId: 'gift',
    image: coast,
    postedAt: '2026-09-11',
    likes: 20,
    likedBy: ['Cristopher Cardenas', 'Melanie Noble', 'Noah Williams', 'Ava Patel'],
    comments: [
      { id: 'c-3', author: 'Cristopher Cardenas', bodyId: 'short', postedAt: '2026-09-10' },
      { id: 'c-4', author: 'Melanie Noble', bodyId: 'long', postedAt: '2026-09-09' },
    ],
  },
  {
    id: 'post-3',
    bodyId: 'oak',
    image: beach,
    postedAt: '2026-09-10',
    likes: 20,
    likedBy: ['Lainey Davidson', 'Maya Chen', 'Noah Williams'],
    comments: [],
  },
]

export const followers: Follower[] = [
  { id: 'f-1', name: 'Lainey Davidson', location: 'Austin, United States', following: true },
  { id: 'f-2', name: 'Cristopher Cardenas', location: 'Lisbon, Portugal', following: false },
  { id: 'f-3', name: 'Melanie Noble', location: 'Berlin, Germany', following: true },
  { id: 'f-4', name: 'Chase Day', location: 'Toronto, Canada', following: false },
  { id: 'f-5', name: 'Shawn Manning', location: 'Manchester, United Kingdom', following: false },
  { id: 'f-6', name: 'Soren Durham', location: 'Copenhagen, Denmark', following: true },
]

export const friends: Friend[] = [
  { id: 'p-1', name: 'Maya Chen', roleId: 'engineer' },
  { id: 'p-2', name: 'Noah Williams', roleId: 'designer' },
  { id: 'p-3', name: 'Ava Patel', roleId: 'productManager' },
  { id: 'p-4', name: 'Lainey Davidson', roleId: 'engineer' },
  { id: 'p-5', name: 'Melanie Noble', roleId: 'dataAnalyst' },
  { id: 'p-6', name: 'Chase Day', roleId: 'designer' },
]

/** The gallery reuses the post images; a real one would have its own. */
export const gallery = [
  { id: 'g-1', titleId: 'sunset', image: sunset, takenAt: '2026-09-12' },
  { id: 'g-2', titleId: 'coast', image: coast, takenAt: '2026-09-11' },
  { id: 'g-3', titleId: 'beach', image: beach, takenAt: '2026-09-10' },
  { id: 'g-4', titleId: 'sunset', image: sunset, takenAt: '2026-08-28' },
  { id: 'g-5', titleId: 'coast', image: coast, takenAt: '2026-08-21' },
  { id: 'g-6', titleId: 'beach', image: beach, takenAt: '2026-08-14' },
]
