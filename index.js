const express = require("express");
const app = express();
const { connectToMysql, syncToDb } = require("./connections/db.sql.connection");


const userRoutes = require("./routers/users.routes");
const expenseRoutes = require("./routers/expenses.routes");
const categoryRoutes = require("./routers/catagory.routes");

app.use(express.json());
app.use(express.urlencoded({ extended: false }));

app.use("/api/users", userRoutes);
app.use("/api/categories", categoryRoutes);
app.use("/api/expenses", expenseRoutes);

syncToDb();
connectToMysql()
  .then(() => {
    console.log("In connectToMysql()");
    console.log("SQL CONNECTED");
  })
  .catch((error) => {
    console.log("Not connected", error);
  });

const port = 8001;

app.listen(port, () => {
  console.log(`Server running on port ${port}`);
});
