const express = require("express");
require("dotenv").config();
const { v4 } = require("uuid");
const app = express();
const { PORT = 3333 } = process.env;

class Score {
  constructor({
    title,
    composer,
    style,
    stock = 0,
    instrumentation = [],
    owner,
  }) {
    if (title == null) {
      throw new Error(`scores require a title, received ${title}`);
    }
    this._id = v4();
    this.title = title + "";
    this.composer = composer;
    this.style = style;
    this.stock = stock;
    this.owner = owner;
    this.instrumentation = instrumentation;
  }
}
const scores = [
  new Score({
    title: "Txus",
    composer: "Evaristo",
    style: "punk",
    owner: "me",
  }),
  new Score({
    title: "Salve",
    composer: "Evaristo",
    style: "punk",
    owner: "me",
  }),
];

// parse application/x-www-form-urlencoded
app.use(express.urlencoded({ extended: false }));
app.use(express.json()); // parse application/json

app.post("/api/v1/scores", (req, res) => {
  console.log(req.body);
  const newScore = new Score(req.body);
  cars.push(newScore);
  res.sendStatus(201);
});
app.put("/api/v1/scores/:id", (req, res) => {
  // req.params.id
  console.log(req.params.id);
  const { id } = req.params;
  const idx = scores.findIndex(({ _id }) => {
    return id === _id;
  });
  if (idx === -1) {
    return res.sendStatus(404);
  }
  const oldScore = scores[idx];
  const updatedScore = {
    ...oldScore,
    ...req.body,
  };
  scores.splice(idx, 1, updatedScore);
  // scores = [...scores.slice(0, idx, updatedScore, ...scores.slice(idx + 1))]
  res.status(200).send(updatedScore);
});

app.delete("/api/v1/scores/:id", (req, res) => {
  const { id } = req.params;
  const idx = scores.findIndex(({ _id }) => {
    return id === _id;
  });
  res.sendStatus(200);
  return scores.splice(idx, 1);
});

app.get("/api/v1/scores", (req, res) => {
  return res.json(scores);
});

app.use(express.static("public"));

app.listen(PORT, () => {
  console.log(`listening to ${PORT}`);
});
