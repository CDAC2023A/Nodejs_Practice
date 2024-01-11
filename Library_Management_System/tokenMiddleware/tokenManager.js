let userData = [];
module.exports = {
  getUserData: () => userData,
  addUserData: (user) => {
    console.log("Adding user:", user);
    userData.push(user);
  },
};
