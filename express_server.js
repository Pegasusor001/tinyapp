const bodyParser = require("body-parser");
const express = require("express");
const app = express();
const PORT = 8080; // default port 8080

app.set("view engine", "ejs"); // This tells the Express app to use EJS as its templating engine. 
app.use(bodyParser.urlencoded({extended: true}));

function generateRandomString() {
    let result = [];
    let n = 6;
    for(let i = 0; i < n; i++) {
      let ranNum = Math.ceil(Math.random() * 25);     
      result.push(String.fromCharCode(65+ranNum));    
    }
    return result.join('');
}


const urlDatabase = {
  "b2xVn2": "http://www.lighthouselabs.ca", // shortURL is the key, b2xVn2; long is the value. 
  "9sm5xK": "http://www.google.com"
};

app.get("/", (req, res) => {
  res.send("Hello!");
});

app.get("/urls", (req, res) => {
  const templateVars = { urls: urlDatabase };   // initate for loop in ejs html file
  res.render("urls_index", templateVars);       // ejs default folder view, 
});

app.get("/urls/new", (req, res) => {
  res.render("urls_new");
});

app.get("/urls/:shortURL", (req, res) => {      // : means shortURL is a variable to be replaced. 
  const templateVars = { shortURL: req.params.shortURL, longURL: urlDatabase[req.params.shortURL] /* What goes here? */ };
  res.render("urls_show", templateVars); // the way to pass the variable to ejs file. 
});


app.get("/urls.json", (req, res) => {
  res.json(urlDatabase);
});

app.get("/hello", (req, res) => {
  res.send("<html><body>Hello <b>World</b></body></html>\n");
});



app.post("/urls", (req, res) => {
  temp = generateRandomString();
  urlDatabase.temp = req.body.longURL;
  // res.send("Ok");         // Respond with 'Ok' (we will replace this)
  res.redirect(req.body.longURL);
});

app.get("/u/:shortURL", (req, res) => {
  const shortURL = req.params.shortURL;
  const longURL = urlDatabase[shortURL];
  res.redirect(longURL);
});


app.listen(PORT, () => {
  console.log(`Example app listening on port ${PORT}!`);
});
