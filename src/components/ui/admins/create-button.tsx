import { Link } from "react-router-dom";
import { Button } from "../button";
import { Plus } from "lucide-react";

interface CreateButtonProps {
    href: string; 
  }
  
  export const CreateButton = ({href} : CreateButtonProps) => {
    return (
      <Link to={href}>
        <Button variant="outline"><Plus/>Create</Button>
      </Link>
    );
  };