  const express = require('express');
  const mysql = require('mysql');
  const cors = require('cors');

  const app = express();
  app.use(cors());
  app.use(express.json());

  const db = mysql.createConnection({
    host: "127.0.0.1",
    port: '3306',
    user: 'root',
    password: 'root',
    database: 'jobs'
  });

  app.get('/', (req, res) => {
    return res.json("From backend");
  });


  app.get('/csinternships', (req, res) => {
    const user_id = req.query.user_id;
    if (!user_id){
      const sql = "SELECT * FROM cs_internships";
      db.query(sql, (err, data) => {
        if (err) {return res.json(err)};
        return res.json(data);
      });
    }
    else{
      const sql = "SELECT DISTINCT intern.id, company, location, program, link, status FROM cs_internships intern LEFT OUTER JOIN users_to_cs_internships jobs ON intern.id = jobs.job_id AND jobs.user_id = " + user_id + " ORDER BY intern.id ASC";
      db.query(sql, (err, data) => {
        if (err) {return res.json(err)};
        return res.json(data);
      });
    }
  });

  app.post('/api/login', (req, res) => {
    const { username, password } = req.body;
    // Use parameterized query to avoid SQL injection
    const sql = 'SELECT * FROM users WHERE username = ? AND password = ?';
    db.query(sql, [username, password], (err, data) => {
      if (err) {
        console.error('Error executing SQL query:', err);
        return res.status(500).json({ error: 'Internal Server Error' });
      }

      if (data.length === 0) {
        return res.status(401).json({ error: 'Invalid credentials' });
      }

      // The login is successful
      return res.json({ message: 'Login successful', user: data[0] });
    });
  });
  app.post('/api/register', (req, res) => {
    const { username, password, email, name } = req.body;

    // Check if the email already exists in the database
    const checkEmailQuery = 'SELECT * FROM users WHERE email = ?';
    db.query(checkEmailQuery, [email], (err, emailResult) => {
      if (err) {
        console.error('Error executing SQL query:', err);
        return res.status(500).json({ error: 'Internal Server Error' });
      }

      if (emailResult.length > 0) {
        // Email already exists, return an error response
        return res.status(400).json({ error: 'Email already taken' });
      }

      // If email is unique, check if the username already exists in the database
      const checkUsernameQuery = 'SELECT * FROM users WHERE username = ?';
      db.query(checkUsernameQuery, [username], (err, usernameResult) => {
        if (err) {
          console.error('Error executing SQL query:', err);
          return res.status(500).json({ error: 'Internal Server Error' });
        }

        if (usernameResult.length > 0) {
          // Username already exists, return an error response
          return res.status(400).json({ error: 'Username already taken' });
        }

        // If both email and username are unique, proceed with user registration
        const insertUserQuery = 'INSERT INTO users (username, password, email, name) VALUES (?, ?, ?, ?)';
        db.query(insertUserQuery, [username, password, email, name], (err, data) => {
          if (err) {
            console.error('Error executing SQL query:', err);
            return res.status(500).json({ error: 'Internal Server Error' });
          }

          // Registration successful, return a success response
          return res.status(200).json({ message: 'Registration successful' });
        });
      });
    });
  });

  app.post('/api/statusupdate', (req, res) => {
    const { user_id, job_id, status } = req.body;
    // Use parameterized query to avoid SQL injection

    const delete_sql = "DELETE FROM users_to_cs_internships WHERE user_id = ? AND job_id = ?"
    db.query(delete_sql, [user_id, job_id], (err, data) => {
      if (err) {
        console.error('Error executing SQL query:', err);
        return res.status(500).json({ error: 'Internal Server Error' });
      }

      if (data.length === 0) {
        return res.status(401).json({ error: 'Invalid credentials' });
      }

      // Continue with the insert query
      const sql = 'INSERT INTO users_to_cs_internships (user_id, job_id, status) VALUES (?, ?, ?)'
      db.query(sql, [user_id, job_id, status], (err, data) => {
        if (err) {
          console.error('Error executing SQL query:', err);
          return res.status(500).json({ error: 'Internal Server Error' });
        }

        if (data.length === 0) {
          return res.status(401).json({ error: 'Invalid credentials' });
        }

        // The insert is successful
        return res.json({ message: 'Status updated successfully' });
      });
    });
  });

  app.get('/api/comments', (req, res) => {
    // Fetch comments from the database
    const sql = "SELECT * FROM comments";
    db.query(sql, (err, data) => {
      if (err) {
        return res.status(500).json({ error: 'Internal Server Error' });
      }
      return res.json(data);
    });
  });

  app.post('/api/comments/:commentId/update', (req, res) => {
    const commentId = req.params.commentId;
    const { thumbsUp, thumbsDown } = req.body;
  
    // Update the "thumbs up" and "thumbs down" for the specified comment ID
    const updateCommentQuery = 'UPDATE comments SET thumbsUp = ?, thumbsDown = ? WHERE id = ?';
    db.query(updateCommentQuery, [thumbsUp, thumbsDown, commentId], (err, data) => {
      if (err) {
        console.error('Error updating comment:', err);
        return res.status(500).json({ error: 'Internal Server Error' });
      }
  
      return res.status(200).json({ message: 'Comment updated successfully' });
    });
  });
  
  
  // API endpoint for adding a new comment
  app.post('/api/comments', (req, res) => {
    const { text, thumbsUp, thumbsDown, userId } = req.body;
  
    // Insert the new comment into the database
    const insertCommentQuery = 'INSERT INTO comments (text, thumbsUp, thumbsDown, user_id) VALUES (?, ?, ?, ?)';
    db.query(insertCommentQuery, [text, thumbsUp, thumbsDown, userId], (err, data) => {
      if (err) {
        console.error('Error adding comment:', err);
        return res.status(500).json({ error: 'Internal Server Error' });
      }
  
      return res.status(200).json({ message: 'Comment added successfully' });
    });
  });
  
  app.listen(8082, () => {
    console.log("listening");
  });