const Robotlocation = document.querySelector("#Robot_location");
const teamInput = document.querySelector("#Team");
const matchInput = document.querySelector("#Input-match");
const locationInput = document.querySelector("#location");
var QRCode1 = new QRCode(document.getElementById("qrcode1"), "");
var QRCode2 = new QRCode(document.getElementById("qrcode2"), "");


Robotlocation.addEventListener('change', (event) => {setLocation(event.target.value);});
matchInput.addEventListener('change',() => {changeteamnumber(getCurrentTeamNumberFromRobot());});
Robotlocation.onchange = e => setLocation(e.target.value);

// this is the function that will be called when the form is submitted
document.getElementById("Scouting_Form").onkeypress = function(e) {
  var key = e.charCode || e.keyCode || 0;     
  if (key == 13) {
    e.preventDefault();
    var inputs = document.getElementById("Scouting_Form").getElementsByTagName("input");
    for (var i = 0; i < inputs.length; i++) {
      if (inputs[i] == document.activeElement && i < inputs.length - 1) {
        inputs[i + 1].focus();
        break;
      }
    }
  }
}

document.querySelector('form').addEventListener('submit', function(event) {
  event.preventDefault(); // Prevent the form from submitting normally
  if(QRCode1){
    QRCode1.clear();
  }
  if(QRCode2){
    QRCode2.clear();
  }
  // check current page
  if (currentPage == 1) {
    // set page to 5 by calling nextPage() 4 times
    nextPage();
    nextPage();
    nextPage();
    nextPage();
    
  }



  // Get form data
  var formData = new FormData(event.target);
  var formFields = {};
  formData.forEach((value, key) => { formFields[key] = value });
  let newJsonObj = {};
  let i = 1;

  for (let key in formFields) {
      newJsonObj[i] = formFields[key];
      i++;
  }
  
  
  // Send the request asynchronously
  // the body should be an json with key value pairs
  console.log(event.target.action);
  fetch("/", {
    method: 'POST',
    body: JSON.stringify(formFields),
    headers: {
      'Content-Type': 'application/json'
    }
  }).catch(function(error) {
    console.error('Error:', error);
  }); 
  
  //log to console
  console.log("Form Submitted!");

  // next page
  nextPage();
  console.log(newJsonObj);
  console.log(JSON.stringify(newJsonObj));
  //print the length of the JSON.stringify(newJsonObj)
  console.log(JSON.stringify(newJsonObj).length);

  //same for formFields
  console.log(formFields);
  console.log(JSON.stringify(formFields));
  console.log(JSON.stringify(formFields).length);

  let valuesString = Object.values(newJsonObj).join(',');
  // Generate QR code if there is an error print it to the console
  qrText = valuesString;

  if (qrText.length < 221 && qrText.length > 180)  {
    // add " " to the qr code at least 200 characters
    qrText = qrText + " ".repeat(200 - qrText.length);
    console.log(qrText);
  }

  // split the qr into two qr codes
  QRCode1.makeCode(qrText.substring(0, qrText.length));

  // set all the forms filds to empty exsect the readonly ones, set them to 0
  var inputs = document.getElementById("Scouting_Form").getElementsByTagName("input");
  for (var j = 0; j < inputs.length; j++) {
    if (inputs[j].readOnly) {
      inputs[j].value = 0;
    } else if (inputs[j].type == "checkbox") {
      inputs[j].checked = false;
      AbsentCheckHidden.value = AbsentCheck.checked ? 'TRUE' : 'FALSE';
      LeftWingCheckHidden.value = LeftWingCheck.checked ? 'TRUE' : 'FALSE';
      DroppedNotesCheckHidden.value = DroppedNotesCheck.checked ? 'TRUE' : 'FALSE';
    }
    else {
      inputs[j].value = "";
    }
  }

  toggleSubmitButton();


});



var currentPage = 1;
let scoutLocation = "Red 1";
let current_team = "" || getCurrentTeamNumberFromRobot();

function nextPage() {
  if (currentPage < 5) {
    document.getElementById("page" + currentPage).style.display = "none";
    currentPage++;
    document.getElementById("page" + currentPage).style.display = "block";
  }
}

function prevPage() {
  if (currentPage > 1) {
    document.getElementById("page" + currentPage).style.display = "none";
    currentPage--;
    document.getElementById("page" + currentPage).style.display = "block";
  }
}

function restartForm() {
  document.getElementById("page" + currentPage).style.display = "none";
  currentPage = 1;
  document.getElementById("page" + currentPage).style.display = "block";
}

function toggleSubmitButton() {
  var absentCheckbox = document.getElementById("Absent");
  var submitButton = document.getElementById("submit-button");
  
  if (absentCheckbox.checked) {
    submitButton.style.display = "inline";
  } else {
    submitButton.style.display = "none";
  }
}

// Show the first page when the form loads
document.getElementById("page1").style.display = "block";

//form submit function
function submitForm() {
  alert("Form Submitted!");
}

//adding submitForm() as an onsubmit event to the form
// document.getElementById("myForm").onsubmit = submitForm();


function increment(id_) {
  var input = document.getElementById(id_);
  input.value = parseInt(input.value) + 1;
}

function decrement(id_) {
  var input = document.getElementById(id_);
  input.value = parseInt(input.value) - 1;
  if (input.value < 0) {
    input.value = 0;
  }
}

