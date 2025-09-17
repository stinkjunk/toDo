// import { createTaskWindow, initialize, taskCreator } from "../Controller/controller.js";
import { initialize, addTask, addList, debugOptions} from "../Controller/controller.js";

const taskList = document.getElementById("taskList");
const archiveList = document.getElementById("archiveList");
const tasks = JSON.parse(localStorage.getItem("tasks"));
const createNewTaskBtn = document.getElementById("createNewTask");
const createNewListBtn = document.getElementById("createNewList");
const brouchure = document.getElementById("brouchure");
const main = document.querySelector("main");
console.log("tasks:", tasks);

const activeBtn = document.getElementById("activeBtn");
const archiveBtn = document.getElementById("archiveBtn");

//aktiver debug-funktioner
const debug = true;
//------------------------
if (debug === true) {
debugOptions(main);
}

archiveBtn.addEventListener("click", () => {
  brouchure.classList = "archivedPage";
  archiveBtn.classList.add("active");
  activeBtn.classList.remove("active");
  console.log("archiveBtn clicked");
});

activeBtn.addEventListener("click", () => {
  brouchure.classList = "";
  archiveBtn.classList.remove("active");
  activeBtn.classList.add("active");
  console.log("activeBtn clicked");
});

if (tasks !== null) {
  initialize();
}

// createNewTaskBtn.addEventListener("click", () => createTaskWindow(true));
createNewTaskBtn.addEventListener("click", addTask);
createNewListBtn.addEventListener("click", addList);


// createTaskWindow(true);

