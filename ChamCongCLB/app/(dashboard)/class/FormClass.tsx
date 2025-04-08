import React from 'react';
import { Form, Input, Select, TimePicker } from "antd";
import { FormInstance } from "antd/es/form";
import dayjs from 'dayjs';

import { IStudent } from '@/types/student';
import { ILecturer } from '@/types/lecturer';
import { ICourse } from '@/types/course';

const { Option } = Select;

interface FormClassProps {
    form: FormInstance;
    students: IStudent[];
    lecturers: ILecturer[];
    courses: ICourse[];
}

export default function FormClass({ form, students, lecturers, courses }: FormClassProps) {
    const times = [2, 3, 4, 5, 6, 7];

    return (
        <Form
            form={form}
            layout="vertical"
            initialValues={{
                timeStart: dayjs('08:00', 'HH:mm'), // Giá trị mặc định
                timeEnd: dayjs('10:00', 'HH:mm')
            }}
        >
            <Form.Item
                label="Mã lớp"
                name="code"
                rules={[{ required: true, message: 'Vui lòng nhập mã lớp!' }]}
            >
                <Input placeholder="VD: 2024-2025.2.TIN1083.001" />
            </Form.Item>
            <Form.Item
                label="Tên lớp"
                name="name"
                rules={[{ required: true, message: 'Vui lòng nhập tên lớp!' }]}
            >
                <Input placeholder="VD: Kỹ thuật lập trình - Nhóm 1" />
            </Form.Item>
            <Form.Item
                label="Buổi học"
                name="day"
                rules={[{ required: true, message: 'Vui lòng nhập buổi!' }]}
            >
                <Select placeholder="Chọn buổi">
                    {times.map((time) => (
                        <Option key={time} value={time}>
                            Thứ {time}
                        </Option>
                    ))}
                </Select>
            </Form.Item>
            <Form.Item
                label="Thời gian bắt đầu"
                name="timeStart"
                rules={[{ required: true, message: 'Vui lòng nhập thời gian bắt đầu!' }]}
                getValueProps={(value) => ({ value: value ? dayjs(value, 'HH:mm') : null })}
            >
                <TimePicker format="HH:mm" />
            </Form.Item>
            <Form.Item
                label="Thời gian kết thúc"
                name="timeEnd"
                rules={[{ required: true, message: 'Vui lòng nhập thời gian kết thúc!' }]}
                getValueProps={(value) => ({ value: value ? dayjs(value, 'HH:mm') : null })}
            >
                <TimePicker format="HH:mm" />
            </Form.Item>
            <Form.Item
                label="Giảng viên"
                name="lecturersId"
                rules={[{ required: true, message: 'Vui lòng chọn giảng viên!' }]}
            >
                <Select placeholder="Chọn giảng viên" mode="multiple">
                    {lecturers.map(lecturer => (
                        <Option key={lecturer.id} value={lecturer.id}>
                            {lecturer.fullName}
                        </Option>
                    ))}
                </Select>
            </Form.Item>
            <Form.Item
                label="Khóa học"
                name="courseId"
                rules={[{ required: true, message: 'Vui lòng chọn khóa học!' }]}
            >
                <Select placeholder="Chọn khóa học">
                    {courses.map(course => (
                        <Option key={course.id} value={course.id}>
                            {course.name} - {course.code}
                        </Option>
                    ))}
                </Select>
            </Form.Item>
            <Form.Item label="Sinh viên" name="studentsId">
                <Select
                    showSearch
                    allowClear
                    mode="multiple"
                    placeholder="Chọn sinh viên"
                    optionFilterProp="label"
                >
                    {students.map(student => (
                        <Option
                            key={student.id}
                            value={student.id}
                            label={`${student.lastName} ${student.firstName} (${student.maSinhVien})`}
                        >
                            {student.lastName} {student.firstName} ({student.maSinhVien?.toUpperCase()})
                        </Option>
                    ))}
                </Select>
            </Form.Item>
        </Form>
    );
}
