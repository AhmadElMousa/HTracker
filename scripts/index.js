// saves user habits from local storage
function saveToLocalStorage(habits) {
  localStorage.setItem("habits", JSON.stringify(habits));
}

// loads user habits from local storage
function loadFromLocalStorage() {
  return JSON.parse(localStorage.getItem("habits")) || [];
}

const tbody = document.getElementById("habitsBody");
const habitsDiv = document.getElementById("habits-div");

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
    });
  }
}

// renders the habits table using divs instead of a table after user adds a habit or on load
function renderTableWithDiv() {
  const habits = loadFromLocalStorage();
  const date = localStorage.getItem("date");
  habitsDiv.innerHTML = "";

  if (date === getCurrentDate()) {
    habits.forEach((habit, index) => {
      const row = `<div class="habit ${
        habit.isChecked ? "habit-checked" : "habit-unchecked"
      }" data-index="${index}">
            <p>${habit.habit}</p>
            <input ${
              habit.isChecked ? "checked" : ""
            } type="checkbox" class="switch" />
            <span class="edit-btn"><img src="./edit.png" /></span>
            <span class="delete-btn"><img src="./delete.png" /></span>
          </div>`;
      console.dir(habit);
      habitsDiv.innerHTML += row;

      //addCheckboxListeners();
    });
  } else {
    localStorage.setItem("date", getCurrentDate());
    habits.forEach((habit, index) => {
      const row = `<div class="habit habit-unchecked" data-index="${index}">
            <p>${habit.habit}</p>
            <input type="checkbox" class="switch" />
            <span class="edit-btn"><img src="./edit.png" /></span>
            <span class="delete-btn"><img src="./delete.png" /></span>
          </div>`;
      habitsDiv.innerHTML += row;
    });
  }
}

// adds a new habit to the table
function addHabit() {
  let habitDetail = document.getElementById("habit-info").value;
  if (habitDetail) {
    const habits = loadFromLocalStorage();
    habits.push({ habit: habitDetail, isChecked: false }); // Add new habit
    saveToLocalStorage(habits); // Save updated list to localStorage
    renderTableWithDiv(); // Re-render the table

    // Clear input fields
    document.getElementById("habit-info").value = "";
    document.getElementById("popup").classList.toggle("hidden");
  } else {
    alert("Please fill in both fields!");
  }
}

// gets the current date in dd-MM-yyyy format
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

  // adds event listener for edit button 
habitsDiv.addEventListener("click", (event) => {
  if (event.target.closest(".edit-btn")) {
    const editBtn = event.target.closest(".edit-btn");
    const index = editBtn.getAttribute("data-index");
    const row = editBtn.parentElement.closest("div");

    // Get the current values
    const habitCell = row.querySelector("p");

    const habitValue = habitCell.textContent;

    // Replace text with input fields
    habitCell.innerHTML = `<input type="text" value="${habitValue}" class="edit-input">`;

    // Change the edit button to a save button
    editBtn.innerHTML = `<img src="./save.png">`;
    editBtn.classList.remove("edit-btn");
    editBtn.classList.add("save-btn");
  }
});

  // adds event listener for save button which appears when the user is editing a habit 
habitsDiv.addEventListener("click", (event) => {
  if (event.target.closest(".save-btn")) {
    const habits = loadFromLocalStorage();
    const saveBtn = event.target.closest(".save-btn");
    const index = saveBtn.parentElement.getAttribute("data-index");
    const row = saveBtn.closest("div");

    // Get the updated values from the input fields
    const habitInput = row.querySelector("p .edit-input");

    const updatedHabit = habitInput.value;

    // Update the habits array
    habits[index].habit = updatedHabit;

    saveToLocalStorage(habits);

    // Re-render the table
    renderTableWithDiv();

    // Optionally, log the updated habits array
    console.log("Updated Habits:", habits);
  }
});

  // adds event listener for delete button 
document.getElementById("habits-div").addEventListener("click", (event) => {
  if (event.target.closest(".delete-btn")) {
    const index = event.target.parentElement
      .closest(".delete-btn")
      .getAttribute("data-index");
    const habits = loadFromLocalStorage();

    if (index >= 0 && index < habits.length) {
      habits.splice(index, 1);
      saveToLocalStorage(habits);
      renderTableWithDiv();
    }
  }
});

  // adds event listener for checkbox button 
habitsDiv.addEventListener("change", (event) => {
  if (event.target.matches('input[type="checkbox"]')) {
    const habits = loadFromLocalStorage();
    const checkbox = event.target;
    const index = checkbox.parentElement.dataset.index;
    checkbox.parentElement.classList.toggle("habit-checked", checkbox.checked);
    checkbox.parentElement.classList.toggle(
      "habit-unchecked",
      !checkbox.checked
    );

    // Update the isChecked property in the habits array
    habits[index].isChecked = checkbox.checked;
    saveToLocalStorage(habits);
    // Optionally, log the updated habits array
    console.log("Updated Habits:", habits);
  }
});

setTodaysDate();
renderTableWithDiv();
