'use server'

import globalConfig from '@/app.config'

export const getImage = async (nameFile: string) => {
  // Trả về URL dạng proxy hoặc trực tiếp
  return `${globalConfig.baseUrl}/extension/image?nameFile=${encodeURIComponent(nameFile)}`
}
