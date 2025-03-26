'use client';
import React, { useState } from 'react';
import { Input, Pagination, Table } from 'antd';
import type { TableColumnsType } from 'antd';

type DataGridProps<T> = {
    data: T[];
    columns: TableColumnsType<T>;
    rowKey: keyof T;
    pageIndex: number;
    pageSize: number;
    totalRecords: number;
    setPageIndex: (page: number) => void;
    setPageSize?: (pageSize: number) => void;
};

const DataGrid = <T extends object>({
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
            />
            <Pagination
                className='flex flex-row justify-end mt-5'
                current={pageIndex}
                pageSize={pageSize}
                total={totalRecords}
                showSizeChanger
                pageSizeOptions={['6', '10', '15', '20']}
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
