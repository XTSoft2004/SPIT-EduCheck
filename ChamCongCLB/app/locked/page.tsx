'use client'

import React from 'react'
import { Result, Button } from 'antd'
import { FacebookFilled } from '@ant-design/icons'

export default function LockedPage() {
  return (
    <div className="flex justify-center items-center h-screen bg-gray-100 dark:bg-gray-900">
      <Result
        icon={<span className="text-4xl">🔒</span>}
        title={
          <h1 className="text-2xl text-gray-800 dark:text-gray-200 leading-relaxed">
            Tài khoản đã bị khoá!
          </h1>
        }
        subTitle={
          <p className="text-base text-gray-600 dark:text-gray-400 leading-relaxed">
            Chuyển khoản anh Trường 50k để được mở khoá tài khoản nhé! <br />
            <Button
              type="primary"
              icon={<FacebookFilled />}
              href="https://www.facebook.com/xuantruong.war.clone.code#"
              target="_blank"
              rel="noopener noreferrer"
            >
              Liên hệ anh Trường
            </Button>
          </p>
        }
      />
    </div>
  )
}
