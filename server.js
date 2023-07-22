const express = require('express');
const jwt = require('jsonwebtoken');
const bodyParser = require('body-parser');
const mysql = require('mysql');
const cors = require('cors');

const port = 1234;
const secretKey = 'iAmSiam';
const app = express();
app.use(bodyParser.json());
app.use(cors());

const db = mysql.createConnection({
    host: 'localhost',
    user: 'siamDev',
    password: 'SiamPass',
    database: 'ToDoApp',
});

app.post('/login', (req, res) => login(req, res));
app.post('/signup', (req, res) => signup(req, res));
app.post('/addNewList', authenticateToken, (req, res) => addListElement(req, res));
app.delete('/deleteListElement', authenticateToken, (req, res) => deleteElement(req, res));
app.delete('/deleteAllElements', authenticateToken, (req, res) => deleteAll(req, res));

// funtions
function authenticateToken(req, res, next) 
{
    const token = req.header('Authorization');

    if (!token) {
        return res.status(401).json({ message: 'No token provided.' });
    }

    jwt.verify(token, secretKey, (err, decoded) => {
        if (err) {
            return res.status(403).json({ message: 'Invalid token given.'});
        }
        req.user = decoded;
        next();
    });
}
function login(req, res) 
{

    const { username, password } = req.body;

    const sql = 'SELECT * FROM users WHERE username = ? AND password = ?';

    db.query(sql, [username, password], (err, results) => {
        if (err) {
            return res.status(500).json({ message: 'Database error.' });
        }

        if (results.length === 0) {
            return res.status(401).json({ message: 'Invalid credentials.' });
        }

        const user = { username: username, role: 'admin' };

        const token = jwt.sign(user, secretKey, { expiresIn: '2h' });

        res.json({ token: token });
    });
}
function signup(req, res)
{
    const { username, password } = req.body;

    const sql1 = 'SELECT * FROM users WHERE username = ?';
    db.query(sql1, [username], (err, results) => {
        if (err) {
            return res.status(500).json({ message: 'Database error.' });
        }

        if (results.length > 0) {
            return res.status(400).json({ message: 'Username already exists.' });
        }

        const sql2 = 'INSERT INTO users (username, password) VALUES (?, ?)';
        db.query(sql2, [username, password], (err, result) => {
            if (err) {
                return res.status(500).json({ message: 'Database error.' });
            }

            res.json({ message: "Signed up successfully" });
        });
    });
}
function addListElement(req, res)
{
    const { id, username, content} = req.body;
    const sql = 'INSERT INTO tasks VALUES (?, ?, ?)';
    db.query(sql, [id, username, content], (err, result) => {
        if (err) {
            return res.status(500).json({ message: 'Database error.', msg: err });
        }
        res.status(201).json({message: "added task"});
    });
}
function deleteElement(req, res)
{
    const { username, id } = req.body;

    const sql = 'DELETE FROM tasks WHERE id = ? AND username = ?';
    db.query(sql, [id, username], (err, result) => {
        if (err) {
            return res.status(500).json({ message: 'Database error.', msg: err });
        }    
        res.status(201).json({ message: "deleted the item" });
    });
}
function deleteAll(req, res)
{
    const { username } = req.body;

    const sql = 'DELETE FROM tasks WHERE username = ?';
    db.query(sql, [username], (err, result) => {
        if (err) {
            return res.status(500).json({ message: 'Database error.', msg: err });
        }        
        res.status(201).json({message: `deleted all list of ${username}`});
    });
}

app.listen(port, () => {
    console.log(`Server started on port ${port}`);
});