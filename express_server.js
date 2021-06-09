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

const urlDatabase = {
  "b2xVn2": "http://www.lighthouselabs.ca",
  "9sm5xK": "http://www.google.com"
};

const userDatabase = {
  test: {
    email: 'test@gmail.com',
    password: 'test'
  },
};

// Get home page, localhost/urls
app.get("/urls", (req, res) => {
  console.log(req.cookies)
  const templateVars = { 
    urls: urlDatabase,
    username: req.cookies["username"]
  };
  res.render("urls", templateVars);     
});


// Get posting new link page, localhost/urls/news, used to post new urls. 
app.get("/urls/new", (req, res) => {
  const templateVars = { 
    username: req.cookies["username"]
  };
  res.render("urls_new", templateVars);
});

// Get Register Page
app.get('/urls/register', (req, res) => {
  const templateVars = { 
    username: req.cookies["username"]
  };
  res.render('urls_register', templateVars);
})

// Get Login Page
app.get('/urls/login', (req, res) => {
  const templateVars = { 
    username: req.cookies["username"]
  };
  res.render('urls_login', templateVars);
})

// Get showlink page, urls_show, when receive request to different short url 
app.get("/urls/:shortURL", (req, res) => {  
  const templateVars = { shortURL: req.params.shortURL, longURL: urlDatabase[req.params.shortURL]};
  res.render("urls_show", templateVars);
});



// Post new url request
app.post("/urls/new", (req, res) => {
  const urlToPost = req.body.longURL;
  const shortURL = generateShortURL();
  urlDatabase[shortURL] = urlToPost;
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
  urlDatabase[urlToEdit] = req.body.longURL;
  res.redirect('/urls');
})

// Post login
app.post('/login', (req, res) => {
  const email = req.body.email;
  const password = req.body.password;
  let username = ''

  for (let user in userDatabase) {
    if (userDatabase[user].email === email && userDatabase[user].password === password) {
      username = user;
    } else {
      return res.status(404).send('Please enter the right email or password')
    }
  }

  res.cookie('username', email)
  res.redirect('/urls')
})

// Post logout
app.post('/logout', (req, res) => {
  res.clearCookie('username')
  res.redirect('/urls')
})


// Post Register 
app.post('/register', (req, res) => {
  const email = req.body.email;
  const password = req.body.password;
  const username = generateId()

  if (!email || !password){
    return res.status(404).send('Please enter username or password')
  }

  userDatabase[username] = {
    id: username,
    email,
    password
  }

  res.cookie('username', email);
  res.redirect('/urls');
})




// get the json file at /urls.json
app.get("/urls.json", (req, res) => {
  res.json(urlDatabase);
});

// shortening urls 
app.get("/u/:shortURL", (req, res) => {
  const shortURL = req.params.shortURL;
  const longURL = urlDatabase[shortURL];
  res.redirect(longURL);
});




app.listen(PORT, () => {
  console.log(`Example app listening on port ${PORT}!`);
});
