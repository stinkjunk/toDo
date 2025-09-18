import {
  tasks,
  storeLocal,
  updateLocal,
  logLocal,
  clearLocal,
  loadLocal,
  removeLocal,
  printPlaceholderData,
  setPreferredTheme,
} from "../Model/dataManager.js";

const main = document.querySelector("main");
const html = document.querySelector("html");
const taskList = document.getElementById("taskList");
const archiveList = document.getElementById("archiveList");
const header = document.querySelector("header");
const headerPush = document.getElementById("headerpush");

headerPush.style.height = header.offsetHeight + 10 + "px";

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
    complete: false,
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

      requestAnimationFrame(() => {
        taskDesc.style.height = "auto";
        taskDesc.style.height = taskDesc.scrollHeight + "px";
        //venter med at opdaterer indtil efter første render
        //forstår vitterligt ikke hvorfor denne funktionalitet
        //ikke bare er en CSS-property; BBLEERHHH!
        //(ser også snappy ud............)
      });

      taskDesc.addEventListener("input", (event) => {
        task.description = event.target.value;
        updateLocal(task.id, task.description, "description");
        taskDesc.style.height = "auto";
        taskDesc.style.height = taskDesc.scrollHeight + "px";
      });

      taskDesc.style.height = "auto";
      taskDesc.style.height = taskDesc.scrollHeight + "px";

      taskDoneBtn.addEventListener("click", () => {
        const taskCard = document.getElementById(`${task.id}`);
        task.isDone = !task.isDone;
        console.log("Task marked as done:", task);
        updateLocal(task.id, task.isDone, "isDone");

        taskCard.classList.add("removing");
        setTimeout(() => {
          taskCard.remove();
          initialize();
          updateScrollHeight();
        }, 500);
      });
    } else {
      console.log(task.id, "er en liste");

      const entryHTML = task.tasks
        .map(
          (entry, i) => `
          <div class="shoppingListItem ${entry.complete ? "complete" : ""}">
            <button class="numBtn" id="minusBtn${task.id}_${i}">–</button>
            <p id="wareCountID${task.id}_${i}" class="wareCount">${
            entry.bought
          }</p>
            <button class="numBtn" id="plusBtn${task.id}_${i}">+</button>
            <input id="wareNameID${task.id}_${i}" type="text" class="wareTitle" 
            value="${entry.ware}">
            <p>købt/</p>
            <input id="needID${task.id}_${i}" type="number" class="needCount" 
            value="${entry.need}">
            <button class="deleteEntryBtn" id="deleteEntry${
              task.id
            }_${i}">–</button>
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
              <button class = "addEntry" id="addEntry${task.id}">Tilføj ny vare</button>
           ${entryHTML}
           </div>
         </div>
       <div class="cardFooter">
         <button class="deleteTaskBtn" id="deleteID${task.id}">🗑️</button>
       </div>
      `;

      task.tasks.forEach((entry, i) => {
        // i = indeks fordi det er det andet argument
        //i forEach funktionen
        const item = card.querySelectorAll(".shoppingListItem")[i];
        const minusBtn = card.querySelector(`#minusBtn${task.id}_${i}`);
        const plusBtn = card.querySelector(`#plusBtn${task.id}_${i}`);
        const wareCount = card.querySelector(`#wareCountID${task.id}_${i}`);
        const wareName = card.querySelector(`#wareNameID${task.id}_${i}`);
        const needCount = card.querySelector(`#needID${task.id}_${i}`);
        const deleteEntryBtn = card.querySelector(
          `#deleteEntry${task.id}_${i}`
        );

        minusBtn.addEventListener("click", () => {
          if (entry.bought > 0) {
            if (entry.complete) {
              entry.complete = false;
              item.classList.remove("complete");
            }
            if (task.isDone) {
              task.isDone = false;
              card.classList.remove("done");
              card.classList.add("removing");
              setTimeout(() => {
                card.remove();
                initialize();
              }, 500);
            }
            entry.bought--;
            wareCount.innerHTML = entry.bought;
            updateLocal(task.id, task.tasks, "tasks");
            checkIfComplete();
          }
        });

        plusBtn.addEventListener("click", () => {
          entry.bought++;
          if (entry.bought >= entry.need) {
            entry.bought = entry.need;
            entry.complete = true;
            item.classList.add("complete");
          }
          wareCount.innerHTML = entry.bought;

          updateLocal(task.id, task.tasks, "tasks");
          checkIfComplete();
        });

        deleteEntryBtn.addEventListener("click", () => {
          if (task.tasks.length === 1) {
            const message = `
             <h3 style="text-align: center;">Slet liste?</h3>
             <p>Det ser ud til at du er ved at slette den eneste vare i listen.</p>
             <p>Hvis du sletter denne vare vil listen også blive slettet.</p>
             <p>Er du sikker?</p>
             `;
            confirmDeletion(task.id, message);
            return;
          }
          task.tasks.splice(i, 1);
          item.classList.add("removing");
          setTimeout(() => item.remove(), 500);
          storeLocal(tasks);
          checkIfComplete();
          updateScrollHeight();
        });

        wareName.addEventListener("input", (entryInner) => {
          entry.ware = entryInner.target.value;
          updateLocal(task.id, task.tasks, "tasks");
          checkIfComplete();
        });

        needCount.addEventListener("input", (entryInner) => {
          entry.need = Number(entryInner.target.value); //forstå dette
          checkIfComplete();
        });

        needCount.addEventListener("blur", (entryInner) => {
          if (entry.need <= 0) {
            entry.need = 1;
            entryInner.target.value = 1;
          }
          if (entry.bought >= entry.need) {
            console.log("needCount");
            entry.bought = entry.need;
            wareCount.innerHTML = entry.bought;
            entry.complete = true;
            item.classList.add("complete");
          }
          updateLocal(task.id, task.tasks, "tasks");
          checkIfComplete();
        });

        function checkIfComplete() {
          if (task.tasks.every((entry) => entry.complete)) {
            task.isDone = true;
            updateLocal(task.id, task.isDone, "isDone");

            card.classList.add("removing");
            setTimeout(() => {
              card.remove();
              initialize();
              updateScrollHeight();
            }, 500);
          }
        }
        //entryInner shorthand brugt for læsbarhed (forvirrende med to 'entry's)
        //NOTE TO SELF:
        //både entry og entryInner er shorthands defineret i arrow-funktioner
      });

      const addEntryBtn = card.querySelector(`#addEntry${task.id}`);
      addEntryBtn.addEventListener("click", () => {
        task.tasks.push({
          ware: "Varer",
          bought: 0,
          need: 10,
          complete: false,
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
    const iconPickerBtn = document.getElementById(`iconID${task.id}`);

    iconPickerBtn.addEventListener("click", () => {
      console.log("Icon picker clicked (ID: ", task.id, ")");
      iconPicker(task);
    });

    taskTitle.addEventListener("input", (event) => {
      task.title = event.target.value;
      // console.log("taskTitle input: ", task.title, " (ID: ", task.id, ")");
      updateLocal(task.id, task.title, "title");
    });

    taskIcon.addEventListener("click", () => {
      console.log("Icon picker clicked (ID: ", task.id, ")");
    });

    deleteTaskBtn.addEventListener("click", () => {
      const message = `
      <h3 style="text-align: center;">Slet ${
        task.type === "task" ? "opgaven" : "listen"
      }?</h3>
      <p>Er du sikker på at du vil slette ${
        task.type === "task" ? "opgaven" : "listen"
      } "<i>${task.title}"?</i></p>
      <p>Denne handling kan ikke fortrydes.</p>

      `;

      console.log("Delete task clicked (ID: ", task.id, ")");

      confirmDeletion(task.id, message);
    });
  });
  updateScrollHeight();
}

const windowCont = document.getElementById("windowCont");

function confirmDeletion(id, message) {
  windowCont.innerHTML = ""; //cleanup, for en sikkerheds skyld
  windowCont.classList.add("active");
  const confirmWindow = document.createElement("div");
  confirmWindow.classList = "window zoomIn";
  console.log("Message i confirmDeletion:", message);
  confirmWindow.innerHTML = `${message}
        <div class="buttons">
       <button Id="confirmBtnID${id}" class="deletionBtns">Ja</button>
       <button Id="cancelBtnID${id}" class="deletionBtns">Nej</button>
      </div>`;

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
    updateScrollHeight();
  }, 500);
}

function iconPicker(task) {
  const icons = [
    "📝",
    "🛒",
    "🤖",
    "📚",
    "🎨",
    "🎵",
    "🏃",
    "🍳",
    "🌱",
    "🧘",
    "📷",
    "✍️",
    "💡",
    "📅",
    "🔧",
    "🧩",
    "🍹",
    "🍪",
    "🛠️",
    "🌞",
    "🕹️",
    "💻",
    "📖",
    "🌊",
    "🚴",
    "🎬",
    "🗂️",
    "🏡",
    "✈️",
    "🍎",
    "🍊",
    "🍌",
    "🍉",
    "🍓",
    "🥑",
    "🥕",
    "🌽",
    "🍕",
    "🍔",
    "🍟",
    "🥪",
    "🍰",
    "🍩",
    "🥗",
    "🌅",
    "🍗",
    "🌲",
    "📸",
    "🥞",
    "🐍",
    "🥤",
    "⚽",
  ];

  windowCont.innerHTML = ""; //cleanup, for en sikkerheds skyld
  windowCont.classList.add("active");
  const iconPickerWindow = document.createElement("div");
  const iconTile = icons
    .map(
      (icon) =>
        `<button class="iconElement" id="iconID${icon}">${icon}</button>`
    )
    .join("");
  iconPickerWindow.innerHTML = `
    <div class="iconPickerHeader">
    <h3>Vælg et ikon</h3>
    <button id="closeIconPicker">+</button>
    </div>
    <div class="iconContents">${iconTile}</div>
    </div>`;
  iconPickerWindow.classList = "window zoomIn";
  iconPickerWindow.id = "iconPickerWindow";
  windowCont.appendChild(iconPickerWindow);

  const closeIconPicker = document.getElementById("closeIconPicker");
  closeIconPicker.addEventListener("click", () => {
    windowCont.classList.remove("active");
    iconPickerWindow.classList.remove("zoomIn");
    iconPickerWindow.offsetHeight; //trigger reflow
    iconPickerWindow.classList.add("zoomOut");
    iconPickerWindow.addEventListener("animationend", () => {
      console.log("ZoomOut on confirmWindow ended");
      windowCont.innerHTML = "";
    });
  });

  icons.forEach((icon) => {
    const iconBtn = document.getElementById(`iconID${icon}`);
    iconBtn.addEventListener("click", () => {
      task.icon = icon;
      updateLocal(task.id, task.icon, "icon");
      closeIconPicker.click();
      initialize();
    });
  });
}

export function settings() {
  windowCont.innerHTML = ""; //cleanup, for en sikkerheds skyld
  windowCont.classList.add("active");
  const settingsWindow = document.createElement("div");
  settingsWindow.id = "settingsWindow";
  let currentTheme = localStorage.getItem("preferedTheme");
  settingsWindow.innerHTML = `
    <h3>Settings</h3>
    <h4>Temaer</h4>
    <button id='settingsThemeDef' ${
      currentTheme === "system" ? "class='active'" : ""
    }>Systemstandard (${
    window.matchMedia("(prefers-color-scheme: dark)").matches ? "Mørk" : "Lys"
  })</button>
    <button id='settingsThemeLight' ${
      currentTheme === "light" ? "class='active'" : ""
    }'>Lys</button>
    <button id='settingsThemeDark' ${
      currentTheme === "dark" ? "class='active'" : ""
    }>Mørk</button>
    <h4>Debug</h4>
    <button id='settingsClearLocal'>Clear local storage</button>
    <button id='settingsLogLocal'>Log local storage</button>
    <button id='settingsPrintPlaceholderData'>Print placeholder data</button>
    <h4>Sådan bruger du appen:</h4>
    <p>Du kan vælge at lave en ny opgave eller en liste ved at klikke på knappen
     "📝" eller "🛒" i toppen af siden. Efter disse er lavet, kan du frit redigere dem.
     Du kan trykke færdiggør på en opgave for at flytte dem til arkiv-listen, hvorfra
     du kan sende dem tilbage til den aktive To-Do liste ved at trykke på "Fortryd Færdiggørelse".
     Lister bliver automatisk flyttet til arkiv-listen når alle deres krav er fuldendt. Ændr på
     kravene for at automatisk flytte dem tilbage til den aktive liste.</p>
    
    <button id='settingsClose'>Luk indstillinger</button>
    `;
  settingsWindow.classList = "window zoomIn";
  windowCont.prepend(settingsWindow);
  const settingsClose = document.getElementById("settingsClose");
  const settingsThemeDef = document.getElementById("settingsThemeDef");
  const settingsThemeLight = document.getElementById("settingsThemeLight");
  const settingsThemeDark = document.getElementById("settingsThemeDark");
  const settingsClearLocal = document.getElementById("settingsClearLocal");
  const settingsLogLocal = document.getElementById("settingsLogLocal");
  const settingsPrintPlaceholderData = document.getElementById(
    "settingsPrintPlaceholderData"
  );

  settingsClose.addEventListener("click", () => {
    windowCont.classList.remove("active");
    settingsWindow.classList.remove("zoomIn");
    settingsWindow.offsetHeight; //trigger reflow
    settingsWindow.classList.add("zoomOut");
    settingsWindow.addEventListener("animationend", () => {
      console.log("ZoomOut on confirmWindow ended");
      windowCont.innerHTML = "";
    });
  });

  //vælg tema:

  settingsThemeDef.addEventListener("click", () => {
    setPreferredTheme("system");
    html.classList = window.matchMedia("(prefers-color-scheme: dark)").matches
      ? "dark"
      : "light";
    console.log("Tema: Systemstandard");
    settingsThemeDark.classList = "";
    settingsThemeLight.classList = "";
    settingsThemeDef.classList.add("active");
  });

  settingsThemeLight.addEventListener("click", () => {
    setPreferredTheme("light");
    html.classList = "light";
    console.log("Tema: Lys");
    settingsThemeDark.classList = "";
    settingsThemeLight.classList.add("active");
    settingsThemeDef.classList = "";
  });

  settingsThemeDark.addEventListener("click", () => {
    setPreferredTheme("dark");
    html.classList = "dark";
    console.log("Tema: Mørk");
    settingsThemeDark.classList.add("active");
    settingsThemeLight.classList = "";
    settingsThemeDef.classList = "";
  });

  //debug:
  settingsClearLocal.addEventListener("click", () => {
    tasks.length = 0; //glemmer i-hukommelse data
    clearLocal(); //glemmer data i localStorage
    console.log("Glemt opgaver i localStorage og fra nuværende instans");
    initialize();
    console.log("Genindlæst");
  });
  settingsLogLocal.addEventListener("click", () => logLocal());
  settingsPrintPlaceholderData.addEventListener("click", async () => {
    await printPlaceholderData("../Model/placeHolderData.json");
    initialize();
    settingsClose.click();
  });
}

//paster her undgår cirkulære imports
const brouchure = document.getElementById("brouchure");
const archivedPage = document.querySelector("#archiveList");
const activePage = document.querySelector("#taskList");

export function updateScrollHeight() {
  const currentPage = brouchure.classList.contains("archivedPage")
    ? archivedPage
    : activePage;

  // get the real rendered height in pixels
  requestAnimationFrame(() => {
    const height = currentPage.getBoundingClientRect().height;
    main.style.height = height + "px";
    console.log("Applied height:", height + "px");
  });
}

window.addEventListener("load", updateScrollHeight);
window.addEventListener("resize", updateScrollHeight);
