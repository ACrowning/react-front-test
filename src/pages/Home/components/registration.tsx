import React, { useState } from "react";
import { Form, Input, Button, Radio, Alert, DatePicker } from "antd";
import { participants } from "../../../api/participant";

interface EventRegistrationProps {
  eventId: string;
  onClose: () => void;
}

const EventRegistration: React.FC<EventRegistrationProps> = ({
  eventId,
  onClose,
}) => {
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const onFinish = async (values: any) => {
    setLoading(true);
    setError(null);
    try {
      const response = await participants.addParticipant({
        name: values.name,
        email: values.email,
        birthDate: values.birthDate.format("YYYY-MM-DD"),
        whereHear: values.whereHear,
        eventId,
      });

      if (response.error) {
        setError(response.error);
      } else {
        onClose();
      }
    } catch (err) {
      setError("Failed to register for the event.");
    } finally {
      setLoading(false);
    }
  };

  return (
    <Form onFinish={onFinish} layout="vertical">
      {error && <Alert message={error} type="error" />}

      <Form.Item
        label="Name"
        name="name"
        rules={[{ required: true, message: "Please input your name!" }]}
      >
        <Input />
      </Form.Item>

      <Form.Item
        label="Email"
        name="email"
        rules={[
          { required: true, message: "Please input your email!" },
          { type: "email", message: "Please input a valid email!" },
        ]}
      >
        <Input />
      </Form.Item>

      <Form.Item
        label="Birth Date"
        name="birthDate"
        rules={[{ required: true, message: "Please select your birth date!" }]}
      >
        <DatePicker style={{ width: "100%" }} />
      </Form.Item>

      <Form.Item
        label="Where did you hear about this event?"
        name="whereHear"
        rules={[{ required: true, message: "Please select an option!" }]}
      >
        <Radio.Group>
          <Radio value="social_media">Social Media</Radio>
          <Radio value="friends">Friends</Radio>
          <Radio value="found_myself">Found Myself</Radio>
        </Radio.Group>
      </Form.Item>

      <Form.Item>
        <Button type="primary" htmlType="submit" loading={loading}>
          Register
        </Button>
      </Form.Item>
    </Form>
  );
};

export default EventRegistration;
