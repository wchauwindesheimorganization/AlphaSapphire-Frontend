import { createFileRoute } from "@tanstack/react-router";
import { DataTable } from "../components/Datatable";
import { User } from "@/models/User";
import { usercolumns } from "@/models/Columndefinitions/UserColumns";
import { getUsers } from "../api/userApi";
import { useState, useEffect, useContext } from "react";
import { createUser } from "../api/userApi";
import { UserContext } from "@/UserContext";
export const Route = createFileRoute("/users")({
  component: RouteComponent,
});

function RouteComponent() {
  type EditableUser = User & { isNew?: boolean };
  const userContext = useContext(UserContext);
  const account = userContext.account!;
  const [users, setUsers] = useState<User[]>([]);
  const [isAdding, setIsAdding] = useState(false);
  const [errors, setErrors] = useState<
    { id: number; errormessage: string }[] | null
  >();
  useEffect(() => {
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
    setUsers((prevUsers) =>
      prevUsers.map((user) =>
        user.Id === id ? { ...user, ...updatedFields } : user
      )
    );
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
        isNew: true, // Flag to indicate this is a new row
      },
    ]);
  };
  const handleSaveNewUser = async (newUser: EditableUser) => {
    try {
      const { isNew, ...sanitizedUser } = newUser;
      console.log(sanitizedUser)
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
      setUsers((prevUsers) =>
        prevUsers.map((user) =>
          user.Id === newUser.Id ? { ...addedUser, isNew: false } : user
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
  console.log(errors);
  console.log(account)
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
            columns={usercolumns(
              updateUserState,
              handleSaveNewUser,
              handleCancelNewUser
            )}
            data={users}
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
