const bodyParser = require("body-parser");
const cookieSession = require('cookie-session');
const express = require("express");
const bcrypt = require('bcrypt');
const { getUserByEmail, generateId, generateShortURL, urlsForUser } = require('./helpers');

const PORT = 8080;                     // default port 8080
const app = express();
app.set("view engine", "ejs");         // Express app, EJS as templating engine.
app.use(bodyParser.urlencoded({extended: true}));
app.use(cookieSession({                // app.use(cookieParser() is replaced by sookieSession for encryption. 
  name: 'userID',
  keys: ['key1', 'key2']
}));

const urlDatabase = {
  b6UTxQ: { longURL: "https://www.tsn.ca", userID: "test" },
  i3BoGr: { longURL: "https://www.google.ca", userID: "test" }
};

const userDatabase = {
  test: {
    id: 'test',
    email: 'test@gmail.com',
    password: '$2b$10$0SCB.oPikTAGVp2uMdQLAuHmfUNFuQQI./bJRnYCCAPHLzt7FMi/e'
  },
};


app.get('/', (req,res) => {
  if (req.session["userID"]) {
    res.redirect("/urls");
  } else {
    res.redirect("urls/login");
  }
});

//home page, localhost/urls
app.get("/urls", (req, res) => {
  if (req.session["userID"]) {
    const id = req.session["userID"].id;
    const urlOfId = urlsForUser(id, urlDatabase);
    const templateVars = {
      urls: urlOfId,
      userID: req.session["userID"]
    };
    res.render("urls", templateVars);
  } else {
    res.send('Please login first');
  }
});

// create new page
app.get("/urls/new", (req, res) => {
  const templateVars = {
    userID: req.session["userID"]
  };
  if (req.session["userID"]) {
    res.render("urls_new", templateVars);
  } else {
    res.redirect('urls/login');
  }
});

// register page
app.get('/urls/register', (req, res) => {
  const templateVars = {
    userID: req.session["userID"]
  };

  if (req.session["userID"]) {
    res.redirect('/urls');
  } else {
    res.render('urls_register', templateVars);
  }
});

//login page
app.get('/urls/login', (req, res) => {
  const templateVars = {
    userID: req.session["userID"]
  };

  if (req.session["userID"]) {
    res.redirect('/urls');
  } else {
    res.render('urls_login', templateVars);
  }

});

app.get("/urls/:shortURL", (req, res) => {
  if (!req.session["userID"]) {
    return res.send('Please login first');
  }
  
  const id = req.session["userID"].id;
  const urlOfId = urlsForUser(id, urlDatabase);
  const shortURL = req.params.shortURL;

  if (!urlOfId[shortURL]) {
    return res.send('Please add this website to your account first');
  }

  const longURL = urlOfId[shortURL];
  const userID = req.session["userID"];
  const templateVars = { userID, shortURL, longURL};
  res.render("urls_show", templateVars);
});

app.post("/urls", (req, res) => {
  const urlToPost = req.body.longURL;
  const shortURL = generateShortURL();
  const userID = req.session["userID"];

  urlDatabase[shortURL] = {longURL: urlToPost, userID: userID.id};
  res.redirect(`/urls/${shortURL}`);
});

app.post('/urls/:url/delete', (req, res) => {
  const urlToDelte = req.params.url;
  delete urlDatabase[urlToDelte];
  res.redirect('/urls');
});

app.post('/urls/login', (req, res) => {
  const email = req.body.email;
  const password = req.body.password;
  let userID = '';

  for (let user in userDatabase) {
    if (userDatabase[user].email === email) {
      userID = user;
      break;
    } 
  }

  if (!userID) {
    return res.status(400).send('The email address doesn\'t exist');
  }
  
  bcrypt.compare(password, userDatabase[userID].password, (err, result) => {
    if (result) {
      req.session.userID = userDatabase[userID];
      res.redirect('/urls');
    } else {
      return res.status(401).send('password is not correct');
    }
  });
});

app.post('/urls/logout', (req, res) => {
  req.session = null;
  res.redirect('/urls');
});

app.post('/urls/register', (req, res) => {
  const email = req.body.email;
  const userID = generateId();
  const password = req.body.password;
  
  if (!email || !password) {
    return res.status(404).send('Please enter userID or password');
  }

  for (let user in userDatabase) {
    if (userDatabase[user].email === email) {
      return res.status(400).send('The email address has been registered');
    }
  }

  bcrypt.genSalt(10, (err, salt) => {               // generate a salt value based on saltrounds 10.
    bcrypt.hash(password, salt, (err, hash) => {    // generate a hash value
      userDatabase[userID] = {
        id: userID,
        email,
        password: hash
      };
      req.session.userID = userDatabase[userID];
      res.redirect('/urls');
    });
  });
});

// Edit urls
app.post('/urls/:url', (req, res) => {
  const urlToEdit = req.params.url;
  urlDatabase[urlToEdit].longURL = req.body.longURL;
  res.redirect('/urls');
});

app.get("/urls.json", (req, res) => {
  res.json(urlDatabase);
});

// shortening urls
app.get("/u/:id", (req, res) => {
  const shortURL = req.params.id;
  if (urlDatabase[shortURL]) {
    const longURL = urlDatabase[shortURL].longURL;
    res.redirect(longURL);
  } else {
    res.send('URL not exist in data base');
  }
});


app.listen(PORT, () => {
  console.log(`Example app listening on port ${PORT}!`);
});
