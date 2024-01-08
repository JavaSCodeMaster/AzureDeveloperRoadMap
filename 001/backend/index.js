const express = require("express");
const cors = require("cors");
const { v4: uuidv4 } = require('uuid');
const path = require("path");

const app = express();
app.use(cors());
app.use(express.json());
app.use(express.static(path.join(__dirname, 'public')));

const notes = new Map();
console.log(`Start Azure web-app...`);

app.get('/', (req, res) => {
    res.sendFile(__dirname + 'public/index.html');
});

app.get("/api", (req, res) => {
    console.log('Start request: GET api');
    res.json({
        name: "Note web app",
        description: "Note web app backend sample",
        version: "1.0.0",
        status: 'success'
    });
});

// Додавання замітки
app.post("/api/notes", async (req, res) => {
    console.log('Start request: POST notes');
    const note = req.body;

    note.id = uuidv4();
    notes.set(note.id, note);
    console.log(`Total records: ${notes.size}`);
    res.status(201)
        .json({
            data: note,
            status: 'success'
        })
        .end();
});

// Отримання всіх заміток
app.get("/api/notes", (req, res) => {
    console.log('Start request: GET notes');
    const allNotes = [];
    for (const note of notes.values()) {
        allNotes.push(note);
    }
    res.status(200)
        .json({
        data: allNotes,
        status: 'success'
    })
        .end();
});

// Отримання замітки за її ідентифікатором
app.get("/api/notes/:id", (req, res) => {
    console.log(`Start request: GET note by ID: ${req.params.id}`);
    const id = req.params.id;
    const note = notes.get(id);
    if (note) {
        res.status(200)
            .json({
            data: note,
            status: 'success'
        })
            .end();
    } else {
        res.status(404)
            .json({
            status: 'error',
            message: `Resource with ID: ${id} not found`
        })
            .end();
    }
});

// Видалення замітки за її ідентифікатором
app.delete("/api/notes/:id", (req, res) => {
    console.log(`Start request: DELETE note by ID: ${req.params.id}`);
    const id = req.params.id;
    if (!notes.has(id)) {
        res.status(404)
            .json({
            status: 'error',
            message: `Resource with ID: ${id} not found`
        })
            .end();
    }
    notes.delete(id);
    console.log(`Total records: ${notes.size}`);
    res.status(204).end();
});


const PORT = process.env.PORT || 3001;
app.listen(PORT, () => {
    console.log(`Server running on port ${PORT}`);
});

