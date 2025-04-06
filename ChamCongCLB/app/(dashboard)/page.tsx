'use client'
import React from 'react';
import { getStatisticClass, getStatisticInfo, getStatisticSalary } from "@/actions/statistic.action";
import CardInfo from "@/components/Dashboard/Statistics/Card/CardInfo"
import { IStatisticClass, IStatisticInfo, IStatisticSalary } from "@/types/statistic";
import { useEffect, useState } from "react";
import ChartClass from '@/components/Dashboard/Statistics/Chart/ChartClass';
import { Table } from 'antd';
import DataGrid from "@/components/Dashboard/Statistics/DataGrid/DataGrid";
import SpinLoading from '@/components/ui/Loading/SpinLoading';

export default function Page() {
    const [statisticClass, setstatisticClass] = useState<IStatisticClass[] | null>(null);
    const [statisticInfo, setstatisticInfo] = useState<IStatisticInfo | null>(null);
    const [statisticSalary, setstatisticSalary] = useState<IStatisticSalary[]>([]);
    const [course, setCourse] = useState<string | null>(null);

    const [loading, setLoading] = useState(true);

    useEffect(() => {
        const fetchData = async () => {
            const [statisticClassRes, statisticInfoRes, statisticSalaryRes] = await Promise.all([
                getStatisticClass(),
                getStatisticInfo(),
                getStatisticSalary(),
            ]);

            if (statisticClassRes.ok) {
                const mappedData: IStatisticClass[] = statisticClassRes.data.map((item: any) => ({
                    ClassName: item.className.split('-')[1].trim(),

                    NumberTimesheet: item.numberTimesheet,
                }));
                setCourse(statisticClassRes.data[0].className.split('-')[0].trim());
                setstatisticClass(mappedData)
            }

            if (statisticInfoRes.ok) setstatisticInfo(statisticInfoRes);

            if (statisticSalaryRes.ok) setstatisticSalary(statisticSalaryRes.data.salaryInfoStudents);
            setLoading(false);
        };

        fetchData();
    }, []);

    const columns = [
        {
            title: 'Mã sinh viên',
            dataIndex: 'codeName',
            key: 'codeName',
        },
        {
            title: 'Sinh viên',
            dataIndex: 'studentName',
            key: 'studentName',
        },
        {
            title: 'Số buổi hỗ trợ',
            dataIndex: 'day',
            key: 'day',
        },
        {
            title: 'Tổng số tiền',
            dataIndex: 'salary',
            key: 'salary',
        }
    ]

    return (
        <>
            {(loading) ? (
                <SpinLoading />
            ) : (
                <>
                    {/* <h1>Dashboard</h1> */}
                    <div className="grid grid-cols-1 gap-4">
                        <div className="col-span-1">
                            <CardInfo statisticInfo={statisticInfo} />
                            <div className="mt-2">
                                <ChartClass data={statisticClass || []} course={course || ''} />
                            </div>
                            <div className="mt-2">
                                <DataGrid
                                    rowKey='codeName'
                                    data={statisticSalary || []}
                                    columns={columns}
                                />
                            </div>
                        </div >
                    </div>
                </>
            )}
        </>
    )
}