'use client';
import { useRouter } from 'next/navigation';
import { getSemesters } from '@/actions/semester.actions';
import { getProfile } from '@/actions/user.actions';
import { ISemester } from '@/types/semester';
import { IUserProfile } from '@/types/user';
import { Button } from 'antd';
import React, { useState, useEffect } from 'react';

export default function SwitchSemester() {
    const router = useRouter();
    const [user, setUser] = useState<IUserProfile>();
    const [semester, setSemester] = useState<ISemester[]>();

    useEffect(() => {
        const fetchData = async () => {
            const [userRes, semesterRes] = await Promise.all([getProfile(), getSemesters()]);

            if (userRes.ok) setUser(userRes.data);
            if (semesterRes.ok) setSemester(semesterRes.data);
        };
        fetchData();
    }, []);

    const currentSemester = user ? semester?.find((s) => s.id === user.semesterId) : undefined;

    return (
        <div className="flex justify-center items-center h-screen">
            <Button
                className="w-25 flex items-center text-red-400 font-bold border-none text-lg sm:text-sm"
                onClick={() => router.push('/semester/change')}
            >
                {currentSemester
                    ? `Học kỳ: ${currentSemester.semesters_Number}, Năm học: ${currentSemester.yearStart} : ${currentSemester.yearEnd}`
                    : 'No semester selected'}
            </Button>
        </div>
    );
}
