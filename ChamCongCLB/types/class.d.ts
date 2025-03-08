export interface IClass {
    id: number;
    code: string;
    name: string;
    day: number;
    timeStart: string;
    timeEnd: string;
    lecturerId: string;
    courseId: string;
}

export interface IClassFilter {
    pageNumber: number;
    pageSize: number;
}

export interface IClassCreate {
    code: string;
    name: string;
    day: number;
    timeStart: string;
    timeEnd: string;
    lecturerId: string;
    courseId: string;
    studentId: string[];
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
    studentId?: string[];
}

export interface IClassDeleteLecturer {
    classId: string;
}