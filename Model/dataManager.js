export const tasks = [];
export let preferedTheme = localStorage.getItem("preferedTheme") || "system"; //hvis ikke opdateret, så sæt til system

export function loadLocal() {
  const storedTasks = localStorage.getItem("tasks");
  if (storedTasks) {
    tasks.push(...JSON.parse(storedTasks));
  } //tilføjer data fra localStorage til i-hukommelsens tasks-array
}

export function storeLocal(data) {
  localStorage.setItem("tasks", JSON.stringify(data));
  //parser data til JSON og sætter det i localStorage
}

export function updateLocal(id, data, type) {
  //   console.log(`updateLocal(id=${id}, data=${data})`);
  const index = tasks.findIndex((task) => task.id === id); //finder indeks for task med id
  if (index !== -1) {
    //hvis id findes i tasks-array
    tasks[index][type] = data; //opdaterer kun for den relevante key
    storeLocal(tasks);
  }
}

export function logLocal() {
  console.log("Stored tasks:", JSON.parse(localStorage.getItem("tasks")));
  //logger tasks fra localStorage
}

export function clearLocal() {
  localStorage.clear();
  //sletter localStorage data
}

export function removeLocal(id) {
  console.log("Removing task with id:", id);
  const index = tasks.findIndex((task) => task.id === id);
  if (index !== -1) {
    tasks.splice(index, 1); //fjerner task fra tasks-array
    storeLocal(tasks);
  }
}

export async function printPlaceholderData(adress) {
    clearLocal();

  const response = await fetch(adress);
  if (!response.ok) {
    return;
  }

  const placeholderData = await response.json();

  tasks.push(...placeholderData); 
  storeLocal(tasks); 
}

export function setPreferredTheme(theme) {
  preferedTheme = theme; // opdater in-memory variabel
  localStorage.setItem("preferedTheme", theme); // gem i localStorage
  console.log("Tema opdateret til:", theme);
}
