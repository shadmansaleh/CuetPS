//UserTable.tsx
import { useState } from "react";
import { Table, Button, message } from "antd";
import axios from "@/utils/axios";
import styles from "./AdminPage.module.css";
import { useQuery } from "react-query";

interface User {
  _id: string;
  name: string;
  email: string;
  createdAt: string; // or Date if your API returns a Date object
}

const UserTable = () => {
  const [users, setUsers] = useState<User[]>([]); // Specify User[] type
  const userQuery = useQuery(
    "users",
    async () => {
      const { data } = await axios.get("/api/user");
      return data;
    },
    {
      onSuccess: (data) => setUsers(data),
      onError: () => message.error("Failed to fetch users."),
    }
  );

  const deleteUser = async (id: string) => {
    try {
      await axios.delete(`/api/users/${id}`);
      message.success("User deleted successfully.");
      userQuery.refetch();
    } catch (error) {
      console.error("Error deleting user:", error);
      message.error("Failed to delete user.");
    }
  };

  // Define table columns
  const columns = [
    {
      title: "Name",
      dataIndex: "name",
      key: "name",
    },
    {
      title: "Email",
      dataIndex: "email",
      key: "email",
    },
    {
      title: "Joined At",
      dataIndex: "createdAt",
      key: "createdAt",
      render: (date: string) => new Date(date).toLocaleString(), // Specify date type
    },
    {
      title: "Action",
      key: "action",
      render: (
        _: any,
        record: User // Type 'record' as User
      ) => (
        <Button danger onClick={() => deleteUser(record._id)}>
          Delete
        </Button>
      ),
    },
  ];

  return (
    <div className={styles.tableContainer}>
      <h2 className={styles.tableTitle}>Manage Users</h2>
      <Table
        columns={columns}
        dataSource={Array.isArray(users) ? users : []} // Ensure dataSource is always an array
        rowKey="_id" // Use `_id` as unique row identifier
        bordered
        loading={userQuery.isLoading} // Show loading state
      />
    </div>
  );
};

export default UserTable;
