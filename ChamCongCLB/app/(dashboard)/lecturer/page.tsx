'use client'
import React, { useState } from 'react';
import useSWR, { mutate } from 'swr';
import { Button, Space, Form, message } from 'antd';
import DataGrid from '@/components/ui/Table/DataGrid';

import { ILecturer, ILecturerCreate, ILecturerUpdate } from '@/types/lecturer';

import { updateLecturer, createLecturer, getLecturers } from '@/actions/lecturer.actions';

import CustomModal from '@/components/Modal/CustomModal';
import FormLecturer from './FormLecturer';
import SpinLoading from '@/components/ui/Loading/SpinLoading';
import Searchbar from '@/components/ui/Table/Searchbar';
import { CirclePlus, CircleX } from 'lucide-react'
import { EditOutlined } from '@ant-design/icons';
import { Role, useAuth } from '@/context/AuthContext';
import { ButtonAddTable } from '@/components/ui/Button/ButtonAddTable';

export default function LecturerPage() {
    const { role } = useAuth();
    const columns = [
        {
            title: 'Tên giảng viên',
            dataIndex: 'fullName',
            key: 'fullName',
        },
        {
            title: 'Email',
            dataIndex: 'email',
            key: 'email',
            render: (text: string) => (
                <span>{text || 'Chưa cập nhật'}</span>
            ),
        },
        {
            title: 'Số điện thoại',
            dataIndex: 'phoneNumber',
            key: 'phoneNumber',
            render: (text: string) => (
                <span>{text || 'Chưa cập nhật'}</span>
            ),
        },
        ...(role === Role.ADMIN ? [
            {
                title: 'Hành động',
                key: 'action',
                render: (_: unknown, record: ILecturer) => (
                    <Space>
                        <Button type="primary" icon={<EditOutlined />} onClick={() => handleEdit(record)}>Sửa</Button>
                    </Space>
                ),
            }
        ] : [])
    ];

    const [pageIndex, setPageIndex] = useState(1);
    const [pageSize, setPageSize] = useState(6);
    const [selectedCourse, setSelectedCourse] = useState<ILecturer | null>(null);

    const [searchText, setSearchText] = useState('');

    const handleSearch = (value: string) => {
        setSearchText(value);
        setPageIndex(1)
    };

    const { data, isLoading } = useSWR(
        ['lecturers', searchText, pageIndex, pageSize],
        ([, search, page, limit]) => getLecturers(search, page, limit),
        { revalidateOnFocus: false }
    );

    const lecturers = data?.data || [];
    const totalCourses = data?.total || 0;

    const [isModalOpen, setIsModalOpen] = useState(false);
    const [isModalCreate, setIsModalCreate] = useState(false);
    const [form] = Form.useForm();

    const handleEdit = (formData: ILecturer) => {
        form.setFieldsValue({
            fullName: formData.fullName,
            email: formData.email,
            phoneNumber: formData.phoneNumber,
        });
        setIsModalOpen(true);
        setSelectedCourse(formData);
    };

    const handleClose = () => {
        setIsModalOpen(false);
        setIsModalCreate(false);
        form.resetFields();
    }

    const handleUpdate = async () => {
        try {
            const values = await form.getFieldsValue();
            const formUpdate: ILecturerUpdate = {
                id: selectedCourse?.id || 0,
                fullName: values.fullName,
                email: values.email ?? '',
                phoneNumber: values.phoneNumber ?? '',
            };

            const response = await updateLecturer(formUpdate);
            if (response.ok) {
                handleClose();
                setSelectedCourse(null);

                mutate(['lecturers', searchText, pageIndex, pageSize]);
                message.success('Cập nhật giảng viên thành công');
            }
        }
        catch (error) {
            console.error('Error updating course:', error);
        }
    }

    const handleCreate = async () => {
        try {
            const values = await form.getFieldsValue();
            const formCreate: ILecturerCreate = {
                fullName: values.fullName,
                email: values.email ?? '',
                phoneNumber: values.phoneNumber ?? '',
            };

            const response = await createLecturer(formCreate);
            if (response.ok) {
                handleClose();
                setSelectedCourse(null);

                mutate(['lecturers', searchText, pageIndex, pageSize]);
                message.success('Thêm giảng viên thành công');
            }
        }
        catch (error) {
            console.error('Error creating course:', error);
        }
    }

    return (
        <>
            <div className="flex flex-col md:flex-row justify-between items-stretch gap-2 mb-2">
                <ButtonAddTable
                    btnText="Thêm giảng viên"
                    role={role}
                    onClick={() => setIsModalCreate(true)}
                />
                <div className="flex justify-end w-full">
                    <Searchbar setSearchText={handleSearch} />
                </div>
            </div>

            {isLoading ? <SpinLoading /> : (
                <>
                    <DataGrid<ILecturer>
                        rowKey="id"
                        data={lecturers}
                        columns={columns}
                        pageIndex={pageIndex}
                        pageSize={pageSize}
                        totalRecords={totalCourses}
                        setPageIndex={setPageIndex}
                        setPageSize={setPageSize} />
                </>
            )}

            <CustomModal
                isOpen={isModalCreate}
                onClose={handleClose}
                title="Thêm thông tin giảng viên"
                footer={
                    <Space>
                        <Button type="primary" onClick={handleCreate}>
                            <CirclePlus size={20} />Thêm giảng viên
                        </Button>
                        <Button type="default" onClick={handleClose}>
                            <CircleX size={20} />Đóng</Button>
                    </Space>
                }>
                <FormLecturer form={form} />
            </CustomModal>

            <CustomModal
                isOpen={isModalOpen}
                onClose={handleClose}
                title="Chỉnh sửa thông tin giảng viên"
                footer={
                    <Space>
                        <Button type="primary" onClick={() => selectedCourse && handleUpdate()}>Cập nhật</Button>
                        <Button type="default" onClick={handleClose}>Đóng</Button>
                    </Space>
                }>
                <FormLecturer form={form} />
            </CustomModal>
        </>
    )
}