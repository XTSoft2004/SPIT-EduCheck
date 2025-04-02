'use client';
import React from 'react';
import { Pagination, Table } from 'antd';
import type { TableColumnsType, TableProps } from 'antd';

type DataGridProps<T> = {
    data: T[];
    columns: TableColumnsType<T>;
    rowKey: keyof T;
    pageIndex: number;
    pageSize: number;
    totalRecords: number;
    setPageIndex: (page: number) => void;
    setPageSize?: (pageSize: number) => void;
    rowSelection?: TableProps<T>['rowSelection'];
};

const DataGrid = <T extends object>({
    rowSelection,
    data,
    columns,
    rowKey,
    pageIndex,
    pageSize,
    totalRecords,
    setPageIndex,
    setPageSize,
}: DataGridProps<T>) => {
    return (
        <>
            <Table<T>
                columns={columns}
                dataSource={data}
                rowKey={rowKey as string}
                scroll={{ x: 'max-content' }}
                pagination={false}
                rowSelection={rowSelection}
                rowClassName={(record, index) =>
                    index % 2 === 0 ? 'dark:bg-[#1E2636] bg-gray-100' : 'dark:bg-[#242f45]'
                }
            />
            <Pagination
                className='flex flex-row mt-5 items-center sm:justify-end justify-between'
                current={pageIndex}
                pageSize={pageSize}
                total={totalRecords}
                showSizeChanger
                showLessItems
                pageSizeOptions={[6, 10, 15, 20, totalRecords]}
                onShowSizeChange={(current, size) => {
                    setPageIndex(1);
                    setPageSize && setPageSize(size);
                }}
                onChange={(page) => setPageIndex(page)}
            />
        </>
    );
};

export default DataGrid;
