// AdminPage.tsx
import { Tabs } from "antd";
import UserTable from "./UserTable";
import PhotoTable from "./PhotoTable";
import styles from "./AdminPage.module.css";
import ExhibitionTab from "./ExhibitionTab";
import { useParams, useNavigate } from "react-router-dom";

const AdminPage = () => {
  // get url params
  const { path } = useParams<{ path: string }>();
  const navigate = useNavigate();
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
      children: <ExhibitionTab />,
    },
  ];

  let tabKey = path;
  switch (path) {
    case "users":
      tabKey = "1";
      break;
    case "photos":
      tabKey = "2";
      break;
    case "exhibition":
      tabKey = "3";
      break;
    default:
      tabKey = "1";
  }

  return (
    <div className={styles.adminPage}>
      <h1 className={styles.pageTitle}>Admin Dashboard</h1>
      <Tabs
        defaultActiveKey={tabKey}
        className={styles.tabs}
        items={tabItems}
        onChange={(key) => {
          let newPath = "";
          switch (key) {
            case "1":
              newPath = "users";
              break;
            case "2":
              newPath = "photos";
              break;
            case "3":
              newPath = "exhibition";
              break;
            default:
              newPath = "users";
          }
          navigate(`/admin/${newPath}`);
        }}
      />
    </div>
  );
};

export default AdminPage;
