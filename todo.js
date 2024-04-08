const express = require('express');
const cors = require('cors');
const {v4:uuidv4} = require('uuid');
const sqlite3 = require('sqlite3').verbose();
const dbSource = "todo.db";
const db = new sqlite3.Database(dbSource);

const HHTP_Port = 8000;
console.log("Listening on port: " + HHTP_Port);
var app = express();
app.use(cors());
app.use(express.json());

class Tasks {
    constructor(strTaskName, strDueDate, strLocation, strInstructions, strStatus, strTaskID) {
        this.taskName = strTaskName;
        this.dueDate = strDueDate;
        this.location = strLocation;
        this.instructions = strInstructions;
        this.status = strStatus;
        this.taskID = strTaskID;
    }
}

let strID = uuidv4();

app.post("/task", (req, res, next) => {
    let strTaskName = req.body.TaskName;
    let strDueDate = req.body.DueDate;
    let strLocation = req.body.Location;
    let strInstructions = req.body.Instructions;
    let strStatus = req.body.Status;
    let strTaskID = uuidv4();
    let strCommand = "INSERT INTO tblTasks (TaskName, DueDate, Location, Instructions, Status, TaskID) VALUES (?,?,?,?,?,?)";
    if(strTaskName && strDueDate && strLocation && strInstructions && strStatus){
        let arrParameters = [strTaskName, strDueDate, strLocation, strInstructions, strStatus, strTaskID];
        let objTask = new Tasks(strTaskName, strDueDate, strLocation, strInstructions, strStatus, strTaskID);
        db.run(strCommand, arrParameters, function(error, result){
            if(error){
                res.status(400).json({error: error.message});
            } else {
                res.status(201).json({message: "success", task: objTask})
            }
        })
    } else {
        res.status(400).json({error: "Not all parameters provided"})
    }
});

app.get("/task/:taskID", (req, res, next) => {
    let strTaskID = req.params.taskID;
    if(strTaskID){
        let strCommand = "SELECT * FROM tblTasks WHERE TaskID = ?";
        let arrParameters = [strTaskID];
        db.all(strCommand,arrParameters,(err, rows) => {
            if(err){
                res.status(400).json({error: err.message});
            } else {
                res.status(200).send(rows);
            }
        })
    } else {
        res.status(400).json({error: "No task id provided"})
    }
});

app.get("/task", (req, res, next) => {
    let strCommand = "SELECT * FROM tblTasks";
    db.all(strCommand,(err, rows) => {
        if(err){
            res.status(400).json({error: err.message});
        } else {
            res.status(200).send(rows);
        }
    })
});

app.delete("/task/:taskID", (req, res, next) => {
    let strTaskID = req.params.taskID;
    console.log(strTaskID);
    if(strTaskID){
        let strCommand = "DELETE FROM tblTasks WHERE TaskID = ?";
        let arrParameters = [strTaskID];
        db.run(strCommand, arrParameters, function(error){
            if(error){
                res.status(400).json({error: error.message});
            } else {
                res.status(200).json({message: "success"})
            }
        })
    } else {
        res.status(400).json({error: "No task id provided"})
    }
});

app.put("/task/:taskID", (req, res, next) => {
    let strTaskID = req.params.taskID;
    let strTaskName = req.body.taskName;
    let strDueDate = req.body.dueDate;
    let strLocation = req.body.location;
    let strInstructions = req.body.instructions;
    let strStatus = req.body.status;
    if(strTaskID && strTaskName && strDueDate && strLocation && strInstructions && strStatus){
        let strCommand = "UPDATE tblTasks SET TaskName = ?, DueDate = ?, Location = ?, Instructions = ?, Status = ? WHERE TaskID = ?";
        let arrParameters = [strTaskName, strDueDate, strLocation, strInstructions, strStatus, strTaskID];
        db.run(strCommand, arrParameters, function(error, result){
            if(error){
                res.status(400).json({error: error.message});
            } else {
                res.status(200).json({message: "success"})
            }
        })
    } else {
        res.status(400).json({error: "Not all parameters provided"})
    }
});


app.listen(HHTP_Port);