# SBA-318-Express-Server

Skill based assigment creating a express server

## Table of Contents

- [About](#about)
- [Technologies](#technologies)
- [Database](#database)
- [Run Locally](#run-locally)
- [API routes](#API-routes)
- [API examples](#API-examples)
- [Template views](#template-views)
- [Screenshots](#screenshots)

## About

The assigment is one of the task from Software Engineering Bootcamp.

Objectives:

- Create a server application with Node and Express.
- Create a RESTful API using Express.
- Create Express middleware.
- Use Express middleware.
- Use a template engine to render views with Express.
- Interact with a self-made API through HTML forms.

The server is a simple blog app, where client can do CRUD operation with users, posts, comments.<br>
The server is using EJS package to render views to the client.<br>
The server is using custom middleware to handle 404 - not found status, and error middleware for any other cases.<br>
The form validation for creating a user was accomplished using Joi package.

## Technologies

- JavaScript
- HTML
- CSS
- Node.js
- Express.js
- EJS package
- Joi package
- MongoDb
- mongoose

## Database

   <br>
      <img src="/public/images/database.png" width="700" height="500">

## Run Locally

1. Clone the project `git clone https://link-to-project`
2. Go to the project directory `cd my-project`
3. Install packages `npm install`
4. Create `.env` file and include your `ATLAS_URI`, optionally incluce `PORT`

- Note: In data folder, I provided starting data which will create automatically after `GET '/'`

5. Run with node.js `nodemon server`

- or `npm run dev`

6. In browser `http://localhost:3000/`

- or `http://localhost:3000/api`
  - Note: Above route will show hypermedia - links to use API

## API routes

- **GET** /

  - **GET** /api
  - **GET** /api/users
  - **POST** /api/users
    - **GET** /api/users/:id
    - **PATCH** /api/users/:id
    - **DELETE** /api/users/:id
    - **GET** /api/users/:id/posts || **GET** /api/users/:id/posts?sortBy=<value>
    - **GET** /api/users/:id/posts/create - `WARNING` : this route will render a view to creating a post
  - **GET** /api/posts
  - **POST** /api/posts
    - **GET** /api/posts/:id || **GET** /api/posts?userId=<value>
    - **PUT** /api/posts/:id
    - **DELETE** /api/posts/:id
  - **GET** /api/comments || **GET** /comments?userId=<value> || **GET** /comments?postId=<value>
  - **POST** /api/comments
    - **GET** /api/comments/:id
    - **PATCH** /api/comments/:id
    - **DELETE** /api/comments/:id

## API examples

`USERS`

1. Get all users

```javascript
GET  api/users
```

2. Create user

```javascript
POST  api/users
```

Request body example(note: there is optional img property):

```JSON
  {
    "name": "Neville",
    "username": "Neville123",
    "email": "Neville@example.com"
  }
```

3. Get single user by id

```javascript
GET  api/users/2
```

4.  Get posts created but specific user sorted by the oldest id(the oldest creation)

```javascript
GET  api/users/2/posts?sortBy=id:desc
```

or

```javascript
GET  api/posts?userId=2
```

`POSTS`

1. Create post

```javascript
POST  api/posts
```

Request body example:

```JSON
  {
    "userId": 2,
    "title": "I am up to not good",
    "content": "lorem ipsum lorem ipsum"
  }
```

`COMMENTS`

1. Get comments

```javascript
GET  api/comments
```

2. Get comments for a specific post

```javascript
GET  api/comments?postId=2
```

3. Get comments for created by specific user

```javascript
GET  api/comments?userId=1
```

4. Create a comment

```javascript
POST  api/comments
```

Request body example:

```JSON
  {
    "userId": 2,
    "postId":5,
    "body": "lorem ipsum lorem ipsum"
  }
```

## Template views

1. Home view, it has links to all posts,all users

```javascript
GET  /
```

2. All users view

```javascript
GET / api / users;
```

The page is user friendly. When clicked on user card it will render posts created by user:

```javascript
GET  /api/users/:id/posts
```

`NOTE:` if hovered over post it will show post id and userId
<br>
`NOTE:`
When user click the "create post" button on "All users view" it will render a view to create post:

3. Create post view

```javascript
GET  /api/users/:id/posts/create
```

4. All posts view

```javascript
GET  /api/posts/
```

`NOTE:`

1. When user click on the post it will show comments for this post
2. When user hovers over the post it shows userId and post id.

## Screenshots

1. All users view
   <br>
   <img src="/public/images/users.png" width="700" height="500">
1. All posts view
   <br>
   <img src="/public/images/posts.png" width="700" height="500">
