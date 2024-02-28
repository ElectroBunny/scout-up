const express = require("express");
const { google } = require("googleapis");
const favicon = require('serve-favicon');
const bodyParser = require('body-parser');
const dotenv = require('dotenv');
const path = require('path');


const app = express();
dotenv.config();
app.use(express.json())
app.use(express.static('public'))
app.set("view engine", "ejs");
app.use(favicon(path.join(__dirname,'public','logo.png')));
app.use(express.urlencoded({ extended: true }));
app.use(bodyParser.urlencoded({ extended: true }));


app.get("/", (req, res) => {
  res.render("index");
});
app.get("/he", (req,res) => {
  res.render("indexhe");
});
app.get("/qr", (req, res) => {
  res.render("qrscan");
});

app.post("/", async (req, res) => {
  const data = req.body;
  const values = Object.values(req.body)

  console.log("new submission from: " + req.body.ScouterName + "\n Scouter IP is: " + req.ip)
  console.log(values)
  console.log("-------------------------")
  console.log(data)

  // if data[5] is TRUE, then delete all the values in the data from the 6th index to the end
  if (values[5] == "TRUE"){
    values.splice(6, values.length - 6)
  }

  const auth = new google.auth.GoogleAuth({
    keyFile: "credentials.json",
    scopes: "https://www.googleapis.com/auth/spreadsheets",
  });

  // Create client instance for auth
  const client = await auth.getClient();

  // Instance of Google Sheets API
  const googleSheets = google.sheets({ version: "v4", auth: client });

  const spreadsheetId = process.env.spreadsheetId;

  // Get metadata about spreadsheet
  const metaData = await googleSheets.spreadsheets.get({
    auth,
    spreadsheetId,
  });

  // Read rows from spreadsheet
  const getRows = await googleSheets.spreadsheets.values.get({
    auth,
    spreadsheetId,
    range: "data!A:A",
  });
  //check if the data is already in the spreadsheet dont check only the first value in the row - check all the values in the row
  const rows = getRows.data.values;
  let found = false;
  for (let i = 0; i < rows.length; i++) {
    if (rows[i].join(',') == values.join(',')) {
      found = true;
      break;
    }
  }

  if (!found) {
    // Write row(s) to spreadsheet
    await googleSheets.spreadsheets.values.append({
      auth,
      spreadsheetId,
      range: "data!A:B",
      valueInputOption: "USER_ENTERED",
      resource: {
        values: [values],
      },
    });
  }

  res.redirect('/');
});

// app.post('/submit', (req, res)=> {
//   console.log("data received");
//   const data = req.body;
//   const values = Object.values(req.body);
//   console.log(values);
//   console.log(data)
//   res.redirect('/');
// })

app.listen(process.env.PORT || 3000, () => {
  console.log("Server is running on port 3000");
});