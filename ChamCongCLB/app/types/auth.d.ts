export interface ITokens {
    username: string;
    isLocked: boolean;
    isVerify: boolean;
    roleName: string;
    accessToken: string;
    refreshToken: string;
}

export interface IProfile {
    username: string;
    isLocked: boolean;
    isVerify: boolean;
    roleName: string;
}

export interface ILoginForm {
    username: string;
    password: string;
}

export interface ILoginResponse {
    data: ITokens;
    message: string;
}