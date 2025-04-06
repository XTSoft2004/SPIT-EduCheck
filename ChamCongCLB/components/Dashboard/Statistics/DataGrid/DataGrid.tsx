import React from 'react';
import { Table, TableColumnsType } from "antd";

interface DataGridProps<T> {
    data: T[];
    columns: TableColumnsType<T>;
    rowKey: keyof T;
}

const DataGrid = <T extends Object>({
    columns,
    data,
    rowKey,
}: DataGridProps<T>) => {
    return (
        <>
            <h1 className="text-2xl font-bold text-center text-gray-900 dark:text-white">Thống kê lương</h1>
            <Table<T>
                columns={columns}
                dataSource={data}
                rowKey={rowKey as string}
                scroll={{ x: 'max-content' }}
                pagination={false}
                rowClassName={(record, index) =>
                    index % 2 === 0 ? 'dark:bg-[#1E2636] bg-gray-100' : 'dark:bg-[#242f45]'
                }
            />
        </>
    )
}

export default DataGrid;