const Compound = require("../models").compound;
const config = require('../configs/configs.js');
const fs = require("fs");
const csv = require("fast-csv");

//pagination to retrive data from database 
const getPageDetails = (page, size) => {
    const limit = size ? parseInt(size) : 4;
    const offset = page ? page * limit : 0;
    return { limit, offset };
};

//pagination method to send request to the browser
const getFormattedResponse = (data, page, limit) => {
    const { count: totalItems, rows: records } = data;
    const currentPage = page ? page : 0;
    const totalPages = Math.ceil(totalItems / limit);
    return { totalItems, records, totalPages, currentPage };
};


//create records in bulk with csv file
async function multiCreateC(req,res){
    try {
        console.log(req.file);
        if (req.file == undefined) {
            return res.status(400).send("Please upload a CSV file!");
        }
        let Records = [];
        let path = config.PATH + "/files/" + req.file.filename;
        fs.createReadStream(path)
        .pipe(csv.parse({ headers: true })) 
        .on("data", (row) => {
            Records.push(row);
        })
        .on("end", () => {
        Compound.bulkCreate(Records,{fields: [
            'id','CompoundName','CompoundDescription','strImageSource','strImageAttribution'
        ]})
            .then(() => {
                res.status(200).send({message:" Multiple Records Inserted Successfully... "});
            })
            .catch((error) => {
                res.status(500).send({message: "Fail to import data into database!",error: error.message});
            });
        });
    } catch (error) {
        console.log(error);
        res.status(500).send({
          message: "Could not upload the file: " + req.file.originalname,
        });
    }
}


//create single records 
async function createC(req,res){
    try {
        const compound = {
            CompoundName: req.body.CompoundName,
            CompoundDescription: req.body.CompoundDescription,
            strImageSource: req.body.strImageSource,
            strImageAttribution: req.body.strImageAttribution ? req.body.strImageAttribution : null
          };

        console.log(compound);
        const result = await Compound.create(compound);
        res.send(result);
    } catch (error) {
        console.log(error);
        res.status(500).send({message:error.message || "Some error occurred while creating the Compound."});
    }
}

//retrive all compound with pagination
async function getAllC(req,res){
    try {
        const page = req.query.page;
        const size = req.query.size;
        var condition =  req.body.condition;
        var sort = [req.body.sort.atr,req.body.sort.order];
        const { limit, offset } = getPageDetails(page, size);
        const result = await Compound.findAndCountAll({ where: condition, limit : limit, offset : offset ,order: [sort]});
        const response = getFormattedResponse(result, page, limit);
        res.send(response);
    } catch (error) {
        console.log(error);
        res.status(500).send({message:error.message || "Some error occurred while retrieving records."});
    }
}

// get compound details for specified id
async function getC(req,res){
    try {
        const id = req.params.id;
        const result = await Compound.findByPk(id);
        if (result) {
            res.send(result);
        } else {
            res.status(404).send({message: `Cannot find Compound with id=${id}.`});
        }
    } catch (error) {
        console.log(error);
        res.status(500).send({message: "Error retrieving Compound"});
    }
}

// update compound for specified id
async function updateC(req,res){
    try {
        const id = req.params.id;
        const result = await Compound.update(req.body, {where: { id: id }});
        if (result) {
            res.send({message: "Compound was updated successfully."});
        } else {
            res.send({message: `Cannot update Compound with id=${id}. Maybe Compound was not found or req.body is empty!`});
        }
    } catch (error) {
        console.log(error);
        res.status(500).send({message: "Error updating Compound"});
    }
}

// Delete a Compound with the specified id in the request
async function deleteC(req,res) {
    try {
        const id = req.params.id;
        const result = await Compound.destroy({where: { id: id }});
        if (result) {
            res.send({message: "Compound is deleted successfully!"});
        } else {
            res.send({message: `Cannot delete Compound with id=${id}. Maybe Compound was not found!`});
        }
    } catch (error) {
        console.log(error);
        res.status(500).send({message: "Could not delete Compound"});
    }
}

module.exports={multiCreateC,createC, getAllC, getC, updateC, deleteC};