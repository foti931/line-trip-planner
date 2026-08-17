const STORAGE_KEY = "line-trip-planner:v1";

const initialState = {
  trip: {
    name: "東京旅行",
    start: "",
    end: "",
    note: "集合場所、予約番号、注意事項などをここにまとめます。",
  },
  schedules: [
    {
      id: crypto.randomUUID(),
      date: "",
      time: "09:00",
      title: "集合",
      memo: "駅の改札前",
    },
  ],
  todos: [
    {
      id: crypto.randomUUID(),
      title: "ホテルを予約する",
      owner: "",
      due: "",
      done: false,
    },
  ],
};

let state = loadState();

const elements = {
  tripName: document.querySelector("#trip-name"),
  tripStart: document.querySelector("#trip-start"),
  tripEnd: document.querySelector("#trip-end"),
  tripNote: document.querySelector("#trip-note"),
  scheduleForm: document.querySelector("#schedule-form"),
  scheduleDate: document.querySelector("#schedule-date"),
  scheduleTime: document.querySelector("#schedule-time"),
  scheduleTitle: document.querySelector("#schedule-title-input"),
  scheduleMemo: document.querySelector("#schedule-memo"),
  scheduleList: document.querySelector("#schedule-list"),
  scheduleTemplate: document.querySelector("#schedule-item-template"),
  todoForm: document.querySelector("#todo-form"),
  todoTitle: document.querySelector("#todo-title-input"),
  todoOwner: document.querySelector("#todo-owner"),
  todoDue: document.querySelector("#todo-due"),
  todoList: document.querySelector("#todo-list"),
  todoTemplate: document.querySelector("#todo-item-template"),
  taskProgress: document.querySelector("#task-progress"),
  scheduleCount: document.querySelector("#schedule-count"),
  taskCount: document.querySelector("#task-count"),
  shareLine: document.querySelector("#share-line"),
  copySummary: document.querySelector("#copy-summary"),
  exportJson: document.querySelector("#export-json"),
  importJson: document.querySelector("#import-json"),
  profileName: document.querySelector("#profile-name"),
  avatar: document.querySelector("#avatar"),
  toast: document.querySelector("#toast"),
};

bindEvents();
render();
initLiff();

function loadState() {
  try {
    const saved = localStorage.getItem(STORAGE_KEY);
    return saved ? JSON.parse(saved) : structuredClone(initialState);
  } catch {
    return structuredClone(initialState);
  }
}

function saveState() {
  localStorage.setItem(STORAGE_KEY, JSON.stringify(state));
}

function bindEvents() {
  ["input", "change"].forEach((eventName) => {
    [elements.tripName, elements.tripStart, elements.tripEnd, elements.tripNote].forEach(
      (input) => input.addEventListener(eventName, updateTrip)
    );
  });

  elements.scheduleForm.addEventListener("submit", addSchedule);
  elements.todoForm.addEventListener("submit", addTodo);
  elements.shareLine.addEventListener("click", shareToLine);
  elements.copySummary.addEventListener("click", copySummary);
  elements.exportJson.addEventListener("click", exportJson);
  elements.importJson.addEventListener("change", importJson);
}

function updateTrip() {
  state.trip = {
    name: elements.tripName.value.trim(),
    start: elements.tripStart.value,
    end: elements.tripEnd.value,
    note: elements.tripNote.value.trim(),
  };
  saveState();
}

function addSchedule(event) {
  event.preventDefault();
  state.schedules.push({
    id: crypto.randomUUID(),
    date: elements.scheduleDate.value,
    time: elements.scheduleTime.value,
    title: elements.scheduleTitle.value.trim(),
    memo: elements.scheduleMemo.value.trim(),
  });
  elements.scheduleForm.reset();
  saveState();
  render();
}

function addTodo(event) {
  event.preventDefault();
  state.todos.push({
    id: crypto.randomUUID(),
    title: elements.todoTitle.value.trim(),
    owner: elements.todoOwner.value.trim(),
    due: elements.todoDue.value,
    done: false,
  });
  elements.todoForm.reset();
  saveState();
  render();
}

function render() {
  elements.tripName.value = state.trip.name;
  elements.tripStart.value = state.trip.start;
  elements.tripEnd.value = state.trip.end;
  elements.tripNote.value = state.trip.note;
  renderSchedules();
  renderTodos();
  renderStats();
}

function renderSchedules() {
  elements.scheduleList.replaceChildren();

  if (state.schedules.length === 0) {
    elements.scheduleList.append(emptyMessage("まだ予定がありません"));
    return;
  }

  [...state.schedules]
    .sort((a, b) => `${a.date}${a.time}`.localeCompare(`${b.date}${b.time}`))
    .forEach((schedule) => {
      const item = elements.scheduleTemplate.content.cloneNode(true);
      item.querySelector(".item-title").textContent = schedule.title;
      item.querySelector(".item-meta").textContent = [formatDate(schedule.date), schedule.time]
        .filter(Boolean)
        .join(" ");
      item.querySelector(".item-note").textContent = schedule.memo;
      item.querySelector(".delete").addEventListener("click", () => {
        state.schedules = state.schedules.filter(({ id }) => id !== schedule.id);
        saveState();
        render();
      });
      elements.scheduleList.append(item);
    });
}

