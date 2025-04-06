'use client';

import { IStatisticClass } from '@/types/statistic';
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
} from 'recharts';

export default function ChartClass({ data, course }: { course: string, data: IStatisticClass[] }) {
    return (
        <div style={{ display: 'flex', flexDirection: 'column', width: '100%', padding: '0 16px' }}>
            <p className='text-2xl font-bold text-center mb-2'>Thống kê chấm công</p>
            <p className='text-lg font-bold text-center text-gray-600'>{course}</p>
            <div style={{ display: 'flex', justifyContent: 'space-between', gap: '16px', width: '100%' }}>
                {/* BarChart bên trái */}
                <div style={{ flex: 1, minWidth: '300px' }}>
                    <ResponsiveContainer width="100%" height={300}>
                        <BarChart data={data}>
                            <CartesianGrid strokeDasharray="3 3" />
                            <XAxis
                                dataKey="ClassName"
                                interval={0}
                                tick={{ fontSize: 10, fontWeight: 'bold' }}
                                textAnchor="middle"
                            />
                            <YAxis />
                            <Tooltip
                                contentStyle={{
                                    backgroundColor: '#333',
                                    borderColor: '#555',
                                    color: '#fff',
                                }}
                                wrapperStyle={{
                                    transition: 'background-color 0.3s ease',
                                }}
                                itemStyle={{
                                    color: '#fff',
                                }}
                                labelStyle={{
                                    fontWeight: 'bold',
                                    textAlign: 'center',
                                }}
                                cursor={{ fill: 'rgba(255, 255, 255, 0.1)' }}
                            />
                            <Legend />
                            <Bar dataKey="NumberTimesheet" fill="#82ca9d" name='Số lần chấm công (trái)' >
                                <LabelList dataKey="NumberTimesheet" position="inside" style={{ fontWeight: 900 }} />
                            </Bar>

                        </BarChart>
                    </ResponsiveContainer>
                </div>

                {/* BarChart bên phải */}
                <div style={{ flex: 1, minWidth: '300px' }}>
                    <ResponsiveContainer width="100%" height={300}>
                        <BarChart data={data}>
                            <CartesianGrid strokeDasharray="3 3" />
                            <XAxis
                                dataKey="ClassName"
                                interval={0}
                                tick={{ fontSize: 11 }}
                                textAnchor="end"
                            />
                            <YAxis />
                            <Tooltip
                                contentStyle={{
                                    backgroundColor: '#333',
                                    borderColor: '#555',
                                    color: '#fff',
                                }}
                                wrapperStyle={{
                                    transition: 'background-color 0.3s ease',
                                }}
                                itemStyle={{
                                    color: '#fff',
                                }}
                                labelStyle={{
                                    fontWeight: 'bold',
                                    textAlign: 'center',
                                }}
                                cursor={{ fill: 'rgba(255, 255, 255, 0.1)' }}
                            />
                            <Legend />
                            <Bar dataKey="NumberTimesheet" fill="#8884d8" name='Số lần chấm công (phải)' />
                        </BarChart>
                    </ResponsiveContainer>
                </div>
            </div>
        </div>
    );
}
