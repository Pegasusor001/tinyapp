const getUserByEmail = function(email, database) {
  for (let user in database) {
    if (database[user].email === email) {
      return database[user];
    } 
  };
  return {id : undefined}
}

module.exports = { getUserByEmail };
// console.log(getUserByEmail('test@gmail.com', userDatabase))
