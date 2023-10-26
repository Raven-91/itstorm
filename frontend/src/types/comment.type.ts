export type CommentType = {
  id: string,
  text: string,
  date: string,
  likesCount: number,
  selectedLike?: boolean,
  dislikesCount: number,
  selectedDislike?:  boolean,
  user: {
    id: string,
    name: string
  }
  day?: string,
  time?: string
}
