import React from 'react';
import { Form, Input, Select } from "antd";
import { FormInstance } from "antd/es/form";

import { ISemester } from '@/types/semester';

const { Option } = Select;

interface FormClassProps {
    form: FormInstance;
    semesters: ISemester[];
}

export default function FormClass({ form, semesters }: FormClassProps) {
    return (
        <Form
            form={form}
            layout="vertical"
        >
            <Form.Item
                label="Mã học phần"
                name="code"
                rules={[{ required: true, message: 'Vui lòng nhập học phần!' }]}
            >
                <Input placeholder="VD: TIN1083" />
            </Form.Item>
            <Form.Item
                label="Tên học phần"
                name="name"
                rules={[{ required: true, message: 'Vui lòng nhập tên học phần!' }]}
            >
                <Input placeholder="VD: Kỹ thuật lập trình" />
            </Form.Item>
            <Form.Item
                label="Số tín chỉ"
                name="credits"
                rules={
                    [
                        { required: true, message: 'Vui lòng nhập số tín chỉ!' },
                        { pattern: /^[0-9]+$/, message: 'Số tín chỉ không hợp lệ!' },
                        { min: 1, max: 1, message: 'Số tín chỉ không hợp lệ!' },
                    ]}
            >
                <Input placeholder="VD: 3" />
            </Form.Item>
            <Form.Item
                label="Học kỳ"
                name="semesterId"
                rules={[{ required: true, message: 'Vui lòng chọn học kỳ!' }]}
            >
                <Select placeholder="Chọn học kỳ">
                    {semesters.map((semester) => (
                        <Option key={semester.id} value={semester.id}>
                            {/* {semester.yearStart} - {semester.yearEnd}.{semester.semesters_Number} */}
                            Học kỳ: {semester.semesters_Number} - Năm học: {semester.yearStart} - {semester.yearEnd}
                        </Option>
                    ))}
                </Select>
            </Form.Item>
        </Form>
    );
}
