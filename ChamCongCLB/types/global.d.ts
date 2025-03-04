export interface IMeta {
    totalRecords: number,
    totalPages: number,
    currentPage: number,
    pageSize: number
}

interface IBaseResponse {
    ok: boolean;
    status: number;
    message: string;
}

export interface IResponse extends IBaseResponse {}

export interface IIndexResponse<T> extends IBaseResponse {
    data: T[];
    meta: IMeta;
}

export interface IShowResponse<T> extends IBaseResponse {
    data: T;
}