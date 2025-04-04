'use client'

import { Form, Input, Button, message, Card } from 'antd'
import { useState } from 'react'
import { changePassword } from '@/actions/user.actions'
import { IUserUpdate } from '@/types/user'
import { useRouter } from 'next/navigation'

export default function ChangePasswordPage() {
    const [form] = Form.useForm<IUserUpdate>()
    const [loading, setLoading] = useState(false)
    const router = useRouter()

    const onFinish = async (values: IUserUpdate) => {
        setLoading(true)
        try {
            const res = await changePassword(values)

            if (res.ok) {
                message.success(res.message)
                router.push('/');
            } else {
                message.error(res.message)
            }
        } catch (err) {
            message.error('Có lỗi xảy ra.')
        } finally {
            form.resetFields()
            setLoading(false)
        }
    }

    return (
        <div className="flex justify-center items-center transition-colors mt-10">
            <Card className="w-full max-w-md shadow-lg rounded-2xl p-6">
                <h2 className="text-2xl font-semibold text-center mb-6 text-gray-900 dark:text-white">
                    Đổi mật khẩu
                </h2>
                <Form
                    form={form}
                    layout="vertical"
                    onFinish={onFinish}
                    requiredMark={false}
                    onFieldsChange={() => {
                        const fieldsError = form.getFieldsError();
                        const hasError = fieldsError.some(field => field.errors.length > 0);
                        setLoading(hasError);
                    }}
                >
                    <Form.Item
                        label={<span className="text-gray-800 dark:text-gray-200">Mật khẩu cũ</span>}
                        name="oldPassword"
                        rules={[
                            { required: true, message: 'Vui lòng nhập mật khẩu cũ' },
                            { min: 7, message: 'Mật khẩu phải có ít nhất 7 ký tự' },
                        ]}
                    >
                        <Input.Password placeholder="Nhập mật khẩu cũ" />
                    </Form.Item>

                    <Form.Item
                        label={<span className="text-gray-800 dark:text-gray-200">Mật khẩu mới</span>}
                        name="password"
                        rules={[
                            { required: true, message: 'Vui lòng nhập mật khẩu mới' },
                            { min: 7, message: 'Mật khẩu phải có ít nhất 7 ký tự' },
                        ]}
                    >
                        <Input.Password placeholder="Nhập mật khẩu mới" />
                    </Form.Item>

                    <Form.Item
                        label={<span className="text-gray-800 dark:text-gray-200">Xác nhận mật khẩu mới</span>}
                        name="confirmPassword"
                        dependencies={['password']}
                        rules={[
                            { required: true, message: 'Vui lòng xác nhận mật khẩu mới' },
                            { min: 7, message: 'Mật khẩu phải có ít nhất 7 ký tự' },
                            ({ getFieldValue }) => ({
                                validator(_, value) {
                                    if (!value || getFieldValue('password') === value) {
                                        return Promise.resolve()
                                    }
                                    return Promise.reject('Mật khẩu xác nhận không khớp')
                                },
                            }),
                        ]}
                    >
                        <Input.Password placeholder="Xác nhận mật khẩu mới" />
                    </Form.Item>

                    <Form.Item>
                        <Button
                            type="primary"
                            htmlType="submit"
                            disabled={loading}
                            className="w-full"
                        >
                            Đổi mật khẩu
                        </Button>
                    </Form.Item>
                </Form>
            </Card>
        </div>
    )
}
