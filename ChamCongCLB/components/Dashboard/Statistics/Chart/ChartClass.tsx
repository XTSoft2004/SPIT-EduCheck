'use client'
import React from 'react';
import { BarChart } from '@mantine/charts';
import { useTheme } from '@/context/ThemeContext';
import { IStatisticClass } from '@/types/statistic';

export function ChartClass({ course, classes }: { course: string, classes: IStatisticClass[] }) {
    const { theme } = useTheme();
    const barColor = theme === 'dark' ? 'teal.3' : 'blue.3'; // Set color based on theme

    console.log('course', course);

    const hasData = Array.isArray(classes) && classes.length > 0;
    return (
        <div className="overflow-x-auto px-4">
            <div className="min-w-[800px] max-w-[200px]"> {/* 👈 Cho min width đủ rộng để cuộn */}
                <h1 className="text-2xl font-bold mb-4 text-center">Biểu đồ lớp học</h1>
                {hasData ? (
                    <BarChart
                        h={400}
                        data={classes}
                        dataKey="ClassName"
                        xAxisLabel={course}
                        yAxisLabel='Số lượng chấm công'
                        withLegend
                        series={[{ name: 'NumberTimesheet', color: barColor }]}
                    />
                ) : (
                    <p className="text-center text-gray-500">Không có dữ liệu</p>
                )}
            </div>
        </div>
    );
}
