// lib/metadata.ts
import type { Metadata } from 'next'

export const siteMetadata: Metadata = {
  title: 'SPIT EduCheck – Hệ thống chấm công hỗ trợ giảng dạy | Khoa CNTT HUSC',
  description:
    'SPIT EduCheck là hệ thống quản lý chấm công dành cho sinh viên hỗ trợ giảng dạy tại Khoa Công nghệ Thông tin, Đại học Khoa học Huế (HUSC). Ứng dụng giúp sinh viên dễ dàng ghi nhận và quản lý thông tin công việc, hỗ trợ đánh giá hiệu quả học tập và giảng dạy.',
  keywords: [
    'SPIT',
    'EduCheck',
    'chấm công',
    'hỗ trợ giảng dạy',
    'quản lý chấm công',
    'CNTT HUSC',
    'sinh viên trợ giảng',
    'điểm danh',
    'ứng dụng web',
  ],
  openGraph: {
    title: 'SPIT EduCheck – Hệ thống chấm công hỗ trợ giảng dạy',
    description:
      'SPIT EduCheck là hệ thống quản lý chấm công dành cho sinh viên hỗ trợ giảng dạy tại Khoa CNTT HUSC. Ứng dụng cho phép sinh viên ghi nhận công việc học tập và hỗ trợ đánh giá hiệu quả lớp học.',
    url: 'https://chamcong.spit-husc.io.vn/',
    siteName: 'SPIT EduCheck',
    images: [
      {
        url: 'https://chamcong.spit-husc.io.vn/logo/logo-500x500.png',
        width: 500,
        height: 500,
        alt: 'Logo SPIT EduCheck',
      },
    ],
    locale: 'vi_VN',
    type: 'website',
  },
  twitter: {
    card: 'summary_large_image',
    title: 'SPIT EduCheck – Hệ thống chấm công hỗ trợ giảng dạy',
    description:
      'SPIT EduCheck là hệ thống quản lý chấm công dành cho sinh viên hỗ trợ giảng dạy. Truy cập ngay để ghi nhận và quản lý công việc học tập!',
    images: ['https://chamcong.spit-husc.io.vn/slides/img-9.webp'],
    // Nếu có tài khoản Twitter chính thức cho EduCheck, thêm sau @, ví dụ:
    // site: '@SPIT_EduCheck',
  },
}
