function getDaysInMonth(month, year = new Date().getFullYear()) {
  return new Date(year, month + 1, 0).getDate();
}

const taskListElement = document.getElementById("task-list");
let tasks = JSON.parse(localStorage.getItem("tasks")) || ["DSA", "DBMS", "Web Dev"];

function renderTasks() {
  taskListElement.innerHTML = "";

  const selectedMonth = Number(document.getElementById("month").value);
  const selectedYear = Number(document.getElementById("year").value);
  const days = getDaysInMonth(selectedMonth, selectedYear);


  // This was for Date Header Row

  // // 1. Create and append the date header row
  // const dateHeader = document.createElement("div");
  // dateHeader.className = "date-header";

  // // Empty space for the task name column
  // const emptyHeader = document.createElement("div");
  // emptyHeader.className = "task-name";
  // emptyHeader.textContent = "Date";
  // dateHeader.appendChild(emptyHeader);

  // // Append day numbers as labels
  // for (let day = 1; day <= days; day++) {
  //   const dayLabel = document.createElement("div");
  //   dayLabel.className = "day-label";
  //   dayLabel.textContent = day;
  //   dateHeader.appendChild(dayLabel);
  // }

  // taskListElement.appendChild(dateHeader);


  // 2. Render task rows with checkboxes below the dates
  tasks.forEach((task, taskIndex) => {
    const row = document.createElement("div");
    row.className = "task-row";

    const name = document.createElement("div");
    name.className = "task-name";
    name.textContent = task;
    row.appendChild(name);

    const checkboxes = document.createElement("div");
    checkboxes.className = "day-checkboxes";

    const progressText = document.createElement("div");
    progressText.className = "progress-text";

    for (let day = 1; day <= days; day++) {
      const checkboxId = `${task}-month-${selectedMonth}-year-${selectedYear}-day-${day}`;

      const wrapper = document.createElement("div");
      wrapper.className = "checkbox-wrapper";

      const checkbox = document.createElement("input");
      checkbox.type = "checkbox";
      checkbox.id = checkboxId;
      checkbox.checked = JSON.parse(localStorage.getItem(checkboxId)) || false;

      const label = document.createElement("label");
      label.setAttribute("for", checkboxId);
      label.classList.add("checkbox-label");
      label.textContent = day;

      if (checkbox.checked) {
        label.classList.add("checked-label");
      }

      checkbox.addEventListener("change", () => {
        localStorage.setItem(checkboxId, checkbox.checked);
        updateProgress(task, days, progressText);
        highlightCompletedDays(days);
        if (checkbox.checked) {
          label.classList.add("checked-label");
        } else {
          label.classList.remove("checked-label");
        }
      });

      wrapper.appendChild(checkbox);
      wrapper.appendChild(label);
      checkboxes.appendChild(wrapper);
    }

    row.appendChild(checkboxes);
    updateProgress(task, days, progressText);
    row.appendChild(progressText);
    taskListElement.appendChild(row);
  });

  highlightCompletedDays(days);
}



function updateProgress(task, totalDays, progressTextElement) {
  const selectedMonth = document.getElementById("month").value;
  let completed = 0;
  for (let day = 1; day <= totalDays; day++) {
    const id = `${task}-month-${selectedMonth}-day-${day}`;
    if (JSON.parse(localStorage.getItem(id))) {
      completed++;
    }
  }
  const percent = Math.round((completed / totalDays) * 100);
  progressTextElement.textContent = `✅ ${percent}% done`;
}

function highlightCompletedDays(totalDays) {
  const selectedMonth = document.getElementById("month").value;

  for (let day = 1; day <= totalDays; day++) {
    let allDone = true;

    for (let task of tasks) {
      const id = `${task}-month-${selectedMonth}-day-${day}`;
      if (!JSON.parse(localStorage.getItem(id))) {
        allDone = false;
        break;
      }
    }

    tasks.forEach((task, taskIndex) => {
      const cell = document.querySelector(`.task-row:nth-child(${taskIndex + 1}) .day-checkboxes`).children[day - 1];
      if (allDone) {
        cell.style.backgroundColor = "#c9f7c2";
      } else {
        cell.style.backgroundColor = "transparent";
      }
    });
  }
}

function addTask() {
  const newTask = document.getElementById("new-task").value.trim();
  if (newTask && !tasks.includes(newTask)) {
    tasks.push(newTask);
    localStorage.setItem("tasks", JSON.stringify(tasks));
    renderTasks();
    document.getElementById("new-task").value = "";
  }
}

function resetAll() {
  if (confirm("Are you sure you want to reset all checkboxes?")) {
    localStorage.clear();
    tasks = ["DSA", "DBMS", "Web Dev"];
    localStorage.setItem("tasks", JSON.stringify(tasks));
    renderTasks();
  }
}

// Dark mode toggle (optional)
function toggleDarkMode() {
  document.body.classList.toggle("dark-mode");
  localStorage.setItem("dark-mode", document.body.classList.contains("dark-mode"));
}


function populateYearOptions() {
  const yearSelect = document.getElementById("year");
  const currentYear = new Date().getFullYear();

  for (let y = currentYear - 5; y <= currentYear + 5; y++) {
    const option = document.createElement("option");
    option.value = y;
    option.textContent = y;
    if (y === currentYear) option.selected = true;
    yearSelect.appendChild(option);
  }
}



// Load dark mode if enabled before
window.onload = function () {
  populateYearOptions();
  renderTasks();

  document.getElementById("month").addEventListener("change", renderTasks);
  document.getElementById("year").addEventListener("change", renderTasks);
};

