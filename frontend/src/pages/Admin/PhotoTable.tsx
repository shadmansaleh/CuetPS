//PhotoTable.tsx
import { useEffect, useState } from "react";
import { Table, Button, message } from "antd";
import axios from "axios";
import styles from "./AdminPage.module.css";

const PhotoTable = () => {
  const [photos, setPhotos] = useState<any[]>([]); // Ensure photos is always an array
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    fetchPhotos();
  }, []);

  const fetchPhotos = async () => {
    setLoading(true);
    try {
      const response = await axios.get("/api/photos");
      if (Array.isArray(response.data)) {
        setPhotos(response.data);
      } else {
        message.error("Unexpected response format from API.");
        setPhotos([]); // Ensure photos is an empty array on error
      }
    } catch (error) {
      console.error("Error fetching photos:", error);
      message.error("Failed to fetch photos.");
      setPhotos([]); // Ensure photos is an empty array on error
    } finally {
      setLoading(false);
    }
  };

  const downloadPhoto = async (id: string, title: string) => {
    try {
      const response = await axios.get(`/api/photos/${id}/download`, {
        responseType: "blob",
      });
      const url = window.URL.createObjectURL(new Blob([response.data]));
      const link = document.createElement("a");
      link.href = url;
      link.setAttribute("download", `${title}.jpg`);
      document.body.appendChild(link);
      link.click();
      link.remove();
    } catch (error) {
      console.error("Error downloading photo:", error);
      message.error("Failed to download photo.");
    }
  };

  const columns = [
    { title: "Photo Title", dataIndex: "title", key: "title" },
    {
      title: "Uploader",
      key: "uploader",
      render: (_: any, record: any) => record.uploader?.name || "Unknown",
    },
    {
      title: "Uploaded At",
      dataIndex: "createdAt",
      key: "createdAt",
      render: (date: string) => {
        // Ensure the date is properly formatted
        const formattedDate = new Date(date);
        return !isNaN(formattedDate.getTime()) ? formattedDate.toLocaleString() : "Invalid Date";
      },
    },
    {
      title: "Action",
      key: "action",
      render: (_: any, record: any) => (
        <>
          <Button
            type="link"
            onClick={() => window.open(record.photoUrl, "_blank")}
          >
            View
          </Button>
          <Button onClick={() => downloadPhoto(record._id, record.title)}>
            Download
          </Button>
        </>
      ),
    },
  ];

  return (
    <div className={styles.tableContainer}>
      <h2 className={styles.tableTitle}>Manage Submitted Photos</h2>
      <Table
        columns={columns}
        dataSource={photos}
        rowKey="_id"
        bordered
        loading={loading}
        pagination={false} // Optional: Disables pagination if not needed
      />
    </div>
  );
};

export default PhotoTable;
