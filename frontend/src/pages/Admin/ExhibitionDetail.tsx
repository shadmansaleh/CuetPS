import { useState, useEffect } from "react";
import { useParams } from "react-router-dom";
import { Form, Input, DatePicker, Button, Upload, message, Card, Image } from "antd";
import { UploadOutlined } from "@ant-design/icons";
import axios from "@/utils/axios";
import dayjs from "dayjs";

const ExhibitionDetail: React.FC = () => {
  const { id } = useParams();
  const [form] = Form.useForm();
  const [loading, setLoading] = useState(false);
  const [thumbnail, setThumbnail] = useState<string | null>(null);
  const [previewImage, setPreviewImage] = useState<string | null>(null);

  useEffect(() => {
    const fetchExhibition = async () => {
      try {
        setLoading(true);
        const { data } = await axios.get(`/api/exhibitions/${id}`);
        console.log("Exhibition ID:", id);

        form.setFieldsValue({
          title: data.title,
          description: data.description,  // Change to lowercase 'description'
          startDate: dayjs(data.start_date),
          endDate: dayjs(data.end_date),
        });
        

        setThumbnail(data.thumbnail_url);
        setPreviewImage(data.thumbnail_url);
      } catch (error) {
        message.error("Failed to load exhibition details.");
      } finally {
        setLoading(false);
      }
    };

    fetchExhibition();
  }, [id, form]);

  const handleSave = async (values: any) => {
    try {
      setLoading(true);
      await axios.put(`/api/exhibitions/${id}`, {
        title: values.title,
        description: values.description,
        startDate: values.startDate.toISOString(),
        endDate: values.endDate.toISOString(),
        thumbnail,
      });
      message.success("Exhibition updated successfully!");
    } catch (error) {
      message.error("Failed to update exhibition.");
    } finally {
      setLoading(false);
    }
  };

  const handleUpload = async (file: File) => {
    const formData = new FormData();
    formData.append("thumbnail", file);

    try {
      const { data } = await axios.post(
        `/api/exhibitions/${id}/upload-thumbnail`,
        formData,
        {
          headers: {
            "Content-Type": "multipart/form-data",
          },
        }
      );

      setThumbnail(data.url);
      setPreviewImage(data.url);
      message.success("Thumbnail uploaded successfully!");
    } catch (error) {
      message.error("Failed to upload thumbnail.");
    }
  };

  return (
    <div style={styles.pageContainer}>
      <Card title="Edit Exhibition Details" loading={loading} bordered={false} style={styles.card}>
        <Form form={form} layout="vertical" onFinish={handleSave}>
          <Form.Item name="title" label="Exhibition Title" rules={[{ required: true, message: "Please enter the title" }]}>
            <Input placeholder="Enter title" />
          </Form.Item>
          <Form.Item name="description" label="Exhibition Description" rules={[{ required: true, message: "Please enter the description" }]}>
            <Input.TextArea style={{
              padding: "12px",
              fontSize: "16px",
              borderRadius: "8px",
            }} placeholder="Enter description" />
          </Form.Item>

          <Form.Item name="startDate" label="Start Date" rules={[{ required: true, message: "Please select a start date" }]}>
            <DatePicker style={{ width: "100%" }} />
          </Form.Item>

          <Form.Item name="endDate" label="End Date" rules={[{ required: true, message: "Please select an end date" }]}>
            <DatePicker style={{ width: "100%" }} />
          </Form.Item>

          <Form.Item label="Thumbnail">
            {previewImage && (
              <Image
                src={previewImage}
                alt="Thumbnail"
                style={styles.thumbnail}
              />
            )}
            <Upload
              showUploadList={false}
              beforeUpload={(file) => {
                handleUpload(file);
                return false;
              }}
            >
              <Button icon={<UploadOutlined />}>Upload New Thumbnail</Button>
            </Upload>
          </Form.Item>

          <Form.Item>
            <Button type="primary" htmlType="submit" loading={loading} style={styles.saveButton}>
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
    borderRadius: "50%",
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
