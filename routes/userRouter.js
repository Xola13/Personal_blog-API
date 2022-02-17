require("dotenv").config();
const express = require('express');
const router = express.Router();
const mysql = require('mysql');
const con = require('../dbConnectiion') 
const bcrypt = require('bcrypt');
const jwt = require('jsonwebtoken');

function authenticationToken(req, res, next) {
  const authHeader = req.headers['authorization'];

  const token = authHeader && authHeader.split(" ")[1];

  if(!token) res.sendStatus(401)
  
  jwt.verify(token, process.env.SECRETE_KEY, (err, user) => {
    if(err) res.sendStatus(403)
    req.user = user;
    next();

  });
};





// USER REGISTRATION
router.post('/', async (req, res) => {

   const{name, email, contact, password} = req.body;
   if(!name || !email || !contact || !password)
   res.status(400).send({msg: "Not all fields have been submitted"});

   const salt = bcrypt.genSalt();
   const hashedpassword = await bcrypt.hash(password, salt);

   var sql = `INSERT INTO Users (user_name, user_email, user_contact, user_password) VALUES ('${name}','${email}','${contact}','${hashedpassword}')`;
        con.query(sql, function (err, result) {
          if (err) throw err;
          console.log("1 record inserted");
      });
});

// GET ALL USERS

router.get('/', (req, res, next)=>{
  
  var sql = `SELECT *FROM Users`;
    con.query(sql, function (err, result) {
      if (err) throw err;
      console.log("1 record inserted");
      res.send(result)
  
  });
});

// GET ONE USER

router.get('/:id', (req, res, next)=>{
  
  var sql = `SELECT *FROM Users WHERE User_id=${req.params.id}`;
  con.query(sql, function (err, result) {
    if (err) throw err;
    console.log("1 record inserted");
    res.send(result)
  });
});

// UPDATE USERS

router.put('/:id', (req, res, next)=>{

const { name, email, contact, password, avatar, about } = req.body;

  let sql = "UPDATE Users SET"; 
  
  if(name) sql += `User_name = ${name}`;
  if(email) sql += `User_email = ${email}`;
  if(contact) sql += `User_contact = ${contact}`;
  if(password) sql += `User_password = ${password}`;
  if(avatar) sql += `User_avatar = ${avatar}`;
  if(about) sql += `User_about = ${about}`;
  

  sql += `WHERE User_id=${req.params.id}`;

  con.query(sql, function (err, result) {
    if (err) throw err;
    console.log("1 record inserted");
    res.send(result)
  });
});

//DELETE USERS

router.delete('', (req, res, next)=>{
  var sql = `DELETE *FROM Users WHERE User_id=${req.params.id}`;
  con.query(sql, function (err, result) {
    if (err) throw err;
    console.log("1 record deleted");
    res.send("Number of records deleted: "+result)
  });
})

// SIGN IN USER
router.patch('/', (req, res)=> {
  const { email, password} = req.body;
  var sql = `SELECT * FROM Users WHERE User_email='${email}'`;
  con.query(sql, async function (err, result) {
    if (err) throw err;
    console.log("1 record found");

const user = result[0];

console.log(user);

const match = await bcrypt.compare(password, user.user_password);
if(match) {

const access_token = jwt.sign(user.process.env.SECRETE_KEY);
res.send({ jwt:access_token });

}else {
  res.send()
}
  });
});


module.exports = router;