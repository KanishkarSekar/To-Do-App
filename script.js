const inputBox = document.getElementById("input-box");
const addBtn = document.getElementById("add-btn");
const listContainer = document.getElementById("list-container");
const taskCount = document.getElementById("task-count");
const emptyMessage = document.getElementById("empty-message");

// Edit modal elements
const editModal = document.getElementById("edit-modal");
const editInput = document.getElementById("edit-input");
const saveBtn = document.getElementById("save-btn");
const cancelBtn = document.getElementById("cancel-btn");
const closeModalBtn = document.getElementById("close-modal");

// Load tasks from localStorage
let tasks = JSON.parse(localStorage.getItem("myTasks")) || [];

// Currently editing task ID
let editingTaskId = null;

// Save tasks to localStorage
function saveTasks() {
    localStorage.setItem("myTasks", JSON.stringify(tasks));
}

// Display tasks
function showTasks() {
    listContainer.innerHTML = "";

    tasks.forEach(task => {
        const li = document.createElement("li");

        // Create label
        const label = document.createElement("label");
        label.className = "task-label";

        // Create checkbox
        const checkbox = document.createElement("input");
        checkbox.type = "checkbox";
        checkbox.checked = task.completed;

        // Create task text
        const span = document.createElement("span");
        span.textContent = task.text;

        // Create Edit button
        const editBtn = document.createElement("button");
        editBtn.className = "edit-btn";
        editBtn.textContent = "Edit";

        // Create Delete button
        const deleteBtn = document.createElement("button");
        deleteBtn.className = "delete-btn";
        deleteBtn.textContent = "×";
        deleteBtn.title = "Delete task";

        // Checkbox functionality
        checkbox.addEventListener("change", function () {
            task.completed = checkbox.checked;
            saveTasks();
            showTasks();
        });

        // Edit functionality - open modal
        editBtn.addEventListener("click", function () {
            openEditModal(task);
        });

        // Delete functionality
        deleteBtn.addEventListener("click", function () {
            tasks = tasks.filter(t => t.id !== task.id);
            saveTasks();
            showTasks();
        });

        // Append elements
        label.appendChild(checkbox);
        label.appendChild(span);

        li.appendChild(label);
        li.appendChild(editBtn);
        li.appendChild(deleteBtn);

        listContainer.appendChild(li);
    });

    updateCount();

    // Show or hide empty message
    emptyMessage.style.display =
        tasks.length === 0 ? "block" : "none";
}

// Open edit modal
function openEditModal(task) {
    editingTaskId = task.id;

    editInput.value = task.text;
    editModal.classList.add("active");

    // Focus input after modal opens
    setTimeout(() => {
        editInput.focus();
        editInput.select();
    }, 100);
}

// Close edit modal
function closeEditModal() {
    editingTaskId = null;
    editModal.classList.remove("active");
    editInput.value = "";
}

// Save edited task
function saveEditedTask() {
    const newText = editInput.value.trim();

    if (newText === "") {
        editInput.placeholder = "Please enter a task name";
        editInput.focus();
        return;
    }

    // Find task and update it
    const task = tasks.find(t => t.id === editingTaskId);

    if (task) {
        task.text = newText;
        saveTasks();
        showTasks();
    }

    closeEditModal();
}

// Add new task
function addTask() {
    const text = inputBox.value.trim();

    if (text === "") {
        alert("Please enter a task!");
        inputBox.focus();
        return;
    }

    const newTask = {
        id: Date.now() + Math.random(),
        text: text,
        completed: false
    };

    tasks.push(newTask);

    saveTasks();
    showTasks();

    inputBox.value = "";
    inputBox.focus();
}

// Update task counter
function updateCount() {
    const completed = tasks.filter(task => task.completed).length;
    const total = tasks.length;

    taskCount.textContent = `${completed}/${total} completed`;
}

// Add task button
addBtn.addEventListener("click", addTask);

// Enter key to add task
inputBox.addEventListener("keydown", function (event) {
    if (event.key === "Enter") {
        addTask();
    }
});

// Save changes button
saveBtn.addEventListener("click", saveEditedTask);

// Cancel button
cancelBtn.addEventListener("click", closeEditModal);

// Close icon
closeModalBtn.addEventListener("click", closeEditModal);

// Enter key to save edits
editInput.addEventListener("keydown", function (event) {
    if (event.key === "Enter") {
        saveEditedTask();
    }
});

// Close modal when clicking outside the box
editModal.addEventListener("click", function (event) {
    if (event.target === editModal) {
        closeEditModal();
    }
});

// Close modal using Escape key
document.addEventListener("keydown", function (event) {
    if (event.key === "Escape" && editModal.classList.contains("active")) {
        closeEditModal();
    }
});

// Display saved tasks on page load
showTasks();