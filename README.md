### Fancy To-Do

API Documentation

**URLs**

```Client URL : http://localhost:8080,
Client URL : http://localhost:8080
Server URL : http://localhost:3000
```

### List of To-Do Routes

| Routes    | HTTP   | Header(s) | Body                                                         | Response Success                         | Response Error        | Description               |
| --------- | ------ | --------- | ------------------------------------------------------------ | ---------------------------------------- | --------------------- | ------------------------- |
| /todo/    | GET    | Token     | None                                                         | `Status code : 200`<br>`dataTypes : []`  | `Status code : 400` ` | Get all todo list by user |
| /todo/:id | GET    | Token     | None                                                         | `Status code : 200`<br/>`dataTypes : []` | `Status code : 400`   | Get specific todo by id   |
| /todo/:id    | POST   | Token     | userId:String**(Required)**, name:String**(Required)**, description:String**(Required)**, dueDate: date**(Required)** | `Status code : 200`<br/>`dataTypes : {}` | `Status code : 400`   | Create a to-do by user    |
| /todo/:id/checked| GET    | Token     | None                                                         | `Status code : 200`<br/>`dataTypes : []` | `Status code : 400`   | Get finished to do  |
| /todo/:id/:unchecked | GET    | Token     | None                                                         | `Status code : 200`<br/>`dataTypes : []` | `Status code : 400`   | Get unfinished to do  |
| /todo/:id | DELETE | Token     | None                                                         | `Status code : 200`<br/>`dataTypes : {}` | `Status code : 400`   | Delete a to-do            |
| /todo/:id  | PUT    | Token     | None                                                         | `Status code : 200`<br/>`dataTypes : {}` | `Status code : 400`   | Edit a to-do              |



### List of Sign In Routes

| Routes         | HTTP | Header(s) | Body                                                         | Response Success                         | Response Error      | Description            |
| -------------- | ---- | --------- | ------------------------------------------------------------ | ---------------------------------------- | ------------------- | ---------------------- |
| /signin/local  | POST | None      | username:String**(Required)**, <br>password:String**(Required)**,<br>email:String(**Required**) | `Status code : 200`<br/>`dataTypes : {}` | `Status code : 400` | Sign in through local  |
| /signin/google | POST | None      | id_token:String**(Required)**                                | `Status code : 200`<br/>`dataTypes : {}` | `Status code : 400` | Sign in through google |

### List of User In Routes

| Routes     | HTTP | Header(s) | Body                                                         | Response Success                         | Response Error      | Description       |
| ---------- | ---- | --------- | ------------------------------------------------------------ | ---------------------------------------- | ------------------- | ----------------- |
| /user/     | GET  | None      | None                                                         | `Status code : 200`<br/>`dataTypes : {}` | `Status code : 400` | Get all user      |
| /:username | GET  | None      | None                                                         | `Status code : 200`<br/>`dataTypes : {}` | `Status code : 400` | Get a single user |
| /user/     | POST | None      | username:String**(Required)**, password:String**(Required)**, email:String**(Required)**, via:String**(Required)** | `Status code : 201`<br/>`dataTypes : {}` | `Status code : 400` | Create a user     |



#### Usage

Make sure you have Node.js and npm installed in your computer, and then run `npm install`.

In order to get access to all of the routes, you will need a `JWT(JSON Web Token) Token` which will be generated automatically after a sign in / sign up action on the client-side.

Run `npm run start` to start the server.

