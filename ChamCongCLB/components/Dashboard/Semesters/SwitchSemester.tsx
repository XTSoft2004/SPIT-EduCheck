
'use client';
import { getSemesters } from '@/actions/semester.actions';
import { getMe } from '@/actions/user.actions';
import { ISemester } from '@/types/semester';
import { IUser } from '@/types/user';
import React, { useState, useEffect, useRef } from 'react';

export default function SwitchSemester() {
    // const [user, setUser] = useState<IUser>();
    // const [semester, setSemester] = useState<ISemester>();
    // useEffect(() => {
    //     fetchMe();
    // }, []);

    // const fetchMe = async () => {
    //     const response = await getMe();
    //     if (response.ok) {
    //         setUser(response.data);
    //     }
    // };

    // const fetchSemester = async () => {
    //     const response = await getSemesters();
    //     if (response.ok) {
    //         setUser(response.data);
    //     }
    // };

    return (
        <>

        </>
    )
}