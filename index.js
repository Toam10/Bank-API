const express = require("express");
const app = express();

const {
  loadData,
  saveData,
  checkUserToAdd,
  calculateWithdraw,
  calculateTransfer,
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
  if (checkUserToAdd(newUser)) {
    data.push(newUser);
    saveData(data);
    res.status(201).send(JSON.stringify(data));
  } else {
    res
      .status(400)
      .send(
        JSON.stringify({
          ERROR: "Send unique user with full and correct data",
          pasportId: "string or number",
          cash: "number",
          credit: "number",
          isActive: "boolean",
        })
      );
  }
});

//add cash to user
app.put("/cash", (req, res) => {
  const data = loadData();
  const userIdToEdit = req.query.userId;
  const cash = req.body.cash;
  const editIndex = data.findIndex((user) => user.pasportId == userIdToEdit);
  const user = data[editIndex];
  if (editIndex === -1) {
    res.status(400).send(`The user with id ${userIdToEdit} doesn't exist`);
  } else if (!user.isActive) {
    res
      .status(400)
      .send(
        `The user with id ${userIdToEdit} is not active, operations are unsupported`
      );
  } else {
    user.cash = user.cash + cash;
    saveData(data);
    res.status(200).send(JSON.stringify(data));
  }
});

// to add credit
app.put("/credit", (req, res) => {
  const data = loadData();
  const userIdToEdit = req.query.userId;
  const credit = req.body.credit;
  const editIndex = data.findIndex((user) => user.pasportId == userIdToEdit);

  const user = data[editIndex];
  if (editIndex === -1) {
    res.status(400).send(`The user with id ${userIdToEdit} doesn't exist`);
  } else if (!user.isActive) {
    res
      .status(400)
      .send(
        `The user with id ${userIdToEdit} is not active, operations are unsupported`
      );
  } else {
    user.credit = user.credit + credit;
    saveData(data);
    res.status(200).send(JSON.stringify(data));
  }
});

//withdraw money
app.put("/withdraw", (req, res) => {
  const data = loadData();
  const id = req.query.userId;
  const withdraw = req.body.withdraw;
  const index = data.findIndex((dataUser) => dataUser.pasportId == id);
  let user = data[index];
  if (index === -1) {
    res.status(400).send(`The user with id ${id} doesn't exist`);
  } else if (!user.isActive) {
    res
      .status(400)
      .send(`The user with id ${id} is not active, operations are unsuported`);
  } else {
    user = calculateWithdraw(withdraw, user);
    if (user) {
      saveData(data);
      res.status(200).send(JSON.stringify(data));
    } else {
      res
        .status(400)
        .send(
          `The user with id ${id} doesn't have enough money for withdraw ${withdraw}`
        );
    }
  }
});

//transfer money
app.put("/transfer", (req, res) => {
  let data = loadData();
  const idUserFrom = req.query.idUserFrom;
  const idUserTo = req.query.idUserTo;
  const transfer = req.body.transfer;
  const indexFrom = data.findIndex(
    (dataUser) => dataUser.pasportId == idUserFrom
  );
  const indexTo = data.findIndex((dataUser) => dataUser.pasportId == idUserTo);

  let userFrom = data[indexFrom];
  let userTo = data[indexTo];
  if (indexFrom === -1 || indexTo === -1) {
    if (indexFrom === -1 && indexTo === -1) {
      res
        .status(400)
        .send(`The users with id ${idUserFrom} and id ${idUserTo} don't exist`);
    } else if (indexTo === -1) {
      res.status(400).send(`The user with id ${idUserTo} doesn't exist`);
    } else {
      res.status(400).send(`The user with id ${idUserFrom} doesn't exist`);
    }
  } else if (!userFrom.isActive || userTo.isActive) {
    if (!userFrom.isActive && !userTo.isActive) {
      res
        .status(400)
        .send(
          `The user with id ${idUserFrom} and id ${idUserTo} are not active, operations are unsupported`
        );
    } else if (!userFrom.isActive) {
      res
        .status(400)
        .send(
          `The user with id ${idUserFrom} is not active, operations are unsupported`
        );
    } else {
      res
        .status(400)
        .send(
          `The user with id ${idUserTo} is not active, operations are unsupported`
        );
    }
  } else {
    newData = calculateTransfer(transfer, data, indexFrom, indexTo);
    if (newData) {
      saveData(newData);
      res.status(200).send(JSON.stringify(newData));
    } else {
      res
        .status(400)
        .send(
          `The user with id ${idUserFrom} doesn't have enough money for transfer ${transfer}`
        );
    }
  }
});

//get users data by id
app.get("/users", (req, res) => {
  const data = loadData();
  const id = req.query.userId;
  const index = data.findIndex((dataUser) => dataUser.pasportId == id);
  if (index > -1) {
    res.status(200).send(JSON.stringify(data[index]));
  } else {
    res.send(`The user with id ${id} doesn't exist`);
  }
});

//get user info by amount of cash
app.get("/cash", (req, res) => {
  const data = loadData();
  const cash = req.query.cash;
  const cashResult = data.filter((dataUser) => dataUser.cash === cash);
  if (cashResult.length > 0) {
    res.status(200).send(JSON.stringify(cashResult));
  } else {
    res.status(400).send(`The user with cash ${cash} not found`);
  }
});

//get users that are active and have more than X amount of money in cash
app.get("/cash-active", (req, res) => {
  const data = loadData();
  const cash = req.query.cash;

  const users = data.filter(
    (dataUser) => dataUser.cash >= cash && dataUser.isActive === true
  );
  if (users.length > 0) {
    res.status(200).send(JSON.stringify(users));
  } else {
    res
      .status(400)
      .send(`No active users are found with cash equal or more ${cash}`);
  }
});

const PORT = 3000;

app.listen(PORT, () => {
  console.log("server is up on port:", PORT);
});
