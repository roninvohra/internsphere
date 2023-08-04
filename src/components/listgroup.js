import { useState, useEffect } from "react";
import Table from "react-bootstrap/Table";
import "bootstrap/dist/css/bootstrap.min.css";
import Dropdown from "react-bootstrap/Dropdown";
import DropdownButton from "react-bootstrap/DropdownButton";
import Container from "react-bootstrap/Container";
import "./dropdown.css";
import StatusCounter from "./StatusCounter";
import { Card, Form, Button, Alert } from "react-bootstrap";
import statusColors from "./Utils";

function ListGroup() {
  const [data, setData] = useState([]);
  const [statusMap, setStatusMap] = useState({}); // New state to hold the status for each job id
  const [searchQuery, setSearchQuery] = useState("");
  const [sortOrder, setSortOrder] = useState("asc");
  const [sortCol, setSortCol] = useState("id");

  function statusComparator(sortOrder, statusA, statusB) {
    if (statusA === statusB) {
      return 0;
    }

    if (statusA === "Not Applied") {
      return sortOrder === "asc" ? -1 : 1;
    }

    if (statusB === "Not Applied") {
      return sortOrder === "asc" ? 1 : -1;
    }

    // In case both statusA and statusB are not "Not Applied"
    return sortOrder === "asc"
      ? statusA.localeCompare(statusB)
      : statusB.localeCompare(statusA);
  }

  useEffect(() => {
    fetch(
      process.env.REACT_APP_API_ENDPOINT +
        "/csinternships?user_id=" +
        localStorage.getItem("loggedInUser")
    )
      .then((response) => response.json())
      .then((data) => {
        setData(data);
        // Initialize the statusMap with the status from the data
        const initialStatusMap = {};
        data.forEach((item) => {
          initialStatusMap[item.id] = item.status || "Not Applied"; // Assuming the status field contains string values (e.g., "Applied", "Received Assessment", etc.)
        });
        setStatusMap(initialStatusMap);
      })
      .catch((error) => console.error(error));
  }, []);

  const handleStatusHeaderClick = () => {
    // Toggle the sorting order when the "Status" header is clicked
    setSortOrder((prevSortOrder) => (prevSortOrder === "asc" ? "desc" : "asc"));
    setSortCol("status");
  };

  const handleIDHeaderClick = () => {
    // Toggle the sorting order when the "Status" header is clicked
    setSortOrder((prevSortOrder) => (prevSortOrder === "asc" ? "desc" : "asc"));
    setSortCol("id");
  };

  const handleDropdownItemClick = async (eventKey, job_id) => {
    const user_id = localStorage.getItem("loggedInUser");
    if (user_id) {
      try {
        const response = await fetch(
          process.env.REACT_APP_API_ENDPOINT + "/api/statusupdate",
          {
            method: "POST",
            headers: {
              "Content-Type": "application/json",
            },
            body: JSON.stringify({ user_id, job_id, status: eventKey }),
          }
        );

        if (response.ok) {
          // Update the status in the local state when the API request is successful
          setStatusMap((prevStatusMap) => ({
            ...prevStatusMap,
            [job_id]: eventKey,
          }));
          console.log(
            `API request successful! Status updated for job id ${job_id}.`
          );
        } else {
          console.error("API request failed!");
          // Handle error case
        }
      } catch (error) {
        console.error("API request error:", error);
        // Handle error case
      }
    } else {
      setStatusMap((prevStatusMap) => ({
        ...prevStatusMap,
        [job_id]: eventKey,
      }));
    }
    setSortCol("none");
  };

  const filteredData = data.filter((item) => {
    const company = item.company.toLowerCase();
    const location = item.location.toLowerCase();
    const program = item.program.toLowerCase();
    //console.log(item);
    return (
      company.includes(searchQuery.toLowerCase()) ||
      location.includes(searchQuery.toLowerCase()) ||
      program.includes(searchQuery.toLowerCase())
    );
  });

  console.log("sort col:", sortCol, "dir:", sortOrder);

  if (sortCol == "id") {
    filteredData.sort((a, b) => {
      // Sort first by status, then by ID
      let statusA = statusMap[a.id] || "Not Applied";
      let statusB = statusMap[b.id] || "Not Applied";
      return sortOrder === "asc" ? a.id - b.id : b.id - a.id; // If statuses are the same, sort by ID
    });
  } else if (sortCol == "status") {
    filteredData.sort((a, b) => {
      let statusA = statusMap[a.id] || "Not Applied";
      let statusB = statusMap[b.id] || "Not Applied";
      return statusComparator(sortOrder, statusA, statusB);
    });
  }

  return (
    <>
      <Container>
        <div>
          {!localStorage.getItem("loggedInUser") && (
            <Alert
              variant="warning"
              style={{
                width: "20rem",
                background: "#ffffe0",
                marginTop: "10px",
              }}
            >
              ⚠️ Please <a href="/login">login</a> to save your changes.
            </Alert>
          )}
        </div>
        <div style={{ marginTop: "10px" }}>
          <StatusCounter data={data} statusMap={statusMap} />
        </div>
        <Form.Group>
          <Form.Control
            type="text"
            placeholder="Search by company, location, or program..."
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            style={{ marginTop: "20px", marginBottom: "10px" }}
          />
        </Form.Group>
        <Table striped bordered>
          <thead>
            <tr>
              <th onClick={handleStatusHeaderClick}>
                Status {sortOrder === "asc" ? "▲" : "▼"}
              </th>
              <th onClick={handleIDHeaderClick}>
                ID
                {sortOrder === "asc" ? "▲" : "▼"}{" "}
              </th>
              <th>Company</th>
              <th>Location</th>
              <th>Program</th>
            </tr>
          </thead>
          <tbody>
            {filteredData.map((item) => (
              <tr key={item.id}>
                <td>
                  <DropdownButton
                    variant={statusColors[statusMap[item.id]]}
                    id={`dropdown-button-${item.id}`}
                    title={statusMap[item.id] || "Not Applied"}
                  >
                    <Dropdown.Item
                      eventKey="applied"
                      onClick={() =>
                        handleDropdownItemClick("Applied", item.id)
                      }
                    >
                      Applied
                    </Dropdown.Item>
                    <Dropdown.Item
                      eventKey="no_response"
                      onClick={() =>
                        handleDropdownItemClick("No Response", item.id)
                      }
                    >
                      No Response
                    </Dropdown.Item>
                    <Dropdown.Item
                      eventKey="rejected"
                      onClick={() =>
                        handleDropdownItemClick("Rejected", item.id)
                      }
                    >
                      Rejected
                    </Dropdown.Item>
                    <Dropdown.Item
                      eventKey="received_assessment"
                      onClick={() =>
                        handleDropdownItemClick("Assessment Received", item.id)
                      }
                    >
                      Assessment Received
                    </Dropdown.Item>
                    <Dropdown.Item
                      eventKey="assessment_complete"
                      onClick={() =>
                        handleDropdownItemClick("Assessment Complete", item.id)
                      }
                    >
                      Assessment Complete
                    </Dropdown.Item>
                    <Dropdown.Item
                      eventKey="interview_pending"
                      onClick={() =>
                        handleDropdownItemClick("Interview Pending", item.id)
                      }
                    >
                      Interview Pending
                    </Dropdown.Item>
                    <Dropdown.Item
                      eventKey="interview_complete"
                      onClick={() =>
                        handleDropdownItemClick("Interview Complete", item.id)
                      }
                    >
                      Interview Complete
                    </Dropdown.Item>
                    <Dropdown.Item
                      eventKey="received_offer"
                      onClick={() =>
                        handleDropdownItemClick("Offer Received ", item.id)
                      }
                    >
                      Offer Received
                    </Dropdown.Item>
                    <Dropdown.Item
                      eventKey="accepted_offer"
                      onClick={() =>
                        handleDropdownItemClick("Offer Accepted ", item.id)
                      }
                    >
                      Offer Accepted
                    </Dropdown.Item>
                  </DropdownButton>
                </td>
                <td>{item.id}</td>
                <td>{item.company}</td>
                <td>{item.location}</td>
                <td>
                  {item.link && (
                    <a
                      href={item.link}
                      target="_blank"
                      rel="noopener noreferrer"
                    >
                      {item.program}
                    </a>
                  )}{" "}
                  {!item.link && item.program}
                </td>
              </tr>
            ))}
          </tbody>
        </Table>
      </Container>
    </>
  );
}

export default ListGroup;
