export const tasks = [];

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
}