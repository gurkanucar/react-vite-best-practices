export interface ProfilePerson {
  id: string
  name: string
  /** Shown under the name; a translation key under `profile.roles`. */
  roleId: string
}

export interface ProfileComment {
  id: string
  author: string
  /** A translation key under `profile.comments`. */
  bodyId: string
  postedAt: string
}

export interface ProfilePost {
  id: string
  /** A translation key under `profile.posts`. */
  bodyId: string
  image: string
  postedAt: string
  likes: number
  /** Names behind the avatar group under the post. */
  likedBy: string[]
  comments: ProfileComment[]
}

export interface SocialLink {
  id: 'facebook' | 'instagram' | 'linkedin' | 'twitter'
  url: string
}

export interface Follower {
  id: string
  name: string
  location: string
  following: boolean
}

export interface Friend {
  id: string
  name: string
  /** A translation key under `profile.roles`. */
  roleId: string
}

/** Initials for `Avatar`, so no image file is needed for a person. */
export function initialsOf(name: string): string {
  return name
    .split(' ')
    .map((part) => part[0] ?? '')
    .slice(0, 2)
    .join('')
    .toUpperCase()
}
