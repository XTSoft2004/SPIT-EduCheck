import React from 'react';
import { Form, Input } from "antd";
import { FormInstance } from "antd/es/form";

interface FormSemesterProps {
    form: FormInstance;
}

export default function FormSemester({ form }: FormSemesterProps) {
    return (
        <Form
            form={form}
            layout="vertical"
        >
            <Form.Item
                label="Học kỳ"
                name="semesters_Number"
                rules={[
                    { required: true, message: 'Vui lòng nhập học kỳ!' },
                    { pattern: /^[1-3]{1}$/, message: 'Học kì không hợp lệ!' },
                ]}
            >
                <Input placeholder="VD: 1" />
            </Form.Item>
            <Form.Item
                label="Năm bắt đầu"
                name="yearStart"
                rules={[
                    { required: true, message: 'Vui lòng nhập năm bắt đầu!' },
                    { pattern: /^(19|20)\d{2}$/, message: 'Năm bắt đầu không hợp lệ!' }
                ]}
            >
                <Input placeholder="VD: 2024" />
            </Form.Item>
            <Form.Item
                label="Năm kết thúc"
                name="yearEnd"
                rules={[
                    { required: true, message: 'Vui lòng nhập năm kết thúc!' },
                    { pattern: /^(19|20)\d{2}$/, message: 'Năm kết thúc không hợp lệ!' },
                    ({ getFieldValue }) => ({
                        validator(_, value) {
                            const yearStart = getFieldValue('yearStart');
                            if (!value || !yearStart || yearStart < value) {
                                return Promise.resolve();
                            }
                            return Promise.reject(new Error('Năm kết thúc phải lớn hơn năm bắt đầu!'));
                        },
                    }),
                ]}
            >
                <Input placeholder="VD: 2025" />
            </Form.Item>
        </Form >
    );
}
