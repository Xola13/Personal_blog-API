const express = require("express");
const cors = require("cors");

// Needed fixes
// https://stackoverflow.com/questions/50093144/mysql-8-0-client-does-not-support-authentication-protocol-requested-by-server
//
//

// const contactRouter = require("./routes/contactRouter");
const userRouter = require("./routes/userRouter");
const blogRouter = require("./routes/blogRouter");

const app = express();
app.set("port", process.env.PORT || 5100);

app.use(express.json());
app.use(cors());

app.get("/", (req, res) => {
  const _rootUrl = req.get("host") + req.url;
  res.send({
    msg: "Welcome to the API. Check the routes object ",
    routes: {
      contact: `${_rootUrl}contact`,
    },
  });
});

// app.use("/contact", contactRouter);
app.use("/users", userRouter);
app.use("/posts", blogRouter);

app.listen(app.get("port"), () => {
  console.log(`Listening for calls on port ${app.get("port")}`);
  console.log("Press Ctrl+C to exit server");
});