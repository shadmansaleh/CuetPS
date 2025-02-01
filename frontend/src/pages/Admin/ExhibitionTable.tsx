import { Table, Button, message, Typography } from "antd";
import { useState } from "react";
import axios from "@/utils/axios"; // Import Axios for API calls
import styles from "./AdminPage.module.css";
import { Photo } from "@/types";
import { useMutation, useQueries, useQueryClient } from "react-query";

const { Title } = Typography;

interface ExhibitionTableProps {
  exhibitionId: string;
  exhibitionTitle: string;
}

const ExhibitionTable: React.FC<ExhibitionTableProps> = ({
  exhibitionId,
  exhibitionTitle,
}) => {
  const [visibleCount, setVisibleCount] = useState(5);
  const [photos, setPhotos] = useState<Photo[]>([]);
  const [approvalRequests, setApprovalRequests] = useState<Photo[]>([]);

  const queryClient = useQueryClient();

  const queries = useQueries([
    {
      queryKey: ["exhibition-photos", exhibitionId],
      queryFn: async () => {
        const { data } = await axios.get(
          `/api/exhibitions/${exhibitionId}/photos`
        );
        console.log("exhibition-photos", data);
        return data;
      },
      onSuccess: (data: Photo[]) => setPhotos(data),
    },
    {
      queryKey: ["photo-approval", exhibitionId],
      queryFn: async () => {
        const { data } = await axios.get(
          `/api/exhibitions/${exhibitionId}/approval`
        );
        console.log("exhibition-approval", data);
        return data;
      },
      onSuccess: (data: Photo[]) => setApprovalRequests(data),
    },
  ]);

  const handleViewMoreClick = () => {
    setVisibleCount((prevCount) => prevCount + 5); // Load 5 more exhibitionPhotos
  };

  const approvalAction = useMutation(
    async ({ photoId, accept }: { photoId: string; accept: boolean }) => {
      const { data } = await axios.post(
        `/api/exhibitions/${exhibitionId}/${
          accept ? "approve" : "reject"
        }/${photoId}`
      );
      return data;
    },
    {
      onSuccess: () => {
        queryClient.invalidateQueries(["exhibition-photos", exhibitionId]);
        queryClient.invalidateQueries(["photo-approval", exhibitionId]);
        message.success("Photo approved successfully");
      },
      onError: () => {
        message.error("Failed to approve photo");
      },
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

  const genTableColumns = (approval: boolean) => [
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
          {approval && (
            <>
              <Button
                type="link"
                className="btn btn-sm btn-success text-white"
                onClick={() =>
                  approvalAction.mutate({ photoId: photo._id, accept: true })
                }
              >
                Accept
              </Button>
              <Button
                type="link"
                className="btn btn-sm btn-error text-white"
                onClick={() =>
                  approvalAction.mutate({ photoId: photo._id, accept: false })
                }
              >
                Reject
              </Button>
            </>
          )}
          <>
            <Button
              type="link"
              className="btn btn-sm btn-info text-white"
              onClick={() => window.open(photo.image_url, "_blank")}
            >
              View
            </Button>
            <Button
              type="link"
              className="btn btn-sm btn-info text-white"
              onClick={() => downloadPhoto(photo._id, photo.title)}
            >
              Download
            </Button>
          </>
        </>
      ),
    },
  ];

  return (
    <div className={styles.tableContainer}>
      <Title level={3}>{exhibitionTitle}</Title>
      <Title level={4}>Submissions</Title>
      <Table
        columns={genTableColumns(true)}
        dataSource={approvalRequests.slice(0, visibleCount)} // Limit to visibleCount
        rowKey="_id"
        bordered
        pagination={false}
        loading={queries[1].isLoading}
      />
      <Title level={4}>Photos</Title>
      <Table
        columns={genTableColumns(false)}
        dataSource={photos.slice(0, visibleCount)} // Limit to visibleCount
        rowKey="_id"
        bordered
        pagination={false}
        loading={queries[0].isLoading}
      />
      {photos.length > visibleCount && (
        <Button
          type="link"
          onClick={handleViewMoreClick}
          style={{ marginTop: "10px" }}
        >
          View More
        </Button>
      )}
    </div>
  );
};

export default ExhibitionTable;
