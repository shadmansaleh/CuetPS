import { Table, Button, Typography } from "antd";
import { useState } from "react";
import { useQuery } from "react-query";
import axios from "@/utils/axios";
import { useParams } from "react-router-dom";
import { Photo } from "@/types";

const { Title } = Typography;

export default function ExhibitionPhotoApproval() {
  const { id } = useParams<{ id: string }>();
  const [approvalRequests, setApprovalRequests] = useState<Photos[]>([]);
  const approvalQuery = useQuery(
    ["exhibition-approvals", id],
    async () => {
      const { data } = await axios.get(`/api/exhibitions/${id}/approval`);
      return data;
    },
    {
      onSuccess: (data) => setApprovalRequests(data),
    },
  );

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
      <div className={" mt-20 mx-6"}>
        <Title level={4}>New Submissions</Title>
        <Table
          columns={tableColumns}
          dataSource={approvalRequests} // Limit to visibleCount
          rowKey="_id"
          bordered
          pagination={false}
          loading={approvalQuery.isLoading}
        />
      </div>
    </div>
  );
}
