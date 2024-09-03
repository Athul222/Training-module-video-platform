import Express from "express";
import cors from "cors";
import bodyParser from "body-parser";

import db from "./database.js";
db.connect()

const app = Express();
const port = 3000;

app.use(cors());
app.use(bodyParser.urlencoded({extended: true}));

// Route to fetch the whole data from database.
app.get("/", async (req, res) => {
    try {
        const result = await db.query("SELECT * FROM videos WHERE id = 1");    
        res.json(result.rows[0]);    
    } catch (err) {
        console.error(err.message)
    }
});

// Route for next video module.
app.get("/next", async (req, res) => {
    const id = req.query.id;
    try {
       const result = await db.query("SELECT * FROM videos WHERE id = $1", [id]);
       res.json(result.rows[0])
    } catch (err) {
        console.error(err.message);
    }
});

// Route for updating the user progress.
app.patch("/update-progress", async (req, res) => {
    const {id, progress} = req.query;
    try {
        const result = await db.query("UPDATE videos SET user_progress = $1 WHERE id = $2 RETURNING *",
            [progress, id]
        );    
        res.json(result.rows[0]);    
    } catch (err) {
    }
});

// Route for updating the user watching videos current time.
app.patch("/update-time", async (req, res) => {
    const {id, currentTime} = req.query;
    try {
        const result = await db.query("UPDATE videos SET last_played_time = $1 WHERE id = $2 RETURNING *",
            [currentTime, id]
        );    
        res.json(result.rows[0]);    
    } catch (err) {
    }
});

app.listen(port, () => {
    console.log("Server started running");
    });