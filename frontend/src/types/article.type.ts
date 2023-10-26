export type ArticleType = {
  id: string,
  title: string,
  description: string,
  image: string,
  date: string,
  category: string,
  url: string,
  comments?: string[],
  commentsCount?: number,
  text?: string
}
