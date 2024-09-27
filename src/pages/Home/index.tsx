import { useEffect, useState } from "react";
import { Card, Button, Pagination, Row, Col, Alert, Spin } from "antd";
import styles from "../Home/home.module.css";
import { events } from "../../api/event";
import { DEFAULT_SIZE } from "../../constants";

const Home: React.FC = () => {
  const [currentPage, setCurrentPage] = useState(1);
  const [eventData, setEventData] = useState<{ events: any[]; total: number }>({
    events: [],
    total: 0,
  });
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const pageSize = DEFAULT_SIZE;

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
        limit: pageSize,
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

  return (
    <div>
      <h2>Events</h2>
      {loading ? (
        <Spin size="large" />
      ) : error ? (
        <Alert message={error} type="error" />
      ) : (
        <>
          <Row gutter={[16, 16]}>
            {eventData.events.map((event, index) => (
              <Col xs={24} sm={12} md={8} lg={6} key={index}>
                <Card title={event.title} bordered={true}>
                  <p>{event.description}</p>
                  <div className={styles.cardActions}>
                    <Button type="link">Register</Button>
                    <Button type="link">View</Button>
                  </div>
                </Card>
              </Col>
            ))}
          </Row>
          <Pagination
            current={currentPage}
            pageSize={pageSize}
            total={eventData.total}
            onChange={onPageChange}
            showSizeChanger={false}
            className={styles.pagination}
          />
        </>
      )}
    </div>
  );
};

export default Home;
