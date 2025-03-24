'use client';
import React, { useState, useEffect } from 'react';
import { DataGrid, GridColDef, GridToolbar } from '@mui/x-data-grid';
import { Button, Dialog, DialogActions, DialogContent, DialogTitle, TextField } from '@mui/material';
import { getSemesters, createSemester, updateSemester, deleteSemester } from '@/actions/semester.actions';
import { ISemester, ISemesterCreate, ISemesterUpdate } from '@/types/semester';

export default function SemesterPage() {
    const [semesters, setSemesters] = useState<ISemester[]>([]);
    const [selectedSemester, setSelectedSemester] = useState<ISemester | null>(null);
    const [open, setOpen] = useState(false);

    useEffect(() => {
        fetchSemesters();
    }, []);

    const fetchSemesters = async () => {
        const response = await getSemesters();
        if (response.ok) {
            setSemesters(response.data);
        }
    };

    const handleAdd = () => {
        setSelectedSemester({ id: 0, semesters_Number: 1, year: new Date().getFullYear() });
        setOpen(true);
    };

    const handleEdit = (semester: ISemester) => {
        setSelectedSemester(semester);
        setOpen(true);
    };

    const handleDelete = async (id: number) => {
        if (window.confirm('Are you sure you want to delete this semester?')) {
            await deleteSemester(id);
            fetchSemesters();
        }
    };

    const handleSave = async () => {
        if (selectedSemester) {
            if (selectedSemester.id === 0) {
                const newSemester: ISemesterCreate = { ...selectedSemester };
                await createSemester(newSemester);
            } else {
                const updatedSemester: ISemesterUpdate = { ...selectedSemester };
                await updateSemester(updatedSemester);
            }
            fetchSemesters();
            setOpen(false);
        }
    };

    const columns: GridColDef[] = [
        { field: 'id', headerName: 'ID', width: 70 },
        { field: 'semesters_Number', headerName: 'Semester Number', width: 150 },
        { field: 'year', headerName: 'Year', width: 150 },
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
        <div style={{ height: 600, width: '100%' }}>
            <Button onClick={handleAdd}>Add Semester</Button>
            <DataGrid
                rows={semesters}
                columns={columns}
                pageSizeOptions={[5, 10, 20]}
                pagination
                checkboxSelection
                disableRowSelectionOnClick
                slots={{ toolbar: GridToolbar }}
            />
            <Dialog open={open} onClose={() => setOpen(false)}>
                <DialogTitle>{selectedSemester?.id === 0 ? 'Add Semester' : 'Edit Semester'}</DialogTitle>
                <DialogContent>
                    <TextField
                        margin="dense"
                        label="Semester Number"
                        type="number"
                        fullWidth
                        value={selectedSemester?.semesters_Number || ''}
                        onChange={(e) => setSelectedSemester(selectedSemester ? { ...selectedSemester, semesters_Number: Number(e.target.value) } : null)}
                    />
                    <TextField
                        margin="dense"
                        label="Year"
                        type="number"
                        fullWidth
                        value={selectedSemester?.year || ''}
                        onChange={(e) => setSelectedSemester(selectedSemester ? { ...selectedSemester, year: Number(e.target.value) } : null)}
                    />
                </DialogContent>
                <DialogActions>
                    <Button onClick={() => setOpen(false)}>Cancel</Button>
                    <Button onClick={handleSave}>Save</Button>
                </DialogActions>
            </Dialog>
        </div>
    );
}