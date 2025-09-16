import { createTaskWindow, initialize } from "../Controller/controller.js";

const taskList = document.getElementById("taskList");
const archiveList = document.getElementById("archiveList");
const tasks = JSON.parse(localStorage.getItem("tasks"));
const createNewBtn = document.getElementById("createNew");
const brouchure = document.getElementById("brouchure");
console.log("tasks:", tasks);

const activeBtn = document.getElementById("activeBtn");
const archiveBtn = document.getElementById("archiveBtn");

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

createNewBtn.addEventListener("click", () => createTaskWindow(true));

// createTaskWindow(true);
