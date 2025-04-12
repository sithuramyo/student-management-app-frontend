import Edit from '@/components/clients/academics/course/edit';
import { useParams } from 'react-router-dom';


export default function EditCourse() {
    const { id } = useParams<{ id: string }>();
    if (!id) return null;
    return (
        <Edit id={id} />
    )
}
