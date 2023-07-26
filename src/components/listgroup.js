import { useState, useEffect } from "react";
import Form from 'react-bootstrap/Form';
import Table from 'react-bootstrap/Table';
import 'bootstrap/dist/css/bootstrap.min.css';
import Dropdown from 'react-bootstrap/Dropdown';
import DropdownButton from 'react-bootstrap/DropdownButton';
import Container from 'react-bootstrap/Container';

function ListGroup() {
  const [data, setData] = useState([]);
  const [statusMap, setStatusMap] = useState({}); // New state to hold the status for each job id
  const [searchQuery, setSearchQuery] = useState("");
  const [sortOrder, setSortOrder] = useState("asc"); 
  useEffect(() => {
    fetch('http://localhost:8082/csinternships?user_id=' + localStorage.getItem('loggedInUser'))
      .then((response) => response.json())
      .then((data) => {
        setData(data);
        // Initialize the statusMap with the status from the data
        const initialStatusMap = {};
        data.forEach(item => {
          initialStatusMap[item.id] = item.status || "Status"; // Assuming the status field contains string values (e.g., "Applied", "Received Assessment", etc.)
        });
        setStatusMap(initialStatusMap);
      })
      .catch((error) => console.error(error));
  }, []);

  const handleStatusHeaderClick = () => {
    // Toggle the sorting order when the "Status" header is clicked
    setSortOrder(prevSortOrder => prevSortOrder === "asc" ? "desc" : "asc");
  };


  const handleDropdownItemClick = async (eventKey, job_id) => {
    const user_id = localStorage.getItem('loggedInUser');
    if (user_id){
    try {

      const response = await fetch('http://localhost:8082/api/statusupdate', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ user_id, job_id, status: eventKey }),
      });

      if (response.ok) {
        // Update the status in the local state when the API request is successful
        setStatusMap(prevStatusMap => ({
          ...prevStatusMap,
          [job_id]: eventKey,
        }));
        console.log(`API request successful! Status updated for job id ${job_id}.`);
      } else {
        console.error('API request failed!');
        // Handle error case
      }
    } catch (error) {
      console.error('API request error:', error);
      // Handle error case
    }
  }
  else{
    setStatusMap(prevStatusMap => ({
      ...prevStatusMap,
      [job_id]: eventKey,
    }));
  }
  };

  const filteredData = data.filter(item => {
    const company = item.company.toLowerCase();
    const location = item.location.toLowerCase();
    const program = item.program.toLowerCase();
    console.log (item)
    return (
      company.includes(searchQuery.toLowerCase()) ||
      location.includes(searchQuery.toLowerCase()) ||
      program.includes(searchQuery.toLowerCase())
    );
  });

  const sortedData = filteredData.sort((a, b) => {
    // Sort first by status, then by ID
    const statusA = statusMap[a.id] || "Status";
    const statusB = statusMap[b.id] || "Status";

    if (statusA === statusB) {
      return sortOrder === "asc" ? a.id - b.id : b.id - a.id; // If statuses are the same, sort by ID
    } else {
      // Sort by status
      return sortOrder === "asc" ? statusA.localeCompare(statusB) : statusB.localeCompare(statusA);
    }
  });

  
  return (
    <>
      <Container>
      <Form.Group>
          <Form.Control
            type="text"
            placeholder="Search by company, location, or program..."
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
          />
        </Form.Group>
      <Table striped bordered>
        <thead>
          <tr>
          <th onClick={handleStatusHeaderClick}>
                Status{" "}
                {sortOrder === "asc" ? "▲" : "▼"} 
              </th>
              <th onClick={() => setSortOrder(prevSortOrder => prevSortOrder === "asc" ? "desc" : "asc")}>
                ID
                {sortOrder === "asc" ? "▲" : "▼"} {/* Add an arrow indicating the sorting order */}
              </th>
            <th>Company</th>
            <th>Location</th>
            <th>Program</th>
          </tr>
        </thead>
        <tbody>
        {filteredData.map(item =>
              <tr key={item.id}>
                <td>
                  <DropdownButton id={`dropdown-button-${item.id}`} title={statusMap[item.id] || "Status"}>
                    <Dropdown.Item eventKey="applied" onClick={() => handleDropdownItemClick("Applied", item.id)}>
                      Applied
                    </Dropdown.Item>
                    <Dropdown.Item eventKey="received_assessment" onClick={() => handleDropdownItemClick("Received Assessment", item.id)}>
                      Received Assessment
                    </Dropdown.Item>
                    <Dropdown.Item eventKey="got_interview" onClick={() => handleDropdownItemClick("Got Interview", item.id)}>
                      Got Interview
                    </Dropdown.Item>
                  </DropdownButton>
                </td>
                <td>{item.id}</td>
                <td>{item.company}</td>
                <td>{item.location}</td>
                <td>{ item.link && <a href={item.link} target="_blank" rel="noopener noreferrer">{item.program}</a>} { !item.link && item.program}</td>
              </tr>
            )}
        </tbody>
      </Table>
      </Container>
    </>
  );
}

export default ListGroup;
