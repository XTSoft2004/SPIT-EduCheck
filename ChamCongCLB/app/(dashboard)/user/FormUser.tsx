import { Form, Input, Select, DatePicker } from "antd";
import { FormInstance } from "antd/es/form";

const { Option } = Select;

interface FormUsertProps {
    form: FormInstance;
}

export default function FormUser({ form }: FormUsertProps) {
    return (
        <Form form={form} layout="vertical">
            <Form.Item
                label="Mật khẩu"
                name="passwordNew"
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
