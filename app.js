const express = require("express");
const { open } = require("sqlite");
const sqlite3 = require("sqlite3");
const path = require("path");

const databasePath = path.join(__dirname, "todoApplication.db");

const app = express();

app.use(express.json());

let db = null;

const initializeDbAndServer = async () => {
  try {
    db = await open({
      filename: databasePath,
      driver: sqlite3.Database,
    });
    app.listen(3000, () =>
      console.log("Server Running at http://localhost:3000/")
    );
  } catch (error) {
    console.log(`DB Error: ${error.message}`);
    process.exit(1);
  }
};

initializeDbAndServer();

// api1
app.get("/todos/", async (req, res) => {
  const data = req.query;
  console.log(data);
  if (data.status) {
    const { status } = data;
    const query = `select * from todo where status = "${status}";`;
    const response = await db.all(query);
    res.send(response);
  } else if (data.priority) {
    const { priority } = data;
    const query = `select * from todo where priority = "${priority}";`;
    const response = await db.all(query);
    res.send(response);
  } else if (data.search_q) {
    const { search_q } = data;
    const query = `select * from todo where todo LIKE "%${search_q}%"`;
    const response = await db.all(query);
    res.send(response);
  } else {
    const { priority, status } = data;
    const query = `select * from todo where priority = "${priority}" and status = "${status}";`;
    const response = await db.all(query);
    res.send(response);
  }
});

// api1 scenario 3
app.get("/todos/", async (req, res) => {});
// api1 scenario 4

// api2 get specificId

app.get("/todos/:todoId", async (req, res) => {
  const { todoId } = req.params;
  const query = `select * from todo where id = ${todoId}`;
  const response = await db.get(query);
  res.send(response);
});

//ap3 create a todo

app.post("/todos/", async (req, res) => {
  const data = req.body;
  console.log(req.body);
  const { id, todo, priority, status } = data;
  const query = `insert into todo(id,todo,priority,status) values(${id},"${todo}","${priority}","${status}");`;
  const response = await db.run(query);
  res.send("Todo Successfully Added");
});

//api 4 update todo based on todoId
app.put("/todos/:todoId", (req, res) => {
  const { todoId } = req.params;
  const reqData = req.body;
  if (reqData.status) {
    console.log(reqData.status);
    const { status } = reqData;
    const query = `update todo set status = "${status}" where id = ${todoId};`;
    const response = db.run(query);
    res.send("Status Updated");
  }
  if (reqData.priority) {
    console.log(reqData.priority);
    const { priority } = reqData;
    const query = `update todo set priority = "${priority}" where id = ${todoId};`;
    const response = db.run(query);
    res.send("Priority Updated");
  }
  if (reqData.todo) {
    console.log(reqData.todo);
    const { todo } = reqData;
    const query = `update todo set todo = "${todo}" where id = ${todoId};`;
    const response = db.run(query);
    res.send("Todo Updated");
  }
});

//api5 delete Todo

app.delete("/todos/:todoId", async (req, res) => {
  const { todoId } = req.params;
  const query = `delete from todo where id = ${todoId}`;
  const response = await db.run(query);
  res.send("Todo Deleted");
});

module.exports = app;
