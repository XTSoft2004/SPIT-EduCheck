'use server';
import globalConfig from "@/app.config";
import { cookies, headers } from 'next/headers';

import { ICourse, ICourseCreate, ICourseUpdate } from "@/types/course";
import { IIndexResponse, IResponse } from "@/types/global";

export const getAllCourses = async () => {
    const response = await fetch(`${globalConfig.baseUrl}/course`, {
        method: 'GET',
        headers: {
            'Content-Type': 'application/json',
            Authorization: headers().get('Authorization') || `Bearer ${cookies().get('accessToken')?.value || ' '}`,
        },
    });

    const data = await response.json();

    return {
        ok: response.ok,
        status: response.status,
        ...data,
    } as IIndexResponse<ICourse>;
}

export const createCourse = async (course: ICourseCreate) => {
    const response = await fetch(`${globalConfig.baseUrl}/course/create`, {
        method: 'POST',
        headers: {
            'Content-Type': 'application/json',
            Authorization: headers().get('Authorization') || `Bearer ${cookies().get('accessToken')?.value || ' '}`,
        },
        body: JSON.stringify(course),
    });

    const data = await response.json();

    return {
        ok: response.ok,
        ...data,
    } as IResponse;
}

export const updateCourse = async (course: ICourseUpdate) => {
    const response = await fetch(`${globalConfig.baseUrl}/course/${course.id}`, {
        method: 'PUT',
        headers: {
            'Content-Type': 'application/json',
            Authorization: headers().get('Authorization') || `Bearer ${cookies().get('accessToken')?.value || ' '}`,
        },
        body: JSON.stringify(course),
    });

    const data = await response.json();

    return {
        ok: response.ok,
        ...data,
    } as IResponse;
}

export const deleteCourse = async (id: number) => {
    const response = await fetch(`${globalConfig.baseUrl}/course/${id}`, {
        method: 'DELETE',
        headers: {
            'Content-Type': 'application/json',
            Authorization: headers().get('Authorization') || `Bearer ${cookies().get('accessToken')?.value || ' '}`,
        },
    });

    const data = await response.json();

    return {
        ok: response.ok,
        ...data,
    } as IResponse;
}