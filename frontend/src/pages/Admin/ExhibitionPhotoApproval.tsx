import { Table, Button, Typography, message } from "antd";
import { useState } from "react";
import { useQuery, useQueryClient, useMutation } from "react-query";
import axios from "@/utils/axios";
import { useParams } from "react-router-dom";
import { Photo } from "@/types";

const { Title } = Typography;

export default function ExhibitionPhotoApproval() {
  const { id } = useParams<{ id: string }>();
  const [approvalRequests, setApprovalRequests] = useState<Photo[]>([]);

  const queryClient = useQueryClient();

  const approvalQuery = useQuery(
    ["exhibition-approvals", id],
    async () => {
      const { data } = await axios.get(`/api/exhibitions/${id}/approval`);
      return data;
    },
    {
      onSuccess: (data) => setApprovalRequests(data),
    }
  );

  const downloadPhoto = async (url: string, title: string) => {
    try {
      const response = await fetch(url);
      const blob = await response.blob();
      const blobUrl = window.URL.createObjectURL(blob);
      const link = document.createElement("a");
      link.href = blobUrl;
      link.setAttribute("download", `${title}.jpg`);
      document.body.appendChild(link);
      link.click();
      document.body.removeChild(link);
      window.URL.revokeObjectURL(blobUrl);
      message.success("Photo downloaded successfully!");
    } catch (error) {
      console.error("Download error:", error);
      message.error("Failed to download photo.");
    }
  };

  const approvalAction = useMutation(
    async ({ photoId, accept }: { photoId: string; accept: boolean }) => {
      const { data } = await axios.post(
        `/api/exhibitions/${id}/${accept ? "approve" : "reject"}/${photoId}`
      );
      return data;
    },
    {
      onSuccess: (_, args) => {
        const { accept } = args;
        queryClient.invalidateQueries(["exhibition-photos", id]);
        queryClient.invalidateQueries(["photo-approval", id]);
        message.success(`Photo ${accept ? "approved" : "rejected"}`);
      },
      onError: (_, args) => {
        message.error(`Failed to ${args.accept ? "approve" : "reject"} photo`);
      },
    }
  );

  const tableColumns = [
    {
      title: "Photo",
      key: "image",
      render: (_: any, photo: Photo) => (
        <img
          src={photo.image_url}
          alt={photo.title}
          className="max-w-20 max-h-20 object-cover rounded-md cursor-pointer"
          onClick={() => window.open(photo.image_url, "_blank")}
        />
      ),
    },
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
            className="btn btn-sm btn-outline btn-success text-white"
            onClick={() =>
              approvalAction.mutate({ photoId: photo._id, accept: true })
            }
          >
            Accept
          </Button>
          <Button
            type="link"
            className="btn btn-sm btn-outline btn-error text-white"
            onClick={() =>
              approvalAction.mutate({ photoId: photo._id, accept: false })
            }
          >
            Reject
          </Button>
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
            onClick={() => downloadPhoto(photo.image_url, photo.title)}
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
        <Title level={4}>New Submissions</Title>
        <Table
          columns={tableColumns}
          dataSource={approvalRequests} // Limit to visibleCount
          rowKey="_id"
          bordered
          pagination={{
            defaultPageSize: 10,
            showSizeChanger: true,
            showTotal: (total, range) =>
              `${range[0]}-${range[1]} of ${total} items`,
          }}
          loading={approvalQuery.isLoading}
        />
      </div>
    </div>
  );
}
