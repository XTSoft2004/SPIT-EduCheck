'use client'
import React from 'react';
import { getStatisticClass, getStatisticInfo } from "@/actions/statistic.action";
import CardInfo from "@/components/Dashboard/Statistics/Card/CardInfo"
import { ChartClass } from "@/components/Dashboard/Statistics/Chart/ChartClass"
import { IStatisticClass, IStatisticInfo } from "@/types/statistic";
import { useEffect, useState } from "react";

export default function Page() {
    const [statisticClass, setstatisticClass] = useState<IStatisticClass[] | null>(null);
    const [statisticInfo, setstatisticInfo] = useState<IStatisticInfo | null>(null);
    const [course, setCourse] = useState<string | null>(null);
    useEffect(() => {
        const fetchData = async () => {
            const [statisticClassRes, statisticInfoRes] = await Promise.all([
                getStatisticClass(),
                getStatisticInfo(),
            ]);

            if (statisticClassRes.ok) {
                console.log('statisticClassRes', statisticClassRes);
                const mappedData: IStatisticClass[] = statisticClassRes.data.map((item: any) => ({
                    ClassName: item.className.split('-')[1].trim(),

                    NumberTimesheet: item.numberTimesheet,
                }));
                setCourse(statisticClassRes.data[0].className.split('-')[0].trim());
                setstatisticClass(mappedData)
            }

            if (statisticInfoRes.ok) setstatisticInfo(statisticInfoRes);

        };

        fetchData();
    }, []);

    return (
        <>
            {/* <h1>Dashboard</h1> */}
            <div className="grid grid-cols-1 gap-4">
                <div className="col-span-1">
                    <CardInfo statisticInfo={statisticInfo} />
                    <div className="mt-2">
                        <ChartClass course={course || ''} classes={statisticClass || []} />
                    </div>
                </div>
            </div>
        </>
    )
}