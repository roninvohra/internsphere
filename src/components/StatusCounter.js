import React from 'react';
import Badge from 'react-bootstrap/Badge';
import Container from 'react-bootstrap/Container';
import Card from 'react-bootstrap/Card';

const StatusCounter = ({ data, statusMap }) => {
  const countStatus = () => {
    const statusCounts = {};
    data.forEach(item => {
      const status = statusMap[item.id] || 'Status'; // Get the status for the current job or use 'Status' as the default value
      statusCounts[status] = (statusCounts[status] || 0) + 1;
    });
    return statusCounts;
  };

  const statusCounts = countStatus();

  return (
    <Container>
      <Card style={{ width: '20rem' , background: '#dee2e6'}}> 
        <Card.Body>
          {Object.entries(statusCounts).map(([status, count]) => (
            <h5 key={status}>
              {status}: <Badge bg="primary">{count}</Badge>
            </h5>
          ))}
        </Card.Body>
      </Card>
    </Container>
  );
};

export default StatusCounter;
