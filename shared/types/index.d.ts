type ApiErrorResponse = {
    message: string,
    devFriendly?: string
}

interface BaseResponse<T> {
    code: number,
    ok: boolean,
    data: T | ApiErrorResponse
}

interface ApiOk<T> extends BaseResponse<T> {
    ok: true,
    data: T
}

interface ApiError<T> extends BaseResponse<T> {
    ok: false,
    data: ApiErrorResponse
}


export type ApiResponse<T> = ApiOk<T> | ApiError<T>