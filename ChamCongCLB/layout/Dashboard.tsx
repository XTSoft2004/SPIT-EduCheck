'use client'
import React, { useEffect, useState } from 'react';
import { Breadcrumb, Button, Layout, Menu, theme, Drawer } from 'antd';

const { Header, Sider, Content } = Layout;

import AppHeader from './AppHeader';
import AppSider from './AppSider';
import LoadingScreen from '@/components/ui/Loading/LoadingScreen';
import { PlusCircleOutlined } from '@ant-design/icons';
import { useRouter } from 'next/navigation';

export default function Dashboard({
    children,
}: {
    children: React.ReactNode
}) {
    const [collapsed, setCollapsed] = useState(false);
    const [isLoading, setIsLoading] = useState(false);
    const router = useRouter();

    return (
        <Layout style={{ height: '100vh' }}>
            <AppSider setIsLoading={setIsLoading} setCollapsed={setCollapsed} collapsed={collapsed} />

            <Layout style={{ height: '100vh' }}>
                <AppHeader setCollapsed={setCollapsed} collapsed={collapsed} />
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
                        flex: 1,
                        overflow: 'auto'
                    }}
                >
                    {isLoading && <LoadingScreen spinning={isLoading} />}
                    {children}
                </div>
            </Layout>
            <Button
                type="primary"
                shape="circle"
                icon={<PlusCircleOutlined />}
                style={{
                    position: 'fixed',
                    bottom: 50,
                    right: 25,
                    zIndex: 1000,
                    width: 48,
                    height: 48,
                    display: 'flex',
                    alignItems: 'center',
                    justifyContent: 'center',
                    fontSize: 22,
                    boxShadow: '0 2px 8px rgba(0,0,0,0.15)',
                    padding: 0
                }}
                onClick={() => {
                    router.push('/timesheet');
                }}
            />
        </Layout >
    );
};
