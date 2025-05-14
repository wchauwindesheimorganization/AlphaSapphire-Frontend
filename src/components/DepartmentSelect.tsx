import Select from 'react-select';
import { useState } from "react";
import { Department } from '@/models/entities/Department';
import { User } from '@/models/entities/User';
import { adminUpdateUser } from '@/api/userApi';
export default function DepartmentSelect({ departments, user, updateUser }: { departments: Department[], user: User & { isNew?: boolean }, updateUser: (id: number, update: Partial<User>) => void }) {



    return (<Select options={departments}
        defaultValue={user.Department}
        getOptionLabel={(e) => e.DepartmentCode.toString()} getOptionValue={e => e.DepartmentCode.toString()} onChange={(e) => {
            console.log(e)
            if (user.isNew) {
                updateUser(user.Id, { DepartmentId: e?.Id })
                return;
            }
            adminUpdateUser(user.Id, { DepartmentId: e?.Id }).then(() => {
                updateUser(user.Id, { DepartmentId: e?.Id })
            }).catch(error => {
                console.log(error)
            })

        }}></Select>)
}