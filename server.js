require("dotenv").config();
const express = require("express");
const { v4: uuidv4 } = require("uuid");
const mongoose = require("mongoose");

const app = express();

const { PORT = 3333 } = process.env;

mongoose.connect("mongodb://localhost:27017/test", {
  useNewUrlParser: true,
  useUnifiedTopology: true,
});

const db = mongoose.connection;
db.on("error", console.error.bind(console, "connection error:"));
db.once("open", function () {
  console.log("db connected");
});

const { Schema } = mongoose;

const todoSchema = new Schema({
  title: String,
  description: {
    type: String,
    default: "",
  },
  completed: {
    type: Boolean,
    default: false,
  },
});

const Todo = mongoose.model("todo", todoSchema);
// fn
app.use(express.static("public"));
// parse application/x-www-form-urlencoded
app.use(express.urlencoded({ extended: false }));
app.use(express.json()); // parse application/json
// API

app.get("/redirect", (req, res) => {
  res.redirect("/");
});

app.get("/api/v1/todos", (req, res) => {
  console.log("query string params", req.query);
  Todo.find({}).exec(function (err, todoSchema) {
    if (err) return res.status(500).send(err);
    return res.json(todoSchema);
  });
});

app.post("/api/v1/todos", (req, res) => {
  console.log(req.body);
  const newTodo = new Todo(req.body);
  newTodo.save((err, model) => {
    console.log(model);
    if (err) return res.status(500).send(err);
    res.status(201).send(model);
  });
});

app.put("/api/v1/todos/:id", (req, res) => {
  // req.params.id
  console.log(req.params.id);
  const { id } = req.params;
  Todo.updateOne({ _id: id }, req.body, function (err, raw) {
    if (err) return handleError(err);
    console.log("The raw response from Mongo was ", raw);
    return res.sendStatus(200);
  });
});
app.delete("/api/v1/todos/:id", (req, res) => {
  console.log(req.params.id);
  const { id } = req.params;
  Todo.remove({ _id: id }, (err) => {
    if (err) return res.status(500).send(err);
    res.sendStatus(204);
  });
});

app.all("*", (req, res) => {
  res.sendStatus(404);
});

app.listen(PORT, () => {
  console.log(`Listening on port ${PORT}`);
});
