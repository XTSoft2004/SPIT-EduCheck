export interface IUser {
    username: string;
    isLocked: boolean;
    isVerify: boolean;
    roleName: string;
}

export interface IUserFilter {
    pageNumber: number;
    pageSize: number;
}

export interface IUserSearch {
    id: number;
}

export interface IUserCreate {
    username: string;
    password: string;
}