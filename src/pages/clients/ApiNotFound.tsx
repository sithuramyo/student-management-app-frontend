import { useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { toast } from "sonner";

interface ApiNotFoundProps {
    message?: string;
    onClose?: () => void;
  }
  
  const ApiNotFound: React.FC<ApiNotFoundProps> = ({ message, onClose }) => {
    const navigate = useNavigate();
  
    useEffect(() => {
      toast.error("Not Found", {
        description: message || "The requested resource was not found.",
      });
  
      const timeout = setTimeout(() => {
        onClose?.(); // reset Zustand state
        navigate(-1); // go back
      }, 1000);
  
      return () => clearTimeout(timeout);
    }, [message, navigate, onClose]);
  
    return null;
  };
  
export default ApiNotFound;
