declare global {
    interface ApiRequest<T> {
        request: T
    }

    interface ApiResponse<T> {
        isSuccess: boolean
        message: string
        data?: T
        statusCode: number
        errors: string[]
    }

    type HttpMethod = 'POST' | 'PUT' | 'PATCH' | 'DELETE'

    interface MutationPayload<TReq> {
        endpoint: string
        method?: HttpMethod
        body: ApiRequest<TReq>
    }
}

export { }