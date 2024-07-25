const express = require("express");
const cors = require("cors");
const mysql = require("mysql");

const app = express();
app.use(express.json());
app.use(cors()); 

const db = mysql.createConnection({
    host: "localhost",
    user: "root",
    password: "",
    database: "crud"
});

db.connect(err => {
    if (err) {
        console.error("Database connection failed: " + err.stack);
        return;
    }
    console.log("Connected to database.");
});

app.get("/", (req, res) => {
    const sql = "SELECT * FROM student";
    db.query(sql, (err, data) => {
        if (err) {
            console.error(err);
            return res.status(500).json({ error: "Error fetching data" });
        }
        return res.json(data);
    });
});

app.post('/create', (req, res) => {
    const { name, email } = req.body;

    if (!name || !email) {
        console.error("Validation failed: name and email are required");
        return res.status(400).json({ error: "Name and email are required" });
    }

    const sql = "INSERT INTO student (Name, Email) VALUES (?)"; 
    const values = [name, email];
    db.query(sql, [values], (err, data) => {
        if (err) {
            console.error(err);
            return res.status(500).json({ error: "Error creating student" });
        }
        return res.json(data);
    });
});

app.put('/update/:id', (req, res) => {
    const { name, email } = req.body;
    const id = req.params.id;

    if (!name || !email) {
        console.error("Validation failed: name and email are required");
        return res.status(400).json({ error: "Name and email are required" });
    }

    const sql = "UPDATE student SET Name = ?, Email = ? WHERE ID = ?";
    const values = [name, email];
    db.query(sql, [...values, id], (err, data) => {
        if (err) {
            console.error(err);
            return res.status(500).json({ error: "Error updating student" });
        }
        return res.json(data);
    });
});

app.delete('/student/:id', (req, res) => {
    const sql = "DELETE FROM student WHERE ID = ?";
    const id = req.params.id;

    db.query(sql, [id], (err, data) => {
        if (err) {
            console.error(err);
            return res.status(500).json({ error: "Error deleting student" });
        }
        return res.json(data);
    });
});

app.listen(8081, () => {
    console.log("Listening on port 8081");
});
