const { v4: uuidv4 } = require('uuid');
const userId = uuidv4().split('-')[1];

console.log(typeof userId);