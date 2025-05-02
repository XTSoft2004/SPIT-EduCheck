'use client'

import { useRouter } from 'next/navigation'
import { Button } from 'antd'
import { HomeOutlined } from '@ant-design/icons'
import 'antd/dist/reset.css'

export default function NotFound() {
  const router = useRouter()
  return (
    <div className="flex flex-col items-center justify-center min-h-screen bg-gray-100 dark:bg-gray-900 text-center px-4">
      <h1 className="text-6xl font-bold text-red-500 dark:text-red-400">
        404 😵
      </h1>
      <p className="text-xl mt-4 text-gray-700 dark:text-gray-300">
        Trang bạn truy cập đã bay màu...
      </p>
      <img
        src="https://media.giphy.com/media/l2JehQ2GitHGdVG9y/giphy.gif"
        alt="404 Not Found"
        className="w-64 h-64 mx-auto mb-8"
      />
      <Button
        type="primary"
        icon={<HomeOutlined />}
        size="large"
        className="bg-blue-500 hover:bg-blue-600 text-white"
        onClick={() => router.push('/')}
      >
        Về trang chủ đê!
      </Button>
    </div>
  )
}
