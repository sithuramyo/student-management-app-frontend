import React from 'react'
import { useParams } from 'react-router-dom';

export default function EditDepartment() {
    const { id } = useParams<{ id: string }>();
    return (
        <div>
            <h1 className="text-xl font-semibold">Edit Department</h1>
            <p className="mt-2 text-gray-700">Department ID: {id}</p>
        </div>
    )
}
