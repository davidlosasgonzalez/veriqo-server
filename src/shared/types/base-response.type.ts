export type BaseResponse = {
    status: 'ok' | 'error';
    message: string;
};

export type DataResponse<T> = BaseResponse & {
    data: T;
};
