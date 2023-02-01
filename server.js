const compound = require("./routes/CompoundRoutes");
const express = require("express");
const app = express();
const PORT = 8080;

var cors = require('cors');

app.use(cors());
app.use(express.json());
app.use(express.urlencoded({ extended: true }));
 
const db = require("./models");

app.use("/api/compounds",compound);

app.listen(PORT, () => {
  console.log(`Server is running on port ${PORT}.`);
});