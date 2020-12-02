const todoTitleInput = document.querySelector("#todoTitle");
const addTodoForm = document.querySelector("#addTodoForm");
const todoListOutput = document.querySelector("#todoList");

let allTodoList = [];

function start() {
  addTodoForm.addEventListener("submit", handleAddTodo);
  todoTitleInput.focus();
  getTodoListFromLocalStorage();
  renderTodoList();
}

function handleAddTodo(event) {
  event.preventDefault();
  const title = todoTitleInput.value.trim();
  if (!!title) {
    allTodoList.push({ title, isDone: false });
    todoTitleInput.value = "";
    renderTodoList();
  } else {
    todoTitleInput.focus();
  }
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
      <button type="button" id="del_item-${itemIndex}" class="btn btn-delete"> <i class="far fa-trash-alt"></i> </button>
    </li>
  `;
}

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
    const delButton = document.querySelector(`#del_item-${i}`);
    checkbox.addEventListener("input", handleCompleteTodo);
    delButton.addEventListener("click", handleDeleteTodo);
  });

  setTodoListToLocalStorage();
}

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

start();
