const path = require("path");
const express = require("express");
const connectDB = require("./config/db");
const morgan = require("morgan");
const { engine } = require("./node_modules/express-handlebars/dist/index");
const dotenv = require("dotenv");
const routes = require("./routes/index");
const passport = require("passport");
const session = require("express-session");

// load config
dotenv.config({ path: "./config/config.env" });

// Passport config
require("./config/passport")(passport);

connectDB();

const app = express();

// logging
if (process.env.NODE_ENV === "development") {
  app.use(morgan("dev"));
}

// Handlebars
// app.engine(".hbs", exphbs.engine({ defaultLayout: "main", extname: ".hbs" }));
// app.set("view engine", ".hbs");

app.engine(".hbs", engine({ defaultLayout: "main", extname: ".hbs" }));
app.set("view engine", ".hbs");

// express session
app.use(
  session({
    secret: "keyboard mine",
    resave: false,
    saveUninitialized: false,
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

const PORT = process.env.PORT || 5000;
app.listen(
  PORT,
  console.log(` Server running in ${process.env.NODE_ENV} mode on port ${PORT}`)
);
