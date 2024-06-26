const express = require("express");
const cors = require("cors");
const cookieSession = require("cookie-session");
const db = require("./models");
const Role = db.role;
require('dotenv').config();

const app = express();

// routes
require('./routes/auth.routes')(app);
require('./routes/user.routes')(app);


db.mongoose
  .connect(process.env.MONGO_URI, {
  })
  .then(() => {
    console.log("Successfully connect to MongoDB");
    initial();
  })
  .catch(err => {
    console.error("Connection error", err);
    process.exit();
  });

async function initial() {
  try {
    console.log("Checking roles oollection...");
    const count = await Role.estimatedDocumentCount();
    console.log(`Roles count: ${count}`)
    // Listar todos los roles mostrando solo el campo 'name'
    const roles = await Role.find({}, { name: 1, _id: 0 });
    console.log("List of roles:", roles.map(role => role.name));

    if (count === 0) {
      await new Role({ name: "user" }).save();
      console.log("added 'user' to roles collection");
      
      await new Role({ name: "moderator" }).save();
      console.log("added 'moderator' to roles collection");
      
      await new Role({ name: "admin" }).save();
      console.log("added 'admin' to roles collection");
    }
  } catch (err) {
    console.log("error", err);
    }
};




var corsOptions = {
  origin: "http://localhost:8081"
};

app.use(cors(corsOptions));

// parse requests of content-type - application/json
app.use(express.json());

// parse requests of content-type - application/x-www-form-urlencoded
app.use(express.urlencoded({ extended: true }));

app.use(
  cookieSession({
    name: "bezkoder-session",
    keys: ["COOKIE_SECRET"], //    Should use as secret enviroment variable
    httpOnly: true
  })
)

// simple route
app.get("/", (req, res) => {
  res.json({ message: "Welcome to bezkoder application." });
});

// set port, listen for requests
const PORT = process.env.PORT || 8080;
app.listen(PORT, () => {
  console.log(`server is runing on port ${PORT}.`);
});