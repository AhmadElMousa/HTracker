// saves user habits from local storage
function saveToLocalStorage(habits) {
  localStorage.setItem("habits", JSON.stringify(habits));
}

// loads user habits from local storage
function loadFromLocalStorage() {
  return JSON.parse(localStorage.getItem("habits")) || [];
}

// renders the habits table after user adds a habit or on load
function renderTable() {
  const habits = loadFromLocalStorage();
  const date = localStorage.getItem("date");
  const tbody = document.querySelector("table tbody");
  tbody.innerHTML = "";

  if (date === getCurrentDate()) {
    habits.forEach((habit, index) => {
      const row = `<tr>
                     <td>${habit.habit}</td>
                     <td>${habit.type}</td>
                     <td><input type="checkbox"  data-index="${index}" ${
        habit.isChecked ? "checked" : ""
      }></td>
                   </tr>`;
      tbody.innerHTML += row;

      addCheckboxListeners();
    });
  }else{
    habits.forEach((habit, index) => {
        const row = `<tr>
                       <td>${habit.habit}</td>
                       <td>${habit.type}</td>
                       <td><input type="checkbox"  data-index="${index}"></td>
                     </tr>`;
        tbody.innerHTML += row;
  
        addCheckboxListeners();
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

setTodaysDate();
renderTable();
