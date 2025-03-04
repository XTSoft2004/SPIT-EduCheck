export interface ICourse {
    id: number;
    code: string;
    name: string;
    credits: number;
}

export interface ICourseFilter {
    pageNumber: number;
    pageSize: number;
}

export interface ICourseCreate {
    code: string;
    name: string;
    credits: number;
    semesterId: number;
}

export interface ICourseUpdate {
    id: number;
    code?: string;
    name?: string;
    credits?: number;
    semesterId?: number;
}