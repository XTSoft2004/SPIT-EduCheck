'use client'
import Checkbox from '@mui/material/Checkbox'
import Label from '@/components/form/Label'
// import { Button } from '@/components/UI/Button/Button'
import { ChevronLeft, EyeClosed, Eye } from 'lucide-react'
import Link from 'next/link'
import Image from 'next/image'
import Input from '@mui/material/Input'
import InputLabel from '@mui/material/InputLabel'
import InputAdornment from '@mui/material/InputAdornment'
import TextField from '@mui/material/TextField'
import AccountCircle from '@mui/icons-material/AccountCircle'
import React, { useState } from 'react'
import { useForm } from 'react-hook-form'
import { useRouter } from 'next/navigation'
import { ILoginForm } from '@/types/auth'
import { login } from '@/actions/login.actions'
import { Button } from '@/components/ui/Button/Button'
import { CustomTextField } from '@/components/ui/Input/CustomTextField'
import KeyIcon from '@mui/icons-material/Key'
import Snackbar from '@mui/material/Snackbar'
import Alert from '@mui/material/Alert'
import SnackbarAlert from '@/components/ui/Alert/SnackbarAlertProps'
// import Button from '@mui/material/Button'
export default function SignInForm() {
  const {
    register,
    handleSubmit,
    formState: { errors },
  } = useForm<ILoginForm>()

  const router = useRouter()
  const [loading, setLoading] = useState<boolean>(false)
  const [openSuccess, setOpenSuccess] = useState<boolean>(false)
  const [openError, setOpenError] = useState<boolean>(false)
  const onSubmit = async (formData: ILoginForm) => {
    setLoading(true)

    const response = await login(formData)

    if (response.ok) {
      setOpenSuccess(true)
      router.push('/')
    } else {
      setOpenError(true)
    }

    setLoading(false)
  }
  const handleClose = () => {
    setOpenSuccess(false)
    setOpenError(false)
  }

  const [isChecked, setIsChecked] = useState(false)
  return (
    <div className="flex flex-col flex-1 lg:w-1/2 w-full">
      {/* <div className="w-full max-w-md sm:pt-10 mx-auto mb-5">
        <Link
          href="/"
          className="inline-flex items-center text-sm text-gray-500 transition-colors hover:text-gray-700 dark:text-gray-400 dark:hover:text-gray-300"
        >
          <ChevronLeft />
          Back to dashboard
        </Link>
      </div> */}
      <div className="flex flex-col justify-center flex-1 w-full max-w-md mx-auto">
        <div>
          <div className="mb-5 sm:mb-8">
            <h1 className="mb-2 font-bold text-gray-800 text-2xl sm:text-3xl lg:text-4xl dark:text-white/90">
              Sign In
            </h1>
            <p className="text-sm text-gray-500 dark:text-gray-400">
              Enter your username and password to sign in!
            </p>
          </div>
          <div>
            <div className="grid grid-cols-1 gap-3 sm:grid-cols-2 sm:gap-5">
              <button className="inline-flex items-center justify-center gap-3 py-3 text-sm font-normal text-gray-700 transition-colors bg-gray-100 rounded-lg px-7 hover:bg-gray-200 hover:text-gray-800 dark:bg-white/5 dark:text-white/90 dark:hover:bg-white/10">
                <svg
                  width="20"
                  height="20"
                  viewBox="0 0 20 20"
                  fill="none"
                  xmlns="http://www.w3.org/2000/svg"
                >
                  <path
                    d="M18.7511 10.1944C18.7511 9.47495 18.6915 8.94995 18.5626 8.40552H10.1797V11.6527H15.1003C15.0011 12.4597 14.4654 13.675 13.2749 14.4916L13.2582 14.6003L15.9087 16.6126L16.0924 16.6305C17.7788 15.1041 18.7511 12.8583 18.7511 10.1944Z"
                    fill="#4285F4"
                  />
                  <path
                    d="M10.1788 18.75C12.5895 18.75 14.6133 17.9722 16.0915 16.6305L13.274 14.4916C12.5201 15.0068 11.5081 15.3666 10.1788 15.3666C7.81773 15.3666 5.81379 13.8402 5.09944 11.7305L4.99473 11.7392L2.23868 13.8295L2.20264 13.9277C3.67087 16.786 6.68674 18.75 10.1788 18.75Z"
                    fill="#34A853"
                  />
                  <path
                    d="M5.10014 11.7305C4.91165 11.186 4.80257 10.6027 4.80257 9.99992C4.80257 9.3971 4.91165 8.81379 5.09022 8.26935L5.08523 8.1534L2.29464 6.02954L2.20333 6.0721C1.5982 7.25823 1.25098 8.5902 1.25098 9.99992C1.25098 11.4096 1.5982 12.7415 2.20333 13.9277L5.10014 11.7305Z"
                    fill="#FBBC05"
                  />
                  <path
                    d="M10.1789 4.63331C11.8554 4.63331 12.9864 5.34303 13.6312 5.93612L16.1511 3.525C14.6035 2.11528 12.5895 1.25 10.1789 1.25C6.68676 1.25 3.67088 3.21387 2.20264 6.07218L5.08953 8.26943C5.81381 6.15972 7.81776 4.63331 10.1789 4.63331Z"
                    fill="#EB4335"
                  />
                </svg>
                Sign in with Google
              </button>
              <button className="inline-flex items-center justify-center gap-3 py-3 text-sm font-normal text-gray-700 transition-colors bg-gray-100 rounded-lg px-7 hover:bg-gray-200 hover:text-gray-800 dark:bg-white/5 dark:text-white/90 dark:hover:bg-white/10">
                <Image
                  width={20}
                  height={20}
                  src="/logo/logo_HUSC.png"
                  alt="Husc Logo"
                  className="w-5 h-5"
                />
                Sign in with Husc
              </button>
            </div>
            <div className="relative py-3 sm:py-5">
              <div className="absolute inset-0 flex items-center">
                <div className="w-full border-t border-gray-200 dark:border-gray-800"></div>
              </div>
              <div className="relative flex justify-center text-sm">
                <span className="p-2 text-gray-400 bg-white dark:bg-gray-900 sm:px-5 sm:py-2">
                  Or
                </span>
              </div>
            </div>
            <form onSubmit={handleSubmit(onSubmit)}>
              <div>
                <Label className="text-sm dark:text-white">
                  Username <span className="text-red-600">*</span>{' '}
                </Label>
                <CustomTextField
                  register={register}
                  errors={errors}
                  name="Username"
                  placeholder="Username"
                  icon={<AccountCircle className="dark:text-white" />}
                />
              </div>
              <div>
                <Label className="text-sm dark:text-white">
                  Password <span className="text-red-600">*</span>{' '}
                </Label>
                <CustomTextField
                  register={register}
                  errors={errors}
                  name="password"
                  placeholder="Password"
                  type="password"
                  icon={<KeyIcon className="dark:text-white" />}
                />
              </div>
              <div className="space-y-2">
                <div className="flex items-center justify-between">
                  <div className="flex items-center">
                    <Checkbox
                      checked={isChecked}
                      onChange={(event, checked) => setIsChecked(checked)}
                    />
                    <span className="block font-normal text-gray-700 text-theme-sm dark:text-gray-400">
                      Keep me logged in
                    </span>
                  </div>
                  <a
                    href="/reset-password"
                    className="text-sm hover:text-dark dark:text-white !important border-none !import"
                    onClick={() => (
                      <SnackbarAlert
                        open={true}
                        onClose={handleClose}
                        severity="error"
                        message="Bạn vui lòng liên hệ với quản trị viên để được hỗ trợ!"
                      />
                    )}
                  >
                    Forgot password?
                  </a>
                </div>
                <div>
                  <Button
                    disabled={loading}
                    className="w-full"
                    onClick={() => console.log('a')}
                  >
                    Sign in
                  </Button>
                </div>
              </div>
            </form>
            <SnackbarAlert
              open={openSuccess}
              onClose={handleClose}
              severity="success"
              message="Đăng nhập thành công !!!"
            />
            <SnackbarAlert
              open={openError}
              onClose={handleClose}
              severity="error"
              message="Đăng nhập thất bại !!!"
            />

            {/* <div className="mt-5">
              <p className="text-sm font-normal text-center text-gray-700 dark:text-gray-400 sm:text-start">
                Don&apos;t have an account? {''}
                <Link
                  href="/signup"
                  className="text-brand-500 hover:text-brand-600 dark:text-brand-400"
                >
                  Sign Up
                </Link>
              </p>
            </div> */}
          </div>
        </div>
      </div>
    </div>
  )
}
