'use client';

import {
    BarChart,
    Bar,
    XAxis,
    YAxis,
    CartesianGrid,
    Tooltip,
    Legend,
    ResponsiveContainer,
    LabelList,
    Label,
} from 'recharts';
import { useMemo } from 'react';
import { IStatisticClass } from '@/types/statistic';

interface ChartClassProps {
    course: string;
    data: IStatisticClass[];
}

const predefinedColors = [
    '#FF5733', '#33FF57', '#3357FF', '#FF33A1', '#A133FF', '#33FFF5', '#F5FF33', '#FF8C33', '#33FF8C', '#8C33FF',
    '#FF3333', '#33FF33', '#3333FF', '#FF33FF', '#33FFFF', '#FFFF33', '#FF6633', '#33FF66', '#6633FF', '#FF3366',
    '#66FF33', '#3366FF', '#FF9933', '#33FF99', '#9933FF', '#FF3399', '#99FF33', '#3399FF', '#FFCC33', '#33FFCC',
    '#CC33FF', '#FF33CC', '#CCFF33', '#33CCFF', '#FF9966', '#66FF99', '#9966FF', '#FF6699', '#99FF66', '#6699FF',
    '#FFCC66', '#66FFCC', '#CC66FF', '#FF66CC', '#CCFF66', '#66CCFF', '#FF6F61', '#6F61FF', '#61FF6F', '#FF61A6',
    '#A661FF', '#61FFA6', '#FFA661', '#61A6FF', '#A6FF61', '#FF7F50', '#7F50FF', '#50FF7F', '#FF1493', '#00CED1',
    '#FFD700', '#ADFF2F', '#40E0D0', '#BA55D3', '#FF4500', '#7CFC00', '#4169E1', '#DA70D6', '#00FA9A', '#D2691E',
    '#DC143C', '#32CD32', '#4682B4', '#DDA0DD', '#FF8C00', '#228B22', '#1E90FF', '#C71585', '#20B2AA', '#B22222',
    '#9ACD32', '#6A5ACD', '#DB7093', '#8FBC8F', '#CD5C5C', '#8A2BE2', '#5F9EA0', '#FA8072', '#7B68EE', '#3CB371',
    '#F4A460', '#9932CC', '#48D1CC', '#BDB76B', '#EE82EE', '#87CEEB', '#778899', '#FFB6C1', '#2E8B57', '#8B0000'
];

// 🔢 Hash chuỗi tên thành số để lấy màu cố định
function hashStringToColorIndex(name: string): number {
    let hash = 0;
    for (let i = 0; i < name.length; i++) {
        hash = name.charCodeAt(i) + ((hash << 5) - hash);
        hash = hash & hash; // convert to 32-bit integer
    }
    return Math.abs(hash) % predefinedColors.length;
}

// ✅ Convert data cho biểu đồ
function convertData(data: IStatisticClass[]) {
    return data.map((cls) => {
        const row: Record<string, any> = {
            ClassName: cls.className,
        };
        cls.studentClasses.forEach((stu) => {
            row[stu.studentName] = stu.numberTimesheet;
        });
        return row;
    });
}

export default function ChartClass({ data, course }: ChartClassProps) {
    const studentNames = useMemo(() => {
        const set = new Set<string>();
        data.forEach((cls) => {
            cls.studentClasses.forEach((stu) => set.add(stu.studentName));
        });
        return Array.from(set);
    }, [data]);

    // 🎨 Gán màu cố định dựa theo hash(name)
    const colorMap = useMemo(() => {
        const map: Record<string, string> = {};
        studentNames.forEach((name) => {
            const colorIdx = hashStringToColorIndex(name);
            map[name] = predefinedColors[colorIdx];
        });
        return map;
    }, [studentNames]);

    const chartData = useMemo(() => convertData(data), [data]);

    return (
        <div className="flex flex-col w-full px-4 py-2">
            <p className="text-2xl font-bold text-center mb-2">Thống kê chấm công</p>
            <p className="text-lg font-semibold text-center text-gray-600 mb-4">{course}</p>

            {/* Đảm bảo có thể cuộn ngang trên mobile, nhưng không cuộn trên PC */}
            <div className="w-full h-[400px] overflow-x-auto lg:overflow-x-hidden">
                {/* Đặt min-width và height cụ thể để giữ kích thước của biểu đồ */}
                <div style={{ minWidth: "900px", height: "100%" }}>
                    <ResponsiveContainer width="100%" height="100%">
                        <BarChart
                            data={chartData}
                            margin={{ top: 20, right: 30, left: 20, bottom: 5 }}
                        >
                            <CartesianGrid strokeDasharray="3 3" />
                            <XAxis
                                dataKey="ClassName"
                                interval={0}
                                tick={{ fontSize: 13 }}
                            />
                            <YAxis label={{ value: 'Số buổi chấm công', angle: -90, position: 'insideLeft' }} />
                            <Tooltip
                                contentStyle={{
                                    backgroundColor: '#333',
                                    borderColor: '#555',
                                    color: '#fff',
                                }}
                                itemStyle={{ color: '#fff' }}
                                labelStyle={{
                                    fontWeight: 'bold',
                                    textAlign: 'center',
                                }}
                                cursor={{ fill: 'rgba(255, 255, 255, 0.1)' }}
                            />
                            <Legend />
                            {studentNames.map((name) => (
                                <Bar
                                    key={name}
                                    dataKey={name}
                                    stackId="a"
                                    fill={colorMap[name]}
                                    name={name}
                                >
                                    <LabelList
                                        dataKey={name}
                                        position="inside"
                                        style={{
                                            fontWeight: 1000,
                                            textShadow: '1px 1px 2px rgba(0, 0, 0, 0.8)',
                                            fill: '#fff',
                                        }}
                                        fontSize={12}
                                    />
                                </Bar>
                            ))}
                        </BarChart>
                    </ResponsiveContainer>
                </div>
            </div>
        </div>
    );
}
