// AdminPage.tsx
import { Button, Modal } from "antd";
import { useState } from "react";
import CreateExhibition from "./CreateExhibition";
import ExhibitionTable from "./ExhibitionTable";
import styles from "./AdminPage.module.css";
import { useQuery } from "react-query";
import axios from "@/utils/axios";
import Loading from "@/components/Loading";
import { Exhibition } from "@/types";

function ExhibitionTab() {
  const [isModalVisible, setIsModalVisible] = useState(false);

  const [exhibitions, setExhibitions] = useState<Exhibition[]>([]);
  const exhibitionQuery = useQuery(
    "exhibitions",
    async () => {
      const { data } = await axios("/api/exhibitions");
      return data;
    },
    {
      onSuccess: (data) => {
        setExhibitions(data);
      },
    }
  );

  const handleCreateExhibitionClick = () => {
    setIsModalVisible(true);
  };

  const handleCancelModal = () => {
    setIsModalVisible(false);
  };

  if (exhibitionQuery.isLoading) return <Loading />;
  return (
    <div>
      <Button
        type="primary"
        onClick={handleCreateExhibitionClick}
        style={{ marginBottom: "20px" }}
      >
        Create Exhibition
      </Button>
      {/* Modal for CreateExhibition */}
      <Modal
        title="Create Exhibition"
        open={isModalVisible}
        onCancel={handleCancelModal}
        footer={null}
        destroyOnClose
        width={600}
      >
        <CreateExhibition />
      </Modal>
      {exhibitionQuery.isError && <div>Failed to load exhibitions</div>}
      {exhibitionQuery.isLoading && <Loading />}
      {!exhibitionQuery.isLoading &&
        exhibitions.map((exhibition) => (
          <ExhibitionTable
            key={exhibition._id}
            exhibitionId={exhibition._id}
            exhibitionTitle={exhibition.title}
          />
        ))}
    </div>
  );
}

export default ExhibitionTab;
