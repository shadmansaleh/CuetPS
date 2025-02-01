import { Table, Button, message, Typography, Spin } from "antd";
import { useState, useEffect } from "react";
import axios from "axios"; // Import Axios for API calls
import styles from "./AdminPage.module.css";

const { Title } = Typography;

interface Photo {
  _id: string;
  title: string;
  uploader: { name: string };
  createdAt: string;
  photoUrl: string;
}

interface ExhibitionTableProps {
  exhibitionId: string;
  exhibitionName: string;
}

const ExhibitionTable: React.FC<ExhibitionTableProps> = ({
  exhibitionId,
  exhibitionName,
}) => {
  const [photos, setPhotos] = useState<Photo[]>([]); // Initialize as empty array
  const [loading, setLoading] = useState(false);
  const [visibleCount, setVisibleCount] = useState(5); // Default number of visible photos

  useEffect(() => {
    const fetchPhotos = async () => {
      setLoading(true);
      try {
        const response = await axios.get(
          `/api/exhibitions/${exhibitionId}/photos`
        );
        if (Array.isArray(response.data)) {
          setPhotos(response.data);
        } else {
          setPhotos([]); // Handle case where response is not an array
        }
      } catch (error) {
        console.error("Error fetching photos:", error);
        message.error("Failed to load photos.");
        setPhotos([]); // Handle error case
      } finally {
        setLoading(false);
      }
    };

    fetchPhotos();
  }, [exhibitionId]);

  const handleViewMoreClick = () => {
    setVisibleCount((prevCount) => prevCount + 5); // Load 5 more photos
  };

  const downloadPhoto = (id: string, title: string) => {
    try {
      const link = document.createElement("a");
      link.href = `/api/photos/${id}/download`;
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

  const columns = [
    {
      title: "Photo Title",
      dataIndex: "title",
      key: "title",
    },
    {
      title: "Uploader",
      key: "uploader",
      render: (_: any, record: Photo) => record.uploader?.name || "Unknown",
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
      render: (_: any, record: Photo) => (
        <>
          <Button
            type="link"
            onClick={() => window.open(record.photoUrl, "_blank")}
          >
            View
          </Button>
          <Button
            type="link"
            onClick={() => downloadPhoto(record._id, record.title)}
          >
            Download
          </Button>
        </>
      ),
    },
  ];

  return (
    <div className={styles.tableContainer}>
      <Title level={3}>{exhibitionName}</Title>
      {loading ? (
        <Spin tip="Loading photos..." />
      ) : (
        <>
          <Table
            columns={columns}
            dataSource={photos.slice(0, visibleCount)} // Limit to visibleCount
            rowKey="_id"
            bordered
            pagination={false}
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
        </>
      )}
    </div>
  );
};

export default ExhibitionTable;
