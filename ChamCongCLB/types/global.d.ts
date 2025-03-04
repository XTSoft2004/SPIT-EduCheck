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