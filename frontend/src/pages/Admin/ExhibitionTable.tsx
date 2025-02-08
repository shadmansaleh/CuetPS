import { Table, Button, message, Typography, Menu, Dropdown } from "antd";
import { useState } from "react";
import axios from "@/utils/axios";
import styles from "./AdminPage.module.css";
import { Photo } from "@/types";
import { useNavigate } from "react-router-dom";
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
  const navigate = useNavigate();

  const handleMenuClick = ({ key }: { key: string }) => {
    if (key === "viewDetails") {
      navigate(`/admin/exhibitions/${exhibitionId}`);
    } else if (key === "seeAllPhotos") {
      navigate(`/admin/exhibitions/${exhibitionId}/photos`);
    } else if (key === "seeAllRequests") {
      navigate(`/admin/exhibitions/${exhibitionId}/approvals`);
    }
  };
  

  const menu = (
    <Menu
      onClick={handleMenuClick}
      items={[
        { label: "View Details", key: "viewDetails" },
        { label: "See Photos", key: "seeAllPhotos" },
        { label: "See Requests", key: "seeAllRequests" },
      ]}
    />
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
          {approval && (
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
            </>
          )}
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
        </>
      ),
    },
  ];

  return (
    <div className={styles.tableContainer}>
      <div
        style={{
          display: "flex",
          justifyContent: "space-between",
          alignItems: "center",
          marginBottom: "10px",
        }}
      >
        <Title level={3} style={{ margin: 0 }}>
          {exhibitionTitle}
        </Title>
        <Dropdown overlay={menu} trigger={["click"]}>
          <Button
            type="text"
            style={{
              fontSize: "18px",
              padding: "0 8px",
              lineHeight: "1",
              cursor: "pointer",
            }}
          >
            ...
          </Button>
        </Dropdown>
      </div>
    </div>
  );
};

export default ExhibitionTable;
