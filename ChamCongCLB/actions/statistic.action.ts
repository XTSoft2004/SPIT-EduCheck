'use server'
import globalConfig from '@/app.config'
import { cookies, headers } from 'next/headers'

import { IResponse } from '@/types/global'
import { IStatisticInfo } from '@/types/statistic'
import { message } from 'antd'

export const getStatisticInfo = async () => {
  const response = await fetch(`${globalConfig.baseUrl}/statistic-info`, {
    method: 'GET',
    headers: {
      'Content-Type': 'application/json',
      Authorization:
        headers().get('Authorization') ||
        `Bearer ${cookies().get('accessToken')?.value || ' '}`,
    },
    next: {
      tags: ['statistic.info'],
    },
  })

  const data = await response.json()
  return {
    ok: response.ok,
    status: response.status,
    ...data,
  }
}

export const getStatisticClass = async () => {
  const response = await fetch(`${globalConfig.baseUrl}/statistic-class`, {
    method: 'GET',
    headers: {
      'Content-Type': 'application/json',
      Authorization:
        headers().get('Authorization') ||
        `Bearer ${cookies().get('accessToken')?.value || ' '}`,
    },
    next: {
      tags: ['statistic.class'],
    },
  })

  const data = await response.json()

  return {
    ok: response.ok,
    status: response.status,
    data: [...data],
  }
}
