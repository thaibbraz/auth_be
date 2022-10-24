const express = require("express");
const app = express();
const port = process.env.PORT || 3000;

app.use(express.json());

let indexRouter = require("./routes/index");
let usersRouter = require("./routes/users");

//  Routes

app.use("/", indexRouter);
app.use("/users", usersRouter);

app.listen(port);
