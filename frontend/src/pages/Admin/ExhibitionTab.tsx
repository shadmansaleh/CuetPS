import { Button, Modal, Input } from "antd";
import { useState } from "react";
import CreateExhibition from "./CreateExhibition";
import ExhibitionTable from "./ExhibitionTable";
import { useQuery } from "react-query";
import axios from "@/utils/axios";
import Loading from "@/components/Loading";
import { Exhibition } from "@/types";

const { Search } = Input;

function ExhibitionTab() {
  const [isModalVisible, setIsModalVisible] = useState(false);
  const [searchQuery, setSearchQuery] = useState("");

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

  // Filter exhibitions based on search query
  const filteredExhibitions = exhibitions.filter((exhibition) =>
    exhibition.title.toLowerCase().includes(searchQuery.toLowerCase())
  );

  if (exhibitionQuery.isLoading) return <Loading />;
  
  return (
    <div className="flex flex-col">
      <div className="flex justify-between mb-5">
        <Search
          placeholder="Search exhibition..."
          allowClear
          onChange={(e) => setSearchQuery(e.target.value)}
          className="w-1/2"
        />
        <Button
          type="primary"
          onClick={handleCreateExhibitionClick}
          className="ml-auto"
        >
          Create Exhibition
        </Button>
      </div>

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

      {!exhibitionQuery.isLoading && filteredExhibitions.length === 0 && (
        <div>No exhibitions found.</div>
      )}

      {!exhibitionQuery.isLoading &&
        filteredExhibitions.map((exhibition) => (
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
