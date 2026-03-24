/* ================= USER KEY SYSTEM ================= */

function getUserKey(key){
let user = localStorage.getItem("currentUser")
return key + "_" + user
}


/* ================= LOGIN SYSTEM ================= */

function register(){

let email = document.getElementById("email").value
let password = document.getElementById("password").value

if(email==="" || password===""){
alert("Enter email & password")
return
}

let users = JSON.parse(localStorage.getItem("users")) || []

let exist = users.find(u=>u.email===email)

if(exist){
alert("Email already registered")
return
}

users.push({email,password})

localStorage.setItem("users",JSON.stringify(users))

alert("Registered Successfully")
}


function login(){

let email = document.getElementById("email").value
let password = document.getElementById("password").value

let users = JSON.parse(localStorage.getItem("users")) || []

let user = users.find(u=>u.email===email && u.password===password)

if(!user){
alert("Invalid Login")
return
}

localStorage.setItem("currentUser",email)

showDashboard()
}


function showDashboard(){

let user = localStorage.getItem("currentUser")

document.getElementById("loginPage").style.display="none"
document.getElementById("dashboard").style.display="block"

document.getElementById("welcome").innerText="Welcome "+user

loadAllData()
}


function logout(){

localStorage.removeItem("currentUser")
location.reload()

}


/* ================= AUTO LOGIN ================= */

window.addEventListener("load", function(){

let user = localStorage.getItem("currentUser")

if(user){
showDashboard()
}else{
document.getElementById("loginPage").style.display="block"
document.getElementById("dashboard").style.display="none"
}

})



/* ================= SECTION SWITCH ================= */

function showSection(id){

let sections = document.querySelectorAll(".section")

sections.forEach(s=>s.classList.add("hidden"))

document.getElementById(id).classList.remove("hidden")

}



/* ================= TODO ================= */

function addTask(){

let task=document.getElementById("taskInput").value

if(task==="") return

let key=getUserKey("tasks")

let tasks=JSON.parse(localStorage.getItem(key)) || []

tasks.push(task)

localStorage.setItem(key,JSON.stringify(tasks))

displayTasks()

document.getElementById("taskInput").value=""
}

function displayTasks(){

let key=getUserKey("tasks")

let tasks=JSON.parse(localStorage.getItem(key)) || []

let list=document.getElementById("taskList")

list.innerHTML=""

tasks.forEach((t,i)=>{

let li=document.createElement("li")
li.innerHTML=t+" <button onclick='deleteTask("+i+")'>❌</button>"

list.appendChild(li)

})
}

function deleteTask(i){

let key=getUserKey("tasks")

let tasks=JSON.parse(localStorage.getItem(key))

tasks.splice(i,1)

localStorage.setItem(key,JSON.stringify(tasks))

displayTasks()
}



/* ================= NOTES ================= */

function saveNote(){

let key=getUserKey("note")

let note=document.getElementById("noteBox").value

localStorage.setItem(key,note)
}

function loadNote(){

let key=getUserKey("note")

let note=localStorage.getItem(key)

if(note){
document.getElementById("noteBox").value=note
}
}



/* ================= HABIT ================= */

function addHabit(){

let key=getUserKey("habits")

let habit=document.getElementById("habitInput").value

if(habit==="") return

let habits=JSON.parse(localStorage.getItem(key)) || []

habits.push(habit)

localStorage.setItem(key,JSON.stringify(habits))

displayHabits()

document.getElementById("habitInput").value=""
}

function displayHabits(){

let key=getUserKey("habits")

let habits=JSON.parse(localStorage.getItem(key)) || []

let list=document.getElementById("habitList")

list.innerHTML=""

habits.forEach((h,i)=>{

let li=document.createElement("li")
li.innerHTML=h+" <button onclick='deleteHabit("+i+")'>❌</button>"

list.appendChild(li)

})
}

function deleteHabit(i){

let key=getUserKey("habits")

let habits=JSON.parse(localStorage.getItem(key))

habits.splice(i,1)

localStorage.setItem(key,JSON.stringify(habits))

displayHabits()
}



/* ================= STUDY TIMER ================= */

let studyInterval

function startStudy(){

let key=getUserKey("studyTime")

let studySeconds = Number(localStorage.getItem(key)) || 0

if(studyInterval) return

studyInterval=setInterval(()=>{

studySeconds++

localStorage.setItem(key,studySeconds)

updateStudy()

},1000)
}

function stopStudy(){
clearInterval(studyInterval)
studyInterval=null
}

function resetStudy(){

let key=getUserKey("studyTime")

localStorage.setItem(key,0)

updateStudy()
}

function updateStudy(){

let key=getUserKey("studyTime")

let studySeconds = Number(localStorage.getItem(key)) || 0

let h=Math.floor(studySeconds/3600)
let m=Math.floor((studySeconds%3600)/60)
let s=studySeconds%60

document.getElementById("studyTime").innerText =
String(h).padStart(2,'0')+":"+
String(m).padStart(2,'0')+":"+
String(s).padStart(2,'0')
}



/* ================= POMODORO ================= */

let pomoInt
let pomoSec = 1500

function startPomodoro(){

if(pomoInt) return

pomoInt=setInterval(()=>{

pomoSec--
updatePomodoro()

if(pomoSec<=0){
clearInterval(pomoInt)
alert("Time Up!")
}

},1000)
}

function stopPomodoro(){
clearInterval(pomoInt)
pomoInt=null
}

function resetPomodoro(){
pomoSec=1500
updatePomodoro()
}

function updatePomodoro(){

let m=Math.floor(pomoSec/60)
let s=pomoSec%60

document.getElementById("pomodoroTime").innerText =
String(m).padStart(2,'0')+":"+String(s).padStart(2,'0')
}



/* ================= CALENDAR ================= */

function generateCalendar(){

let calendar=document.getElementById("calendarGrid")
calendar.innerHTML=""

let date=new Date()
let year=date.getFullYear()
let month=date.getMonth()
let today=date.getDate()

let days=new Date(year,month+1,0).getDate()

for(let d=1; d<=days; d++){

let div=document.createElement("div")
div.className="day"

if(d===today){
div.classList.add("today")
}

let status = localStorage.getItem(getUserKey("day"+d)) || ""

div.innerHTML=
"<div>"+d+"</div>"+
"<button onclick='markDay("+d+",\"✔\")'>✔</button>"+
"<button onclick='markDay("+d+",\"❌\")'>❌</button>"+
"<div id='s"+d+"'>"+status+"</div>"

calendar.appendChild(div)
}
}

function markDay(d,val){

localStorage.setItem(getUserKey("day"+d),val)

document.getElementById("s"+d).innerText=val
}



/* ================= LOAD ALL ================= */

function loadAllData(){

displayTasks()
displayHabits()
loadNote()
updateStudy()
updatePomodoro()
generateCalendar()

}