const path = require("path");
const express = require("express");
const connectDB = require("./config/db");
const morgan = require("morgan");
const { engine } = require("./node_modules/express-handlebars/dist/index");
const dotenv = require("dotenv");
const routes = require("./routes/index");
const passport = require("passport");
const mongoose = require("mongoose");
const session = require("express-session");
const MongoStore = require("connect-mongo");

// load config
dotenv.config({ path: "./config/config.env" });

// Passport config
require("./config/passport")(passport);

connectDB();

const app = express();

// body parser
app.use(express.urlencoded({ extended: false }));
app.use(express.json());

// logging
if (process.env.NODE_ENV === "development") {
  app.use(morgan("dev"));
}

// date format
const { formatDate, stripTags, truncate } = require("./helpers/hbs");

// Handlebars
// app.engine(".hbs", exphbs.engine({ defaultLayout: "main", extname: ".hbs" }));
// app.set("view engine", ".hbs");

app.engine(
  ".hbs",
  engine({
    helpers: { formatDate, stripTags, truncate },
    defaultLayout: "main",
    extname: ".hbs",
  })
);
app.set("view engine", ".hbs");

// express session

const options = {
  mongoUrl: process.env.MONGO_URI,
};

app.use(
  session({
    secret: "keyboard mine",
    resave: false,
    saveUninitialized: false,
    store: MongoStore.create(options),
  })
);

// Passport middleware
app.use(passport.initialize());
app.use(passport.session());

// static folder
app.use(express.static(path.join(__dirname, "public")));

// Routes
app.use("/", routes);
app.use("/auth", require("./routes/auth"));
app.use("/stories", require("./routes/stories"));

const PORT = process.env.PORT || 5000;
app.listen(
  PORT,
  console.log(` Server running in ${process.env.NODE_ENV} mode on port ${PORT}`)
);
