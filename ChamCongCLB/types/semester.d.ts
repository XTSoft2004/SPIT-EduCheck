export interface ISemester {
    id: number;
    semesters_Number: number;
    year: number;
}

export interface ISemesterFilter {
    pageNumber: number;
    pageSize: number;
}

export interface ISemesterCreate {
    semesters_Number: number;
    year: number;
}

export interface ISemesterUpdate {
    id: number;
    semesters_Number?: number;
    year?: number;
}