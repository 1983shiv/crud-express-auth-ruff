const path = require("path");
const express = require("express");
const connectDB = require("./config/db");
const morgan = require("morgan");
const { engine } = require("./node_modules/express-handlebars/dist/index");
const dotenv = require("dotenv");
const methodOverride = require("method-override");
const routes = require("./routes/index");
const passport = require("passport");
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

// method override
app.use(
  methodOverride(function (req, res) {
    if (req.body && typeof req.body === "object" && "_method" in req.body) {
      let method = req.body._method;
      delete req.body._method;
      return method;
    }
  })
);

// logging
if (process.env.NODE_ENV === "development") {
  app.use(morgan("dev"));
}

// date format
const {
  formatDate,
  stripTags,
  truncate,
  editIcon,
  select,
} = require("./helpers/hbs");

// Handlebars
// app.engine(".hbs", exphbs.engine({ defaultLayout: "main", extname: ".hbs" }));
// app.set("view engine", ".hbs");

app.engine(
  ".hbs",
  engine({
    helpers: { formatDate, stripTags, truncate, editIcon, select },
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

// set global var
app.use(function (req, res, next) {
  res.locals.user = req.user || null;
  next();
});

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
