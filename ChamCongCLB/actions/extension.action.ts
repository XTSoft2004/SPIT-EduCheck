'use server'

import globalConfig from '@/app.config'

export const getImage = async (nameFile: string) => {
  // Trả về URL dạng proxy hoặc trực tiếp
  return `${globalConfig.baseUrl}/extension/image?nameFile=${encodeURIComponent(nameFile)}`
}

export const getBase64Image = async (nameFile: string) => {
  const response = await fetch(
    `${globalConfig.baseUrl}/extension/base64?nameFile=${encodeURIComponent(nameFile)}`,
    {
      method: 'GET',
      next: {
        tags: ['extension.base64'],
      },
    },
  )

  const data = await response.text()
  console.log('Base64 Image:', data) // Log the base64 image string
  return data
}
