'use client'
import React from 'react'
import Snackbar from '@mui/material/Snackbar'
import MuiAlert, { AlertProps } from '@mui/material/Alert'

const Alert = React.forwardRef<HTMLDivElement, AlertProps>(
  function Alert(props, ref) {
    return <MuiAlert elevation={6} ref={ref} variant="filled" {...props} />
  },
)

interface SnackbarAlertProps {
  open: boolean
  onClose: () => void
  severity: 'success' | 'error' | 'warning' | 'info'
  message: string
}

const SnackbarAlert: React.FC<SnackbarAlertProps> = ({
  open,
  onClose,
  severity,
  message,
}) => {
  return (
    <Snackbar
      open={open}
      autoHideDuration={6000}
      onClose={onClose}
      anchorOrigin={{ vertical: 'bottom', horizontal: 'right' }}
    >
      <Alert onClose={onClose} severity={severity} sx={{ width: '100%' }}>
        {message}
      </Alert>
    </Snackbar>
  )
}

export default SnackbarAlert
