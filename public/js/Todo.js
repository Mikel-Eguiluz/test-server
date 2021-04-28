export default class Todo {
  constructor({ title, description, completed = false, id, place }) {
    this.title = title;
    this.description = description ? description : "No description";
    this.completed = completed;
    this.id = id;
  }
}
