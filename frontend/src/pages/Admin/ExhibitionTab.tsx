import {
  Button,
  Modal,
  Input,
  Typography,
  Table,
  Select,
  Menu,
  Dropdown,
} from "antd";
import { useState } from "react";
import CreateExhibition from "./CreateExhibition";
import { useQuery } from "react-query";
import axios from "@/utils/axios";
import Loading from "@/components/Loading";
import styles from "./AdminPage.module.css";
import { Exhibition } from "@/types";
import { useNavigate } from "react-router-dom";

const { Title } = Typography;

const { Search } = Input;
const { Option } = Select;

function ExhibitionTab() {
  const [isModalVisible, setIsModalVisible] = useState(false);
  const [searchQuery, setSearchQuery] = useState("");
  const [filter, setFilter] = useState("all");
  const navigate = useNavigate();

  const [exhibitions, setExhibitions] = useState<Exhibition[]>([]);
  const exhibitionQuery = useQuery(
    "exhibitions",
    async () => {
      const { data } = await axios("/api/exhibitions");
      return data;
    },
    {
      onSuccess: (data) => {
        setExhibitions(
          data.sort(
            (a: Exhibition, b: Exhibition) =>
              new Date(b.start_date).getTime() -
              new Date(a.start_date).getTime()
          )
        );
      },
    }
  );

  const handleCreateExhibitionClick = () => {
    setIsModalVisible(true);
  };

  const handleCancelModal = () => {
    setIsModalVisible(false);
  };

  const getFilteredExhibitions = () => {
    const now = new Date();
    return exhibitions.filter((exhibition) => {
      const startDate = new Date(exhibition.start_date);
      const endDate = new Date(exhibition.end_date);
      if (filter === "upcoming") return startDate > now;
      if (filter === "ongoing") return startDate <= now && endDate >= now;
      if (filter === "past") return endDate < now;
      return true; // "all" case
    });
  };
  // Filter exhibitions based on search query
  const filteredExhibitions = getFilteredExhibitions().filter((exhibition) =>
    exhibition.title.toLowerCase().includes(searchQuery.toLowerCase())
  );

  const handleMenuClick = ({ id, key }: { key: string; id: string }) => {
    if (key === "viewDetails") {
      navigate(`/admin/exhibitions/${id}`);
    } else if (key === "seeAllPhotos") {
      navigate(`/admin/exhibitions/${id}/photos`);
    } else if (key === "seeAllRequests") {
      navigate(`/admin/exhibitions/${id}/approvals`);
    }
  };

  const menu = (id: string) => (
    <Menu
      onClick={({ key }) => handleMenuClick({ key, id })}
      items={[
        { label: "View Details", key: "viewDetails" },
        { label: "See Photos", key: "seeAllPhotos" },
        { label: "See Requests", key: "seeAllRequests" },
      ]}
    />
  );

  const tableColumns = [
    {
      title: "Thumbnail",
      key: "image",
      render: (_: any, exhibition: Exhibition) => (
        <img
          src={exhibition.thumbnail_url}
          alt={exhibition.title}
          className="max-w-20 max-h-20 object-cover rounded-md"
        />
      ),
    },
    {
      title: "Title",
      dataIndex: "title",
      key: "title",
      render: (text: string, record: Exhibition) => (
        <div
          onClick={() =>
            handleMenuClick({ key: "viewDetails", id: record._id })
          }
          className="cursor-pointer hover:text-blue-600"
        >
          {text}
        </div>
      ),
    },
    {
      title: "Description",
      dataIndex: "description",
      key: "description",
    },
    {
      title: "Starts At",
      dataIndex: "start_date",
      key: "start_date",
      render: (date: string) => {
        const formattedDate = new Date(date);
        return !isNaN(formattedDate.getTime())
          ? formattedDate.toLocaleDateString()
          : "Invalid Date";
      },
    },
    {
      title: "Duration",
      key: "duration",
      render: (record: any) => {
        const startDate = new Date(record.start_date);
        const endDate = new Date(record.end_date);
        const duration = endDate.getTime() - startDate.getTime();
        const days = duration / (1000 * 60 * 60 * 24);
        return `${days} days`;
      },
    },
    {
      title: "Photos",
      key: "photos",
      render: (exhibition: Exhibition) => {
        return (
          <div
            onClick={() =>
              handleMenuClick({
                key: "seeAllPhotos",
                id: exhibition._id,
              })
            }
          >
            <div className="text-green-600 flex justify-center align-center cursor-pointer  hover:text-blue-600">
              {exhibition.photos.filter((x: any) => x.selected).length}
            </div>
          </div>
        );
      },
    },
    {
      title: "Approval",
      key: "photos",
      render: (exhibition: Exhibition) => {
        return (
          <div
            onClick={() =>
              handleMenuClick({
                key: "seeAllRequests",
                id: exhibition._id,
              })
            }
          >
            <div className="text-purple-600 flex justify-center align-center cursor-pointer  hover:text-blue-600">
              {
                exhibition.photos.filter((x: any) => x.selected === false)
                  .length
              }
            </div>
          </div>
        );
      },
    },
    {
      title: "Action",
      key: "action",
      render: (exhibition: any) => (
        <Dropdown overlay={menu(exhibition._id)} trigger={["click"]}>
          <Button
            type="text"
            style={{
              fontSize: "18px",
              padding: "0 8px",
              lineHeight: "1",
              cursor: "pointer",
            }}
          >
            <div className=" flex justify-center align-center cursor-pointer text-blue-600">
              ...
            </div>
          </Button>
        </Dropdown>
      ),
    },
  ];

  if (exhibitionQuery.isLoading) return <Loading />;

  return (
    <div className="flex flex-col">
      <div className="flex justify-between mb-5">
        <Search
          placeholder="Search exhibition..."
          allowClear
          onChange={(e) => setSearchQuery(e.target.value)}
          className="w-1/3"
        />
        <Select defaultValue="all" onChange={setFilter} className="w-1/4 ml-2">
          <Option value="all">All</Option>
          <Option value="upcoming">Upcoming</Option>
          <Option value="ongoing">Ongoing</Option>
          <Option value="past">Past</Option>
        </Select>
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

      {!exhibitionQuery.isLoading && (
        <>
          <div className={styles.tableContainer}>
            <Title level={2}>Exhibitions</Title>
            <Table
              columns={tableColumns}
              dataSource={filteredExhibitions}
              rowKey="_id"
              bordered
              pagination={{
                defaultPageSize: 10,
                showSizeChanger: true,
                showTotal: (total, range) =>
                  `${range[0]}-${range[1]} of ${total} items`,
              }}
              loading={exhibitionQuery.isLoading}
            />
          </div>
        </>
      )}
    </div>
  );
}

export default ExhibitionTab;
