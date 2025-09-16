import { createTaskWindow, initialize } from "../Controller/controller.js";

const taskList = document.getElementById("taskList");
const archiveList = document.getElementById("archiveList");
const tasks = JSON.parse(localStorage.getItem("tasks"));
const createNewBtn = document.getElementById("createNew");
console.log("tasks:", tasks);



if (tasks !== null) {
  initialize();
}


createNewBtn.addEventListener("click", () => createTaskWindow(true));


// createTaskWindow(true);
