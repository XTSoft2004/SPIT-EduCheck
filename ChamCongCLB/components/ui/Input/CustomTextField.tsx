import { useState, ReactNode } from 'react'
import { TextField, InputAdornment, IconButton } from '@mui/material'
import { Visibility, VisibilityOff } from '@mui/icons-material'

interface CustomTextFieldProps {
  register: any
  errors: { [key: string]: any }
  name: string
  placeholder: string
  type?: string
  icon?: ReactNode
}

export function CustomTextField({
  register,
  errors,
  name,
  placeholder,
  type = 'text',
  icon,
}: CustomTextFieldProps) {
  const [showPassword, setShowPassword] = useState(false)

  const handleTogglePassword = () => {
    setShowPassword((prev) => !prev)
  }

  return (
    <TextField
      placeholder={placeholder}
      variant="outlined"
      fullWidth
      type={type === 'password' && !showPassword ? 'password' : 'text'}
      {...register(name, {
        required: `${placeholder} không được bỏ trống`,
      })}
      error={!!errors[name]}
      helperText={errors[name]?.message}
      className="dark:text-white dark:placeholder-white"
      sx={{
        '& .MuiOutlinedInput-root': {
          borderRadius: '16px',
        },
      }}
      style={{ marginBottom: '16px' }}
      InputProps={{
        startAdornment: icon ? (
          <InputAdornment position="start">{icon}</InputAdornment>
        ) : null,
        endAdornment:
          type === 'password' ? (
            <InputAdornment position="end">
              <IconButton onClick={handleTogglePassword} edge="end">
                {showPassword ? (
                  <VisibilityOff className="dark:text-white" />
                ) : (
                  <Visibility className="dark:text-white" />
                )}
              </IconButton>
            </InputAdornment>
          ) : null,
      }}
    />
  )
}
