import React from "react";
import Badge from "react-bootstrap/Badge";
import Container from "react-bootstrap/Container";
import Card from "react-bootstrap/Card";
import { Row, Col } from "react-bootstrap";
import statusColors from "./Utils";

const StatusCounter = ({ data, statusMap }) => {
  const countStatus = () => {
    const statusCounts = {};
    data.forEach((item) => {
      const status = statusMap[item.id] || "Status"; // Get the status for the current job or use 'Status' as the default value
      statusCounts[status] = (statusCounts[status] || 0) + 1;
    });
    return statusCounts;
  };

  const statusCounts = countStatus();
  const statusList1 = [
    "Not Applied",
    "Applied",
    "No Response",
    "Rejected",
    "Offer Accepted",
  ];

  const statusList2 = [
    "Assessment Received",
    "Assessment Complete",
    "Interview Pending",
    "Interview Complete",
    "Offer Received ",
  ];

  return (
    <Card style={{ background: "#dee2e6" }}>
      <Card.Body>
        <Row>
          {statusList1.map((status) => (
            <Col key={status} className="text-end">
              <div>
                {status}{" "}
                <Badge bg={statusColors[status]}>
                  {statusCounts[status] ?? 0}
                </Badge>{" "}
                &nbsp;
              </div>
            </Col>
          ))}
        </Row>
        <Row>
          {statusList2.map((status) => (
            <Col key={status} className="text-end">
              <div>
                {status}{" "}
                <Badge bg={statusColors[status]}>
                  {statusCounts[status] ?? 0}
                </Badge>{" "}
                &nbsp;
              </div>
            </Col>
          ))}
        </Row>
      </Card.Body>
    </Card>
  );
};

export default StatusCounter;
