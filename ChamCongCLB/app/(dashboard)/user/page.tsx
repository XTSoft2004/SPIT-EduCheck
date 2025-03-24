'use client';
import React, { useState, useEffect } from 'react';
import { DataGrid, GridColDef, GridToolbar } from '@mui/x-data-grid';
import { Dialog, DialogActions, DialogContent, DialogTitle, TextField } from '@mui/material';
import { getUsers } from '@/actions/user.actions';
import { IUser } from '@/types/user';

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
            setUsers(response.data);
        }
    };

    const columns: GridColDef[] = [
        { field: 'id', headerName: 'ID', width: 90 },
        { field: 'username', headerName: 'Username', width: 200 },
        { field: 'isLocked', headerName: 'Is Locked', width: 120 },
        { field: 'isVerify', headerName: 'Is Verify', width: 120 },
        { field: 'roleName', headerName: 'Role Name', width: 120 },
    ];

    return (
        <div style={{ height: 700, width: '100%' }}>
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
                <DialogTitle>Add User</DialogTitle>
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
                        label="Is Locked"
                        fullWidth
                        value={selectedUser?.isLocked || ''}
                        onChange={(e) => setSelectedUser({ ...selectedUser!, isLocked: e.target.value === 'true' })}
                    />
                    <TextField
                        margin="dense"
                        label="Is Verify"
                        fullWidth
                        value={selectedUser?.isVerify || ''}
                        onChange={(e) => setSelectedUser({ ...selectedUser!, isVerify: e.target.value === 'true' })}
                    />
                    <TextField
                        margin="dense"
                        label="Role Name"
                        fullWidth
                        value={selectedUser?.roleName || ''}
                        onChange={(e) => setSelectedUser({ ...selectedUser!, roleName: e.target.value })}
                    />

                </DialogContent>
            </Dialog>
        </div>
    );
}