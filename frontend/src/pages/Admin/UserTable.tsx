//UserTable.tsx
import { useEffect, useState } from "react";
import { Table, Button, message } from "antd";
import axios from "axios";
import styles from "./AdminPage.module.css";

interface User {
  _id: string;
  name: string;
  email: string;
  createdAt: string; // or Date if your API returns a Date object
}

const UserTable = () => {
  const [users, setUsers] = useState<User[]>([]); // Specify User[] type
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    fetchUsers(); // Fetch users when the component is mounted
  }, []);

  const fetchUsers = async () => {
    setLoading(true); // Show loading spinner
    try {
      const response = await axios.get("/api/users");
      console.log("API Response:", response.data); // Debug API response

      if (Array.isArray(response.data)) {
        setUsers(response.data); // Set users if response is valid
      } else {
        message.error("Unexpected response format from API.");
        setUsers([]); // Reset to empty array if format is invalid
      }
    } catch (error) {
      console.error("Error fetching users:", error);
      message.error("Failed to fetch users.");
      setUsers([]); // Reset to empty array on error
    } finally {
      setLoading(false); // Hide loading spinner
    }
  };

  const deleteUser = async (id: string) => { // Define 'id' as string
    try {
      await axios.delete(`/api/users/${id}`);
      message.success("User deleted successfully.");
      fetchUsers(); // Refresh the user list after deletion
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
      render: (_: any, record: User) => ( // Type 'record' as User
        <Button
          danger
          onClick={() => deleteUser(record._id)}
        >
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
        loading={loading} // Show loading state
      />
    </div>
  );
};

export default UserTable;
