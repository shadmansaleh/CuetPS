import React from "react";
import { Form, Input, DatePicker, Button, message, Card } from "antd";
import { UploadOutlined } from "@ant-design/icons";
import { Upload, UploadProps } from "antd";
import axios from "@/utils/axios";
import moment, { Moment } from "moment";
import { QueryClient } from "react-query";

// Define the interface for form values
interface ExhibitionFormValues {
  title: string;
  description: string;
  start_date: Moment | null;
  end_date: Moment | null;
  themePhoto: any;
}

const CreateExhibition: React.FC = () => {
  const [form] = Form.useForm();
  const queryClient = new QueryClient();

  const onFinish = async (values: ExhibitionFormValues) => {
    try {
      const uploadThumbnailData = new FormData();
      const file = values.themePhoto[0].originFileObj;
      uploadThumbnailData.append("file", file);
      uploadThumbnailData.append("contentType", file.type);
      const uploaded = await axios.post(
        "/api/storage/upload",
        uploadThumbnailData,
        {
          headers: { "Content-Type": "multipart/form-data" },
        }
      );
      if (uploaded.status === 200) {
        const response = await axios.post("/api/exhibitions/create", {
          title: values.title,
          description: values.description,
          start_date: values.start_date!.toISOString(),
          end_date: values.end_date!.toISOString(),
          thumbnail_url: uploaded.data,
          status: "upcoming",
        });

        if (response.status === 201) {
          message.success("Exhibition created successfully.");
          form.resetFields();
          queryClient.invalidateQueries("exhibitions");
        }
      }
    } catch (error: any) {
      const errorMsg =
        error.response?.data?.message || "Failed to create exhibition.";
      console.error("Error creating exhibition:", errorMsg);
      message.error(errorMsg);
    }
  };

  // Define upload properties for the theme photo
  const uploadProps: UploadProps = {
    name: "file", // Ensure this matches the backend field name
    listType: "picture", // To display uploaded images as thumbnails
    maxCount: 1, // Limit to one file
    accept: "image/*", // Only accept image files
    beforeUpload: (file: File) => {
      // Prevent auto-upload; manually handle it via FormData
      return false;
    },
  };

  return (
    <Card
      title="Create Exhibition"
      bordered={false}
      style={{
        width: "100%",
        maxWidth: 600,
        margin: "0 auto",
        backgroundColor: "#f9f9f9",
        boxShadow: "0 4px 12px rgba(0, 0, 0, 0.1)",
        borderRadius: "8px",
        padding: "20px",
      }}
    >
      <Form form={form} layout="vertical" onFinish={onFinish}>
        {/* Title Field */}
        <Form.Item
          name="title"
          label="Exhibition Title"
          rules={[{ required: true, message: "Please input the title!" }]}
        >
          <Input
            style={{
              padding: "12px",
              fontSize: "16px",
              borderRadius: "8px",
            }}
          />
        </Form.Item>

        {/* Description Field */}
        <Form.Item
          name="description"
          label="Exhibition Description"
          rules={[{ required: true, message: "Please input the description!" }]}
        >
          <Input.TextArea
            style={{
              padding: "12px",
              fontSize: "16px",
              borderRadius: "8px",
            }}
            rows={4}
          />
        </Form.Item>

        {/* Start Date Field */}
        <Form.Item
          name="start_date"
          label="Start Date"
          rules={[{ required: true, message: "Please select a start date!" }]}
        >
          <DatePicker
            style={{ width: "100%" }}
            disabledDate={(current) =>
              current && current < moment().endOf("day")
            }
          />
        </Form.Item>

        {/* End Date Field */}
        <Form.Item
          name="end_date"
          label="End Date"
          rules={[{ required: true, message: "Please select an end date!" }]}
        >
          <DatePicker
            style={{ width: "100%" }}
            disabledDate={(current) =>
              current && current < moment().endOf("day")
            }
          />
        </Form.Item>

        {/* Theme Photo Upload */}
        <Form.Item
          name="themePhoto"
          label="Theme Cover Photo"
          valuePropName="fileList"
          getValueFromEvent={(e) => e?.fileList}
          rules={[
            { required: true, message: "Please upload a theme cover photo!" },
          ]}
        >
          <Upload {...uploadProps} showUploadList={false}>
            <Button icon={<UploadOutlined />} style={{ width: "100%" }}>
              Upload Theme Photo
            </Button>
          </Upload>
        </Form.Item>

        {/* Submit Button */}
        <Form.Item>
          <Button
            type="primary"
            htmlType="submit"
            style={{
              width: "100%",
              padding: "12px",
              fontSize: "16px",
              borderRadius: "8px",
            }}
          >
            Create Exhibition
          </Button>
        </Form.Item>
      </Form>
    </Card>
  );
};

export default CreateExhibition;
