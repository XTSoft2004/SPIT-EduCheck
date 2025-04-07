import React, { useEffect, useState } from 'react';
import { Spin } from 'antd';

const LoadingScreen: React.FC = () => {
    const [spinning, setSpinning] = useState(true);
    const [percent, setPercent] = useState(0);

    useEffect(() => {
        let ptg = -10;
        const interval = setInterval(() => {
            ptg += 5;
            setPercent(ptg);

            if (ptg > 200) {
                clearInterval(interval);
                setSpinning(false);
                setPercent(0);
            }
        }, 200);
    }, []);

    return <Spin spinning={spinning} percent={percent} fullscreen />;
};

export default LoadingScreen;