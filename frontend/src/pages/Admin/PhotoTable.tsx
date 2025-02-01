//PhotoTable.tsx
import { useState } from "react";
import { Table, Button, message } from "antd";
import axios from "@/utils/axios";
import styles from "./AdminPage.module.css";
import { useQuery } from "react-query";
import Loading from "@/components/Loading";
import { Photo } from "@/types";

const PhotoTable = () => {
  const [photos, setPhotos] = useState<Photo[]>([]); // Ensure photos is always an array

  const photoQuery = useQuery(
    "all-photos",
    async () => {
      const { data } = await axios.get("/api/photos/all/");
      return data;
    },
    {
      onSuccess: (data) => setPhotos(data),
      onError: () => message.error("Failed to fetch photos."),
    }
  );

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
      render: (_: any, photo: Photo) =>
        typeof photo.user === "object" ? photo.user.name : "Unknown",
    },
    {
      title: "Uploaded At",
      dataIndex: "createdAt",
      key: "createdAt",
      render: (date: string) => {
        // Ensure the date is properly formatted
        const formattedDate = new Date(date);
        return !isNaN(formattedDate.getTime())
          ? formattedDate.toLocaleString()
          : "Invalid Date";
      },
    },
    {
      title: "Action",
      key: "action",
      render: (_: any, photo: Photo) => (
        <>
          <Button
            type="link"
            onClick={() => window.open(photo.image_url, "_blank")}
          >
            View
          </Button>
          <Button onClick={() => downloadPhoto(photo._id, photo.title)}>
            Download
          </Button>
        </>
      ),
    },
  ];

  if (photoQuery.isLoading) return <Loading />;
  return (
    <div className={styles.tableContainer}>
      <h2 className={styles.tableTitle}>Manage Submitted Photos</h2>
      <Table
        columns={columns}
        dataSource={photos}
        rowKey="_id"
        bordered
        loading={photoQuery.isLoading}
        pagination={{
          pageSize: 25,
        }}
      />
    </div>
  );
};

export default PhotoTable;
