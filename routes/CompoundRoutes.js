const compound = require("../controllers/CompoundController");
const upload = require("./../middleware/FileUpload");
const express = require("express");
const route = express.Router();

// Multiple Record creation of Compounds
route.post("/multiCreateC",upload.single('file'), compound.multiCreateC);
  
// Create a single new Compound
route.post("/createC", compound.createC);
  
// getting all Compounds with pagination
route.post("/AllC", compound.getAllC);
  
// Retrieve a single Compound with id
route.get("/:id", compound.getC);
  
// Update a Compound with id
route.put("/:id", compound.updateC);
  
// Delete a Compound with id
route.delete("/:id", compound.deleteC);
  

module.exports = route;