export interface Product {
  category: string
  description: string
  id: number
  price: number
  rating: number
  stock: number
  thumbnail: string
  title: string
}

export interface ProductListFilters {
  limit: number
  skip: number
}

export interface ProductListResponse {
  limit: number
  products: Product[]
  skip: number
  total: number
}
