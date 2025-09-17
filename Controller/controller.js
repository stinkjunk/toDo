import {
  tasks,
  storeLocal,
  updateLocal,
  logLocal,
  clearLocal,
  loadLocal,
  removeLocal,
} from "../Model/dataManager.js";

const taskList = document.getElementById("taskList");
const archiveList = document.getElementById("archiveList");

//importerer data-related funktioner

loadLocal(); // loader opgaver fra localStorage ind i hukommelsen

export function addTask() {
  const task = {}; //objekt som holder opgavens data
  task.type = "task";
  task.title = "Ny opgave";
  task.description = "";
  task.icon = "📝";
  task.id = self.crypto.randomUUID(); //generer et tilfældigt id
  task.isDone = false;
  task.isNew = true;

  tasks.push(task); //tilføjer opgaven til tasks-array
  console.log("Added task:", task);
  console.log("Tasks:", tasks);
  storeLocal(tasks);
  initialize();
}

export function addList() {
  const list = {}; //objekt som holder opgavens data
  list.type = "list";
  list.title = "Ny indkøbsliste";
  list.icon = "🛒";
  list.id = self.crypto.randomUUID(); //generer et tilfældigt id
  list.isDone = false;
  list.isNew = true;
  list.tasks = [];
  list.tasks.push({
    ware: "Varer",
    bought: 0,
    need: 10,
  });
  console.log("Tasks: ", list.tasks);
  tasks.push(list);
  console.log("Added list:", list);
  storeLocal(tasks);
  initialize();
}

export function initialize() {
  taskList.innerHTML = "";
  archiveList.innerHTML = "";

  tasks.forEach((task) => {
    const card = document.createElement("div");
    card.classList.add("taskCard");
    if (task.type === "task") {
      console.log("task:", task);
      //skab card for hver task:

      card.innerHTML = `
    <div class="cardHeader">
      <button class='iconElement' id='iconID${task.id}'>${task.icon}</button>
      <input id='titleID${
        task.id
      }' type='text' class="taskTitle" placeholder='${task.title}' value='${
        task.title
      }'>
    </div>
    <div class="cardContent">
      <textarea id='descID${
        task.id
      }' class='taskDesc' placeholder='Tilføj en beskrivelse'>${
        task.description
      }</textarea>
    </div>
    <div class="cardFooter">
      <button class="taskDoneBtn" id='doneID${task.id}'>${
        task.isDone ? "Fortryd færdiggørelse" : "Færdig"
      }</button>
      <button class="deleteTaskBtn" id="deleteID${task.id}">🗑️</button>
    </div>
  `;
      //task-type specifikke consts
      const taskDesc = card.querySelector(`#descID${task.id}`);
      const taskDoneBtn = card.querySelector(`#doneID${task.id}`);
      //query i selve card, da disse ikke eksisterer i DOM endu

      taskDesc.addEventListener("input", (event) => {
        task.description = event.target.value;
        updateLocal(task.id, task.description, "description");
      });

      taskDoneBtn.addEventListener("click", () => {
        const taskCard = document.getElementById(`${task.id}`);
        task.isDone = !task.isDone;
        console.log("Task marked as done:", task);
        updateLocal(task.id, task.isDone, "isDone");

        taskCard.classList.add("removing");
        setTimeout(() => {
          taskCard.remove();
          initialize();
        }, 500);
      });
    } else {
      console.log(task.id, "er en liste");

      const entryHTML = task.tasks
        .map(
          (entry, i) => `
          <div class="shoppingListItem">
            <button class="numBtn" id="minusBtn${task.id}_${i}">–</button>
            <p id="wareCountID${task.id}_${i}" class="wareCount">${entry.bought}</p>
            <button class="numBtn" id="plusBtn${task.id}_${i}">+</button>
            <input id="wareNameID${task.id}_${i}" type="text" class="wareTitle" 
            value="${entry.ware}">
            <p> købt ud af </p>
            <input id="needID${task.id}_${i}" type="number" class="needCount" 
            value="${entry.need}">
            <button class="deleteEntryBtn" id="deleteEntry${task.id}_${i}">–</button>
          </div>
          `
        )
        .join("");

      card.innerHTML = `
       <div class="cardHeader">
         <button class='iconElement' id='iconID${task.id}'>${task.icon}</button>
         <input id='titleID${task.id}' type='text' class="taskTitle" placeholder='${task.title}' value='${task.title}'>
         </div>
           <div class="cardContent">
           <div class="shoppingList">
           ${entryHTML}
            <button class = "addEntry" id="addEntry${task.id}">Tilføj ny vare</button>
           </div>
         </div>
       <div class="cardFooter">
         <button class="deleteTaskBtn" id="deleteID${task.id}">🗑️</button>
       </div>
      `;

      task.tasks.forEach((entry, i) => {
        console.log(entry);
        const minusBtn = card.querySelector(`#minusBtn${task.id}_${i}`);
        const plusBtn = card.querySelector(`#plusBtn${task.id}_${i}`);
        const wareCount = card.querySelector(`#wareCountID${task.id}_${i}`);
        const wareName = card.querySelector(`#wareNameID${task.id}_${i}`);
        const needCount = card.querySelector(`#needID${task.id}_${i}`);
        const deleteEntryBtn = card.querySelector(
          `#deleteEntry${task.id}_${i}`
        );

        minusBtn.addEventListener("click", () => {
          entry.bought--;
          wareCount.innerHTML = entry.bought;
          updateLocal(task.id, task.tasks, "tasks");
        });

        plusBtn.addEventListener("click", () => {
          entry.bought++;
          wareCount.innerHTML = entry.bought;
          updateLocal(task.id, task.tasks, "tasks");
        });

        deleteEntryBtn.addEventListener("click", () => {
          console.log("Delete entry clicked (ID: ", task.id, ")");
          confirmDeletion(task.id, task.title);
        });

        wareName.addEventListener("input", (event) => {
          entry.ware = event.target.value;
          updateLocal(task.id, task.tasks, "tasks");
        });

        needCount.addEventListener("input", (event) => {
          entry.need = event.target.value;
          updateLocal(task.id, task.tasks, "tasks");
        });
      });

      const addEntryBtn = card.querySelector(`#addEntry${task.id}`);
      addEntryBtn.addEventListener("click", () => {
        task.tasks.push({
          ware: "Varer",
          bought: 0,
          need: 10,
        });
        console.log("Added entry:", task.tasks);
        storeLocal(tasks);
        initialize();
      });
    }

    card.id = task.id;
    if (task.isDone) {
      card.classList.add("done");
      archiveList.prepend(card);
    } else {
      taskList.prepend(card);
    }

    if (task.isNew === true) {
      card.classList.add("removing"); // start in shrunken state
      card.offsetHeight; // force reflow
      card.classList.remove("removing"); // triggers transition to normal size
      task.isNew = false;
      updateLocal(task.id, task.isNew, "isNew");
    }

    //universelle consts for alle typer card

    const taskTitle = document.getElementById(`titleID${task.id}`);
    const taskIcon = document.getElementById(`iconID${task.id}`);
    const deleteTaskBtn = document.getElementById(`deleteID${task.id}`);

    taskTitle.addEventListener("input", (event) => {
      task.title = event.target.value;
      // console.log("taskTitle input: ", task.title, " (ID: ", task.id, ")");
      updateLocal(task.id, task.title, "title");
    });

    taskIcon.addEventListener("click", () => {
      console.log("Icon picker clicked (ID: ", task.id, ")");
    });

    deleteTaskBtn.addEventListener("click", () => {
      console.log("Delete task clicked (ID: ", task.id, ")");
      confirmDeletion(task.id, task.title);
    });

    //TODO: Opdater tasks[] i localStorage hver gang info er opdateret
  });
}

