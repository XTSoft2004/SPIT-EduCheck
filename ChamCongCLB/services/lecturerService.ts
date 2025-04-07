import api, { Meta, PaginationFilter } from './api';

export const getLecturers = () => {
    return api.get('/lecturer');
}

export interface Lecturer {
    id: string;
    fullname: string;
    phoneNumber: string;
    email: string;
}

