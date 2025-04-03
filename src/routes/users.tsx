import { createFileRoute } from "@tanstack/react-router";
import { DataTable } from "../components/Datatable";
import { User, columns as usercolumns } from "../models/User";
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
