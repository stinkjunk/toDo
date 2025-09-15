// import { tasks } from "../../Model/dataManager.js";
import { loadLocal } from "../../Model/dataManager.js";
import { createTaskWindow } from "../../Controller/controller.js";

loadLocal();

const tasks = JSON.parse(localStorage.getItem("tasks"));
const pageID = new URLSearchParams(window.location.search).get("id");
const pageObj = tasks.find((task) => task.id === pageID);

console.log("Page obj:", pageObj);




const docTitle = document.querySelector("title");
docTitle.innerHTML = pageObj.title;

// createTaskWindow(false);