const windowCont = document.getElementById("windowCont");

function confirmDeletion(id, title) {
  windowCont.innerHTML = ""; //cleanup, for en sikkerheds skyld
  windowCont.classList.add("active");
  const confirmWindow = document.createElement("div");
  confirmWindow.classList = "window zoomIn";
  confirmWindow.innerHTML = `
    <h3 style="text-align: center;">Slet opgave?</h3>
    <p>Er du sikker på at du vil slette opgaven "<i>${title}"?</i></p>
    <p>Denne handling kan ikke fortrydes.</p>
    <div class="buttons">
      <button Id="confirmBtnID${id}">Ja</button>
      <button Id="cancelBtnID${id}">Nej</button>
    </div>
    `;

  //...
  windowCont.appendChild(confirmWindow);
  confirmWindow.addEventListener("animationend", () => {
    console.log("ZoomIn on confirmWindow ended");

    const confirmBtn = document.getElementById(`confirmBtnID${id}`);
    console.log("confirmBtn:", confirmBtn);
    const cancelBtn = document.getElementById(`cancelBtnID${id}`);
    console.log("cancelBtn:", cancelBtn);

    confirmBtn.addEventListener("click", () => {
      handleChoice(true);
    });

    cancelBtn.addEventListener("click", () => {
      handleChoice(false);
    });

    function handleChoice(remove) {
      confirmBtn.disabled = true;
      cancelBtn.disabled = true; //for at undgå kaos, når vinduet allerede lukkes

      console.log("confirmBtn clicked");
      windowCont.classList.remove("active");
      confirmWindow.classList.remove("zoomIn");
      confirmWindow.offsetHeight; //trigger reflow
      confirmWindow.classList.add("zoomOut");
      confirmWindow.addEventListener("animationend", () => {
        console.log("ZoomOut on confirmWindow ended");
        windowCont.innerHTML = "";
        if (remove === true) {
          console.log('Fjerer task med id: "', id, '"...');
          removeSelf(id);
        } else {
          console.log('Annulerer fjernelse af task med id: "', id, '"...');
        }
      });
    }
  });
}

function removeSelf(id) {
  console.log("Removing task with id:", id);
  const task = document.getElementById(`${id}`);
  task.classList.add("removing");
  setTimeout(() => {
    console.log("Task card shrunken...");
    task.remove();
    console.log("Task removed from DOM");
    removeLocal(id);
  }, 500);
}

//debug:
export function debugOptions(slot) {
  const debugWindow = document.createElement("div");
  debugWindow.id = "debugWindow";
  debugWindow.innerHTML = `
    <button id='debugClearLocal'>Clear local storage</button>
    <button id='debugStoreLocal'>Store local storage</button>
    <button id='debugLogLocal'>Log local storage</button>
    `;
  slot.prepend(debugWindow);

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
