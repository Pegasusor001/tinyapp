const userDatabase = {
  test: {
    id: 'test',
    email: 'test@gmail.com',
    password: '$2b$10$0SCB.oPikTAGVp2uMdQLAuHmfUNFuQQI./bJRnYCCAPHLzt7FMi/e'
  },
};

const getUserByEmail = function(email, database) {
  for (let user in database) {
    if (database[user].email === email) {
      return database[user];
    }
  };
}

// console.log(getUserByEmail('test@gmail.com', userDatabase))
