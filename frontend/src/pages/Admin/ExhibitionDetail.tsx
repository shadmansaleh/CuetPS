import { useState, useEffect } from "react";
import { useParams } from "react-router-dom";
import {
  Form,
  Input,
  DatePicker,
  Button,
  Upload,
  message,
  Card,
  Image,
} from "antd";
import { UploadOutlined } from "@ant-design/icons";
import axios from "@/utils/axios";
import dayjs from "dayjs";
import { useQuery } from "react-query";
import { Exhibition } from "@/types";

const ExhibitionDetail = ({
  id,
  onSuccess,
}: {
  id: string;
  onSuccess: () => void;
}) => {
  // const { id } = useParams();
  const [form] = Form.useForm();
  const [loading, setLoading] = useState(false);
  const [exhibition, setExhibition] = useState<Exhibition | null>(null);
  const [previewImage, setPreviewImage] = useState<string | null>(null);
  const previewUrl = previewImage ? previewImage : exhibition?.thumbnail_url;

  const exhibitionQuery = useQuery(
    ["exhibition", id],
    async () => {
      const response = await axios.get(`/api/exhibitions/${id}`);
      return response.data;
    },
    {
      onSuccess: (data: any) => {
        setExhibition(data);
        form.setFieldsValue({
          title: data.title,
          description: data.description,
          start_date: dayjs(data.start_date),
          end_date: dayjs(data.end_date),
        });
      },
      onError: () => {
        message.error("Failed to load exhibition details.");
      },
    }
  );

  const handleSave = async (values: any) => {
    console.log("Form values:", values);
    if (!exhibition) {
      message.error("Exhibition not found.");
      return;
    }
    try {
      setLoading(true);
      let formData = new FormData();
      const appendIfChanged = (key: keyof Exhibition, value: any) => {
        if (exhibition[key] !== value) {
          formData.append(key, value);
        }
      };
      appendIfChanged("title", values.title);
      appendIfChanged("description", values.description);
      appendIfChanged("start_date", values.start_date.toISOString());
      appendIfChanged("end_date", values.end_date.toISOString());
      if (previewImage) {
        formData.append("file", values.thumbnail[0].originFileObj);
      }

      if ([...formData.keys()].length === 0) {
        message.info("No changes detected.");
        return;
      }
      await axios.put(`/api/exhibitions/${id}`, formData, {
        headers: { "Content-Type": "multipart/form-data" },
      });
      exhibitionQuery.refetch();
      message.success("Exhibition updated successfully!");
      onSuccess();
    } catch (error) {
      console.error("Error updating exhibition:", error);
      message.error("Failed to update exhibition.");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div style={styles.pageContainer}>
      <Card
        title="Edit Exhibition Details"
        loading={loading}
        bordered={false}
        style={styles.card}
      >
        <Form form={form} layout="vertical" onFinish={handleSave}>
          <Form.Item
            name="title"
            label="Exhibition Title"
            rules={[{ required: true, message: "Please enter the title" }]}
          >
            <Input placeholder="Enter title" />
          </Form.Item>
          <Form.Item
            name="description"
            label="Exhibition Description"
            rules={[
              { required: true, message: "Please enter the description" },
            ]}
          >
            <Input.TextArea
              style={{
                padding: "12px",
                fontSize: "16px",
                borderRadius: "8px",
              }}
              placeholder="Enter description"
            />
          </Form.Item>

          <Form.Item
            name="start_date"
            label="Start Date"
            rules={[{ required: true, message: "Please select a start date" }]}
          >
            <DatePicker style={{ width: "100%" }} />
          </Form.Item>

          <Form.Item
            name="end_date"
            label="End Date"
            rules={[{ required: true, message: "Please select an end date" }]}
          >
            <DatePicker style={{ width: "100%" }} />
          </Form.Item>

          <Image src={previewUrl} alt="Thumbnail" style={styles.thumbnail} />
          <Form.Item
            name="thumbnail"
            label="Thumbnail"
            valuePropName="fileList"
            getValueFromEvent={(e) => e?.fileList}
          >
            <Upload
              name="file"
              listType="picture"
              maxCount={1}
              accept="image/*"
              showUploadList={false}
              beforeUpload={() => {
                return false;
              }}
              onChange={(info) => {
                info.fileList = info.fileList.slice(-1); // Limit to one file
                let file = info.fileList[0]?.originFileObj;
                if (file) {
                  setPreviewImage(URL.createObjectURL(file)); // Generate a preview URL
                }
              }}
            >
              <Button icon={<UploadOutlined />}>Upload New Thumbnail</Button>
            </Upload>
          </Form.Item>

          <Form.Item>
            <Button
              type="primary"
              htmlType="submit"
              loading={loading || exhibitionQuery.isLoading}
              disabled={loading || exhibitionQuery.isLoading}
              style={styles.saveButton}
            >
              Save Changes
            </Button>
          </Form.Item>
        </Form>
      </Card>
    </div>
  );
};

const styles: { [key: string]: React.CSSProperties } = {
  pageContainer: {
    minHeight: "100vh",
    display: "flex",
    justifyContent: "center",
    alignItems: "center",
    backgroundColor: "#f0f2f5", // Light grey background
    padding: "20px",
  },
  card: {
    width: "600px",
    backdropFilter: "blur(10px)",
    background: "rgba(255, 255, 255, 0.2)",
    borderRadius: "15px",
    boxShadow: "0px 4px 10px rgba(0, 0, 0, 0.1)",
    padding: "20px",
  },
  thumbnail: {
    width: "120px",
    height: "120px",
    borderRadius: "10%",
    objectFit: "cover",
    display: "block",
    margin: "0 auto 15px auto",
  },
  saveButton: {
    width: "100%",
    fontSize: "16px",
  },
};

export default ExhibitionDetail;
