'use client'
import React, { useState, useEffect, useRef } from 'react';
import DataGrid from '@/components/ui/Table/DataGrid';
import { getStudents } from '@/actions/student.actions';
import { IStudent } from '@/types/student';

const columns = [
    {
        title: 'ID',
        dataIndex: 'id',
        key: 'id',
    },
    {
        title: 'Mã sinh viên',
        dataIndex: 'maSinhVien',
        key: 'maSinhVien',
    },
    {
        title: 'Họ',
        dataIndex: 'lastName',
        key: 'lastName',
    },
    {
        title: 'Tên',
        dataIndex: 'firstName',
        key: 'firstName',
    },
    {
        title: 'Lớp',
        dataIndex: 'class',
        key: 'class',
    },
    {
        title: 'Số điện thoại',
        dataIndex: 'phoneNumber',
        key: 'phoneNumber',
    },
    {
        title: 'Email',
        dataIndex: 'email',
        key: 'email',
    },
    {
        title: 'Giới tính',
        dataIndex: 'gender',
        key: 'gender',
        render: (value: boolean) => (value ? 'Nam' : 'Nữ'),
    },
    {
        title: 'Ngày sinh',
        dataIndex: 'dob',
        key: 'dob',
        render: (value: Date) => new Date(value).toLocaleDateString('vi-VN'),
    }
];


export default function UserPage() {
    const [student, setStudent] = useState<IStudent[]>([]);

    useEffect(() => {
        fetchUsers();
    }, []);

    const fetchUsers = async () => {
        const response = await getStudents();
        if (response.ok) {
            setStudent(response.data);
        }
    };

    return (
        <>
            <DataGrid<IStudent> data={student} columns={columns} rowKey="id" />
        </>
    )
}