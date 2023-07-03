import UserSchema from "./UserSchema.js";

export const insertUser = (userObj) => {
  return UserSchema(userObj).save();
};

export const getUserByEamil = (email) => {
  return UserSchema.findOne({ email });
};
