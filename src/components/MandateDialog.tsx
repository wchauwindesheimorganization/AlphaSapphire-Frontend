import { Dialog, DialogContent, DialogDescription, DialogHeader, DialogTitle, DialogTrigger } from "@/components/ui/Dialog";
import Multiselect from "./Multiselect";
import { User } from "@/models/entities/User";
import { Mandate } from "@/models/entities/Mandate";
import { useState } from "react";
export default function MandateDialog({ row, mandates, user, updateUserState, assignMandate, unassignMandate }: Readonly<{ row: any, mandates: Mandate[], user: User & { isNew?: boolean }, updateUserState: (id: number, updatedFields: Partial<any>) => void, assignMandate: (id: number, mandates: any[]) => Promise<any>, unassignMandate: (id: number, mandates: any[]) => Promise<any> }>) {
    const [isOpen, setIsOpen] = useState(false);

    return (<Dialog open={isOpen} onOpenChange={setIsOpen}>
        <DialogTrigger>{user.Id}</DialogTrigger>
        <DialogContent onClick={(e) => {
            // Prevent closing the dialog when interacting with elements inside it
            e.stopPropagation();
        }}>
            <DialogHeader
                onClick={(e) => {
                    // Prevent closing the dialog when interacting with elements inside it
                    e.stopPropagation();
                }}
            >
                <DialogTitle>Manage mandates for {`${user.FirstName} ${user.LastName} `}</DialogTitle>
                <DialogDescription>
                </DialogDescription>
            </DialogHeader>
            <Multiselect row={row} mandates={mandates} user={user} updateUserState={updateUserState} assignMandate={assignMandate} unassignMandate={unassignMandate} />

        </DialogContent>
    </Dialog>)
}