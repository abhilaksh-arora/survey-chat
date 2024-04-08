const express = require("express");
const app = express();

const cors = require("cors");
const connectDB = require("./config/db");
const bodyParser = require("body-parser");

const router = require("./route/adminRoutes");
router.use(bodyParser.json());

const routerUser = require("./route/chatRoutes");
routerUser.use(bodyParser.json());

app.use(bodyParser.json());
const PORT = process.env.PORT || 1000;

app.use(cors());
app.use(express.json());
app.use(express.urlencoded({ extended: true }));
app.use(bodyParser.json());

app.use(function (req, res, next) {
  res.header("Access-Control-Allow-Origin", "*");
  res.header(
    "Access-Control-Allow-Headers",
    "Origin, X-Requested-With, Content-Type, Accept"
  );
  next();
});

connectDB();

app.get("/", (req, res) => {
  res.send("Hello World");
});

app.use("/api/v1/admin", router);
app.use("/api/v1/user", routerUser);

app.listen(PORT, () => {
  console.log(`listening on http://localhost:${PORT}`);
});