//////////////////////////////////////////////////////////////
/*
const image = document.querySelector('#image-container img');
const numPartsHorizontal = 10;
const numPartsVertical = 10;
let prevPoint = null;

image.addEventListener('click', function(event) {
  const rect = image.getBoundingClientRect();
  const x = event.clientX - rect.left;
  const y = event.clientY - rect.top;
  const partWidth = image.width / numPartsHorizontal;
  const partHeight = image.height / numPartsVertical;
  const partNumber = Math.floor(y / partHeight) * numPartsHorizontal + Math.floor(x / partWidth) + 1;

  if (prevPoint !== null) {
    prevPoint.remove();
  }

  const point = document.createElement('div');
  point.classList.add('point');
  point.style.left = x + 'px';
  point.style.top = y + 'px';
  image.parentNode.appendChild(point);
  prevPoint = point;

  locationInput.value = partNumber;
});


*/
//////////////////////////////////////////////////////////////

const AbsentCheck = document.getElementById('Absent');
const AbsentCheckHidden = document.getElementById('AbsentC');

AbsentCheck.addEventListener('change', function() {
  AbsentCheckHidden.value = this.checked ? 'TRUE' : 'FALSE';
});

const LeftWingCheck = document.getElementById('LeftWing');
const LeftWingCheckHidden = document.getElementById('LeftWing');

LeftWingCheck.addEventListener('change', function() {
  LeftWingCheckHidden.value = this.checked ? 'TRUE' : 'FALSE';
});

const DroppedNotesCheck = document.getElementById('DroppedNotes');
const DroppedNotesCheckHidden = document.getElementById('DroppedNotesC');

DroppedNotesCheck.addEventListener('change', function() {
  DroppedNotesCheckHidden.value = this.checked ? 'TRUE' : 'FALSE';
});

// const DefenseCheck = document.getElementById('Defense');
// const DefenseCheckHidden = document.getElementById('DefenseC');

// DefenseCheck.addEventListener('change', function() {
//   DefenseCheckHidden.value = this.checked ? 'TRUE' : 'FALSE';
// });





////////////////////////////////////////////////////////////////
/**
 * 
 * @param {String} newLocation the new location
 */
function setLocation(newLocation = "Red 1") {
  // teamMetric.value = getCurrentTeamNumberFromRobot();
  console.log("Setting location")
  scoutLocation = newLocation;
  changeteamnumber(getCurrentTeamNumberFromRobot());
  updatTeamLabel(scoutLocation,teamInput.value);
}


function updatTeamLabel(scoutLocation,teamNumber){
  console.log("Updating team label");
  for(var i=1; i<5; i++){
    document.getElementById("team-label-" + i).innerHTML = teamNumber + "- " + getTeamName(teamNumber);
  }
}

/**
 * 
 * @returns robot location on DBA data base
 */
function getRobot() {
  console.log("getRobot");
  console.log(scoutLocation);
  if (scoutLocation == "Blue 1" || scoutLocation == "Blue 2" || scoutLocation == "Blue 3"){
    document.getElementById("body").classList.remove("red-style");
    document.getElementById("body").classList.add("blue-style");
  }
  else {
    document.getElementById("body").classList.remove("blue-style");
    document.getElementById("body").classList.add("red-style");
  }
  switch (scoutLocation) {
    case "Blue 1":
      return "b1";
    case "Blue 2":
      return "b2";
    case "Blue 3":
      return "b3";
    case "Red 1":
      return "r1";
    case "Red 2":
      return "r2";
    case "Red 3":
      return "r3";
    default:
      console.log("no bot")
      return "";
  }
}


function changeteamnumber(_teaming) {
  if (_teaming != undefined) {
    current_team = _teaming;
    teamInput.value = _teaming;
  }
  updatTeamLabel(scoutLocation,teamInput.value);
}

function getTeamName(teamNumber) {
  if (teamNumber !== undefined) {
    if (teams) {
      var teamKey = "frc" + teamNumber;
      var ret = "";
      Array.from(teams).forEach(team => ret = team.key == teamKey ? team.nickname : ret);
      return ret;
    }
  }
  return "";
}


function getCurrentTeamNumberFromRobot() {
  console.log("getCurrentTeamNumberFromRobot");
  if (getRobot() != "" && typeof getRobot() !== 'undefined' && getCurrentMatch() != "") {
    if (getRobot().charAt(0) == "r") {
      return (getCurrentMatch().red.team_keys[parseInt(getRobot().charAt(1)) - 1]).replace("undefined", "").replace("frc", "");
    } else if (getRobot().charAt(0) == "b") {
      return (getCurrentMatch().blue.team_keys[parseInt(getRobot().charAt(1)) - 1]).replace("undefined", "").replace("frc", "");
    }
  }
}

function getCurrentMatchKey() {
  console.log("getCurrentMatchKey")
  return "2024isde2" + "_" + "qm" + matchInput.value;
}

function getCurrentMatch() {
  console.log("getCurrentMatch");
  return getMatch(getCurrentMatchKey());
}

function getMatch(matchKey) {
  console.log("getMatch");
  //This needs to be different than getTeamName() because of how JS stores their data
  if (matchKey !== undefined) {
    if (schedule) {
      var ret = "";
      Array.from(schedule).forEach(match => ret = match.key == matchKey ? match.alliances : ret);
      console.log("ret" + ret);
      return ret;
    }
  }
  console.log("no end");
  return "";
}

window.onload = function () {
  getTeams("2024isde2");
  getSchedule("2024isde2");
  AbsentCheckHidden.value = AbsentCheck.checked ? 'TRUE' : 'FALSE';
  LeftWingCheckHidden.value = LeftWingCheck.checked ? 'TRUE' : 'FALSE';
  DroppedNotesCheckHidden.value = DroppedNotesCheck.checked ? 'TRUE' : 'FALSE';
  toggleSubmitButton();
};
