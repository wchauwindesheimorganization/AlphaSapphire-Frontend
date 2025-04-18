import Select from 'react-select';
import { Mandate } from "@/models/Mandate";
import MultiselectTooltip from "@/components/ui/MultiselectTooltip";
import { useState } from 'react';
import { User } from '@/models/User';
export default function Multiselect({ row, mandates, user, updateUserState, assignMandate, unassignMandate }: { row: any, mandates: Mandate[], user: any, updateUserState: (id: number, updatedFields: Partial<User>) => void, assignMandate: (id: number, mandates: Mandate[]) => Promise<any>, unassignMandate: (id: number, mandates: Mandate[]) => Promise<any>, }) {
    const [isOpen, setIsOpen] = useState(() => false);

    return (<div onClick={(e) => e.stopPropagation()}> <Select<Mandate, true>
        onMenuClose={() => setIsOpen(false)}
        onMenuOpen={() => setIsOpen(true)}
        menuIsOpen={isOpen}
        isMulti
        name="colors"
        closeMenuOnSelect={false}
        components={{ Option: MultiselectTooltip }}
        value={row.row.original.Mandates}
        options={mandates}
        getOptionLabel={e => e.MandateName}
        getOptionValue={e => e.MandateName}
        className="basic-multi-select"

        onChange={(newValues) => {
            console.log("New values", newValues)
            console.log("test")
            const mutableMandates = [...newValues]; // Convert to a mutable array
            if (mutableMandates.length > row.row.original.Mandates.length) {
                // Added values
                const addedValues = mutableMandates.filter(
                    (value) =>
                        !row.row.original.Mandates.some(
                            (selected: Mandate) => selected.MandateName === value.MandateName
                        )
                );
                if (user.isNew) {
                    updateUserState(row.row.original.Id, { Mandates: mutableMandates });
                    console.log("Added values", addedValues)
                }
                else {
                    assignMandate(row.row.original.Id, addedValues).then(() => {
                        updateUserState(row.row.original.Id, { Mandates: mutableMandates });
                        console.log("Added values", addedValues)
                    }).catch(error => {
                        console.log(error)
                    })
                }

            } else if (mutableMandates.length < row.row.original.Mandates.length) {
                // Removed values
                const removedValues = row.row.original.Mandates.filter(
                    (value: Mandate) =>
                        !mutableMandates.some(
                            (newValue) => newValue.MandateName === value.MandateName
                        )
                );
                if (user.isNew) {
                    updateUserState(row.row.original.Id, { Mandates: mutableMandates });
                }
                else {
                    unassignMandate(row.row.original.Id, removedValues).then(() => {
                        updateUserState(row.row.original.Id, { Mandates: mutableMandates });
                    }).catch(error => {
                        console.log(error)
                    })
                }
            }
        }}
    /></div>)
}