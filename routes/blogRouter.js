const express = require('express');
const router = express.Router();
const mysql = require('mysql');
const authenticateToken = require('../auth');
const { on } = require('../dbConnectiion');
const con = require('../dbConnectiion')




function getToday() {
    let today = new Date();
    const dd = String(today.getDate()).padStart(2, "0");
    const mm = String(today.getMonth() + 1).padStart(2, "0"); //January is 0!
    const yyyy = today.getFullYear();
  
    today = mm + "/" + dd + "/" + yyyy;
  
    return today;
  }



// BLOG POST

// router.post('/', (req, res, next)=>{
    
//     const{title, body, date, author} = req.body;
//     if(!title || !body || !date || !author)
//     res.status(400).send({msg: "Not all fields have been submitted"});
 
//     var sql = `INSERT INTO Posts (post_title, post_body, post_date, post_author) VALUES ('${title}','${body}','${date}','${author}')`;
//          con.query(sql, function (err, result) {
//            if (err) throw err;
//            console.log("1 record inserted");
//        });
//  });

 // GET ALL BLOG POSTS
 
router.get('/', authenticateToken, (req, res, next) => {
    
    var sql = `SELECT *FROM Posts`;
    con.query(sql, function (err, result) {
      if (err) throw err;
      console.log("1 record inserted");
      res.send(result)
  
  });
});


router.post('/', authenticateToken, (req, res, next) => {
    
const {title, body } = req.body;
const user = req.user;
if(!title || !body) res.sendStatus(400);

res.send(user);

var sql = `INSERT INTO Posts (post_title, post_body) VALUES ('${title}','${body}','${getToday}','${req.user.user_id}')`;
          con.query(sql, function (err, result) {
            // if (err) throw err;
            // console.log("1 record inserted");
            // res.send({msg: "Post created"});
            res.send({
                msg: "Post created",
                post_id: result.insertId,
            });
       }).on('error', () => res.sendStatus(400));
});

// GET ONE BLOG POSTS

router.get('/:id', (req, res, next)=>{
    
    var sql = `SELECT *FROM Posts WHERE Post_id=${req.params.id}`;
    con.query(sql, function (err, result) {
      if (err) throw err;
      console.log("1 record inserted");
      res.send(result)
    });

});

// UPDATE BLOG POSTS

router.put('/:id', (req, res, next)=>{

    const { title, body, date, author } = req.body;

  let sql = "UPDATE Posts SET"; 
  
  if(title) sql += `Post_title = ${title}`;
  if(body) sql += `Post_body = ${body}`;
  if(date) sql += `Post_date = ${date}`;
  if(author) sql += `Post_author = ${author}`;

  sql += `WHERE Post_id=${req.params.id}`;

  con.query(sql, function (err, result) {
    if (err) throw err;
    console.log("1 record inserted");
    res.send(result)
  });

});

router.delete('/:id', (req, res, next)=>{
    
    var sql = `DELETE * FROM Posts WHERE Post_id=${req.params.id}`;
    con.query(sql, function (err, result) {
      if (err) throw err;
      console.log("1 record deleted");
      res.send("Number of records deleted: "+result)
    });

})

module.exports = router;