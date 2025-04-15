import Edit from "@/components/clients/admins/platformusers/systemusers/edit";
import { useParams } from "react-router-dom";

export default function EditSystemUser() {
    const { id } = useParams<{ id: string }>();
    if (!id) return null;
    return (
        <Edit id={id} />
    )
}
