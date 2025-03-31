'use client'
import React, { useState, useEffect } from 'react';
import useSWR, { mutate } from 'swr';
import { Button, Space, Form } from 'antd';
import DataGrid from '@/components/ui/Table/DataGrid';

import { IClass, IClassCreate, IClassUpdate } from '@/types/class';
import { ICourse } from '@/types/course';
import { IStudent } from '@/types/student';
import { ILecturer } from '@/types/lecturer';

import { createClass, getClasses, updateClass } from '@/actions/class.actions';
import { getAllCourses } from '@/actions/course.actions';
import { getAllStudents } from '@/actions/student.actions';
import { getAllLecturers } from '@/actions/lecturer.actions';

import CustomModal from '@/components/Modal/CustomModal';
import FormClass from './FormClass';
import SpinLoading from '@/components/ui/Loading/SpinLoading';
import Searchbar from '@/components/ui/Table/Searchbar';
import { CirclePlus, CircleX } from 'lucide-react'
import { EditOutlined } from '@ant-design/icons';

export default function ClassPage() {
    const [courses, setCourses] = useState<ICourse[]>([]);
    const [students, setStudents] = useState<IStudent[]>([]);
    const [lecturers, setLecturers] = useState<ILecturer[]>([]);

    useEffect(() => {
        const fetchData = async () => {
            const [studentsRes, lecturersRes, coursesRes] = await Promise.all([
                getAllStudents(),
                getAllLecturers(),
                getAllCourses(),
            ]);

            if (studentsRes.ok) setStudents(studentsRes.data);
            if (lecturersRes.ok) setLecturers(lecturersRes.data);
            if (coursesRes.ok) setCourses(coursesRes.data);
        };

        fetchData();
    }, []);

    const columns = [
        // {
        //     title: 'ID',
        //     dataIndex: 'id',
        //     key: 'id',
        // },
        {
            title: 'Mã lớp',
            dataIndex: 'code',
            key: 'code',
        },
        {
            title: 'Tên lớp',
            dataIndex: 'name',
            key: 'name',
        },
        {
            title: 'Buổi',
            dataIndex: 'day',
            key: 'day',
            render: (value: number) => {
                return 'Thứ ' + value;
            },
        },
        {
            title: 'Thời gian bắt đầu',
            dataIndex: 'timeStart',
            key: 'timeStart',
        },
        {
            title: 'Thời gian kết thúc',
            dataIndex: 'timeEnd',
            key: 'timeEnd',
        },
        {
            title: 'Giảng viên',
            dataIndex: 'lecturerId',
            key: 'lecturerId',
            render: (value: number) => {
                const lecturer = lecturers.find(lecturer => lecturer.id === value);
                return lecturer ? `${lecturer.fullName}` : 'N/A';
            }
        },
        {
            title: 'Khóa học',
            dataIndex: 'courseId',
            key: 'courseId',
            render: (value: number) => {
                const course = courses.find(course => course.id === value);
                return course ? `${course.name}` : 'N/A';
            }
        },
        {
            title: 'Thao tác',
            key: 'action',
            render: (_: unknown, record: IClass) => (
                <Space>
                    <Button type="primary" icon={<EditOutlined />} onClick={() => handleEdit(record)}>Sửa</Button>
                </Space>
            ),
        }
    ];

    const [pageIndex, setPageIndex] = useState(1);
    const [pageSize, setPageSize] = useState(5);
    const [selectedClass, setSelectedClass] = useState<IClass | null>(null);

    const [searchText, setSearchText] = useState('');

    const handleSearch = (value: string) => {
        setSearchText(value);
        setPageIndex(1)
    };

    const { data, isLoading } = useSWR(
        ['classes', searchText, pageIndex, pageSize],
        ([, search, page, limit]) => getClasses(search, page, limit),
        { revalidateOnFocus: false }
    );

    const classes = data?.data || [];
    const totalClasses = data?.total || 0;

    const [isModalOpen, setIsModalOpen] = useState(false);
    const [isModalCreate, setIsModalCreate] = useState(false);
    const [form] = Form.useForm();

    const handleEdit = (formData: IClass) => {
        form.setFieldsValue({
            code: formData.code,
            name: formData.name,
            day: formData.day,
            timeStart: formData.timeStart,
            timeEnd: formData.timeEnd,
            lecturerId: formData.lecturerId,
            courseId: formData.courseId,
            studentsId: formData.studentsId,
        });
        setIsModalOpen(true);
        setSelectedClass(formData);
    };

    const handleClose = () => {
        setIsModalOpen(false);
        setIsModalCreate(false);
        form.resetFields();
    }

    const handleUpdate = async (formData: IClass) => {
        try {
            const values = await form.getFieldsValue();
            const formUpdate: IClassUpdate = {
                id: selectedClass?.id || 0,
                code: values.code,
                name: values.name,
                day: values.day,
                timeStart: values.timeStart,
                timeEnd: values.timeEnd,
                lecturerId: values.lecturerId,
                courseId: values.courseId,
                studentsId: selectedClass?.studentsId || [],
            };

            const response = await updateClass(formUpdate);
            if (response.ok) {
                setIsModalOpen
                form.resetFields();
                setSelectedClass(null);

                mutate(['classes', pageIndex, pageSize]);
            }
        }
        catch (error) {
            console.error('Error updating class:', error);
        }
    }

    const handleCreate = async () => {
        try {
            const values = await form.getFieldsValue();
            const formCreate: IClassCreate = {
                id: 0,
                code: values.code,
                name: values.name,
                day: values.day,
                timeStart: values.timeStart,
                timeEnd: values.timeEnd,
                lecturerId: values.lecturerId,
                courseId: values.courseId,
                studentsId: values.studentsId,
            };

            const response = await createClass(formCreate);
            if (response.ok) {
                setIsModalOpen(false);
                form.resetFields();
                setSelectedClass(null);

                mutate(['classes', pageIndex, pageSize]);
            }
        }
        catch (error) {
            console.error('Error creating class:', error);
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
                    Thêm lớp
                </Button>

                <Searchbar setSearchText={handleSearch} />
            </div>

            {isLoading ? <SpinLoading /> : (
                <>
                    <DataGrid<IClass>
                        rowKey="id"
                        data={classes}
                        columns={columns}
                        pageIndex={pageIndex}
                        pageSize={pageSize}
                        totalRecords={totalClasses}
                        setPageIndex={setPageIndex}
                        setPageSize={setPageSize} />
                </>
            )}

            <CustomModal
                isOpen={isModalCreate}
                onClose={handleClose}
                title="Thêm thông tin lớp"
                footer={
                    <Space>
                        <Button type="primary" onClick={handleCreate}>
                            <CirclePlus size={20} />Thêm lớp
                        </Button>
                        <Button type="default" onClick={handleClose}>
                            <CircleX size={20} />Đóng</Button>
                    </Space>
                }>
                <FormClass form={form} students={students} lecturers={lecturers} courses={courses} />
            </CustomModal>

            <CustomModal
                isOpen={isModalOpen}
                onClose={handleClose}
                title="Chỉnh sửa thông tin lớp"
                footer={
                    <Space>
                        <Button type="primary" onClick={() => selectedClass && handleUpdate(selectedClass)}>Cập nhật</Button>
                        <Button type="default" onClick={handleClose}>Đóng</Button>
                    </Space>
                }>
                <FormClass form={form} students={students} lecturers={lecturers} courses={courses} />
            </CustomModal>
        </>
    )
}