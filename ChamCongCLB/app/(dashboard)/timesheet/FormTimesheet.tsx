import React from 'react';
import { Form, Input, Select } from "antd";
import { FormInstance } from "antd/es/form";

import { IClass } from '@/types/class';
import { IStudent } from '@/types/student';

const { Option } = Select;

interface FormClassProps {
    form: FormInstance;
}

export default function FormClass({ form }: FormClassProps) {
    return (
        <Form
            form={form}
            layout="vertical"
        >

        </Form>
    );
}
