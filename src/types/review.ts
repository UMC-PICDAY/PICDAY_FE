export interface UploadImageResult {
  imageUrl: string
}

export interface CreateReviewRequest {
  reservationId: number
  rating: number
  content: string
  imageUrls: string[] | null
}