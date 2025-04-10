import Edit from '@/components/clients/academics/departments/edit';
import { useParams } from 'react-router-dom';

export default function EditDepartment() {
    const { id } = useParams<{ id: string }>();
    if (!id) return null;
    return (
        <Edit id={id} />
    )
}
