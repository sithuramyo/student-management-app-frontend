import { useEffect, useRef } from "react";
import { useNavigate } from "react-router-dom";
import { toast } from "sonner";

interface ApiNotFoundProps {
  message?: string;
  onClose?: () => void;
}

const ApiNotFound: React.FC<ApiNotFoundProps> = ({ message, onClose }) => {
  const navigate = useNavigate();
  const hasRun = useRef(false);

  useEffect(() => {
    if (hasRun.current) return;
    hasRun.current = true;

    toast.error("Not Found", {
      description: message || "The requested resource was not found.",
    });

    const timeout = setTimeout(() => {
      onClose?.();
      navigate(-1);
    }, 1500);

    return () => clearTimeout(timeout);
  }, [message, navigate, onClose]);

  return null;
};

export default ApiNotFound;
