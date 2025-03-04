export interface ILecturer {
    id: string;
    fullname: string;
    phoneNumber: string;
    email: string;
}

export interface ILecturerFilter {
    pageNumber: number;
    pageSize: number;
}

export interface ILecturerCreate {
    fullname: string;
    email: string;
    phoneNumber: string;
}

export interface ILecturerUpdate {
    id: number;
    fullname?: string;
    email?: string;
    phoneNumber?: string;
}