const fs = require("fs");

const loadData = () => {
  try {
    const dataBuffer = fs.readFileSync("./db/data.json");
    const dataJSON = dataBuffer.toString();
    const data = JSON.parse(dataJSON);
    return data;
  } catch (e) {
    return [];
  }
};

const saveData = (data) => {
  fs.writeFileSync("./db/data.json", JSON.stringify(data));
};

const checkUserToAdd = (user) => {
  const checkKeys = Object.keys(user).includes(
    "pasportId" && "cash" && "credit" && "isActive"
  );

  let repeatCheck = true;
  const data = loadData();
  data.forEach((userData) => {
    if (userData.pasportId === user.pasportId) {
      repeatCheck = false;
    }
  });
  //pasportId may be number or string
  console.log(user);
  const [pasportId, cash, credit, isActive] = Object.values(user);
  const checkValues =
    typeof cash === "number" &&
    typeof credit === "number" &&
    (isActive === "false" || isActive === "true");

  return checkKeys && repeatCheck && checkValues;
};

const calculateWithdraw = (withdrawSum, object) => {
  if (withdrawSum <= object.cash + object.credit) {
    if (withdrawSum <= object.cash) {
      object.cash = object.cash - withdrawSum;
    } else if (withdrawSum > object.cash) {
      object.credit = object.credit + object.cash - withdrawSum;
      object.cash = 0;
    }
    return object;
  } else {
    return null;
  }
};

const calculateTransfer = (transferSum, data, indexFrom, indexTo) => {
  const objectFrom = data[indexFrom];
  const objectTo = data[indexTo];
  if (calculateWithdraw(transferSum, objectFrom)) {
    calculateWithdraw(transferSum, objectFrom);
    objectTo.cash += transferSum;
    return data;
  } else {
    return null;
  }
};

module.exports = {
  loadData,
  saveData,
  checkUserToAdd,
  calculateWithdraw,
  calculateTransfer,
};
