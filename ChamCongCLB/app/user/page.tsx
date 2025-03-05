'use client';
import React, { useState, useEffect } from 'react';
import { DataGrid, GridColDef, GridToolbar } from '@mui/x-data-grid';
import { Button, Dialog, DialogActions, DialogContent, DialogTitle, TextField } from '@mui/material';
import { getUsers, getUserById } from '@/actions/user.actions';
import { IUser, IUserCreate } from '@/types/user';

export default function UserPage() {
    const [users, setUsers] = useState<IUser[]>([]);
    const [selectedUser, setSelectedUser] = useState<IUser | null>(null);
    const [open, setOpen] = useState(false);
    const [page, setPage] = useState(0);
    const [pageSize, setPageSize] = useState(5);
    
    useEffect(() => {
        fetchUsers();
    }, [page, pageSize]);

    const fetchUsers = async () => {
        const response = await getUsers();
        if (response.ok) {
            setUsers(response.data || []);
        }
    };

    const handleAdd = () => {
        setSelectedUser({ id: '', username: '', email: '', role: '' });
        setOpen(true);
    };

    const handleEdit = (user: IUser) => {
        setSelectedUser(user);
        setOpen(true);
    };

    const handleDelete = async (id: string) => {
        console.log(`Delete user ${id}`);
        fetchUsers();
    };

    const handleSave = async () => {
        if (selectedUser) {
            if (selectedUser.id === '') {
                const newUser: IUserCreate = {
                    username: selectedUser.username,
                    email: selectedUser.email,
                    role: selectedUser.role,
                };
                console.log('Create user:', newUser);
            } else {
                console.log('Update user:', selectedUser);
            }
            fetchUsers();
            setOpen(false);
        }
    };

    const columns: GridColDef[] = [
        { field: 'id', headerName: 'ID', width: 90 },
        { field: 'username', headerName: 'Username', width: 200, editable: true },
        { field: 'email', headerName: 'Email', width: 200, editable: true },
        { field: 'role', headerName: 'Role', width: 150, editable: true },
        {
            field: 'actions',
            headerName: 'Actions',
            width: 200,
            renderCell: (params) => (
                <>
                    <Button onClick={() => handleEdit(params.row)}>Edit</Button>
                    <Button onClick={() => handleDelete(params.row.id)}>Delete</Button>
                </>
            ),
        },
    ];

    return (
        <div style={{ height: 700, width: '100%' }}>
            <Button onClick={handleAdd}>Add User</Button>
            <DataGrid
                rows={users}
                columns={columns}
                pageSizeOptions={[5, 10, 20]}
                pagination
                paginationModel={{ page, pageSize }}
                onPaginationModelChange={(newModel) => {
                    setPage(newModel.page ?? 0);
                    setPageSize(newModel.pageSize ?? pageSize);
                }}
                checkboxSelection
                disableRowSelectionOnClick
                slots={{
                    toolbar: GridToolbar,
                }}
            />
            <Dialog open={open} onClose={() => setOpen(false)}>
                <DialogTitle>{selectedUser?.id === '' ? 'Add User' : 'Edit User'}</DialogTitle>
                <DialogContent>
                    <TextField
                        margin="dense"
                        label="Username"
                        fullWidth
                        value={selectedUser?.username || ''}
                        onChange={(e) => setSelectedUser({ ...selectedUser!, username: e.target.value })}
                    />
                    <TextField
                        margin="dense"
                        label="Email"
                        fullWidth
                        value={selectedUser?.email || ''}
                        onChange={(e) => setSelectedUser({ ...selectedUser!, email: e.target.value })}
                    />
                    <TextField
                        margin="dense"
                        label="Role"
                        fullWidth
                        value={selectedUser?.role || ''}
                        onChange={(e) => setSelectedUser({ ...selectedUser!, role: e.target.value })}
                    />
                </DialogContent>
                <DialogActions>
                    <Button onClick={() => setOpen(false)}>Cancel</Button>
                    <Button onClick={handleSave}>Save</Button>
                </DialogActions>
            </Dialog>
        </div>
    );
};
