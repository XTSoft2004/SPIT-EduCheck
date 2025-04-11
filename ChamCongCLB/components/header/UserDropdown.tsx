'use client'
import { useEffect, useState } from 'react';
import { logout } from '@/actions/auth.actions';
import Dropdown from 'antd/es/dropdown/dropdown';
import { Avatar, Space } from 'antd';
import { Menu } from 'antd';
import {
  UserOutlined,
  SettingOutlined,
  LogoutOutlined,
  LockOutlined,
} from '@ant-design/icons';

import { getMe } from '@/actions/user.actions'

import { IUser } from '@/types/user';
import { useRouter } from 'next/navigation'


export default function UserDropdown() {
  const [user, setUser] = useState<IUser | null>(null)
  const router = useRouter()

  const handleLogout = async () => {
    await logout()
    router.push('/')
  }

  const handleChangePassword = async () => {
    router.push('/change-password')
  }


  useEffect(() => {
    const fetchUser = async () => {
      const user = await getMe()
      setUser(user.data)
    }
    fetchUser()
  }, [])

  // Menu Dropdown
  const menu = (
    <Menu className='pt-5'>
      {user?.studentName !== "" ?
        <>
          <Menu.Item
            key="profile"
            icon={<UserOutlined />}
          >
            <span className='font-bold'>{user?.studentName}</span> {/* username */}
          </Menu.Item>
          <Menu.Divider />
        </>
        : undefined}

      {/* <Menu.Item key="profile" icon={<UserOutlined />}>
      Trang cá nhân
    </Menu.Item> */}

      <Menu.Item key="settings" icon={<SettingOutlined />}>
        Cài đặt
      </Menu.Item>
      <Menu.Item key="change-password" icon={<LockOutlined />} onClick={handleChangePassword}>
        Đổi mật khẩu
      </Menu.Item>
      <Menu.Item key="logout" icon={<LogoutOutlined />} onClick={handleLogout} danger>
        Đăng xuất
      </Menu.Item>
    </Menu>
  );

  return (
    <Dropdown overlay={menu} placement="bottomRight">
      <Space className="cursor-pointer">
        <div className='mr-5 flex items-center'>
          <Avatar className='mr-2' size="large" icon={<UserOutlined />} />
          <span className='sm:block hidden font-bold'>{user?.username?.toUpperCase()}</span> {/* fullName */}
        </div>
        {/* <span className="dark:text-white">Admin</span> */}
      </Space>
    </Dropdown>
  )
}
