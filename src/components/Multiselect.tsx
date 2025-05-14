import Select from 'react-select';
import { Mandate } from "@/models/entities/Mandate";
import MultiselectTooltip from "@/components/ui/MultiselectTooltip";
import { useState } from 'react';
import { User } from '@/models/entities/User';
export default function Multiselect({ row, mandates, user, updateUserState, assignMandate, unassignMandate }: { row: any, mandates: Mandate[], user: User & { isNew?: boolean }, updateUserState: (id: number, updatedFields: Partial<User>) => void, assignMandate: (id: number, mandates: Mandate[]) => Promise<any>, unassignMandate: (id: number, mandates: Mandate[]) => Promise<any>, }) {
    const [isOpen, setIsOpen] = useState(() => false);

    return <Select<Mandate, true>
        onMenuClose={() => setIsOpen(false)}
        onMenuOpen={() => setIsOpen(true)}
        menuIsOpen={isOpen}
        isMulti
        name="colors"
        closeMenuOnSelect={false}
        components={{ Option: MultiselectTooltip }}
        value={user.Mandates}
        options={mandates}
        getOptionLabel={e => e.MandateName}
        getOptionValue={e => e.MandateName}
        className="basic-multi-select"

        onChange={(newValues) => {
            const mutableMandates = [...newValues]; // Convert to a mutable array

            if (mutableMandates && mutableMandates.length > row.original.Mandates.length) {
                // Added values
                const addedValues = mutableMandates.filter(
                    (value) =>
                        !row.original.Mandates.some(
                            (selected: Mandate) => selected.MandateName === value.MandateName
                        )
                );
                if (user.isNew) {

                    updateUserState(row.original.Id, { Mandates: mutableMandates });
                }
                else {
                    assignMandate(row.original.Id, addedValues).then(() => {
                        updateUserState(row.original.Id, { Mandates: mutableMandates });
                    }).catch(error => {
                        console.log(error)
                    })
                }

            } else if (user.Mandates && mutableMandates.length < row.original.Mandates.length) {
                // Removed values
                const removedValues = row.original.Mandates.filter(
                    (value: Mandate) =>
                        !mutableMandates.some(
                            (newValue) => newValue.MandateName === value.MandateName
                        )
                );
                if (user.isNew) {
                    updateUserState(row.original.Id, { Mandates: mutableMandates });
                }
                else {
                    unassignMandate(row.original.Id, removedValues).then(() => {
                        updateUserState(row.original.Id, { Mandates: mutableMandates });
                    }).catch(error => {
                        console.log(error)
                    })
                }
            }
        }}
    />
}