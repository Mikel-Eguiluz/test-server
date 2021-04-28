import Todo from "./Todo.js";

const MONGODB_ENDPOINT = "/api/v1/todos";
export default class App {
  todos = [];
  constructor(todos = []) {
    this.todos = todos;
  }
  setTodos(todos) {
    this.todos = todos;
  }

  getTodoById(id) {
    const todo = this.todos.find((todo) => todo.id === id);
    return todo;
  }
  fetchTodos = async () => {
    try {
      const response = await fetch(MONGODB_ENDPOINT);
      if (response.status !== 200) {
        throw response;
      }
      const data = await response.json();
      console.log("data", data);
      for (const todo of data) {
        this.todos.unshift(
          new Todo({
            title: todo.title,
            description: todo.description,
            completed: todo.completed,
            id: todo._id,
          }),
        );
      }
      console.log("appapp", this);
    } catch (err) {
      console.log("error", err);
    }
  };

  renderTodos() {
    for (const node of document.querySelectorAll(".todo-card")) {
      node.remove();
    }
    for (const todo of this.todos) {
      const card = document.createElement("div");
      card.classList = `card hoverable todo-card ${
        todo.completed ? "teal darken-2" : "deep-orange darken-3"
      }`;
      card.id = todo.id;
      if (todo instanceof Todo) {
        card.innerHTML = `        
          <div class="card-content white-text">
            <span class="card-title"><b>${todo.title}</b></span>   
            <p>${todo.description}</p>
          </div>
          <div class="card-action">
            <button  class="waves-effect waves-light btn-small toggle-todo-btn ${
              todo.completed ? "orange darken-4" : "green accent-3"
            }" data-id= ${todo.id}>${
          !todo.completed ? "Complete" : "  Undo  "
        }</button>
        <button  class="waves-effect waves-light btn-small lime update-todo-btn" data-id= ${
          todo.id
        }>Update</button>
            <button class="waves-effect waves-light btn-small orange darken-4 delete-todo-btn" data-id= ${
              todo.id
            }>Delete</button>
          </div>
        
      `;
      } else {
        card.innerHTML = `<div class="card blue-grey darken-1">
          <div class="card-content white-text"> bad object!  </div>
        </div>`;
      }

      document.getElementById("todos-grid").appendChild(card);
    }

    //document.getElementById("todos-grid").innerHTML = injectedString;
  }
  updateTodo = async (id, changes) => {
    console.log("bout to update id", id, changes);
    try {
      const response = await fetch(MONGODB_ENDPOINT, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          Accept: "application/json",
        },
        body: JSON.stringify({
          query: `
            mutation updateTodo($where: TodoWhereUniqueInput!, $data: TodoUpdateInput! ) {
              updateTodo(where: $where, data:$data){
                title
                description
                completed 
                id
                place{
                  name
                  id   
                }
              }
            }`,
          variables: {
            where: {
              id: id,
            },
            data: changes,
          },
        }),
      });
      if (response.status !== 200) {
        throw response;
      }
      const data = await response.json();
      const index = this.todos.findIndex((todo) => todo.id === id);
      const updatedTodo = new Todo(data.data.updateTodo);
      //console.log("UPdatedTodo", updatedTodo);
      return this.todos.splice(index, 1, updatedTodo);
    } catch (err) {
      console.log("error", err);
    }
  };

  deleteTodo = async (id) => {
    console.log("bout to delete id", id);
    try {
      const response = await fetch(MONGODB_ENDPOINT, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          Accept: "application/json",
        },
        body: JSON.stringify({
          query: `
            mutation deleteTodo($where: TodoWhereUniqueInput!) {
              deleteTodo(where: $where){
                title
            }
          }`,
          variables: {
            where: {
              id: id,
            },
          },
        }),
      });
      if (response.status !== 200) {
        throw response;
      }
      await response.json();
      const index = this.todos.findIndex((todo) => todo.id === id);
      console.log(index);
      this.todos.splice(index, 1);

      console.log("deleted");
    } catch (err) {
      console.log("error", err);
    }
  };
  addTodo = async (data) => {
    console.log("about to add", data);
    try {
      const response = await fetch(MONGODB_ENDPOINT, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          Accept: "application/json",
        },
        body: JSON.stringify(data),
      });
      if (response.ok) {
        throw response;
      }
      data = await response.json();
      console.log("data", data);
      const newTodo = new Todo(data.data.createTodo);
      this.todos.unshift(newTodo);

      console.log("newTodo", newTodo);
      return newTodo;
    } catch (err) {
      console.log("error", err);
    }
  };
}
