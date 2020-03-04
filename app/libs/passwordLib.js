const bcrypt = require("bcrypt");
const saltRounds = 10;
const logger = require("./loggerLib");

const hashPassword = myPlaintextPassword => {
  const salt = bcrypt.genSaltSync(saltRounds);
  const hash = bcrypt.hashSync(myPlaintextPassword, salt);
  return hash;
};

const comparePassword = (myPlaintextPassword, hashedPassword, cb) => {
  bcrypt.compare(myPlaintextPassword, hashedPassword, (err, res) => {
    if (err) {
      logger.error(err.message, "Comparison error", 5);
      cb(err, null);
    } else {
      cb(null, res);
    }
  });
  // const verifiedPassword = bcrypt.compareSync(
  //   myPlaintextPassword,
  //   hashedPassword
  // );
  // return verifiedPassword;
};

module.exports = {
  hashPassword: hashPassword,
  comparePassword: comparePassword
};
