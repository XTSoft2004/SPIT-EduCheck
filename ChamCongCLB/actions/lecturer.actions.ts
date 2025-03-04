'use server'
import globalConfig from "../app.config";

import { ILecturer, ILecturerCreate, ILecturerFilter, ILecturerUpdate } from "@/types/lecturer";

/**
 * Get all lecturers
 * @param filter - Filter to search for lecturers
 * @returns List of lecturers
 */
export const getLecturers = async (filter: ILecturerFilter) => {
    const response = await fetch(`${globalConfig.baseUrl}/lecturer?${new URLSearchParams(filter as any)}`,
        {
            method: 'GET',
            headers: {
                'Content-Type': 'application/json',
                
            }
        });
}