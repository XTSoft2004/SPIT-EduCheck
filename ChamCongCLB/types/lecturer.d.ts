export interface ILecturer {
    id: string;
    fullName: string;
    phoneNumber: string;
    email: string;
}

export interface ILecturerFilter {
    pageNumber: number;
    pageSize: number;
}

export interface ILecturerCreate {
    fullName: string;
    email: string;
    phoneNumber: string;
}

export interface ILecturerUpdate {
    id: number;
    fullName?: string;
    email?: string;
    phoneNumber?: string;
}