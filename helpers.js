const { v4: uuidv4 } = require('uuid');

const getUserByEmail = function(email, database) {
  for (let user in database) {
    if (database[user].email === email) {
      return database[user];
    } 
  };
  return {id : undefined}
}

const generateId = () => {
  return uuidv4().split('-')[1];       // 4 digits 
};

const generateShortURL = () => {
  return uuidv4().split('-')[0];       // 8 digits
};

const urlsForUser = (id, urlDatabase) => {
  const urlOfId = {}
  for (let url in urlDatabase) {
    if (urlDatabase[url].userID === id) {
      urlOfId[url] = urlDatabase[url].longURL;
    }
  }
  return urlOfId;
}


module.exports = {getUserByEmail, generateId, generateShortURL, urlsForUser};
// console.log(getUserByEmail('test@gmail.com', userDatabase))
