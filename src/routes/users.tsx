import { createFileRoute } from "@tanstack/react-router";
import { DataTable } from "../components/Datatable";
// import { Payment, columns } from "../models/UserColumns";
import { User, columns as usercolumns } from "../models/User";
import { getUsers } from "../api/userApi";
import { useState, useEffect } from "react";
export const Route = createFileRoute("/users")({
  component: RouteComponent,
});

function RouteComponent() {
  // var data: Payment[] = [
  //   {
  //     id: "728ed52f",
  //     amount: 100,
  //     status: "pending",
  //     email: "m@example.com",
  //   },
  //   {
  //     id: "728ed52f",
  //     amount: 110,
  //     status: "pending",
  //     email: "m@example.com",
  //   },
  //   {
  //     id: "728ed52f",
  //     amount: 100,
  //     status: "pending",
  //     email: "m@example.com",
  //   },
  //   {
  //     id: "728ed52f",
  //     amount: 100,
  //     status: "pending",
  //     email: "m@example.com",
  //   },
  //   {
  //     id: "728ed52f",
  //     amount: 100,
  //     status: "pending",
  //     email: "m@example.com",
  //   },
  //   // ...
  // ];
  const [users, setUsers] = useState<User[]>([]);
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
  return (
    <>
      {users && (
        <DataTable columns={usercolumns(updateUserState)} data={users} />
      )}
    </>
  );
}
