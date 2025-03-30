export interface IClass {
    id: number;
    code: string;
    name: string;
    day: number;
    timeStart: string;
    timeEnd: string;
    lecturerId: string;
    courseId: string;
    studentsId: number[];
}

export interface IClassFilter {
    pageNumber: number;
    pageSize: number;
}

export interface IClassCreate {
    id: number
    code: string;
    name: string;
    day: number;
    timeStart: string;
    timeEnd: string;
    lecturerId: string;
    courseId: string;
    studentsId: number[];
}

export interface IClassUpdate {
    id: number;
    code?: string;
    name?: string;
    day?: number;
    timeStart?: string;
    timeEnd?: string;
    lecturerId?: string;
    courseId?: string;
    studentsId?: number[];
}

export interface IClassDeleteLecturer {
    classId: string;
}