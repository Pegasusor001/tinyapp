const bodyParser = require("body-parser");
const cookieParser = require('cookie-parser')
const express = require("express");
const { v4: uuidv4 } = require('uuid');
const app = express();
const PORT = 8080; // default port 8080

app.set("view engine", "ejs"); // Express app, EJS as templating engine. 
app.use(bodyParser.urlencoded({extended: true}));
app.use(cookieParser())

const generateId = () => {
  return uuidv4().split('-')[1];
};

const generateShortURL = () => {
  return uuidv4().split('-')[0];
};

const urlsForUser = (id) => {
  const urlOfId = {}
  for (let url in urlDatabase) {
    if (urlDatabase[url].userID === id) {
      urlOfId[url] = urlDatabase[url].longURL;
    }
  }

  return urlOfId;
}

const urlDatabase = {
  b6UTxQ: { longURL: "https://www.tsn.ca", userID: "test" },
  i3BoGr: { longURL: "https://www.google.ca", userID: "test" }
};

const userDatabase = {
  test: {
    id: 'test',
    email: 'test@gmail.com',
    password: '1234'
  },
};


// Get home page, localhost/urls
app.get("/urls", (req, res) => {
  console.log(req.cookies, userDatabase, urlDatabase)
  if (req.cookies["userID"]) {
    const id = req.cookies["userID"].id;
    const urlOfId = urlsForUser(id)
    console.log(id, urlOfId);
    const templateVars = { 
      urls: urlOfId,
      userID: req.cookies["userID"]
    };
    res.render("urls", templateVars);
  } else {
    const templateVars = { 
      userID: req.cookies["userID"]
    };
    res.render("urls_home", templateVars);  
  }  
});

// Get posting new link page, localhost/urls/news, used to post new urls. 
// login to view 
app.get("/urls/new", (req, res) => {
  const templateVars = { 
    userID: req.cookies["userID"]
  };
  if (templateVars.userID) {
    res.render("urls_new", templateVars);
  } else {
    return res.redirect('/urls/login')
  }
});

// Get Register Page
app.get('/urls/register', (req, res) => {
  const templateVars = { 
    userID: req.cookies["userID"]
  };
  res.render('urls_register', templateVars);
})

// Get Login Page
app.get('/urls/login', (req, res) => {
  const templateVars = { 
    userID: req.cookies["userID"]
  };
  res.render('urls_login', templateVars);
})

// Get show page, urls_show, when receive request to different short url 
app.get("/urls/:shortURL", (req, res) => {  
  const templateVars = { shortURL: req.params.shortURL, longURL: urlDatabase[req.params.shortURL].longURL};
  res.render("urls_show", templateVars);
});



// Post new url request
app.post("/urls/new", (req, res) => {
  const urlToPost = req.body.longURL;
  const shortURL = generateShortURL();
  const userID = req.cookies["userID"]

  urlDatabase[shortURL] = {longURL: urlToPost, userID: userID.id};
  res.redirect('/urls')
});

// delete urls 
app.post('/urls/:url/delete', (req, res) => {
  const urlToDelte = req.params.url;
  delete urlDatabase[urlToDelte];
  res.redirect('/urls')
})

// Edit urls 
app.post('/urls/:url/edit', (req, res) => {
  const urlToEdit = req.params.url;
  urlDatabase[urlToEdit].longURL = req.body.longURL;
  res.redirect('/urls');
})

// Post login
app.post('/login', (req, res) => {
  const email = req.body.email;
  const password = req.body.password;
  let userID = ''

  for (let user in userDatabase) {
    if (userDatabase[user].email === email && userDatabase[user].password === password) {
      userID = user;
    } else {
      return res.status(400).send('Please enter the right email or password')
    }
  }

  res.cookie('userID', userDatabase[userID])
  res.redirect('/urls')
})

// Post logout
app.post('/logout', (req, res) => {
  res.clearCookie('userID')
  res.redirect('/urls')
})


// Post Register 
app.post('/register', (req, res) => {
  const email = req.body.email;
  const password = req.body.password;
  const userID = generateId()

  if (!email || !password){
    return res.status(404).send('Please enter userID or password')
  }

  for (let user in userDatabase) {
    if (userDatabase[user].email === email) {
      return res.status(400).send('The email address has been registered')
    } 
  }

  userDatabase[userID] = {
    id: userID,
    email,
    password
  }

  res.cookie('userID', userDatabase[userID]);
  res.redirect('/urls');
})




// get the json file at /urls.json
app.get("/urls.json", (req, res) => {
  res.json(urlDatabase);
});

// shortening urls 
app.get("/u/:id", (req, res) => {
  const shortURL = req.params.id;
  const longURL = urlDatabase[shortURL];
  res.redirect('/urls');
});




app.listen(PORT, () => {
  console.log(`Example app listening on port ${PORT}!`);
});
