import { TextField, InputAdornment } from '@mui/material'
import { AccountCircle } from '@mui/icons-material'

interface CustomTextFieldProps {
  register: any
  errors: { [key: string]: any }
  name: string
  placeholder: string
}

export function CustomTextField({
  register,
  errors,
  name,
  placeholder,
}: CustomTextFieldProps) {
  return (
    <TextField
      placeholder={placeholder}
      variant="outlined"
      fullWidth
      {...register(name, {
        required: `${placeholder} không được bỏ trống`,
      })}
      error={!!errors[name]}
      helperText={errors[name]?.message}
      className="dark:text-white dark:placeholder-white"
      sx={{
        '& .MuiOutlinedInput-root': {
          borderRadius: '16px',
          //   '& fieldset': {
          //     borderColor: 'white !important',
          //   },
          //   '&:hover fieldset': {
          //     borderColor: 'white !important',
          //   },
          //   '&.Mui-focused fieldset': {
          //     borderColor: 'white !important',
          //   },
        },
      }}
      style={{ marginBottom: '16px' }}
      InputProps={{
        startAdornment: (
          <InputAdornment position="start">
            <AccountCircle className="dark:text-white" />
          </InputAdornment>
        ),
      }}
    />
  )
}
