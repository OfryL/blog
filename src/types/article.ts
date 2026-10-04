export interface Article {
  id: string
  title: string
  excerpt: string
  content: string
  date: string
  image?: string
  tags?: string[]
  /** Drafts are hidden from the public site and only visible under /stage. */
  draft?: boolean
}
