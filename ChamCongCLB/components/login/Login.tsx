'use client';
import React, { useState } from 'react';
import { useForm } from 'react-hook-form';
import { useRouter } from 'next/navigation';

import { ILoginForm } from "@/types/auth";
import { login } from '@/actions/login.actions';

import TextField from '@mui/material/TextField';
import Button from '@mui/material/Button';
import Snackbar from '@mui/material/Snackbar';
import Alert from '@mui/material/Alert';

export default function Login() { 
    const { register, handleSubmit, formState: { errors } } = useForm<ILoginForm>();
    const router = useRouter();
    const [loading, setLoading] = useState<boolean>(false);
    const [openSuccess, setOpenSuccess] = useState<boolean>(false);
    const [openError, setOpenError] = useState<boolean>(false);

    const onSubmit = async (formData: ILoginForm) => {
        setLoading(true);
        
        const response = await login(formData);

        if (response.ok) {
            setOpenSuccess(true);
            router.push('/');
        } else {
            setOpenError(true);
        }

        setLoading(false);
    };

    const handleClose = () => {
        setOpenSuccess(false);
        setOpenError(false);
    };

    return (
        <div style={{ display: 'flex', flexDirection: 'column', alignItems: 'center', marginTop: '20vh' }}>
            <form onSubmit={handleSubmit(onSubmit)} style={{ display: 'flex', flexDirection: 'column', width: '300px' }}>
                <TextField
                    label="Username"
                    variant="outlined"
                    {...register("username", { required: "Username is required" })}
                    error={!!errors.username}
                    helperText={errors.username?.message}
                    style={{ marginBottom: '16px' }}
                />
                <TextField
                    label="Password"
                    type="password"
                    variant="outlined"
                    {...register("password", { required: "Password is required" })}
                    error={!!errors.password}
                    helperText={errors.password?.message}
                    style={{ marginBottom: '16px' }}
                />
                <Button variant="contained" color="primary" type="submit" disabled={loading}>
                    {loading ? "Logging in..." : "Login"}
                </Button>
            </form>
            <Snackbar open={openSuccess} autoHideDuration={6000} onClose={handleClose}>
                <Alert onClose={handleClose} severity="success" sx={{ width: '100%' }}>
                    Login Successful!
                </Alert>
            </Snackbar>
            <Snackbar open={openError} autoHideDuration={6000} onClose={handleClose}>
                <Alert onClose={handleClose} severity="error" sx={{ width: '100%' }}>
                    Login Failed!
                </Alert>
            </Snackbar>
        </div>
    );
}