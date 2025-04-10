'use client'
import React, { useState, useEffect } from 'react';
import { Layout, Drawer } from 'antd';
const { Sider } = Layout;
import MenuSidebar from './MenuSidebar';
import Image from 'next/image';
import { useTheme } from '@/context/ThemeContext';
import { useRouter } from 'next/navigation';

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

const AppSider: React.FC<{ setIsLoading: (isLoading: boolean) => void, setCollapsed: (collapsed: boolean) => void, collapsed: boolean }> = ({ setIsLoading, setCollapsed, collapsed }) => {
    const { theme } = useTheme();
    const [isMobile, setIsMobile] = useState(false);

    const router = useRouter();
    useEffect(() => {
        const handleResize = () => {
            if (typeof window !== "undefined") {
                setIsMobile(window.innerWidth <= 1022);
            }

        };

        // Gọi một lần khi component mount
        handleResize();

        if (typeof window !== "undefined") {
            // Lắng nghe sự kiện thay đổi kích thước màn hình
            window.addEventListener('resize', handleResize);
        }
        return () => {
            if (typeof window !== "undefined") {
                window.removeEventListener("resize", handleResize);
            }
        };
    }, []);

    return isMobile ? (
        <Drawer
            className='dark:bg-[var(--bg-dark-mode)] dark:text-white'
            placement="left"
            closable
            onClose={() => setCollapsed(false)}
            open={collapsed}
            bodyStyle={{ padding: 0 }} // Xóa padding mặc định của Drawer
        >
            {/* <div onClick={() => router.push('/')} className="cursor-pointer">
               
            </div> */}
            <MenuSidebar setIsLoading={setIsLoading} setCollapsed={setCollapsed} />
        </Drawer>
    ) : (
        <Sider
            className='border-r-[1px] dark:border-gray-800'
            theme={theme}
            trigger={null}
            collapsible
            collapsed={collapsed}
            style={{ ...siderStyle }}
        >
            <div className="flex flex-col h-full">
                <div
                    className="flex justify-center items-center py-3 gap-2 cursor-pointer"
                    onClick={() => router.push('/')}
                >
                    <Image
                        src="/logo/logo-500x500.png"
                        alt="Logo"
                        width={34}
                        height={40}
                        loading="lazy"
                    />
                    {!collapsed && <p className="dark:text-white font-bold">SPIT TEAM</p>}
                </div>
                <MenuSidebar setIsLoading={setIsLoading} setCollapsed={setCollapsed} />
            </div>
        </Sider>
    );
};

export default AppSider;
