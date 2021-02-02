const elDescription = document.getElementById('description');
const elDate = document.getElementById('date');
const elHour = document.getElementById('hour');
const elMinute = document.getElementById('minute');
const btnCreateAlarm = document.getElementById('createAlarm');
const elAlarmsActive = document.querySelector('.alarms__active');
const elAlarmsOld = document.querySelector('.alarms__old');
let alarmsActives = [];
let alarmsOld = [];
let id = 0;

function getListeners() {
  btnCreateAlarm.addEventListener('click', createAlarm);
}

function askNotification() {
  if (Notification.permission === "granted") {
    // If it's okay let's create a notification
    const notification = new Notification("Hi there!");
  }

  // Otherwise, we need to ask the user for permission
  else if (Notification.permission !== "denied") {
    Notification.requestPermission().then(function (permission) {
      // If the user accepts, let's create a notification
      if (permission === "granted") {
        var notification = new Notification("Hi there!");
      }
    });
  }
}

function getInitialStatus() {
  alarmsActives = JSON.parse(localStorage.getItem('actives')) || [];
  
  if (alarmsActives.length === 0) {
    elAlarmsActive.insertAdjacentHTML('beforeend', '<p>No alarms created yet</p>');
  } else {
    setAlarms();
  }
}

function createAlarm(e) {
  e.preventDefault();
  
  if (alarmsActives.length === 0) {
    elAlarmsActive.innerHTML = '';
  }
  
  if (validateForm()) {    
    const objAlarm = {
      id,
      desc: elDescription.value,
      date: elDate.value,
      hour: elHour.value,
      minute: elMinute.value
    }

    storeAlarm(objAlarm);
    renderTemplate(objAlarm);
    cleanForm();
    new Notification('Alarm created');
    id ++;
  }
}

function validateForm() {
  return true;
}

function cleanForm() {
  elDescription.value = '';
  elDate.value = '';
  elHour.value = '';
  elMinute.value = '';
}

function renderTemplate(obj) {
  let editBtn;
  let deleteBtn;
  const templateNewAlarm = `<div class="alarm">
    <span class="date">${obj.date} ${obj.hour}:${obj.minute}</span>
    <span class="text">${obj.desc}</span>
    <div id="buttons${obj.id}"></div>
  </div>`;
  
  elAlarmsActive.insertAdjacentHTML('beforeend', templateNewAlarm);

  editBtn = document.createElement('button');
  deleteBtn = document.createElement('button');
  editBtn.id = 'editAlarm' + id;
  editBtn.innerHTML = 'Edit';
  deleteBtn.id = 'deleteAlarm' + id;
  deleteBtn.innerHTML = 'Delete';

  document.getElementById('buttons' + id).appendChild(editBtn);
  document.getElementById('buttons' + id).appendChild(deleteBtn);
}

function setAlarms() {
  for(alarm of alarmsActives) {
    renderTemplate(alarm);
    id ++;
  }
}

function storeAlarm(objAlarm) {
  alarmsActives.push(objAlarm);
  const alarms = JSON.stringify(alarmsActives);
  localStorage.setItem('actives', alarms);
}

askNotification();
getListeners();
getInitialStatus();

