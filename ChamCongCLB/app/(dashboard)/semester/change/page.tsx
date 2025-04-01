'use client';
import React, { useState, useEffect } from 'react';
import type { RadioChangeEvent } from 'antd';
import { Button, Radio, Typography, Spin, message } from 'antd';
import { useRouter } from 'next/navigation';

import { setSemesterId } from '@/actions/user.actions';
import { getSemesters } from '@/actions/semester.actions';
import { getProfile } from '@/actions/user.actions';
import { refreshToken } from '@/actions/auth.actions';

import { ISemester } from '@/types/semester';

const { Title, Text } = Typography;

export default function SetSemesterPage() {
    const [semesterId, setSemesterIdState] = useState<number | null>(null);
    const [semesters, setSemesters] = useState<ISemester[]>([]);
    const [loading, setLoading] = useState(true);
    const [updating, setUpdating] = useState(false);
    const router = useRouter();

    useEffect(() => {
        const fetchData = async () => {
            try {
                const [semestersData, meData] = await Promise.all([getSemesters(), getProfile()]);
                setSemesters(semestersData.data);
                setSemesterIdState(meData.data.semesterId);
            } catch (error) {
                message.error('Lỗi khi tải dữ liệu!');
            } finally {
                setLoading(false);
            }
        };
        fetchData();
    }, []);

    const handleChange = (e: RadioChangeEvent) => {
        setSemesterIdState(e.target.value);
    };

    const handleSetSemester = async () => {
        if (!semesterId) return;
        setUpdating(true);
        const response = await setSemesterId(semesterId);
        if (response.status && response.message.includes('thành công')) {
            await refreshToken();
            window.location.href = '/';
        } else {
            message.error('Cập nhật học kỳ thất bại!');
        }
        setUpdating(false);
    };

    if (loading) {
        return (
            <div className="flex justify-center items-center h-screen">
                <Spin size="large" />
            </div>
        );
    }

    return (
        <div className="flex flex-col min-h-screen p-5">
            <div className="mt-5 p-3">
                <Radio.Group className="flex flex-col gap-2" onChange={handleChange} value={semesterId}>
                    {semesters.map((semester) => (
                        <Radio key={semester.id} value={semester.id}>
                            <Text>Học kỳ: {semester.semesters_Number}  Năm học: {semester.yearStart}-{semester.yearEnd}</Text>
                        </Radio>
                    ))}
                </Radio.Group>
            </div>
            <div className="mt-5 flex justify-end w-full p-3 gap-3">
                <Button type="primary" onClick={handleSetSemester} loading={updating}>Đổi học kỳ</Button>
                <Button type="default" onClick={() => router.push('/')} className="border border-black">Huỷ bỏ</Button>
            </div>
        </div>
    );
}
