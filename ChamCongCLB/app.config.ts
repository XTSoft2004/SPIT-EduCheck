interface IGlobalConfig {
    API_HOST: string;
    API_PORT: number;
    baseUrl: string;
}

const globalConfig: IGlobalConfig = {
    API_HOST: 'xtcoder2004.io.vn',
    API_PORT: 5000,
    baseUrl: 'http://xtcoder2004.io.vn:5000',
}

export default globalConfig;