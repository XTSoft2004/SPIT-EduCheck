'use client'
import React, { useState } from 'react';
import { Breadcrumb, Button, Layout, Menu, theme } from 'antd';

const { Header, Sider, Content } = Layout;
import MenuSidebar from './MenuSidebar';
import AppHeader from './AppHeader';
import Image from 'next/image'
import Label from '@mui/icons-material/Label';
import { useTheme } from '@/contexts/ThemeContext'


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
    const { theme, toggleTheme } = useTheme()
    const [collapsed, setCollapsed] = useState(false);

    return (
        <Layout style={{ height: '100vh' }}>
            <Sider
                className='custom-sider'
                theme={theme}
                trigger={null}
                collapsible
                collapsed={collapsed}
                style={{ ...siderStyle }}
            >
                <div className="demo-logo-vertical" />
                <div className='flex flex-col h-full'>
                    <div className='flex justify-center items-center py-3 gap-2'>
                        <Image src='/logo/logo-500x500.png' alt="Logo" width={collapsed ? 30 : 40} height={collapsed ? 30 : 40} loading="lazy" />
                        {!collapsed && <p className='dark:text-white font-bold'>SPIT TEAM</p>}
                    </div>

                    <MenuSidebar />
                </div>
            </Sider>


            <Layout style={{ height: '100vh' }}>
                <AppHeader setCollapsed={setCollapsed} />
                {/* <Breadcrumb
                    items={[
                        { key: '/uploads', title: <a href="/uploads">Home</a> },
                        { title: 'List' },
                        { title: 'App' }
                    ]}
                    style={{ margin: '16px 0' }}
                /> */}
                <div
                    className='dark:bg-[var(--bg-dark-mode)] dark:text-white'
                    style={{
                        padding: 24,
                        // background: colorBgContainer,
                        // borderRadius: borderRadiusLG,
                        flex: 1,
                        overflow: 'auto'
                    }}
                >
                    {children}
                </div>
            </Layout>
        </Layout >
    );
};
