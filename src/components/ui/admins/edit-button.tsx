import { useNavigate } from "react-router-dom";
import { Button } from "../button";
import { Cog } from "lucide-react";

export default function EditButton({ href }: { href: string }) {
    const navigate = useNavigate();

    const handleEdit = () => {
        navigate(href);
    };

    return (
        <Button
            variant={'link'}
            onClick={handleEdit}
            title="Edit"
            className="text-blue-600 hover:bg-blue-100 rounded-full p-1.5 transition"
        >
            <Cog size={25} />
        </Button>
    );
}
