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
  const validEmail = (email: string) => {
    const emailRegex = /^[a-zA-Z]+(?:\.[a-zA-Z]+)*@[a-zA-Z0-9.-]+\.[a-zA-Z]{2,}$/gm;
    return emailRegex.test(email)
  }
  const arcadisEmail = (email: string) => {

    return email.split("@")[1] == "arcadis.com"
  }
  const sortMandatesByName = (mandates: Mandate[]) => {
    return mandates.slice().sort((a, b) => a.MandateName.localeCompare(b.MandateName));
  };

  const updateUserState = (id: number, updatedFields: Partial<User>) => {
    setUsers((prevUsers) => {
      const newusers = prevUsers.map((user) => {
        if (user.Id === id) {
          const updatedUser = { ...user, ...updatedFields };
          return {
            ...updatedUser,
            Mandates: sortMandatesByName(updatedUser.Mandates),
          };
        }
        return user;
      });
      return newusers;
    });
  };
  const handleAddRow = () => {
    setIsAdding(true);
    setUsers((prevUsers) => [
      ...prevUsers,
      {
        Id: 0,
        FirstName: "",
        LastName: "",
        Email: "",
        DepartmentId: account.DepartmentId,
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

      if (error instanceof Error && (error as any).response?.data) {
        const errorsWithId = (error as any).response?.data.map(
          (errormessage: string, id: number) => ({
            id: id,
            errormessage,
          })
        );
        setErrors(errorsWithId);
      } else {
        console.error("Unexpected error:", error);
        setErrors([{ errormessage: "An unexpected error occurred.", id: 1 }]);
      }
    }
  }
  const handleSaveNewUser = async (newUser: EditableUser) => {
    try {
      const { isNew, ...sanitizedUser } = newUser;
      const usererrors = [];
      if (sanitizedUser.FirstName === '') {
        usererrors.push("First name is required");
      }
      if (sanitizedUser.LastName === '') {
        usererrors.push("Last name is required");
      }
      if (sanitizedUser.Email === '') {
        usererrors.push("Email is required");
      }
      if (!sanitizedUser.DepartmentId) {
        usererrors.push("Department is empty, contact app administrator");
      }
      if (!validEmail(sanitizedUser.Email)) {
        usererrors.push("Must be valid email");
      }
      if (!arcadisEmail(sanitizedUser.Email)) {
        usererrors.push("Email must belong to the '@arcadis.com' domain");
      }
      if (usererrors.length > 0) {
        const error = new Error("An error occurred!") as Error & { response?: { data: Array<string> } };
        error.response = { data: usererrors };
        throw error;
      }
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
      if (error instanceof Error && (error as any).response?.data) {
        const errorsWithId = (error as any).response?.data.map(
          (errormessage: string, id: number) => ({
            id: id,
            errormessage,
          })
        );
        setErrors(errorsWithId);
      } else {
        console.error("Unexpected error:", error);
        setErrors([{ errormessage: "An unexpected error occurred.", id: 1 }]);
      }
    }
  };

  const handleCancelNewUser = (id: number) => {
    setUsers((prevUsers) => prevUsers.filter((user) => user.Id !== id));
    setIsAdding(false);
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

