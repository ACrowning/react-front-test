import { useEffect, useState } from "react";
import {
  Card,
  Button,
  Pagination,
  Row,
  Col,
  Alert,
  Spin,
  Modal,
  Select,
} from "antd";
import styles from "../Home/home.module.css";
import { events } from "../../api/event";
import {
  DEFAULT_FIELD,
  DEFAULT_PAGE,
  DEFAULT_SIZE,
  DEFAULT_SORT,
} from "../../constants";
import EventRegistration from "./components/registration";
import { useNavigate } from "react-router-dom";

const Home: React.FC = () => {
  const [currentPage, setCurrentPage] = useState(DEFAULT_PAGE);
  const [eventData, setEventData] = useState<{ events: any[]; total: number }>({
    events: [],
    total: 0,
  });
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [isModalVisible, setIsModalVisible] = useState(false);
  const [selectedEventId, setSelectedEventId] = useState<string | null>(null);
  const [sortField, setSortField] = useState<string>(DEFAULT_FIELD);
  const [sortOrder, setSortOrder] = useState<string>(DEFAULT_SORT);
  const navigate = useNavigate();

  const { Option } = Select;

  useEffect(() => {
    fetchEvents(currentPage, sortField, sortOrder);
  }, [currentPage, sortField, sortOrder]);

  const fetchEvents = async (
    page: number,
    sortBy: string,
    sortOrder: string
  ) => {
    setLoading(true);
    setError(null);
    try {
      const response = await events.getEvents({
        sortBy,
        sortOrder,
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

  const handleSortChange = (value: string) => {
    setSortField(value);
  };

  const handleOrderChange = (value: string) => {
    setSortOrder(value);
  };

  const showModal = (eventId: string) => {
    setSelectedEventId(eventId);
    setIsModalVisible(true);
  };

  const handleClose = () => {
    setIsModalVisible(false);
    setSelectedEventId(null);
  };

  const handleViewParticipants = (eventId: string) => {
    navigate(`/event/${eventId}/participants`);
  };

  return (
    <div>
      <h2>Events</h2>

      <div style={{ marginBottom: "16px" }}>
        <Select
          value={sortField}
          className={styles.sortField}
          onChange={handleSortChange}
        >
          <Option value="title">Title</Option>
          <Option value="date">Event Date</Option>
          <Option value="organizer">Organizer</Option>
        </Select>

        <Select
          value={sortOrder}
          className={styles.sortOrder}
          onChange={handleOrderChange}
        >
          <Option value="asc">Ascending</Option>
          <Option value="desc">Descending</Option>
        </Select>
      </div>

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
                  <Button
                    type="link"
                    onClick={() => handleViewParticipants(event.id)}
                  >
                    View
                  </Button>
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
