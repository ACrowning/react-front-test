import { useEffect, useState } from "react";
import { Card, Button, Pagination, Row, Col, Alert, Spin, Modal } from "antd";
import styles from "../Home/home.module.css";
import { events } from "../../api/event";
import { DEFAULT_SIZE } from "../../constants";
import EventRegistration from "./components/registration";

const Home: React.FC = () => {
  const [currentPage, setCurrentPage] = useState(1);
  const [eventData, setEventData] = useState<{ events: any[]; total: number }>({
    events: [],
    total: 0,
  });
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [isModalVisible, setIsModalVisible] = useState(false);
  const [selectedEventId, setSelectedEventId] = useState<string | null>(null);

  useEffect(() => {
    fetchEvents(currentPage);
  }, [currentPage]);

  const fetchEvents = async (page: number) => {
    setLoading(true);
    setError(null);
    try {
      const response = await events.getEvents({
        sortBy: "title",
        sortOrder: "asc",
        page,
        limit: DEFAULT_SIZE,
      });

      if (response.error) {
        setError(response.error);
      } else if (response.data) {
        setEventData(response.data);
      }
    } catch (err) {
      setError("Failed to fetch events.");
    } finally {
      setLoading(false);
    }
  };

  const onPageChange = (page: number) => {
    setCurrentPage(page);
  };

  if (loading) {
    return <Spin size="large" />;
  }

  if (error) {
    return <Alert message={error} type="error" />;
  }

  const showModal = (eventId: string) => {
    setSelectedEventId(eventId);
    setIsModalVisible(true);
  };

  const handleClose = () => {
    setIsModalVisible(false);
    setSelectedEventId(null);
  };

  return (
    <div>
      <h2>Events</h2>

      <>
        <Row gutter={[16, 16]}>
          {eventData.events.map((event, index) => (
            <Col xs={24} sm={12} md={8} lg={6} key={index}>
              <Card className={styles.card} title={event.title} bordered={true}>
                <p>{event.description}</p>
                <div className={styles.cardActions}>
                  <Button type="link" onClick={() => showModal(event.id)}>
                    Register
                  </Button>
                  <Button type="link">View</Button>
                </div>
              </Card>
            </Col>
          ))}
        </Row>

        <Pagination
          current={currentPage}
          pageSize={DEFAULT_SIZE}
          total={eventData.total}
          onChange={onPageChange}
          showSizeChanger={false}
          className={styles.pagination}
        />
      </>
      <Modal
        title="Register for the Event"
        open={isModalVisible}
        onCancel={handleClose}
        footer={null}
      >
        {selectedEventId && (
          <EventRegistration eventId={selectedEventId} onClose={handleClose} />
        )}
      </Modal>
    </div>
  );
};

export default Home;
