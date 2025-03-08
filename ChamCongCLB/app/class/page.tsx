'use client'
import React, { useState, useEffect } from 'react';
import { DataGrid, GridColDef, GridToolbar } from '@mui/x-data-grid';
import { Button, Dialog, DialogActions, DialogContent, DialogTitle, TextField } from '@mui/material';
import { getClasses, createClass, updateClass, deleteClass } from '@/actions/class.actions';
import { IClass, IClassCreate, IClassUpdate } from '@/types/class';

export default function ClassPage() {
    const [classes, setClasses] = useState<IClass[]>([]);
    const [selectedClass, setSelectedClass] = useState<IClass | null>(null);
    const [open, setOpen] = useState(false);
    const [page, setPage] = useState(0);
    const [pageSize, setPageSize] = useState(5);

    useEffect(() => {
        fetchClasses();
    }, [page, pageSize]);

    const fetchClasses = async () => {
        const response = await getClasses();
        if (response.ok) {
            setClasses(response.data);
        }
    };

    const handleAdd = () => {
        setSelectedClass({ id: 0, code: '', name: '', day: 0, timeStart: '', timeEnd: '', lecturerId: '', courseId: '' });
        setOpen(true);
    };

    const handleEdit = (classData: IClass) => {
        setSelectedClass(classData);
        setOpen(true);
    };

    const handleDelete = async (id: number) => {
        await deleteClass(id);
        fetchClasses();
    };

    const handleSave = async () => {
        if (selectedClass) {
            if (selectedClass.id === 0) {
                const newClass: IClassCreate = { ...selectedClass, studentId: [] };
                await createClass(newClass);
            } else {
                const updatedClass: IClassUpdate = { ...selectedClass };
                await updateClass(updatedClass);
            }
            fetchClasses();
            setOpen(false);
        }
    };

    const columns: GridColDef[] = [
        { field: 'id', headerName: 'ID', width: 50 },
        { field: 'code', headerName: 'Code', width: 150 },
        { field: 'name', headerName: 'Name', width: 200 },
        { field: 'day', headerName: 'Day', width: 50 },
        { field: 'timeStart', headerName: 'Start Time', width: 150 },
        { field: 'timeEnd', headerName: 'End Time', width: 150 },
        { field: 'lecturerId', headerName: 'Lecturer ID', width: 100 },
        { field: 'courseId', headerName: 'Course ID', width: 100 },
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
            <Button onClick={handleAdd}>Add Class</Button>
            <DataGrid
                rows={classes}
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
                <DialogTitle>{selectedClass?.id === 0 ? 'Add Class' : 'Edit Class'}</DialogTitle>
                <DialogContent>
                    <TextField margin="dense" label="Code" fullWidth value={selectedClass?.code || ''} onChange={(e) => setSelectedClass({ ...selectedClass!, code: e.target.value })} />
                    <TextField margin="dense" label="Name" fullWidth value={selectedClass?.name || ''} onChange={(e) => setSelectedClass({ ...selectedClass!, name: e.target.value })} />
                    <TextField margin="dense" label="Day" type="number" fullWidth value={selectedClass?.day || ''} onChange={(e) => setSelectedClass({ ...selectedClass!, day: Number(e.target.value) })} />
                    <TextField
                        margin="dense"
                        label="Start Time"
                        type="time"
                        fullWidth
                        value={selectedClass?.timeStart.slice(0, 5) || ''}
                        onChange={(e) => setSelectedClass({ ...selectedClass!, timeStart: e.target.value + ':00' })}
                    />
                    <TextField
                        margin="dense"
                        label="End Time"
                        type="time"
                        fullWidth
                        value={selectedClass?.timeEnd.slice(0, 5) || ''}
                        onChange={(e) => setSelectedClass({ ...selectedClass!, timeEnd: e.target.value + ':00' })}
                    />
                    <TextField margin="dense" label="Lecturer ID" fullWidth value={selectedClass?.lecturerId || ''} onChange={(e) => setSelectedClass({ ...selectedClass!, lecturerId: e.target.value })} />
                    <TextField margin="dense" label="Course ID" fullWidth value={selectedClass?.courseId || ''} onChange={(e) => setSelectedClass({ ...selectedClass!, courseId: e.target.value })} />
                </DialogContent>
                <DialogActions>
                    <Button onClick={() => setOpen(false)}>Cancel</Button>
                    <Button onClick={handleSave}>Save</Button>
                </DialogActions>
            </Dialog>
        </div>
    );
};