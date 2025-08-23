import bcrypt from "bcrypt";

const passHash = async (password) => await bcrypt.hash(password, 10);

const passCompare = async (password, hash) =>
  await bcrypt.compare(password, hash);

export { passHash, passCompare };
