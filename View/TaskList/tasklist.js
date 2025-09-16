import { loadLocal } from "../../Model/dataManager.js";
import { createTaskWindow, viewTask } from "../../Controller/controller.js";

loadLocal();

const tasks = JSON.parse(localStorage.getItem("tasks"));



// createTaskWindow(false);
viewTask(tasks[0]);