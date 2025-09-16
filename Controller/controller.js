import {
  tasks,
  storeLocal,
  logLocal,
  clearLocal,
  loadLocal,
  removeLocal,
} from "../Model/dataManager.js";

const taskList = document.getElementById("taskList");

//importerer data-related funktioner

let icon = "📄";

export function createTaskWindow(debug) {
  let createTaskWindow = document.getElementById("taskCreatorWindow");
  if (createTaskWindow) {
    createTaskWindow.remove();
  } else {
    createTaskWindow = document.createElement("div");
  }

  // skaber UI til at oprette nye opgaver

  createTaskWindow.id = "taskCreatorWindow";
  createTaskWindow.classList.add("taskUI", "taskCard");
  createTaskWindow.innerHTML = `
    <div class="cardHeader">
    <button id='iconPickerBtn' class="iconElement">${icon}</button>
      <input type='text' id='taskTitle' class="taskTitle" placeholder='Titel' value='Ny opgave'></input>
    </div>
    <div class="cardContent">
      <input type='text' id='taskDescription' class="taskDesc" placeholder='Beskrivelse'></input>
      <!-- <input type='text' id='taskIcon' placeholder='Ikon' value='file'></input> -->
    </div>
    <div class="cardFooter">
    <button id='addTask'>Tilføj opgave</button><button id='cancelCreation'>Annuller</button>
    </div>
    `; //HTML indvolden for UI elementet createTaskWindow
  taskList.prepend(createTaskWindow); //createTaskWindow tilføjes, prepend for at vises først

  if (debug === true) {
    debugOptions(createTaskWindow); // debug-funktioner kaldes
  }

  const taskButton = document.getElementById("addTask");
  const cancelCreationBtn = document.getElementById("cancelCreation");
  const iconPickerBtn = document.getElementById("iconPickerBtn");

  taskButton.addEventListener("click", taskCreator);
  cancelCreationBtn.addEventListener("click", cancelCardCreation);
  iconPickerBtn.addEventListener("click", iconPicker);
}

function cancelCardCreation() {
  let createTaskWindow = document.getElementById("taskCreatorWindow");
  createTaskWindow.remove();
}

function iconPicker() {
  console.log("Icon picker clicked");
}

loadLocal(); // loader opgaver fra localStorage ind i hukommelsen

function taskCreator() {
  let currentTask = {};
  //variabel som holder opgavens data (datatype: object)

  const taskTitle = document.getElementById("taskTitle");
  const taskDescription = document.getElementById("taskDescription");
  const taskIcon = icon;
  console.log("taskIcon:", taskIcon);
  //refererer til input felterne i task window

  currentTask.title = taskTitle.value;
  currentTask.description = taskDescription.value;
  currentTask.icon = taskIcon;
  //læser værdierne fra førnævnte input felter og gemmer dem i objektet currentTask

  console.log("currentTask.icon:", currentTask.icon);

  console.log(currentTask);
  addTask(currentTask);
  //sender objektet currentTask til addTask-funktionen
}

function debugOptions(slot) {
  slot.innerHTML += `
    <button id='debugClearLocal'>Clear local storage</button>
    <button id='debugStoreLocal'>Store local storage</button>
    <button id='debugLogLocal'>Log local storage</button>
    `;

  const debugClearLocal = document.getElementById("debugClearLocal");
  const debugStoreLocal = document.getElementById("debugStoreLocal");
  const debugLogLocal = document.getElementById("debugLogLocal");

  debugClearLocal.addEventListener("click", () => {
    tasks.length = 0; //glemmer i-hukommelse data
    clearLocal(); //glemmer data i localStorage
    console.log("Glemt opgaver i localStorage og fra nuværende instans");
    initialize();
    console.log("Genindlæst");
  });
  // debugStoreLocal.addEventListener("click", () => storeLocal(tasks));
  debugLogLocal.addEventListener("click", () => logLocal());
}

function addTask(task) {
  task.id = self.crypto.randomUUID(); //generer et tilfældigt id
  task.color = "hsl(215, 100%, 34%)"; //placeholder-farve
  task.isDone = false;

  tasks.push(task); //tilføjer opgaven til tasks-array
  console.log("Added task:", task);
  console.log("Tasks:", tasks);
  storeLocal(tasks);
  initialize();
}

export function initialize() {
  taskList.innerHTML = "";
  archiveList.innerHTML = "";
  tasks
    // .slice() //skaber en kopi af tasks, så vi ikke ændrer originalen
    // .reverse() //sorterer i omvendt rækkefølge, så vi får de nyeste først
    .forEach((task) => {
      console.log("task:", task);
      //skab card for hver task:
      const card = document.createElement("div");
      card.classList.add("taskCard");
      card.innerHTML = `
        <div class="cardHeader">
    <button class='iconElement' class="iconElement" id='iconID${task.id}'>${
        task.icon
      }</button>
      <input id='titleID${task.id}'type='text' class="taskTitle" placeholder='${
        task.title
      }' value='${task.title}'></input>
    </div>
    <div class="cardContent">
      <input id='descID${task.id}' type='text' class='taskDesc' placeholder='${
        task.description
      }' value='${task.description}'></input>
    </div>
     <div class="cardFooter">
       <button class="taskDoneBtn" id='doneID${task.id}'>${
        task.isDone ? "❌" : "Færdig"
      }</button>
       <button class="deleteTaskBtn" id="deleteID${task.id}">🗑️</button>
      </div>
  `;
      card.id = task.id;
      if (task.isDone) {
        card.classList.add("done");
        archiveList.appendChild(card);
      }
      taskList.prepend(card);

      const taskTitle = document.getElementById(`titleID${task.id}`);
      const taskDesc = document.getElementById(`descID${task.id}`);
      const taskIcon = document.getElementById(`iconID${task.id}`);
      const taskDoneBtn = document.getElementById(`doneID${task.id}`);
      const deleteTaskBtn = document.getElementById(`deleteID${task.id}`);

      taskTitle.addEventListener("input", (event) => {
        task.title = event.target.value;
        console.log("taskTitle input: ", task.title, " (ID: ", task.id, ")");
      });

      taskDesc.addEventListener("input", (event) => {
        task.description = event.target.value;
        console.log(
          "taskDesc input: ",
          task.description,
          " (ID: ",
          task.id,
          ")"
        );
      });

      taskIcon.addEventListener("click", () => {
        console.log("Icon picker clicked (ID: ", task.id, ")");
      });

      taskDoneBtn.addEventListener("click", () => {
        task.isDone = !task.isDone;
        console.log("Task marked as done: ", task, " (ID: ", task.id, ")");
      });

      deleteTaskBtn.addEventListener("click", () => {
        console.log("Delete task clicked (ID: ", task.id, ")");
        //...
      });

      //TODO: Opdater tasks[] i localStorage hver gang info er opdateret
    });
}
