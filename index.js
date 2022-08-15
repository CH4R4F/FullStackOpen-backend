const express = require("express");
const app = express();
app.use(express.json());

app.listen(3001, () => console.log("Server is running on port 3001"));

const data = [
  {
    id: 1,
    name: "Arto Hellas",
    number: "040-123456",
  },
  {
    id: 2,
    name: "Ada Lovelace",
    number: "39-44-5323523",
  },
  {
    id: 3,
    name: "Dan Abramov",
    number: "12-43-234345",
  },
  {
    id: 4,
    name: "Mary Poppendieck",
    number: "39-23-6423122",
  },
];

app.get("/api/persons", (req, res) => {
  res.status(200).json(data);
});

app.get("/api/persons/:id", (req, res) => {
  const { id } = req.params;
  const person = data.find((p) => p.id == id);
  if (!person) {
    return res.status(404).end();
  }

  res.json(person);
});

app.get("/info/", (req, res) => {
  res.send(`
    <p>Phonebook has info for ${data.length} people</p>
    <p>${new Date()}</p> 
  `);
});
