const bodyParser = require("body-parser");
const express = require("express");
const app = express();
const PORT = 8080; // default port 8080

app.set("view engine", "ejs"); // This tells the Express app to use EJS as its templating engine. 
app.use(bodyParser.urlencoded({extended: true}));



const urlDatabase = {
  "b2xVn2": "http://www.lighthouselabs.ca", // shortURL is the key, b2xVn2; long is the value. 
  "9sm5xK": "http://www.google.com"
};

// localhost/urls, ejs: urls_index
app.get("/urls", (req, res) => {
  const templateVars = { urls: urlDatabase };   
  res.render("urls_index", templateVars);     
});

// Post new urls
// Post page: /urls/news, ejs: urls_new, raise post request, action: /urls, name: longURL. 
app.get("/urls/new", (req, res) => {
  res.render("urls_new");
});

// handle Post request
app.post("/urls", (req, res) => {
  console.log(req.body, req.params)
  // res.redirect(req.body.longURL);
  res.redirect('/urls')
});


// when receive request to different short url, ejs: urls_show
app.get("/urls/:shortURL", (req, res) => {     
  const templateVars = { shortURL: req.params.shortURL, longURL: urlDatabase[req.params.shortURL]};
  console.log(req.params);
  res.render("urls_show", templateVars);
});

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

// delete urls 
app.post('/urls/:url/delete', (req, res) => {
  const urlToDelte = req.params.url;
  delete urlDatabase[urlToDelte];

  res.redirect('/urls')
})


app.listen(PORT, () => {
  console.log(`Example app listening on port ${PORT}!`);
});
