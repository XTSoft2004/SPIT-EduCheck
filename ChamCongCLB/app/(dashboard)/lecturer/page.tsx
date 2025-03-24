'use client'
import React, { useState, useEffect } from 'react';
import { DataGrid, GridColDef, GridToolbar } from '@mui/x-data-grid';
import { Button, Dialog, DialogActions, DialogContent, DialogTitle, TextField, Select, MenuItem } from '@mui/material';
import { getLecturers, createLecturer, updateLecturer, deleteLecturer } from '@/actions/lecturer.actions';
import { ILecturer, ILecturerCreate, ILecturerUpdate } from '@/types/lecturer';

export default function LecturerPage() {
    const [lecturers, setLecturers] = useState<ILecturer[]>([]);
    const [selectedLecturer, setSelectedLecturer] = useState<ILecturer | null>(null);
    const [open, setOpen] = useState(false);
    const [page, setPage] = useState(0);
    const [pageSize, setPageSize] = useState(5);
    
    useEffect(() => {
        fetchLecturers();
    }, [page, pageSize]);

    const fetchLecturers = async () => {
        const response = await getLecturers();
        if (response.ok) {
            setLecturers(response.data || []);
        }
    };

    const handleAdd = () => {
        setSelectedLecturer({ id: '', fullName: '', email: '', phoneNumber: '' });
        setOpen(true);
    };

    const handleEdit = (lecturer: ILecturer) => {
        setSelectedLecturer(lecturer);
        setOpen(true);
    };

    const handleDelete = async (id: string) => {
        await deleteLecturer(Number(id));
        fetchLecturers();
    };

    const handleSave = async () => {
        if (selectedLecturer) {
            if (selectedLecturer.id === '') {
                const newLecturer: ILecturerCreate = {
                    fullName: selectedLecturer.fullName,
                    email: selectedLecturer.email,
                    phoneNumber: selectedLecturer.phoneNumber,
                };
                await createLecturer(newLecturer);
            } else {
                const updatedLecturer: ILecturerUpdate = {
                    id: Number(selectedLecturer.id),
                    fullName: selectedLecturer.fullName,
                    email: selectedLecturer.email,
                    phoneNumber: selectedLecturer.phoneNumber,
                };
                await updateLecturer(updatedLecturer);
            }
            fetchLecturers();
            setOpen(false);
        }
    };

    const columns: GridColDef[] = [
        { field: 'id', headerName: 'ID', width: 90 },
        { field: 'fullName', headerName: 'Full Name', width: 200, editable: true },
        { field: 'email', headerName: 'Email', width: 200, editable: true },
        { field: 'phoneNumber', headerName: 'Phone Number', width: 200, editable: true },
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
            <Button onClick={handleAdd}>Add Lecturer</Button>
            <DataGrid
                rows={lecturers}
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
                <DialogTitle>{selectedLecturer?.id === '' ? 'Add Lecturer' : 'Edit Lecturer'}</DialogTitle>
                <DialogContent>
                    <TextField
                        margin="dense"
                        label="Full Name"
                        fullWidth
                        value={selectedLecturer?.fullName || ''}
                        onChange={(e) => setSelectedLecturer({ ...selectedLecturer!, fullName: e.target.value })}
                    />
                    <TextField
                        margin="dense"
                        label="Email"
                        fullWidth
                        value={selectedLecturer?.email || ''}
                        onChange={(e) => setSelectedLecturer({ ...selectedLecturer!, email: e.target.value })}
                    />
                    <TextField
                        margin="dense"
                        label="Phone Number"
                        fullWidth
                        value={selectedLecturer?.phoneNumber || ''}
                        onChange={(e) => setSelectedLecturer({ ...selectedLecturer!, phoneNumber: e.target.value })}
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