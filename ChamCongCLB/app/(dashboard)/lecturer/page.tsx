'use client'
import React, { useState } from 'react';
import useSWR, { mutate } from 'swr';
import { Button, Space, Form } from 'antd';
import DataGrid from '@/components/ui/Table/DataGrid';

import { ILecturer, ILecturerCreate, ILecturerUpdate } from '@/types/lecturer';

import { updateLecturer, createLecturer, getLecturers } from '@/actions/lecturer.actions';

import CustomModal from '@/components/Modal/CustomModal';
import FormLecturer from './FormLecturer';
import SpinLoading from '@/components/ui/Loading/SpinLoading';
import Searchbar from '@/components/ui/Table/Searchbar';
import { CirclePlus, CircleX } from 'lucide-react'
import { EditOutlined } from '@ant-design/icons';

export default function ClassPage() {
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
        },
        {
            title: 'Số điện thoại',
            dataIndex: 'phoneNumber',
            key: 'phoneNumber',
        },
        {
            title: 'Thao tác',
            key: 'action',
            render: (_: unknown, record: ILecturer) => (
                <Space>
                    <Button type="primary" icon={<EditOutlined />} onClick={() => handleEdit(record)}>Sửa</Button>
                </Space>
            ),
        }
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
                email: values.email,
                phoneNumber: values.phoneNumber,
            };

            const response = await updateLecturer(formUpdate);
            if (response.ok) {
                setIsModalOpen(false);
                form.resetFields();
                setSelectedCourse(null);

                mutate(['lecturers', searchText, pageIndex, pageSize]);
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
                email: values.email,
                phoneNumber: values.phoneNumber,
            };

            const response = await createLecturer(formCreate);
            if (response.ok) {
                setIsModalOpen(false);
                form.resetFields();
                setSelectedCourse(null);

                mutate(['lecturers', searchText, pageIndex, pageSize]);
            }
        }
        catch (error) {
            console.error('Error creating course:', error);
        }
    }

    return (
        <>
            <div className="flex flex-col md:flex-row justify-between items-stretch gap-2 mb-2">
                <Button
                    className="w-full md:w-auto flex items-center gap-2"
                    onClick={() => setIsModalCreate(true)}
                >
                    <CirclePlus size={20} />
                    Thêm giảng viên
                </Button>

                <Searchbar setSearchText={handleSearch} />
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