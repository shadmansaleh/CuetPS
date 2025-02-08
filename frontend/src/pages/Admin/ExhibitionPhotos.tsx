import { Table, Button, message, Typography } from "antd";
import { useState } from "react";
import { useQuery } from "react-query";
import axios from "@/utils/axios";
import { useParams } from "react-router-dom";
import { Photo } from "@/types";

const { Title } = Typography;

export default function ExhibitionPhotos() {
  const { id } = useParams<{ id: string }>();
  const [photos, setPhotos] = useState<Photo[]>([]);
  const photoQuery = useQuery(
    ["exhibition-photos", id],
    async () => {
      const { data } = await axios.get(`/api/exhibitions/${id}/photos`);
      return data;
    },
    {
      onSuccess: (data) => setPhotos(data),
    }
  );

  const downloadPhoto = (id: string, title: string) => {
    try {
      const link = document.createElement("a");
      link.href = `/api/exhibitionPhotos/${id}/download`;
      link.setAttribute("download", `${title}.jpg`);
      document.body.appendChild(link);
      link.click();
      document.body.removeChild(link);
      message.success("Photo downloaded successfully!");
    } catch (error) {
      console.error("Download error:", error);
      message.error("Failed to download photo.");
    }
  };

  const tableColumns = [
    {
      title: "Photo Title",
      dataIndex: "title",
      key: "title",
    },
    {
      title: "Uploader",
      key: "uploader",
      render: (_: any, photo: Photo) =>
        (typeof photo.user === "object" && photo.user?.name) || "Unknown",
    },
    {
      title: "Uploaded At",
      dataIndex: "createdAt",
      key: "createdAt",
      render: (date: string) => {
        const formattedDate = new Date(date);
        return !isNaN(formattedDate.getTime())
          ? formattedDate.toLocaleString()
          : "Invalid Date";
      },
    },
    {
      title: "Actions",
      key: "actions",
      render: (_: any, photo: Photo) => (
        <>
          <Button
            type="link"
            className="btn btn-sm btn-outline btn-info text-white"
            onClick={() => window.open(photo.image_url, "_blank")}
          >
            View
          </Button>
          <Button
            type="link"
            className="btn btn-sm btn-outline btn-info text-white"
            onClick={() => downloadPhoto(photo._id, photo.title)}
          >
            Download
          </Button>
        </>
      ),
    },
  ];

  return (
    <div className="h-dvh w-dvw">
      <div className={" mt-20 mx-6 max-h-dvh overflow-y-auto"}>
        <Title level={4}>Photos</Title>
        <Table
          columns={tableColumns}
          dataSource={photos} // Limit to visibleCount
          rowKey="_id"
          bordered
          pagination={{
            defaultPageSize: 10,
            showSizeChanger: true,
            showTotal: (total, range) =>
              `${range[0]}-${range[1]} of ${total} items`,
          }}
          loading={photoQuery.isLoading}
        />
      </div>
    </div>
  );
}
