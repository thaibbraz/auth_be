const express = require("express");
const app = express();
app.use(express.json());

var indexRouter = require("./routes/index");
let usersRouter = require("./routes/users");

// // Routes

app.use("/", indexRouter);
app.use("/users", usersRouter);

app.listen(3000);