function renderTodos() {
  elements.todoList.replaceChildren();

  if (state.todos.length === 0) {
    elements.todoList.append(emptyMessage("まだTODOがありません"));
    return;
  }

  state.todos.forEach((todo) => {
    const item = elements.todoTemplate.content.cloneNode(true);
    const article = item.querySelector(".todo-item");
    const checkbox = item.querySelector(".todo-check");
    checkbox.checked = todo.done;
    article.classList.toggle("done", todo.done);
    item.querySelector(".item-title").textContent = todo.title;
    item.querySelector(".item-meta").textContent = [
      todo.owner ? `担当: ${todo.owner}` : "",
      todo.due ? `期限: ${formatDate(todo.due)}` : "",
    ]
      .filter(Boolean)
      .join(" / ");
    checkbox.addEventListener("change", () => {
      todo.done = checkbox.checked;
      saveState();
      render();
    });
    item.querySelector(".delete").addEventListener("click", () => {
      state.todos = state.todos.filter(({ id }) => id !== todo.id);
      saveState();
      render();
    });
    elements.todoList.append(item);
  });
}

function renderStats() {
  const completed = state.todos.filter((todo) => todo.done).length;
  const progress =
    state.todos.length === 0 ? 0 : Math.round((completed / state.todos.length) * 100);
  elements.taskProgress.textContent = `${progress}%`;
  elements.scheduleCount.textContent = state.schedules.length;
  elements.taskCount.textContent = state.todos.length;
}

function emptyMessage(text) {
  const element = document.createElement("p");
  element.className = "empty";
  element.textContent = text;
  return element;
}

function formatDate(value) {
  if (!value) return "";
  return new Intl.DateTimeFormat("ja-JP", {
    month: "numeric",
    day: "numeric",
    weekday: "short",
  }).format(new Date(`${value}T00:00:00`));
}

function buildSummary() {
  const tripRange = [formatDate(state.trip.start), formatDate(state.trip.end)]
    .filter(Boolean)
    .join(" - ");
  const schedules = state.schedules
    .map((item) => `・${formatDate(item.date)} ${item.time || ""} ${item.title}`.trim())
    .join("\n");
  const todos = state.todos
    .map((item) => {
      const done = item.done ? "完了" : "未完了";
      const owner = item.owner ? ` / 担当: ${item.owner}` : "";
      const due = item.due ? ` / 期限: ${formatDate(item.due)}` : "";
      return `・[${done}] ${item.title}${owner}${due}`;
    })
    .join("\n");

  return [
    `【${state.trip.name || "旅行計画"}】`,
    tripRange,
    state.trip.note,
    "",
    "旅程",
    schedules || "・未登録",
    "",
    "TODO",
    todos || "・未登録",
  ]
    .filter((line, index, lines) => line || lines[index - 1] !== "")
    .join("\n");
}

async function shareToLine() {
  const summary = buildSummary();
  try {
    if (window.liff?.isApiAvailable?.("shareTargetPicker")) {
      await window.liff.shareTargetPicker([
        {
          type: "text",
          text: summary,
        },
      ]);
      showToast("LINE共有を開きました");
      return;
    }
    await navigator.clipboard.writeText(summary);
    showToast("LIFF外のため概要をコピーしました");
  } catch (error) {
    console.error(error);
    showToast("共有できませんでした");
  }
}

async function copySummary() {
  await navigator.clipboard.writeText(buildSummary());
  showToast("概要をコピーしました");
}

function exportJson() {
  const blob = new Blob([JSON.stringify(state, null, 2)], {
    type: "application/json",
  });
  const url = URL.createObjectURL(blob);
  const link = document.createElement("a");
  link.href = url;
  link.download = `${state.trip.name || "trip"}-backup.json`;
  link.click();
  URL.revokeObjectURL(url);
  showToast("JSONを保存しました");
}

async function importJson(event) {
  const file = event.target.files?.[0];
  if (!file) return;

  try {
    const imported = JSON.parse(await file.text());
    if (!imported.trip || !Array.isArray(imported.schedules) || !Array.isArray(imported.todos)) {
      throw new Error("Invalid backup format");
    }
    state = imported;
    saveState();
    render();
    showToast("JSONを復元しました");
  } catch (error) {
    console.error(error);
    showToast("JSONを読み込めませんでした");
  } finally {
    event.target.value = "";
  }
}

async function initLiff() {
  const liffId = new URLSearchParams(location.search).get("liffId");
  if (!window.liff || !liffId) return;

  try {
    await window.liff.init({ liffId });
    if (!window.liff.isLoggedIn()) {
      window.liff.login();
      return;
    }
    const profile = await window.liff.getProfile();
    elements.profileName.textContent = profile.displayName;
    elements.avatar.innerHTML = profile.pictureUrl
      ? `<img src="${profile.pictureUrl}" alt="">`
      : profile.displayName.slice(0, 1);
  } catch (error) {
    console.error(error);
  }
}

function showToast(message) {
  elements.toast.textContent = message;
  elements.toast.classList.add("show");
  window.clearTimeout(showToast.timer);
  showToast.timer = window.setTimeout(() => {
    elements.toast.classList.remove("show");
  }, 2200);
}
