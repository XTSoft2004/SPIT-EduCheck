import React from 'react';
import { Card, Statistic } from 'antd';
import { FileSpreadsheet, UsersRound } from 'lucide-react';
import { IStatisticInfo } from '@/types/statistic';

export default function CardInfo({ statisticInfo, toltalSalary }: { toltalSalary: number, statisticInfo: IStatisticInfo | null }) {
    return (
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4 w-full">
            <div className="flex">
                <Card className="flex-1 w-full" variant="outlined">
                    <Statistic
                        title="Số lượng thành viên"
                        value={statisticInfo?.numberStudent || 0}
                        valueStyle={{ color: '#1890ff' }} // Màu xanh dương
                        prefix={<UsersRound size={16} className="mr-1" />}
                        suffix="thành viên"
                    />
                </Card>
            </div>
            <div className="flex">
                <Card className="flex-1 w-full" bordered={false}>
                    <Statistic
                        title="Số lần chấm công"
                        value={statisticInfo?.numberTimesheet || 0}
                        valueStyle={{ color: '#52c41a' }} // Màu xanh lá
                        prefix={<FileSpreadsheet size={16} className="mr-1" />}
                        suffix="lượt chấm công"
                    />
                </Card>
            </div>
            <div className="flex">
                <Card className="flex-1 w-full" bordered={false}>
                    <Statistic
                        title="Tổng lương của sinh viên"
                        value={new Intl.NumberFormat('vi-VN', { style: 'currency', currency: 'VND' }).format(toltalSalary || 0)}
                        valueStyle={{ color: '#faad14' }} // Màu vàng
                        prefix={<FileSpreadsheet size={16} className="mr-1" />}
                    />
                </Card>
            </div>
            <div className="flex">
                <Card className="flex-1 w-full" bordered={false}>
                    <Statistic
                        title="Sinh viên đi hỗ trợ nhiều nhất"
                        value={statisticInfo?.topTimesheetStudentName || 'Chưa có dữ liệu'}
                        valueStyle={{ color: '#722ed1' }} // Màu tím
                        prefix={<FileSpreadsheet size={16} className="mr-1" />}
                    />
                </Card>
            </div>
        </div>
    );
}
