export interface HttpRequest {
  body?: Record<string, unknown>
}

export interface HttpResponse {
  statusCode: number
  body: any
}
