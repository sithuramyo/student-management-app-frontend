import {
    Dialog,
    DialogContent,
    DialogDescription,
    DialogFooter,
    DialogHeader,
    DialogTitle,
    DialogTrigger,
} from "@/components/ui/dialog";
import { useState } from "react";
import LoadingButton from "../loading-button";
import { useApiMutation } from "@/hooks/useMutation";
import { toast } from "sonner";
import { Button } from "../button";
import { BadgeX } from "lucide-react";
import { useQueryClient } from "@tanstack/react-query";

export default function DeleteSection(props: DeleteProps) {
    const [open, setOpen] = useState(false);
    const queryClient = useQueryClient();
    const mutation = useApiMutation<NoRequest, NoResponse>({
        onSuccess: (res) => {
            queryClient.invalidateQueries({ queryKey: [props.queryKey] })
            toast.success(res.message);
        }
    });

    const handleDelete = () => {
        mutation.mutate({
            endpoint: props.apiUrl,
            method: "DELETE",
        });
        setOpen(false);
    }

    return (
        <Dialog open={open} onOpenChange={setOpen}>
            <DialogTrigger asChild>
                <Button variant="link" className="text-red-600 hover:bg-red-100 rounded-full p-1.5 transition">
                    <BadgeX size={18} />
                </Button>
            </DialogTrigger>
            {/* Increase the dialog box size by using custom classes or inline styles */}
            <DialogContent className="w-[500px] h-[200px]">
                <DialogHeader>
                    <DialogTitle>Do you want to delete this {props.label} ?</DialogTitle>
                    <DialogDescription className="pt-5">
                        Are you sure you want to delete this data?
                        This action cannot be undone. It will permanently delete the data from the server.
                    </DialogDescription>
                    <DialogFooter>
                        <div className="flex gap-2 mt-5">
                            <Button
                                variant={"outline"}
                                onClick={() => setOpen(false)}
                                disabled={mutation.isPending}
                            >
                                Cancel
                            </Button>
                            <Button
                                variant={"outline"}
                                onClick={handleDelete}
                                disabled={mutation.isPending}
                            >
                                {mutation.isPending ? (
                                    <>
                                        <LoadingButton />
                                        Deleting...
                                    </>
                                ) : (
                                    "Confirm"
                                )}
                            </Button>
                        </div>
                    </DialogFooter>
                </DialogHeader>
            </DialogContent>
        </Dialog>
    )
}
