import { createFileRoute } from "@tanstack/react-router";
import { DataTable } from "../../components/Datatable";
import { User } from "@/models/entities/User";
import { adminusercolumns } from "@/models/Columndefinitions/AdminUserColumns";
import { adminGetUsers, adminCreateUser, assignMandate, adminUpdateUser } from "../../api/userApi";
import { useState, useEffect, useContext, useMemo } from "react";
import { UserContext } from "@/UserContext";
import { getMandates } from "@/api/mandateApi";
import { Mandate } from "@/models/entities/Mandate";
import { Department } from "@/models/entities/Department";
import { getDepartments } from "@/api/departmentApi";
import GenericErrorSetter from "@/utils/GenericErrorSetter";
import GenericCancelAdd from "@/utils/GenericCancelAdd";
import { Uservalidation } from "@/models/Validationrules/Uservalidation";
import GenericAdd from "@/utils/GenericAdd";
import GenericStateUpdater from "@/utils/GenericStateUpdater";
export const Route = createFileRoute('/administrator/users')({
  component: RouteComponent,
})


function RouteComponent() {
  type EditableUser = User & { isNew?: boolean };
  const userContext = useContext(UserContext);
  const account = userContext.account!;
  const [departments, setDepartments] = useState<Department[]>([]);
  const [mandates, setMandates] = useState<Mandate[]>([]);
  const [users, setUsers] = useState<User[]>([]);
  const [isAdding, setIsAdding] = useState(false);

  const [errors, setErrors] = useState<
    { id: number; errormessage: string }[] | null
  >();
  useEffect(() => {
    getMandates().then(data => setMandates(data));
    getDepartments().then(data => setDepartments(data));
    adminGetUsers().then((res) => {
      setUsers(res);
    });

  }, []);

  const updateUserState = (id: number, updatedFields: Partial<User>) => {
    GenericStateUpdater({ setState: setUsers, id, updatedFields })
  }
  const handleAddRow = () => {
    setIsAdding(true);
    setUsers((prevUsers) => [
      ...prevUsers,
      {
        Id: 0,
        FirstName: "",
        LastName: "",
        Email: "",
        DepartmentId: account.DepartmentId!,
        KeyUser: false,
        Mandates: [],
        Administrator: false,
        isNew: true, // Flag to indicate this is a new row
      },
    ]);
  };
  const handlePatchUser = async (id: number, user: Partial<User>) => {
    try {

      await adminUpdateUser(id, user);

      updateUserState(id, user);
    }
    catch (error) {

      GenericErrorSetter({ error, setErrors })

    }
  }
  const handleSaveNewUser = async (newUser: EditableUser) => {
    try {
      const sanitizedUser: EditableUser = { ...newUser };
      GenericAdd(Uservalidation, sanitizedUser)

      const addedUser = await adminCreateUser(sanitizedUser);
      if (newUser.Mandates.length > 0) {

        await assignMandate(addedUser.Id, newUser.Mandates)
      }
      setUsers((prevUsers) =>
        prevUsers.map((user) =>
          user.Id === newUser.Id ? { ...addedUser, isNew: false, Mandates: newUser.Mandates } : user
        )
      );
      setIsAdding(false);
    } catch (error) {
      GenericErrorSetter({ error, setErrors })
    }
  };

  const handleCancelNewUser = (id: number) => {
    GenericCancelAdd(id, setUsers, setIsAdding)
  };

  const memoizedData = useMemo(() => users, [users]);
  const memoizedMandates = useMemo(() => mandates, [mandates]);
  const memoizedDepartments = useMemo(() => departments, [departments]);
  const memoizedColumns = useMemo(() => adminusercolumns({ updateUserState, handleSaveNewUser, handleCancelNewUser, handlePatchUser, mandates, departments }), [memoizedMandates, memoizedDepartments]);


  return (
    <>
      <h2>Users</h2>
      <button
        onClick={handleAddRow}
        className="bg-blue-500 text-white px-4 py-2 rounded mb-4"
        disabled={isAdding}
      >
        Add New User
      </button>
      {users && (
        <>
          <DataTable

            columns={memoizedColumns}
            data={memoizedData}

          />
          {
            errors?.map(({ errormessage, id }) => (
              <p key={id} style={{ color: "red " }}>
                {errormessage}
              </p>
            ))}
        </>
      )}
    </>
  );
}


