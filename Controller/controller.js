import {
  tasks,
  storeLocal,
  logLocal,
  clearLocal,
  loadLocal,
  removeLocal,
} from "../Model/dataManager.js";

const page = document.querySelector("body");

//importerer data-related funktioner

export function createTaskWindow(debug) {
  //hvis taskWindow eksisterer, fjernes den
  const taskWindow = document.getElementById("taskWindow");
  if (taskWindow) {
    taskWindow.remove();
  }

  // skaber UI til at oprette nye opgaver

  const createTaskWindow = document.createElement("div");

  createTaskWindow.id = "taskCreatorWindow";
  createTaskWindow.innerHTML = `
    <input type='text' id='taskTitle' placeholder='Titel' value='Ny opgave'></input>
    <input type='text' id='taskDescription' placeholder='Beskrivelse'></input>
    <input type='text' id='taskIcon' placeholder='Ikon' value='file'></input>

    <button id='addTask'>Tilføj opgave</button>
    `; //HTML indvolden for UI elementet createTaskWindow
  page.appendChild(createTaskWindow); //createTaskWindow tilføjes

  if (debug === true) {
    debugOptions(createTaskWindow); // debug-funktioner kaldes
  }

  const taskButton = document.getElementById("addTask");
  taskButton.addEventListener("click", taskCreator);
}

loadLocal(); // loader opgaver fra localStorage ind i hukommelsen

function taskCreator() {
  let currentTask = {};
  //variabel som holder opgavens data (datatype: object)

  const taskTitle = document.getElementById("taskTitle");
  const taskDescription = document.getElementById("taskDescription");
  const taskIcon = document.getElementById("taskIcon");
  //refererer til input felterne i task window

  currentTask.title = taskTitle.value;
  currentTask.description = taskDescription.value;
  currentTask.icon = taskIcon.value;
  //læser værdierne fra førnævnte input felter og gemmer dem i objektet currentTask

  console.log(currentTask);
  addTask(currentTask);
  //sender objektet currentTask til addTask-funktionen
}

function debugOptions(slot) {
  slot.innerHTML += `
    <button id='debugClearLocal'>Clear local storage</button>
    <button id='debugStoreLocal'>Store local storage</button>
    <button id='debugLogLocal'>Log local storage</button>
    <button id='printDebugLinks'>Print debug links</button>
    `;

  const debugClearLocal = document.getElementById("debugClearLocal");
  const debugStoreLocal = document.getElementById("debugStoreLocal");
  const debugLogLocal = document.getElementById("debugLogLocal");
  const printDebugLinksBtn = document.getElementById("printDebugLinks");

  debugClearLocal.addEventListener("click", () => {
    tasks.length = 0; //glemmer i-hukommelse data
    clearLocal(); //glemmer data i localStorage
    console.log("Glemt opgaver i localStorage og fra nuværende instans");
  });
  // debugStoreLocal.addEventListener("click", () => storeLocal(tasks));
  debugLogLocal.addEventListener("click", () => logLocal());
  printDebugLinksBtn.addEventListener("click", () => printDebugLinks(tasks));
}

function addTask(task) {
  task.id = self.crypto.randomUUID(); //generer et tilfældigt id
  task.color = "hsl(215, 100%, 34%)"; //placeholder-farve
  task.isDone = false;

  tasks.push(task); //tilføjer opgaven til tasks-array
  console.log("Added task:", task);
  console.log("Tasks:", tasks);
  storeLocal(tasks);
}

function printDebugLinks(tasks) {
  const debugLinks = document.createElement("ul");
  debugLinks.id = "debugLinks";
  debugLinks.innerHTML = "";
  tasks.forEach((task) => {
    debugLinks.innerHTML += `<li><a href='Task/task.html?id=${task.id}'>${task.title}</a></li>`;
  });
  taskCreatorWindow.appendChild(debugLinks);
}

export function viewTask(task) {
  //hvis createTaskWindow eksisterer, fjernes den
  const createTaskWindow = document.getElementById("taskCreatorWindow");

  if (createTaskWindow) {
    createTaskWindow.remove();
  }
  
  // skaber UI til at vise opgaven
  const TaskWindow = document.createElement("div");
  TaskWindow.id = "taskWindow";
  TaskWindow.innerHTML = `
    <h1>${task.title}</h1>
    <p>${task.description}</p>
    <button id='taskDone'>Done</button>
    `;

  page.appendChild(TaskWindow);

  const taskDoneBtn = document.getElementById("taskDone");

  taskDoneBtn.addEventListener("click", () => {
    task.isDone = true;
    console.log("Task marked as done:", task);
  });
}
