import Edit from '@/components/clients/academics/prerequisite/edit';
import { useParams } from 'react-router-dom';

export default function EditPrerequisite() {
    const { id } = useParams<{ id: string }>();
    if (!id) return null;
    return (
        <Edit id={id} />
    )
}
