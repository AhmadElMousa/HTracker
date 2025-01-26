// saves user habits from local storage
function saveToLocalStorage(habits) {
  localStorage.setItem("habits", JSON.stringify(habits));
}

// loads user habits from local storage
function loadFromLocalStorage() {
  return JSON.parse(localStorage.getItem("habits")) || [];
}

const tbody = document.getElementById("habitsBody");

// renders the habits table after user adds a habit or on load
function renderTable() {
  const habits = loadFromLocalStorage();
  const date = localStorage.getItem("date");
  tbody.innerHTML = "";

  if (date === getCurrentDate()) {
    habits.forEach((habit, index) => {
      const row = `<tr>
                     <td>${habit.habit}</td>
                     <td>${habit.type}</td>
                     <td><input type="checkbox"  data-index="${index}" ${
        habit.isChecked ? "checked" : ""
      }></td>
      <td><span class="edit-btn" data-index="${index}"><img src="./edit.png"></span></td>
      <td><span class="delete-btn" data-index="${index}"><img src="./delete.png"></span></td>
                   </tr>`;
      tbody.innerHTML += row;

      //addCheckboxListeners();
    });
  } else {
    habits.forEach((habit, index) => {
      const row = `<tr>
                       <td>${habit.habit}</td>
                       <td>${habit.type}</td>
                       <td><input type="checkbox"  data-index="${index}"></td>
      <td><span class="edit-btn" data-index="${index}"><img src="./edit.png"></span></td>
      <td><span class="delete-btn" data-index="${index}"><img src="./delete.png"></span></td>
                     </tr>`;
      tbody.innerHTML += row;

      //addCheckboxListeners();
    });
  }
}

// adds a new habit to the table
function addHabit() {
  let habitDetail = document.getElementById("habit-info").value;
  let habitType = document.getElementById("habit-type").value;
  if (habitDetail && habitType) {
    const habits = loadFromLocalStorage();
    habits.push({ habit: habitDetail, type: habitType, isChecked: false }); // Add new habit
    saveToLocalStorage(habits); // Save updated list to localStorage
    renderTable(); // Re-render the table

    // Clear input fields
    document.getElementById("habit-info").value = "";
    document.getElementById("habit-type").value = "";
    document.getElementById("popup").classList.toggle("hidden");
  } else {
    alert("Please fill in both fields!");
  }
}

function getCurrentDate() {
  const currentDate = new Date();

  // Get the current date in YYYY-MM-DD format
  const year = currentDate.getFullYear();
  const month = String(currentDate.getMonth() + 1).padStart(2, "0"); // Months are zero-based
  const day = String(currentDate.getDate()).padStart(2, "0");
  const formattedDate = `${day}-${month}-${year}`;
  return formattedDate;
}

// displays the current day and date for the user
function setTodaysDate() {
  const pDate = document.getElementById("date");

  const currentDate = new Date();

  // Get the current date in YYYY-MM-DD format
  const year = currentDate.getFullYear();
  const month = String(currentDate.getMonth() + 1).padStart(2, "0"); // Months are zero-based
  const day = String(currentDate.getDate()).padStart(2, "0");
  const formattedDate = `${day}-${month}-${year}`;

  // Get the name of the day
  const daysOfWeek = [
    "Sunday",
    "Monday",
    "Tuesday",
    "Wednesday",
    "Thursday",
    "Friday",
    "Saturday",
  ];
  const dayName = daysOfWeek[currentDate.getDay()];

  pDate.innerText = `${dayName} ${formattedDate}`;
  localStorage.setItem("date", formattedDate);
}

document
  .querySelector('[data-handler="show_popup"]')
  .addEventListener("click", () =>
    document.getElementById("popup").classList.toggle("hidden")
  );

document
  .querySelector('[data-handler="hide_popup"]')
  .addEventListener("click", () =>
    document.getElementById("popup").classList.toggle("hidden")
  );

// adds event listener to update habit status
function addCheckboxListeners() {
  const checkboxes = document.querySelectorAll("input[type='checkbox']");
  checkboxes.forEach((checkbox) => {
    checkbox.addEventListener("change", (event) => {
      const index = event.target.getAttribute("data-index"); // Get the habit index
      const habits = loadFromLocalStorage();
      habits[index].isChecked = event.target.checked; // Update the isChecked property
      saveToLocalStorage(habits); // Save the updated data to localStorage
    });
  });
}

function addEditEventListener() {
  document.querySelectorAll(".edit-btn").forEach((span) => {
    span.addEventListener("mouseclick", (event) => {
      makeCellEditable(
        span.parentElement.parentElement,
        event.getAttribute(data - index)
      );
    });
  });
}

tbody.addEventListener("click", (event) => {
  if (event.target.closest(".edit-btn")) {
    const editBtn = event.target.closest(".edit-btn");
    const index = editBtn.getAttribute("data-index");
    const row = editBtn.closest("tr");

    // Get the current values
    const habitCell = row.querySelector("td:nth-child(1)");
    const typeCell = row.querySelector("td:nth-child(2)");

    const habitValue = habitCell.textContent;
    const typeValue = typeCell.textContent;

    // Replace text with input fields
    habitCell.innerHTML = `<input type="text" value="${habitValue}" class="edit-input">`;
    typeCell.innerHTML = `<input type="text" value="${typeValue}" class="edit-input">`;

    // Change the edit button to a save button
    editBtn.innerHTML = `<img src="./save.png">`;
    editBtn.classList.remove("edit-btn");
    editBtn.classList.add("save-btn");
  }
});

tbody.addEventListener("click", (event) => {
  if (event.target.closest(".save-btn")) {
    const habits = loadFromLocalStorage();
    const saveBtn = event.target.closest(".save-btn");
    const index = saveBtn.getAttribute("data-index");
    const row = saveBtn.closest("tr");

    // Get the updated values from the input fields
    const habitInput = row.querySelector("td:nth-child(1) .edit-input");
    const typeInput = row.querySelector("td:nth-child(2) .edit-input");

    const updatedHabit = habitInput.value;
    const updatedType = typeInput.value;

    // Update the habits array
    habits[index].habit = updatedHabit;
    habits[index].type = updatedType;

    saveToLocalStorage(habits);

    // Re-render the table
    renderTable();

    // Optionally, log the updated habits array
    console.log("Updated Habits:", habits);
  }
});

document.getElementById("habitsBody").addEventListener("click", (event) => {
  if (event.target.closest(".delete-btn")) {
    const index = event.target
      .closest(".delete-btn")
      .getAttribute("data-index");
    const habits = loadFromLocalStorage();

    if (index >= 0 && index < habits.length) {
      habits.splice(index, 1);
      saveToLocalStorage(habits);
      renderTable();
    }
  }
});

tbody.addEventListener("change", (event) => {
  if (event.target.matches('input[type="checkbox"]')) {
    const habits = loadFromLocalStorage();
    const checkbox = event.target;
    const index = checkbox.getAttribute("data-index");

    // Update the isChecked property in the habits array
    habits[index].isChecked = checkbox.checked;
    saveToLocalStorage(habits);

    // Optionally, log the updated habits array
    console.log("Updated Habits:", habits);
  }
});

setTodaysDate();
renderTable();
