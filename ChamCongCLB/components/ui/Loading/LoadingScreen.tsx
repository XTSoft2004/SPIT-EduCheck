import React from 'react';
import { Spin } from 'antd';

interface LoadingScreenProps {
    spinning: boolean;
}

const LoadingScreen: React.FC<LoadingScreenProps> = ({ spinning }) => {
    return <Spin spinning={spinning} fullscreen />;
};

export default LoadingScreen;
