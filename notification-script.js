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

function getInitialData() {
  alarmsActives = JSON.parse(localStorage.getItem('actives')) || [];
  alarmsOld = JSON.parse(localStorage.getItem('olds')) || [];
  
  renderLists();
}

function renderLists() {
  elAlarmsActive.innerHTML = '';
  elAlarmsOld.innerHTML = '';
  if (alarmsActives.length === 0) {
    elAlarmsActive.insertAdjacentHTML('beforeend', '<p>No alarms created yet</p>');
  } else {
    id = alarmsActives.length;
    setAlarmsDOM(alarmsActives, elAlarmsActive);
  }

  if (alarmsOld.length === 0) {
    elAlarmsOld.insertAdjacentHTML('beforeend', '<p>No old alarms</p>');
  } else {
    setAlarmsDOM(alarmsOld, elAlarmsOld);
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
    renderTemplate(objAlarm, elAlarmsActive);
    cleanForm();
    id ++;
  }
}

function storeAlarm(objAlarm) {
  alarmsActives.push(objAlarm);
  const alarms = JSON.stringify(alarmsActives);
  localStorage.setItem('actives', alarms);
}

function renderTemplate(obj, container) {
  let editBtn;
  let deleteBtn;
  const templateNewAlarm = `<div class="alarm">
    <span class="date">${obj.date} ${obj.hour}:${obj.minute}</span>
    <span class="text">${obj.desc}</span>
    <div id="buttons${obj.id}"></div>
  </div>`;
  
  container.insertAdjacentHTML('beforeend', templateNewAlarm);

  if (container.classList.contains('alarms__active')) {
    editBtn = document.createElement('button');
    deleteBtn = document.createElement('button');
    editBtn.id = 'editAlarm' + obj.id;
    editBtn.innerHTML = 'Edit';
    deleteBtn.id = 'deleteAlarm' + obj.id;
    deleteBtn.innerHTML = 'Delete';
  
    document.getElementById('buttons' + obj.id).appendChild(editBtn);
    document.getElementById('buttons' + obj.id).appendChild(deleteBtn);
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

function setAlarmsDOM(alarms, container) {
  
  for(alarm of alarms) {
    renderTemplate(alarm, container);
    if (container.classList.contains('alarms__active')) {
      id ++;
    }
  }
}

function checkAlarms() {
  const now = new Date();
  const minuteCheck = now.getMinutes() > 9 ? now.getMinutes() : '0' + now.getMinutes()
  const hourCheck = now.getHours() > 9 ? now.getHours() : '0' + now.getHours();
  const dayCheck = now.getDate() > 9 ? now.getDate() : '0' + now.getDate();
  const monthCheck = now.getMonth() > 9 ? now.getMonth() + 1 : '0' + (now.getMonth() + 1);
  const yearCheck = now.getFullYear();

  for(al of alarmsActives) {
    if (al.date === `${yearCheck}-${monthCheck}-${dayCheck}` && al.hour === hourCheck.toString() && al.minute === minuteCheck.toString()) {
      sendNotification(al.desc);
      removeNotification(al);
    }
  }
}

function sendNotification(text) {
  if (Notification.permission !== "denied") {
    Notification.requestPermission().then(function (permission) {
      if (permission === "granted") {
       new Notification(text);
      }
    });
  }
}

function removeNotification(alarm) {
  const index = alarmsActives.findIndex((al) => al.id === alarm.id);
  alarmsActives.splice(index, 1);
  alarmsOld.push(alarm);
  renderLists();
}

getListeners();
getInitialData();
setInterval(checkAlarms, 1000);

