'use client';
import React, { useState, useRef } from 'react';
import { SearchOutlined } from '@ant-design/icons';
import type { InputRef, TableColumnsType } from 'antd';
import { Button, Input, Space, Table } from 'antd';
import type { FilterDropdownProps } from 'antd/es/table/interface';

type DataGridProps<T> = {
    data: T[];
    columns: TableColumnsType<T>;
    rowKey: keyof T;
};

const DataGrid = <T extends object>({ data, columns, rowKey }: DataGridProps<T>) => {
    const [searchText, setSearchText] = useState('');
    const [searchedColumn, setSearchedColumn] = useState('');
    const searchInput = useRef<InputRef>(null);

    const handleSearch = (
        selectedKeys: string[],
        confirm: FilterDropdownProps['confirm'],
        dataIndex: string
    ) => {
        confirm();
        setSearchText(selectedKeys[0]);
        setSearchedColumn(dataIndex);
    };

    const handleReset = (clearFilters?: () => void) => {
        if (clearFilters) clearFilters();
        setSearchText('');
    };

    const getColumnSearchProps = (dataIndex: keyof T): TableColumnsType<T>[number] => ({
        filterDropdown: ({ setSelectedKeys, selectedKeys, confirm, clearFilters, close }) => (
            <div style={{ padding: 8 }} onKeyDown={(e) => e.stopPropagation()}>
                <Input
                    ref={searchInput}
                    placeholder={`Search ${String(dataIndex)}`}
                    value={selectedKeys[0] as string}
                    onChange={(e) => setSelectedKeys(e.target.value ? [e.target.value] : [])}
                    onPressEnter={() => handleSearch(selectedKeys as string[], confirm, String(dataIndex))}
                    style={{ marginBottom: 8, display: 'block' }}
                />
                <Space>
                    <Button
                        type="primary"
                        onClick={() => handleSearch(selectedKeys as string[], confirm, String(dataIndex))}
                        icon={<SearchOutlined />}
                        size="small"
                        style={{ width: 90 }}
                    >
                        Search
                    </Button>
                    <Button onClick={() => clearFilters && handleReset(clearFilters)} size="small" style={{ width: 90 }}>
                        Reset
                    </Button>
                    <Button type="link" size="small" onClick={() => close()}>
                        Close
                    </Button>
                </Space>
            </div>
        ),
        filterIcon: (filtered: boolean) => (
            <SearchOutlined style={{ color: filtered ? '#1677ff' : undefined }} />
        ),
        onFilter: (value, record) =>
            record[dataIndex]?.toString().toLowerCase().includes((value as string).toLowerCase()) || false,
        render: (text, record, index) => {
            if (searchedColumn === dataIndex) {
                return <b>{text}</b>;
            }
            return text;
        }
    });

    const enhancedColumns = [
        {
            title: 'STT',
            dataIndex: 'stt',
            key: 'stt',
            render: (_: unknown, __: T, index: number) => index + 1,
        },
        ...columns.map((col) => ({
            ...col,
            ...('dataIndex' in col
                ? {
                    ...getColumnSearchProps(col.dataIndex as keyof T),
                    render: col.render
                        ? (text: any, record: T, index: number) => col.render!(text, record, index)
                        : getColumnSearchProps(col.dataIndex as keyof T).render,
                }
                : {}),
        })),
    ];


    return (
        <Table<T>
            columns={enhancedColumns}
            dataSource={data}
            rowKey={rowKey as string}
            scroll={{ x: 'max-content' }}
            pagination={false}
        />
    );
};

export default DataGrid;