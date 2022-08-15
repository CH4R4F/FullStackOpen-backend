const express = require("express");
const morgan = require("morgan");
const generateId = require("./helpers").generateId;
const app = express();
app.use(express.json());
app.use(
  morgan("tiny", {
    skip: (req, res) => req.method === "POST",
  })
);

app.use(
  morgan(
    (tokens, req, res) => {
      return [
        tokens.method(req, res),
        tokens.url(req, res),
        tokens.status(req, res),
        tokens.res(req, res, "content-length"),
        "-",
        tokens["response-time"](req, res),
        "ms",
        JSON.stringify(req.body),
      ].join(" ");
    },
    {
      skip: (req, res) => req.method !== "POST",
    }
  )
);

app.listen(3001, () => console.log("Server is running on port 3001"));

let data = [
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

app.post("/api/persons/", (req, res) => {
  const body = req.body;
  if (!body.name || !body.number) {
    return res.status(400).json({
      error: "make sure you have submited a valid name and number",
    });
  } else if (data.some((p) => p.name.toLowerCase() == body.name.toLowerCase())) {
    return res.status(400).json({
      error: "name must be unique",
    });
  }

  const person = {
    id: generateId(data),
    name: body.name,
    number: body.number,
  };

  data.push(person);
  res.json(person);
});

app.delete("/api/persons/:id", (req, res) => {
  const { id } = req.params;
  const person = data.find((p) => p.id == id);
  if (!person) {
    return res.status(404).end();
  }

  data = data.filter((p) => p != person);
  res.status(204).end();
});

app.get("/info/", (req, res) => {
  res.send(`
    <p>Phonebook has info for ${data.length} people</p>
    <p>${new Date()}</p> 
  `);
});
