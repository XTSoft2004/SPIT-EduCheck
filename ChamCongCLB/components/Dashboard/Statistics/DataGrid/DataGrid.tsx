import React from 'react';
import { Table } from 'antd';

const DataGrid = ({ columns, data, rowKey }: any) => {
    const enhancedColumns = [
        {
            title: 'STT',
            dataIndex: 'stt',
            key: 'stt',
            render: (_: any, __: any, index: number) => index + 1,
            width: 100,
        },
        ...columns,
    ];

    return (
        <>
            <div className='w-full shadow-md p-4 overflow-x-auto'>
                <h1 className='text-2xl font-bold text-center mb-5'>Thống kê lương hỗ trợ các lớp trong kì này</h1>
                <Table
                    columns={enhancedColumns}
                    dataSource={data}
                    rowKey={rowKey}
                    scroll={{ x: 'max-content', y: 300 }}
                    pagination={false}
                    rowClassName={(record, index) =>
                        index % 2 === 0 ? 'dark:bg-[#1E2636] bg-gray-100' : 'dark:bg-[#242f45]'
                    }
                />
            </div>
        </>
    );
};

export default DataGrid;