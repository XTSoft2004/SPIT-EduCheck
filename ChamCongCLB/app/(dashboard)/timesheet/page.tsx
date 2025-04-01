'use client'
import React, { useState, useEffect } from 'react';
import useSWR, { mutate } from 'swr';
import { Button, Space, Form } from 'antd';
import DataGrid from '@/components/ui/Table/DataGrid';

import { getTimesheets, updateTimesheet, createTimesheet } from '@/actions/timesheet.actions';
import { getStudents } from '@/actions/student.actions';
import { getClasses } from '@/actions/class.actions';

import { ITimesheet, ITimesheetUpdate, ITimesheetCreate } from '@/types/timesheet';
import { IStudent } from '@/types/student';
import { IClass } from '@/types/class';

import CustomModal from '@/components/Modal/CustomModal';
import FormTimesheet from './FormTimesheet';
import SpinLoading from '@/components/ui/Loading/SpinLoading';
import Searchbar from '@/components/ui/Table/Searchbar';
import { CirclePlus, CircleX } from 'lucide-react'
import { EditOutlined } from '@ant-design/icons';
import { title } from 'process';

export default function ClassPage() {
    const [students, setStudents] = useState<IStudent[]>([]);
    const [classes, setClasses] = useState<IClass[]>([]);

    useEffect(() => {
        const fetchData = async () => {
            const [studentsData, classesData] = await Promise.all([
                getStudents(),
                getClasses(),
            ]);
            setStudents(studentsData.data);
            setClasses(classesData.data);
        };

        fetchData();
    }, []);

    const columns = [
        {
            title: 'Danh sách sinh viên',
            dataIndex: 'studentsId',
            key: 'studentsId',
            filters: students.map((student) => ({
                text: student.lastName + ' ' + student.firstName,
                value: student.id,
            })),
            onFilter: (value: string, record: ITimesheet) => record.studentsId === Number(value),
        },
        {
            title: 'Lớp học',
            dataIndex: 'classId',
            key: 'classId',
            render: (studentsId: IStudent[]) => {
                studentsId.map((studentId) => {
                    const studentData = students.find((s) => s.id === studentId);
                    return (
                        <span key={studentData?.id}>
                            {studentData?.class}
                        </span>
                    );
                })
            }
        },
        {
            title: 'Thời gian',
            dataIndex: 'timeId',
            key: 'timeId',
            filters: [
                { text: 'Sáng', value: 1 },
                { text: 'Chiều', value: 2 },
                { text: 'Tối', value: 3 },
            ],
            onFilter: (value: string, record: ITimesheet) => record.timeId === Number(value),
        },
        {
            title: 'Ngày điểm danh',
            dataIndex: 'date',
            key: 'date',
        },
        {
            title: 'Trạng thái',
            dataIndex: 'status',
            key: 'status'
        },
        {
            title: 'Hình ảnh điểm danh',
            dataIndex: 'image_Check',
            key: 'image_Check',
        },
        {
            title: 'Chú thích',
            dataIndex: 'note',
            key: 'note',
        },
        {
            title: 'Thao tác',
            key: 'action',
            render: (_: unknown, record: ITimesheet) => (
                <Space>
                    <Button type="primary" icon={<EditOutlined />} onClick={() => handleEdit(record)}>Sửa</Button>
                </Space>
            ),
        }
    ];

    const [pageIndex, setPageIndex] = useState(1);
    const [pageSize, setPageSize] = useState(6);
    const [selectedCourse, setSelectedCourse] = useState<ITimesheet | null>(null);

    const [searchText, setSearchText] = useState('');

    const handleSearch = (value: string) => {
        setSearchText(value);
        setPageIndex(1)
    };

    const { data, isLoading } = useSWR(
        ['timesheets', searchText, pageIndex, pageSize],
        ([, search, page, limit]) => getTimesheets(search, page, limit),
        { revalidateOnFocus: false }
    );

    const timesheets = data?.data || [];
    const totaltimesheets = data?.total || 0;

    const [isModalOpen, setIsModalOpen] = useState(false);
    const [isModalCreate, setIsModalCreate] = useState(false);
    const [form] = Form.useForm();

    const handleEdit = (formData: ITimesheet) => {
        form.setFieldsValue({
            studentsId: formData.studentsId,
            classId: formData.classId,
            timeId: formData.timeId,
            date: formData.date,
            image_Check: formData.image_Check,
            status: formData.status,
            note: formData.note || '',
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
            const formUpdate: ITimesheetUpdate = {
                id: selectedCourse?.id || 0,
                studentsId: values.studentsId,
                classId: values.classId,
                timeId: values.timeId,
                date: values.date,
                image_Check: values.image_Check,
                status: values.status,
                note: values.note || '',
            };

            const response = await updateTimesheet(formUpdate);
            if (response.ok) {
                setIsModalOpen(false);
                form.resetFields();
                setSelectedCourse(null);

                mutate(['timesheets', searchText, pageIndex, pageSize]);
            }
        }
        catch (error) {
            console.error('Error updating timesheet:', error);
        }
    }

    const handleCreate = async () => {
        try {
            const values = await form.getFieldsValue();
            const formCreate: ITimesheetCreate = {
                studentsId: values.studentsId,
                classId: values.classId,
                timeId: values.timeId,
                date: values.date,
                image_Check: values.image_Check,
                status: values.status,
                note: values.note || '',
            };

            const response = await createTimesheet(formCreate);
            if (response.ok) {
                setIsModalOpen(false);
                form.resetFields();
                setSelectedCourse(null);

                mutate(['timesheets', searchText, pageIndex, pageSize]);
            }
        }
        catch (error) {
            console.error('Error creating timesheet:', error);
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
                    Thêm điểm danh
                </Button>

                <Searchbar setSearchText={handleSearch} />
            </div>

            {isLoading ? <SpinLoading /> : (
                <>
                    <DataGrid<ITimesheet>
                        rowKey="id"
                        data={timesheets}
                        columns={columns}
                        pageIndex={pageIndex}
                        pageSize={pageSize}
                        totalRecords={totaltimesheets}
                        setPageIndex={setPageIndex}
                        setPageSize={setPageSize} />
                </>
            )}

            <CustomModal
                isOpen={isModalCreate}
                onClose={handleClose}
                title="Thêm thông tin điểm danh"
                footer={
                    <Space>
                        <Button type="primary" onClick={handleCreate}>
                            <CirclePlus size={20} />Thêm điểm danh
                        </Button>
                        <Button type="default" onClick={handleClose}>
                            <CircleX size={20} />Đóng</Button>
                    </Space>
                }>
                <FormTimesheet form={form} />
            </CustomModal>

            <CustomModal
                isOpen={isModalOpen}
                onClose={handleClose}
                title="Chỉnh sửa thông tin điểm danh"
                footer={
                    <Space>
                        <Button type="primary" onClick={() => selectedCourse && handleUpdate()}>Cập nhật</Button>
                        <Button type="default" onClick={handleClose}>Đóng</Button>
                    </Space>
                }>
                <FormTimesheet form={form} />
            </CustomModal>
        </>
    )
}