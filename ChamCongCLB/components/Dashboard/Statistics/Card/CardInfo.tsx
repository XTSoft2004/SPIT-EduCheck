import React from 'react';
import { Card, Col, Row, Statistic } from 'antd';
import { FileSpreadsheet, UsersRound } from 'lucide-react';
import { IStatisticInfo } from '@/types/statistic';

export default function CardInfo({ statisticInfo }: { statisticInfo: IStatisticInfo | null }) {
    return (
        <div className="grid grid-cols-1 gap-4">
            <Row gutter={[16, 16]} justify="center">
                <Col xs={24} sm={12} md={6} lg={6} xl={6}>
                    <Card variant="outlined">
                        <Statistic
                            title="Số lượng thành viên"
                            value={statisticInfo?.numberStudent || 0}
                            valueStyle={{ color: '#3f8600' }}
                            prefix={<UsersRound size={16} className="mr-1" />}
                            suffix="thành viên"
                        />
                    </Card>
                </Col>
                <Col xs={24} sm={12} md={6} lg={6} xl={6}>
                    <Card bordered={false}>
                        <Statistic
                            title="Số lần chấm công"
                            value={statisticInfo?.numberTimesheet || 0}
                            valueStyle={{ color: '#cf1322' }}
                            prefix={<FileSpreadsheet size={16} className="mr-1" />}
                            suffix="lượt chấm công"
                        />
                    </Card>
                </Col>
                <Col xs={24} sm={12} md={6} lg={6} xl={6}>
                    <Card bordered={false}>
                        <Statistic
                            title="Số lần chấm công"
                            value={statisticInfo?.numberTimesheet || 0}
                            valueStyle={{ color: '#cf1322' }}
                            prefix={<FileSpreadsheet size={16} className="mr-1" />}
                            suffix="lượt chấm công"
                        />
                    </Card>
                </Col>
                <Col xs={24} sm={12} md={6} lg={6} xl={6}>
                    <Card bordered={false}>
                        <Statistic
                            title="Số lần chấm công"
                            value={statisticInfo?.numberTimesheet || 0}
                            valueStyle={{ color: '#cf1322' }}
                            prefix={<FileSpreadsheet size={16} className="mr-1" />}
                            suffix="lượt chấm công"
                        />
                    </Card>
                </Col>
            </Row>
        </div>
    );
}
