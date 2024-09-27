import React, { useEffect, useState } from "react";
import { Card, Row, Col, Spin, Alert, Input } from "antd";
import { useParams } from "react-router-dom";
import { participants } from "../../api/participant";
import styles from "../Participants/participants.module.css";

const { Search } = Input;

export const Participants: React.FC = () => {
  const { eventId } = useParams<{ eventId: string }>();
  const [participantData, setParticipantData] = useState<any[]>([]);
  const [filteredData, setFilteredData] = useState<any[]>([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [searchName, setSearchName] = useState("");
  const [searchEmail, setSearchEmail] = useState("");

  useEffect(() => {
    if (eventId) {
      fetchParticipants(eventId);
    }
  }, [eventId]);

  const fetchParticipants = async (eventId: string) => {
    setLoading(true);
    setError(null);
    try {
      const response = await participants.getParticipants({ eventId });

      if (response.error) {
        setError(response.error);
      } else if (response.data) {
        setParticipantData(response.data);
        setFilteredData(response.data);
      }
    } catch (err) {
      setError("Failed to fetch participants.");
    } finally {
      setLoading(false);
    }
  };

  const onSearchName = (value: string) => {
    setSearchName(value);
    filterParticipants(value, searchEmail);
  };

  const onSearchEmail = (value: string) => {
    setSearchEmail(value);
    filterParticipants(searchName, value);
  };

  const filterParticipants = (name: string, email: string) => {
    const filtered = participantData.filter((participant) => {
      return (
        participant.name.toLowerCase().includes(name.toLowerCase()) &&
        participant.email.toLowerCase().includes(email.toLowerCase())
      );
    });
    setFilteredData(filtered);
  };

  if (loading) {
    return <Spin size="large" />;
  }

  if (error) {
    return <Alert message={error} type="error" />;
  }

  return (
    <div>
      <h2>Participants</h2>

      <Search
        placeholder="Search by name"
        onSearch={onSearchName}
        value={searchName}
        onChange={(e) => onSearchName(e.target.value)}
        className={styles.searchName}
      />
      <Search
        placeholder="Search by email"
        onSearch={onSearchEmail}
        value={searchEmail}
        onChange={(e) => onSearchEmail(e.target.value)}
        className={styles.searchEmail}
      />

      <Row gutter={[16, 16]}>
        {filteredData.map((participant, index) => (
          <Col xs={24} sm={12} md={8} lg={6} key={index}>
            <Card
              className={styles.card}
              title={participant.name}
              bordered={true}
            >
              <p>Email: {participant.email}</p>
            </Card>
          </Col>
        ))}
      </Row>
    </div>
  );
};
