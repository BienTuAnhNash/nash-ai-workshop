export interface PaginationResponse<T> {
  items: T[]
  total: number
  page: number
  limit: number
}
