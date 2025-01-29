// AdminPage.tsx
import { Tabs, Button, Modal, message } from "antd";
import { useState, useEffect } from "react";
import UserTable from "./UserTable";
import PhotoTable from "./PhotoTable";
import CreateExhibition from "./CreateExhibition";
import ExhibitionTable from "./ExhibitionTable";
import styles from "./AdminPage.module.css";
import axios from "axios";

const AdminPage = () => {
  const [isModalVisible, setIsModalVisible] = useState(false);
  const [exhibitions, setExhibitions] = useState<any[]>([]);

  useEffect(() => {
    // Temporary hardcoded exhibitions data
    setExhibitions([
      { _id: "1", number: 1, name: "Nature Photography" },
      { _id: "2", number: 2, name: "Urban Exploration" },
      { _id: "3", number: 3, name: "Artistic Vision" },
    ]);
  }, []);
  // useEffect(() => {
  //   async function fetchExhibitions() {
  //     try {
  //       const response = await axios.get("/api/exhibitions");
  //       setExhibitions(response.data);
  //     } catch (error) {
  //       console.error("Error fetching exhibitions:", error);
  //       message.error("Failed to load exhibitions.");
  //     }
  //   }
  //   fetchExhibitions();
  // }, []);
  

  const handleCreateExhibitionClick = () => {
    setIsModalVisible(true);
  };

  const handleCancelModal = () => {
    setIsModalVisible(false);
  };

  const tabItems = [
    {
      key: "1",
      label: "Manage Users",
      children: <UserTable />,
    },
    {
      key: "2",
      label: "Manage Photos",
      children: <PhotoTable />,
    },
    {
      key: "3",
      label: "Exhibition",
      children: (
        <div>
          {exhibitions.map((exhibition) => (
            <ExhibitionTable
              key={exhibition._id}
              exhibitionId={exhibition._id}
              exhibitionName={exhibition.name}
            />
          ))}
        </div>
      ),
    },
  ];

  return (
    <div className={styles.adminPage}>
      <h1 className={styles.pageTitle}>Admin Dashboard</h1>
      <Button
        type="primary"
        onClick={handleCreateExhibitionClick}
        style={{ marginBottom: "20px" }}
      >
        Create Exhibition
      </Button>
      <Tabs defaultActiveKey="1" className={styles.tabs} items={tabItems} />

      {/* Modal for CreateExhibition */}
      <Modal
        title="Create Exhibition"
        visible={isModalVisible}
        onCancel={handleCancelModal}
        footer={null}
        destroyOnClose
        width={600}
      >
        <CreateExhibition />
      </Modal>
    </div>
  );
};

export default AdminPage;
