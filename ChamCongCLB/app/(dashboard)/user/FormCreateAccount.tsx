import { Form, Input, Select, DatePicker } from "antd";
import { FormInstance } from "antd/es/form";

const { Option } = Select;

interface FormUsertProps {
    form: FormInstance;
}

export default function FormCreateAccount({ form }: FormUsertProps) {
    return (
        <Form form={form} layout="vertical">
            <Form.Item
                label="Tên tài khoản"
                name="username"
                rules={[
                    { required: true, message: 'Vui lòng nhập tên tài khoản!' },
                    { min: 4, message: 'Mật khẩu phải có ít nhất 4 ký tự!' },
                ]}
            >
                <Input placeholder="VD: Admin" />
            </Form.Item><Form.Item
                label="Mật khẩu"
                name="password"
                rules={[
                    { required: true, message: 'Vui lòng nhập mật khẩu!' },
                    { min: 7, message: 'Mật khẩu phải có ít nhất 7 ký tự!' },
                ]}
            >
                <Input.Password placeholder="VD: ********" />
            </Form.Item>
        </Form>
    );
}
