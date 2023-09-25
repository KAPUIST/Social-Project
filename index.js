const express = require("express");
const dotenv = require("dotenv");
const cors = require("cors");
const morgan = require("morgan");
const bodyParser = require("body-parser");
const path = require("path");

const __diname = path.resolve(path.dirname(""));
//보안
const helmet = require("helmet");
const csp = require("helmet-csp");
const dbConnection = require("./dbConfig/index.js");
const { errorMiddleware } = require("./middleware/errorMiddleware.js");
const router = require("./routes/index.js");

dotenv.config();
const app = express();
app.use(express.static(path.join(__diname, "views/build")));

const PORT = process.env.PORT || 8080;

dbConnection();

app.use(helmet());
app.use(
  csp({
    useDefaults: true,
    directives: {
      defaultSrc: ["'self'", "default.example"],
      scriptSrc: ["'self' 'unsafe-inline'"],
      objectSrc: ["'none'"],
    },
  })
);
app.use(cors());
app.use(bodyParser.json());
app.use(express.json({ limit: "10mb" }));
app.use(express.urlencoded({ extended: true }));

app.use(morgan("dev"));
app.use(router);
app.use(errorMiddleware);

app.listen(PORT, () => {
  console.log(`Sever running!!  PORT ${PORT} `);
});
