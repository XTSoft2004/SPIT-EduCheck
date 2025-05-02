'use client'
import React, { useEffect, useState } from 'react'
import { LoadingOutlined, PlusOutlined } from '@ant-design/icons'
import { Button, Form, Input, message, Upload } from 'antd'
import type { GetProp, UploadProps } from 'antd'

import { IUser, IUserUpdate } from '@/types/user'
import { changePassword, getMe } from '@/actions/user.actions'

type FileType = Parameters<GetProp<UploadProps, 'beforeUpload'>>[0]

const getBase64 = (img: FileType, callback: (url: string) => void) => {
  const reader = new FileReader()
  reader.addEventListener('load', () => callback(reader.result as string))
  reader.readAsDataURL(img)
}

const beforeUpload = (file: FileType) => {
  const isJpgOrPng = file.type === 'image/jpeg' || file.type === 'image/png'
  if (!isJpgOrPng) {
    message.error('Bạn chỉ có thể tải lên ảnh!')
  }
  const isLt2M = file.size / 1024 / 1024 < 2
  if (!isLt2M) {
    message.error('Kích thước ảnh không quá 2MB!')
  }
  return isJpgOrPng && isLt2M
}

export default function ProfilePage() {
  const [loading, setLoading] = useState(false)
  const [imageUrl, setImageUrl] = useState<string>()
  const [profile, setProfile] = useState<IUser>()
  const [form] = Form.useForm()

  useEffect(() => {
    const fetchProfile = async () => {
      const response = await getMe()
      if (response.ok) setProfile(response.data)
    }
    fetchProfile()
  }, [])

  const handleChange: UploadProps['onChange'] = (info) => {
    if (info.file.status === 'uploading') {
      setLoading(true)
      return
    }
    if (info.file.status === 'done') {
      // Get this url from response in real world.
      getBase64(info.file.originFileObj as FileType, (url) => {
        setLoading(false)
        setImageUrl(url)
      })
    }
  }

  const handleUpdate = async () => {
    try {
      const values = await form.validateFields()
      const formUpdate: IUserUpdate = {
        oldPassword: values.oldPassword,
        password: values.password,
        confirmPassword: values.confirmPassword,
      }
      const response = await changePassword(formUpdate)
      if (response.ok) {
        message.success('Cập nhật mật khẩu thành công!')
        form.resetFields()
      }
    } catch (error) {
      console.error('Failed to update password:', error)
    }
  }

  const uploadButton = (
    <button style={{ border: 0, background: 'none' }} type="button">
      {loading ? <LoadingOutlined /> : <PlusOutlined />}
      <div style={{ marginTop: 8 }}>Upload</div>
    </button>
  )

  return (
    <div className="flex flex-col justify-center items-center">
      <Upload
        name="avatar"
        listType="picture-circle"
        className="avatar-uploader"
        showUploadList={false}
        action="https://660d2bd96ddfa2943b33731c.mockapi.io/api/upload"
        beforeUpload={beforeUpload}
        onChange={handleChange}
      >
        {imageUrl ? (
          <img src={imageUrl} alt="avatar" style={{ width: '100%' }} />
        ) : (
          uploadButton
        )}
      </Upload>

    <div
      className={`mt-1 w-20 px-4 py-2 rounded-full text-center text-white opacity-80 ${
        profile?.roleName === 'Admin'
          ? 'bg-red-500 dark:bg-red-700'
          : 'bg-green-500 dark:bg-green-700'
      }`}
    >
      {profile?.roleName}
    </div>

      <Form className="w-full max-w-sm" layout="vertical">
        <Form.Item label="Mã sinh viên" name="username">
          <Input
            placeholder={profile?.username}
            readOnly
            className="uppercase"
          />
        </Form.Item>
        <Form.Item label="Họ và tên" name="studentName">
          <Input placeholder={profile?.studentName} />
        </Form.Item>
        <Form.Item className="flex justify-center">
          <Button
            type="primary"
            onClick={handleUpdate}
            className="bg-blue-500 text-white py-2 px-4 rounded hover:bg-blue-600 transition duration-300"
          >
            Cập nhật
          </Button>
        </Form.Item>
      </Form>
    </div>
  )
}
