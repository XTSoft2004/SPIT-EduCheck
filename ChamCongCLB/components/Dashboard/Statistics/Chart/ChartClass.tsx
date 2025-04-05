'use client'
import React, { useEffect, useState } from 'react';
import { BarChart, ChartTooltip } from '@mantine/charts';
import { useTheme } from '@/context/ThemeContext';
import { IStatisticClass } from '@/types/statistic';

export function ChartClass({ course, classes }: { course: string, classes: IStatisticClass[] }) {
    const { theme } = useTheme();
    const barColor = theme === 'dark' ? 'teal.3' : 'blue.3'; // Set color based on theme

    const hasData = Array.isArray(classes) && classes.length > 0;
    const [chartHeight, setChartHeight] = useState(400);

    useEffect(() => {
        if (typeof window !== 'undefined') {
            setChartHeight(window.innerWidth < 640 ? 300 : 400);
        }
    }, []);
    return (
        <div className="w-full overflow-x-auto px-4">
            <h1 className="text-2xl font-bold mb-4 text-center">Biểu đồ lớp học</h1>
            <div className="min-w-[500px] sm:min-w-full max-w-full">
                {hasData ? (
                    <BarChart
                        h={chartHeight}
                        data={classes}
                        dataKey="ClassName"
                        tooltipProps={{
                            content: ({ label, payload }) => <ChartTooltip label={label} payload={payload} />,
                        }}
                        tooltipAnimationDuration={200}
                        valueFormatter={(value) => new Intl.NumberFormat('en-US').format(value)}
                        valueLabelProps={{ position: 'inside', fill: 'white', fontWeight: 700 }}
                        withBarValueLabel
                        xAxisLabel={course}
                        yAxisLabel="Số lượng chấm công"
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
