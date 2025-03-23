'use client'
import React, { useState } from 'react';
import { useRouter } from 'next/navigation';
import {
    MenuFoldOutlined,
    MenuUnfoldOutlined,
    UploadOutlined,
    UserOutlined,
    VideoCameraOutlined,
} from '@ant-design/icons';
import { Button, Layout, Menu, theme } from 'antd';

const { Header, Sider, Content } = Layout;
import MenuSidebar from './MenuSidebar';
import AppHeader from './AppHeader';
import Image from 'next/image'
import Label from '@mui/icons-material/Label';
const siderStyle: React.CSSProperties = {
    overflow: 'auto',
    height: '100vh',
    position: 'sticky',
    insetInlineStart: 0,
    top: 0,
    bottom: 0,
    scrollbarWidth: 'thin',
    scrollbarGutter: 'stable',
};
export default function Dashboard({
    children,
}: {
    children: React.ReactNode
}) {
    const [collapsed, setCollapsed] = useState(false);
    const router = useRouter();
    const {
        token: { colorBgContainer, borderRadiusLG },
    } = theme.useToken();

    return (
        <Layout style={{ height: '100vh' }}>
            <Sider
                trigger={null}
                collapsible
                collapsed={collapsed}
                style={siderStyle}
            >
                <div className="demo-logo-vertical" />
                <div className='flex flex-col h-full'>
                    <div className='flex justify-center items-center py-3 gap-2'>
                        <Image src='/logo/logo-500x500.png' alt="Logo" width={collapsed ? 30 : 40} height={collapsed ? 30 : 40} loading="lazy" />
                        {!collapsed && <p className='text-white font-bold'>SPIT TEAM</p>}
                    </div>

                    {/* <Menu
                        theme="dark"
                        mode="inline"
                        defaultSelectedKeys={['1']}
                        onClick={({ key }) => router.push(key)} // Chuyển trang khi click menu
                        items={MenuSidebar}
                    /> */}
                    <MenuSidebar />
                </div>

            </Sider>
            <Layout style={{ height: '100vh' }}>
                <AppHeader setCollapsed={setCollapsed} />
                <Content
                    style={{
                        padding: 24,
                        background: colorBgContainer,
                        borderRadius: borderRadiusLG,
                        flex: 1,
                        overflow: 'auto'
                    }}
                >
                    {children}
                </Content>
            </Layout>
        </Layout >
    );
};
