// import { createTaskWindow, initialize, taskCreator } from "../Controller/controller.js";
import {
  initialize,
  addTask,
  addList,
  settings,
  updateScrollHeight
} from "../Controller/controller.js";

const taskList = document.getElementById("taskList");
const archiveList = document.getElementById("archiveList");
const tasks = JSON.parse(localStorage.getItem("tasks"));
const createNewTaskBtn = document.getElementById("createNewTask");
const createNewListBtn = document.getElementById("createNewList");
const settingsBtn = document.getElementById("settings");
const brouchure = document.getElementById("brouchure");
const archivedPage = document.querySelector("#archiveList");
const activePage = document.querySelector("#taskList");
const main = document.querySelector("main");
console.log("tasks:", tasks);

const activeBtn = document.getElementById("activeBtn");
const archiveBtn = document.getElementById("archiveBtn");

archiveBtn.addEventListener("click", () => {
  brouchure.classList = "archivedPage";
  archiveBtn.classList.add("active");
  activeBtn.classList.remove("active");
  console.log("archiveBtn clicked");
  updateScrollHeight();
});

activeBtn.addEventListener("click", () => {
  brouchure.classList = "";
  archiveBtn.classList.remove("active");
  activeBtn.classList.add("active");
  console.log("activeBtn clicked");
  updateScrollHeight();
});

if (tasks !== null) {
  initialize();
}

// function updateScrollHeight() {
//   if (brouchure.classList.contains("archivedPage")) {
//     console.log("archivedPage scrollHeight:", archivedPage.scrollHeight + "px");
//     main.style.height = archivedPage.scrollHeight;
//   } else { 
//     console.log("activePage scrollHeight:", activePage.scrollHeight) + "px";
//     main.style.height = activePage.scrollHeight;
//   }

//   console.log("updateScrollHeight() kørt fra index.js");
// }

// createNewTaskBtn.addEventListener("click", () => createTaskWindow(true));
createNewTaskBtn.addEventListener("click", addTask);
createNewListBtn.addEventListener("click", addList);
settingsBtn.addEventListener("click", () => 
  settings(settingsBtn));

// createTaskWindow(true);
