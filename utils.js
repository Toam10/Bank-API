const fs = require("fs");

const loadData = () => {
  try {
    const dataBuffer = fs.readFileSync("./db/data.json");
    const dataJSON = dataBuffer.toString();
    const data = JSON.parse(dataJSON);
    return data;
// you can do this in one line look at this:
   // loadData = () => JSON.parse(fs.readFileSync("./db/data.json","utf-8))
    
  } catch (e) {
    return [];
    // Meaningless 
    // use throw Error("some text will be better")
    //maybe gnarate a new file if there is not a file of json with some data
    // dont use try and catch inside a utils if this is sync and most of the time we do sync things inside utils
  }
};

const saveData = (data) => {
  fs.writeFileSync("./db/data.json", JSON.stringify(data));
};

// good dont do it in one line because this function isnt return something and that is clearer

const checkUserToAdd = (user) => Object.keys(user).includes("pasportId" && "cash" && "credit" && "isActive")
    // make a specific function for this  "pasportId" && "cash" && "credit" && "isActive" that return true or false
    // nice using object.keys we see it alot in the wild
    // one line please that name of the function is tell us the story
  

  let repeatCheck = true;
  const data = loadData();
  data.forEach((userData) => {
    if (userData.pasportId === user.pasportId) {
      repeatCheck = false;
    }
  });
  //pasportId may be number or string
  console.log(user); // remove console.log()
  const [pasportId, cash, credit, isActive] = Object.values(user);
  // nice this is a nice way of using Object.values but

  const checkValues =
    typeof cash === "number" &&
    typeof credit === "number" &&
    (isActive === "false" || isActive === "true");
// remove as other util function
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
    // function name: calculateWithdraw is not a good name if you return object in the end you need to think what you take (args) what you do (somecode) and what you return (return value) !important
  } else {
    return null;
  }
};

const calculateTransfer = (transferSum, data, indexFrom, indexTo) => {
  const objectFrom = data[indexFrom];
  const objectTo = data[indexTo];
  // that a user not only a object if we know that users is array of docs we dont need that you tell us that its a object call is user
  
  if (calculateWithdraw(transferSum, objectFrom)) {
    calculateWithdraw(transferSum, objectFrom);
    objectTo.cash += transferSum;
    return data;
    // 
     // function name: calculateTransfer is not a good name if you return object in the end you need to think what you take (args) what you do (somecode) and what you return (return value) !important
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
