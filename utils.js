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

const checkUserPresence = (id) => {
  const data = loadData();
  result = false;
  data.forEach((dataUser) => {
    if (dataUser.pasportId == id) {
      result = true;
    }
  });
  return result;
};

const checkUser = (user) => {
  const checkKeys = Object.keys(user).includes(
    "pasportId" && "cash" && "credit"
  );

  let repeatCheck = true;
  const data = loadData();
  data.forEach((userData) => {
    if (userData.pasportId === user.pasportId) {
      repeatCheck = false;
    }
  });
  //pasportId may be number or string
  const [passwordId, cash, credit] = Object.values(user);
  const checkValues = typeof cash === "number" || typeof credit !== "number";
  return checkKeys && repeatCheck && checkValues;
};

module.exports = { loadData, saveData, checkUser, checkUserPresence };
