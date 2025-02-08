import { Form, Input, DatePicker, Button, message, Card } from "antd";
import { UploadOutlined } from "@ant-design/icons";
import { Upload, UploadProps } from "antd";
import axios from "@/utils/axios";
import moment, { Moment } from "moment";
import { QueryClient } from "react-query";
import { useState } from "react";

// Define the interface for form values
interface ExhibitionFormValues {
  title: string;
  description: string;
  start_date: Moment | null;
  end_date: Moment | null;
  themePhoto: any;
}

const CreateExhibition = ({ onSuccess }: { onSuccess: () => void }) => {
  const [form] = Form.useForm();
  const queryClient = new QueryClient();
  const [previewUrl, setPreviewUrl] = useState<string | null>(null);

  const onFinish = async (values: ExhibitionFormValues) => {
    try {
      const formData = new FormData();
      const file = values.themePhoto[0].originFileObj;
      formData.append("file", file);
      formData.append("contentType", file.type);
      formData.append("title", values.title);
      formData.append("description", values.description);
      formData.append("start_date", values.start_date!.toISOString());
      formData.append("end_date", values.end_date!.toISOString());
      formData.append("status", "upcoming");

      if (
        values.start_date &&
        values.end_date &&
        values.end_date < values.start_date
      ) {
        message.error("End date must be after start date.");
        return;
      }

      const res = await axios.post("/api/exhibitions/create", formData, {
        headers: { "Content-Type": "multipart/form-data" },
      });

      if (res.status === 201) {
        message.success("Exhibition created successfully.");
        form.resetFields();
        queryClient.invalidateQueries("exhibitions");
        onSuccess();
      }
    } catch (error: any) {
      const errorMsg =
        error.response?.data?.message || "Failed to create exhibition.";
      console.error("Error creating exhibition:", error);
      message.error(errorMsg);
    }
  };

  // Define upload properties for the theme photo
  const uploadProps: UploadProps = {
    name: "file", // Ensure this matches the backend field name
    listType: "picture", // To display uploaded images as thumbnails
    maxCount: 1, // Limit to one file
    accept: "image/*", // Only accept image files
    beforeUpload: () => {
      // Prevent auto-upload; manually handle it via FormData
      return false;
    },
    onChange: (info) => {
      info.fileList = info.fileList.slice(-1); // Limit to one file
      let file = info.fileList[0]?.originFileObj;
      if (file) {
        setPreviewUrl(URL.createObjectURL(file)); // Generate a preview URL
      }
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
          required
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
          required
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
          required
          rules={[{ required: true, message: "Please select a start date!" }]}
        >
          <DatePicker
            style={{ width: "100%" }}
            disabledDate={(current) =>
              current && current < moment().subtract(1, "days").endOf("day")
            }
          />
        </Form.Item>

        {/* End Date Field */}
        <Form.Item
          name="end_date"
          label="End Date"
          required
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
        {previewUrl && (
          <div className="mt-4">
            <h4 className="text-sm font-semibold">Preview:</h4>
            <img
              src={previewUrl}
              alt="Selected preview"
              className="w-full h-auto rounded-lg mt-2 shadow-md"
            />
          </div>
        )}
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
