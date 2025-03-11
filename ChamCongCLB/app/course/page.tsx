'use client';
import React, { useState, useEffect } from 'react';
import { DataGrid, GridColDef, GridToolbar } from '@mui/x-data-grid';
import { Button, Dialog, DialogActions, DialogContent, DialogTitle, TextField, Autocomplete } from '@mui/material';
import { getCourses, createCourse, updateCourse, deleteCourse } from '@/actions/course.actions';
import { ICourse, ICourseCreate, ICourseUpdate } from '@/types/course';
import { getSemesters } from '@/actions/semester.actions';
import { ISemester } from '@/types/semester';

export default function CoursePage() {
    const [courses, setCourses] = useState<ICourse[]>([]);
    const [semesters, setSemesters] = useState<ISemester[]>([]);
    const [selectedCourse, setSelectedCourse] = useState<ICourse | null>(null);
    const [open, setOpen] = useState(false);

    useEffect(() => {
        fetchCourses();
        fetchSemesters();
    }, []);

    const fetchCourses = async () => {
        const response = await getCourses();
        if (response.ok) {
            setCourses(response.data);
        }
    };

    const fetchSemesters = async () => {
        const response = await getSemesters();
        if (response.ok) {
            setSemesters(response.data);
        }
    }

    const handleAdd = () => {
        setSelectedCourse({ id: 0, code: '', name: '', credits: 0, semesterId: 1 });
        setOpen(true);
    };

    const handleEdit = (course: ICourse) => {
        setSelectedCourse(course);
        setOpen(true);
    };

    const handleDelete = async (id: number) => {
        if (window.confirm('Are you sure you want to delete this course?')) {
            await deleteCourse(id);
            fetchCourses();
        }
    };

    const handleSave = async () => {
        if (selectedCourse) {
            if (selectedCourse.id === 0) {
                const newCourse: ICourseCreate = { ...selectedCourse };
                await createCourse(newCourse);
            } else {
                const updatedCourse: ICourseUpdate = { ...selectedCourse };
                await updateCourse(updatedCourse);
            }
            fetchCourses();
            setOpen(false);
        }
    };

    const columns: GridColDef[] = [
        { field: 'id', headerName: 'ID', width: 50 },
        { field: 'code', headerName: 'Code', width: 150 },
        { field: 'name', headerName: 'Name', width: 200 },
        { field: 'credits', headerName: 'Credits', width: 100 },
        {
            field: 'semester',
            headerName: 'Semester',
            width: 200,
            renderCell: (params: { row: ICourse }) => {
                const semester = semesters.find(s => s.id === params.row.semesterId);
                return <p>{semester ? `${semester.semesters_Number} - ${semester.year}` : ''}</p>;
            }
        },
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
            <Button onClick={handleAdd}>Add Course</Button>
            <DataGrid
                rows={courses}
                columns={columns}
                pageSizeOptions={[5, 10, 20]}
                pagination
                slots={{ toolbar: GridToolbar }}
                checkboxSelection
                disableRowSelectionOnClick
            />
            <Dialog open={open} onClose={() => setOpen(false)}>
                <DialogTitle>{selectedCourse?.id === 0 ? 'Add Course' : 'Edit Course'}</DialogTitle>
                <DialogContent>
                    <TextField margin="dense" label="Code" fullWidth value={selectedCourse?.code || ''} onChange={(e) => setSelectedCourse(selectedCourse ? { ...selectedCourse, code: e.target.value } : null)} />
                    <TextField margin="dense" label="Name" fullWidth value={selectedCourse?.name || ''} onChange={(e) => setSelectedCourse(selectedCourse ? { ...selectedCourse, name: e.target.value } : null)} />
                    <TextField margin="dense" label="Credits" type="number" fullWidth value={selectedCourse?.credits || ''} onChange={(e) => setSelectedCourse(selectedCourse ? { ...selectedCourse, credits: Number(e.target.value) } : null)} />
                    <Autocomplete
                        options={semesters}
                        getOptionLabel={(option) => `${option.semesters_Number} - ${option.year}`}
                        renderInput={(params) => <TextField {...params} label="Select Semester" margin="dense" fullWidth />}
                        value={semesters.find(s => s.id === selectedCourse?.semesterId) || null}
                        onChange={(_, newValue) => setSelectedCourse(selectedCourse ? { ...selectedCourse, semesterId: newValue?.id || 1 } : null)}
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