interface IGlobalConfig {
  API_HOST: string
  API_PORT: number
  baseUrl: string
}

const globalConfig: IGlobalConfig = {
  API_HOST: 'chamcong.spit-husc.io.vn',
  API_PORT: 5000,
  baseUrl: 'http://chamcong.spit-husc.io.vn:5000',
}

export default globalConfig
