const express = require("express");
const app = express();

const {
  loadData,
  checkUserPresence,
  saveData,
  checkUser,
} = require("./utils.js");

app.use(express.json());

//get all users
app.get("/", (req, res) => {
  res.send(JSON.stringify(loadData()));
});

//add new user
app.post("/", (req, res) => {
  const data = loadData();
  const newUser = req.body;
  if (checkUser(newUser)) {
    data.push(newUser);
    saveData(data);
    res.status(201).send(JSON.stringify(data));
  } else {
    res.send("send unique user with full and correct data");
  }
});

//add cash to user
app.put("/cash", (req, res) => {
  const data = loadData();
  const userIdToEdit = req.query.userId;
  const cash = req.body.cash;
  const editIndex = data.findIndex((user) => user.pasportId == userIdToEdit);
  if (editIndex > -1) {
    data[editIndex].cash = data[editIndex].cash + cash;
    saveData(data);
    res.status(200).send(JSON.stringify(data));
  } else {
    res.send("enter cash to user that exists");
  }
});

//try to add credit
app.put("/credit", (req, res) => {
  const data = loadData();
  const userIdToEdit = req.query.userId;
  const credit = req.body.credit;
  const editIndex = data.findIndex((user) => user.pasportId == userIdToEdit);
  if (editIndex > -1) {
    data[editIndex].credit = data[editIndex].credit + credit;
    saveData(data);
    res.status(200).send(JSON.stringify(data));
  } else {
    res.send("enter credit to user that exists");
  }
});

//get users data by id
app.get("/users", (req, res) => {
  const data = loadData();
  const id = req.query.userId;
  if (checkUserPresence(id)) {
    const index = data.findIndex((dataUser) => dataUser.pasportId == id);
    res.status(200).send(JSON.stringify(data[index]));
  } else {
    res.send("the user doesn't exist");
  }
});

const PORT = 3000;

app.listen(PORT, () => {
  console.log("server is up on port:", PORT);
});
