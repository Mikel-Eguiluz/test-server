# Full-Stack Application Demo

## Intro

The server is an express API server

### Scripts

yarn install : install dependancies
yarn start: starts the server in [localhost 3333](http://localhost:3333)

### API Routes

Routes begin with `/api/v1/` and then the model they are manipulating. There are `todos` routes set up. The model for a to-do is:

```javascript
 {
  title: String,
  description: {
    type: String,
    default: "",
  },
  completed: {
    type: Boolean,
    default: false,
  },
}
```

sent as `application/json`

- GET `/api/v1/todos` - gets all to-dos
- PUT `/api/v1/todos/1234` - Modifies the to-do whit an Id of `1234`
- POST `/api/v1/todos` - adds a to-do (you need to send data in the request body, as shown above)
- DELETE `api/v1/todos/1234`deletes the to-do with an id of `1234` (404 if not found)
