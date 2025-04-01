'use client'
import { logout } from '@/actions/auth.actions';
import Dropdown from 'antd/es/dropdown/dropdown';
import { Avatar, Space } from 'antd';
import { Button, Layout, Menu, theme } from 'antd';
import {
  UserOutlined,
  SettingOutlined,
  LogoutOutlined,
} from '@ant-design/icons';

const handleLogout = async () => {
  await logout()
  window.location.href = '/login'
}

// Menu Dropdown
const menu = (
  <Menu className='pt-5'>
    <Menu.Item key="profile" icon={<UserOutlined />}>
      <span className='font-bold'>Trần Xuân Trường</span>
    </Menu.Item>


    {/* <Menu.Item key="profile" icon={<UserOutlined />}>
      Trang cá nhân
    </Menu.Item> */}
    <Menu.Divider />
    <Menu.Item key="settings" icon={<SettingOutlined />}>
      Cài đặt
    </Menu.Item>
    <Menu.Item key="logout" icon={<LogoutOutlined />} onClick={handleLogout} danger>
      Đăng xuất
    </Menu.Item>
  </Menu>
);

export default function UserDropdown() {
  return (
    <Dropdown overlay={menu} placement="bottomRight">
      <Space className="cursor-pointer">
        <div className='mr-5 flex items-center'>
          <Avatar className='mr-2' size="large" icon={<UserOutlined />} />
          <span className='sm:block hidden font-bold'>Admin</span>
        </div>
        {/* <span className="dark:text-white">Admin</span> */}
      </Space>
    </Dropdown>
  )
}
