const board = document.getElementById("board");
const storageKey = "kanbanCards";

/* ---- GENERATOR ID ---- */
function newID() {
    return "k" + Math.random().toString(36).slice(2, 9);
}

/* ---- LOSOWY KOLOR ---- */
function randomColor() {
    return `hsl(${Math.random() * 360},70%,75%)`;
}

/* ---- TWORZENIE KARTY ---- */
function makeCard(text, column, id, color) {
    const card = document.createElement("div");
    card.className = "card";
    card.dataset.col = column;
    card.id = id || newID();
    card.style.background = color || randomColor();

    const title = document.createElement("h4");
    title.contentEditable = "true";
    title.innerText = text || "Nowe zadanie";
    card.appendChild(title);

    const left = document.createElement("button");
    left.className = "move";
    left.innerText = "←";
    card.appendChild(left);

    const right = document.createElement("button");
    right.className = "move";
    right.innerText = "→";
    card.appendChild(right);

    const remove = document.createElement("button");
    remove.className = "remove";
    remove.innerText = "X";
    card.appendChild(remove);

    const recolor = document.createElement("button");
    recolor.className = "singleColor";
    recolor.innerText = "🎨";
    card.appendChild(recolor);

    document.querySelector(`section[data-col='${column}'] .cards`).append(card);
    update();
}

/* ---- LICZNIKI ---- */
function updateCounters() {
    document.querySelectorAll("section").forEach(sec => {
        const amount = sec.querySelectorAll(".card").length;
        sec.querySelector(".counter").innerText = `Liczba kart: ${amount}`;
    });
}

/* ---- ZAPIS DO STORAGE ---- */
function save() {
    const list = [];
    document.querySelectorAll(".card").forEach(card => {
        list.push({
            id: card.id,
            title: card.querySelector("h4").innerText,
            column: card.dataset.col,
            color: card.style.background
        });
    });
    localStorage.setItem(storageKey, JSON.stringify(list));
}

/* ---- ODTWARZANIE ---- */
function load() {
    const data = JSON.parse(localStorage.getItem(storageKey) || "[]");
    data.forEach(x => makeCard(x.title, x.column, x.id, x.color));
}

/* ---- SORTOWANIE ---- */
function sortColumn(section) {
    const area = section.querySelector(".cards");
    const cards = [...area.children];
    cards.sort((a, b) => a.querySelector("h4").innerText.localeCompare(b.querySelector("h4").innerText));
    cards.forEach(c => area.append(c));
    update();
}

/* ---- KOLOROWANIE KOLUMNY ---- */
function paintColumn(section) {
    const c = randomColor();
    section.querySelectorAll(".card").forEach(card => card.style.background = c);
    update();
}

/* ---- AKTUALIZACJA ---- */
function update() {
    updateCounters();
    save();
}

/* ---- OBSŁUGA KLIKNIĘĆ ---- */
board.addEventListener("click", e => {
    const section = e.target.closest("section");

    if (e.target.classList.contains("add")) {
        makeCard("Nowe zadanie", section.dataset.col);
    }

    if (e.target.classList.contains("paint")) {
        paintColumn(section);
    }

    if (e.target.classList.contains("sort")) {
        sortColumn(section);
    }

    if (e.target.classList.contains("remove")) {
        e.target.parentElement.remove();
        update();
    }

    if (e.target.classList.contains("singleColor")) {
        e.target.parentElement.style.background = randomColor();
        update();
    }

    if (e.target.classList.contains("move")) {
        const card = e.target.parentElement;
        const col = card.dataset.col;

        if (e.target.innerText === "→" && col !== "done") {
            card.dataset.col = (col === "todo") ? "doing" : "done";
        }

        if (e.target.innerText === "←" && col !== "todo") {
            card.dataset.col = (col === "done") ? "doing" : "todo";
        }

        document.querySelector(`section[data-col='${card.dataset.col}'] .cards`).append(card);
        update();
    }
});

/* ---- ZMIANA TEKSTU ---- */
board.addEventListener("input", save);

/* ---- START ---- */
load();
update();
