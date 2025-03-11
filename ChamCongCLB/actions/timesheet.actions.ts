'use server';
import globalConfig from "@/app.config";
import { cookies, headers } from 'next/headers';

import { ITimesheet, ITimesheetCreate, ITimesheetUpdate } from "@/types/timesheet";
import { IIndexResponse, IResponse } from "@/types/global";

export const getTimesheets = async () => {
    const response = await fetch(`${globalConfig.baseUrl}/timesheet`, {
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
    } as IIndexResponse<ITimesheet>;
}

export const createTimesheet = async (timesheet: ITimesheetCreate) => {
    const response = await fetch(`${globalConfig.baseUrl}/timesheet/create`, {
        method: 'POST',
        headers: {
            'Content-Type': 'application/json',
            Authorization: headers().get('Authorization') || `Bearer ${cookies().get('accessToken')?.value || ' '}`,
        },
        body: JSON.stringify(timesheet),
    });

    const data = await response.json();

    return {
        ok: response.ok,
        ...data,
    } as IResponse;
}

export const updateTimesheet = async (timesheet: ITimesheetUpdate) => {
    const response = await fetch(`${globalConfig.baseUrl}/timesheet/${timesheet.id}`, {
        method: 'PUT',
        headers: {
            'Content-Type': 'application/json',
            Authorization: headers().get('Authorization') || `Bearer ${cookies().get('accessToken')?.value || ' '}`,
        },
        body: JSON.stringify(timesheet),
    });

    const data = await response.json();

    return {
        ok: response.ok,
        ...data,
    } as IResponse;
}

export const deleteTimesheet = async (timesheet: ITimesheet) => {
    const response = await fetch(`${globalConfig.baseUrl}/timesheet/${timesheet.id}`, {
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