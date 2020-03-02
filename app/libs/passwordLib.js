const bcrypt = require("bcrypt");
const saltRounds = 10;
const logger = require("./loggerLib");

const hashPassword = myPlaintextPassword => {
  const salt = bcrypt.genSaltSync(saltRounds);
  const hash = bcrypt.hashSync(myPlaintextPassword, salt);
  return hash;
};

const comparePassword = (myPlaintextPassword, hashedPassword) => {
  const verifiedPassword = bcrypt.compareSync(
    myPlaintextPassword,
    hashedPassword
  );
  return verifiedPassword;
};

module.exports = {
  hashPassword: hashPassword,
  comparePassword: comparePassword
};
