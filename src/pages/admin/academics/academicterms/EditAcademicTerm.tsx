import Edit from "@/components/clients/admins/academics/academicterms/edit";
import { useParams } from "react-router-dom";

export default function EditAcademicTerm() {
    const { id } = useParams<{ id: string }>();
    if (!id) return null;
    return (
        <Edit id={id} />
    )
}
