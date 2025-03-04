export interface ISemester {
    id: number;
    semesterse_Number: number;
    year: number;
}

export interface ISemesterFilter {
    pageNumber: number;
    pageSize: number;
}

export interface ISemesterCreate {
    semesterse_Number: number;
    year: number;
}

export interface ISemesterUpdate {
    id: number;
    semesterse_Number?: number;
    year?: number;
}