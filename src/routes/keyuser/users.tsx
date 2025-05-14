import { createFileRoute } from "@tanstack/react-router";
import { DataTable } from "../../components/Datatable";
import { User } from "@/models/entities/User";
import { usercolumns } from "@/models/Columndefinitions/UserColumns";
import { getUsers, createUser, assignMandate, updateUser } from "../../api/userApi";
import { useState, useEffect, useContext, useMemo } from "react";
import { UserContext } from "@/UserContext";
import { getMandates } from "@/api/mandateApi";
import { Mandate } from "@/models/entities/Mandate";
export const Route = createFileRoute("/keyuser/users")({
  component: RouteComponent,
});

function RouteComponent() {
  type EditableUser = User & { isNew?: boolean };
  const userContext = useContext(UserContext);
  const account = userContext.account!;
  const [mandates, setMandates] = useState<Mandate[]>([]);
  const [users, setUsers] = useState<User[]>([]);
  const [isAdding, setIsAdding] = useState(false);

  const [errors, setErrors] = useState<
    { id: number; errormessage: string }[] | null
  >();
  useEffect(() => {
    getMandates().then(data => setMandates(data));

    getUsers().then((res) => {
      setUsers(res);
    });

  }, []);

  const validEmail = (email: string) => {
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    return emailRegex.test(email)
  }
  const arcadisEmail = (email: string) => {

    return email.split("@")[1] == "arcadis.com"
  }
  const updateUserState = (id: number, updatedFields: Partial<User>) => {
    setUsers((prevUsers) => {
      const newusers = prevUsers.map((user) => {
        return user.Id === id ? { ...user, ...updatedFields } : user
      })
      newusers.map((user) => { user.Mandates.sort((a, b) => a.MandateName.localeCompare(b.MandateName)) })
      return newusers;
    }
    );
  };
  console.log(account)
  const handleAddRow = () => {
    setIsAdding(true);
    setUsers((prevUsers) => [
      ...prevUsers,
      {
        Id: 0,
        FirstName: "",
        LastName: "",
        Email: "",
        Department: account.Department,
        KeyUser: false,
        Mandates: [],
        Administrator: false,
        isNew: true, // Flag to indicate this is a new row
      },
    ]);
  };
  const handlePatchUser = async (id: number, user: Partial<User>) => {
    try {

      await updateUser(id, user);
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
      if (!sanitizedUser.Department) {
        usererrors.push("Department Id is empty, contact app administrator");
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
      const addedUser = await createUser(sanitizedUser);
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
  const memoizedColumns = useMemo(() => usercolumns({ updateUserState, handleSaveNewUser, handleCancelNewUser, handlePatchUser, mandates }), [memoizedMandates]);

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

            columns={
              memoizedColumns}
            data={memoizedData}

          />
          {errors &&
            errors.map(({ errormessage, id }) => (
              <p key={id} style={{ color: "red " }}>
                {errormessage}
              </p>
            ))}
        </>
      )}
    </>
  );
}
