import React from "react";
import { Form, Input, DatePicker, Button, message, Card } from "antd";
import { UploadOutlined } from "@ant-design/icons";
import { Upload, UploadProps } from "antd";
import axios from "axios";
import moment, { Moment } from "moment";

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

  const onFinish = async (values: ExhibitionFormValues) => {
    try {
      const formData = new FormData();
      formData.append("title", values.title);
      formData.append("description", values.description); // Adding description
      formData.append("start_date", values.start_date!.toISOString()); // Format date as ISO string
      formData.append("end_date", values.end_date!.toISOString()); // Format date as ISO string
      formData.append("themePhoto", values.themePhoto[0].originFileObj); // Access the uploaded file

      // Post the data to the backend to create an exhibition
      const response = await axios.post("/api/exhibitions", formData, {
        headers: { "Content-Type": "multipart/form-data" },
      });

      // Handle success and reset the form
      if (response.status === 201) {
        message.success("Exhibition created successfully.");
        form.resetFields();
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
      console.log("File selected:", file);
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
