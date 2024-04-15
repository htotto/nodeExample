const express = require('express');
const cors = require('cors');
const {v4:uuidv4} = require('uuid');
const sqlite3 = require('sqlite3').verbose();
const dbSource = "node.db";
const db = new sqlite3.Database(dbSource);
const HTTP_PORT = 8000;

console.log("Listening on port " + HTTP_PORT);
var app = express();
app.use(cors());

//This is a seperate way than shown in class. It is a built in alternative to body-parser
app.use(express.json());

// Task 1 Implement CRUD Operations to manage room reservations
// Get 
app.get("/reservations", (req,res,next) => {
    let strCommand = "SELECT * FROM tblReservations";
    db.all(strCommand,[],(err,rows) => {
        if(err){
            res.status(400).json({error:err.message})
        } else {
            res.status(200).json(rows)
        }
    })
})

// Get by ID
app.get("/reservations/:id", (req,res,next) => {  
    let strID = req.params.id;
    if (strID){
        let strCommand = "SELECT * FROM tblReservations WHERE ID = ?";
        let arrParameters = [strID];
        db.get(strCommand,arrParameters,(err,row) => {
            if(err){
                res.status(400).json({error:err.message})
            } else {
                res.status(200).json(row)
            }
        })
    } else {
        res.status(400).json({error:"No ID provided"})
    }
})

// Delete
app.delete("/reservations/:id", (req,res,next) => {
    let strID = req.params.id;
    if (strName){
        let strCommand = "DELETE FROM tblReservations WHERE ID = ?";
        let arrParameters = [strID];
        db.run(strCommand,arrParameters,function(err,result){
            if(err){
                res.status(400).json({error:err.message})
            } else {
                res.status(200).json({message:"deleted"})
            }
        })
    } else {
        res.status(400).json({error:"No ID provided"})
    }
})

// Post
app.post("/reservations", (req,res,next) => {
    let strID = uuidv4();
    let strRoomNumber = req.body.RoomNumber;
    let strDate = req.body.Date;
    let strStartTime = req.body.StartTime;
    let strEndTime = req.body.EndTime;
    let strReservedBy = req.body.ReservedBy;
    let strCommand = "INSERT INTO tblReservations VALUES(?,?,?,?,?,?)";
    if(strRoomNumber && strDate && strStartTime && strEndTime && strReservedBy){
        let arrParameters = [strID, strRoomNumber, strDate, strStartTime, strEndTime, strReservedBy];
        db.run(strCommand,arrParameters, function(err,result){
            if(err){
                res.status(400).json({error:err.message})
            } else {
                res.status(201).json({message:"success"})
            }
        })
    } else {
        res.status(400).json({error:"Not all parameters provided"})
    }
})


// Task 2: Custom Class Implementation
class InstallationInfo {
    constructor(strName, strprimaryColor, strAddress){
        this.name = strName
        this.primaryColor = strprimaryColor;
        this.address = strAddress;
    }
}

// Create an instance with the values given in the test.
var arrInstallation = [];
let objCookevillePolice = new InstallationInfo('Cookeville Police', 'blue', '1019 Neal Street');
arrInstallation.push(objCookevillePolice);

//Get
app.get("/installinfo", (req,res,next) => { 
    res.status(200).send(arrInstallation);
})

app.listen(HTTP_PORT);