// Global var definitions
const todoTitleInput = document.querySelector("#todoTitle");
const addTodoForm = document.querySelector("#addTodoForm");
const todoListOutput = document.querySelector("#todoList");

let allTodoList = [];
let isEditMode = false;
let selectedIndex = null;

// Main function ----------------
function start() {
  addTodoForm.addEventListener("submit", handleSubmitTodo);
  todoTitleInput.focus();
  getTodoListFromLocalStorage();
  renderTodoList();
}

// Actions functions ----------------

function handleSubmitTodo(e) {
  e.preventDefault();

  todoTitleInput.focus();
  const title = todoTitleInput.value.trim();

  if (!title) {
    clearInput();
    return;
  }

  if (isEditMode) {
    allTodoList[selectedIndex].title = title;
  } else {
    allTodoList.push({ title, isDone: false });
    todoTitleInput.value = "";
  }

  clearInput();
  renderTodoList();
}

function handleTodoUpdateMode(event) {
  event.preventDefault();
  const itemToUpdate = Number(event.currentTarget.id.split("-")[1]);
  todoTitleInput.value = allTodoList[itemToUpdate].title;
  selectedIndex = itemToUpdate;
  isEditMode = true;
  todoTitleInput.focus();
}

function handleDeleteTodo(event) {
  let confirmDelete = confirm("Você tem certeza que quer deletar a tarefa?");
  if (confirmDelete) {
    const itemToDeleteID = Number(event.currentTarget.id.split("-")[1]);
    allTodoList = allTodoList.filter((_, i) => i !== itemToDeleteID);
  }
  renderTodoList();
}

function handleCompleteTodo(event) {
  const itemToComplete = Number(event.target.id.split("-")[1]);
  allTodoList.forEach((todo, index) => {
    if (index === itemToComplete) {
      todo.isDone = !todo.isDone;
    }
  });
  renderTodoList();
}

function createTodoItemHTML(itemData, itemIndex) {
  const { title, isDone } = itemData;
  //prettier-ignore
  return `
    <li>
      <span class="todo-text ${isDone ? "completed" : ""}">
        <input type="checkbox" id="item-${itemIndex}" ${isDone ? "checked" : ""} />${title}</span>
      <div class="todo-list-controls">
        <button type="button" id="update_item-${itemIndex}" class="btn btn-update"> <i class="far fa-edit"></i> </button>
        <button type="button" id="del_item-${itemIndex}" class="btn btn-delete"> <i class="far fa-trash-alt"></i> </button>
      </div>  
    </li>
  `;
}

// Render funciton ----------------

function renderTodoList() {
  if (allTodoList.length === 0) {
    removeTodoListFromLocalStorage();
    return (todoListOutput.innerHTML =
      "<p class='info-message'>Nenhuma tarefa cadastrada.<p>");
  }

  let todoListHTML = allTodoList.map((item, i) => {
    return createTodoItemHTML(item, i);
  });

  todoListOutput.innerHTML = todoListHTML.join("");

  allTodoList.forEach((_, i) => {
    const checkbox = document.querySelector(`#item-${i}`);
    const deleteButton = document.querySelector(`#del_item-${i}`);
    const updateButton = document.querySelector(`#update_item-${i}`);
    checkbox.addEventListener("input", handleCompleteTodo);
    deleteButton.addEventListener("click", handleDeleteTodo);
    updateButton.addEventListener("click", handleTodoUpdateMode);
  });

  setTodoListToLocalStorage();
}

// Handle Local Storage ----------------

function getTodoListFromLocalStorage() {
  const localStorageList = JSON.parse(localStorage.getItem("todoList"));
  if (localStorageList) {
    allTodoList = localStorageList;
  }
}

function setTodoListToLocalStorage() {
  localStorage.setItem("todoList", JSON.stringify(allTodoList));
}

function removeTodoListFromLocalStorage() {
  localStorage.removeItem("todoList");
}

// Helper functions ----------------

function clearInput() {
  isEditMode = false;
  todoTitleInput.value = "";
}

// Execute main function when page loads
start();
