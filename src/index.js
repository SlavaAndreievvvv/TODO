'use strict';

const CACHE_KEY = 'todos';
const LIST_ID = 'todo-list';
const $inputAddTodo = document.querySelector('[name="todo"]');
const $buttonAddTodo = document.querySelector('#add');
const $buttonAddImgTodo = document.querySelector('.button__plus')
const $todoList = document.querySelector('#todo-list');
const $section = document.querySelector('#section-todo')


$inputAddTodo.addEventListener('input', highlightButton);
function highlightButton() {
  if ($inputAddTodo.value.length >= 1) {
    $buttonAddTodo.classList.add('active');
    $buttonAddImgTodo.classList.add('active');
  }
  else {
    $buttonAddTodo.classList.remove('active');
    $buttonAddImgTodo.classList.remove('active');
  }
}
function saveToCache(todos) {
  localStorage.setItem(CACHE_KEY, JSON.stringify(todos));
  return todos;
}

function getCacheData() {
  const data = localStorage.getItem(CACHE_KEY);
  return JSON.parse(data || "[]");
}

function getTodoIdxDyId(todos, id) {
  return todos.findIndex((item) => item.id === id);
}

function editCacheTodo(id, newData) {
  const todos = getCacheData();
  const idx = getTodoIdxDyId(todos, id);
  if (idx >= 0) {
    todos[idx] = { ...todos[idx], ...newData };
  }
  saveToCache(todos);
}

function removeCacheTodo(id) {
  const todos = getCacheData();
  const idx = getTodoIdxDyId(todos, id);
  if (idx >= 0) {
    todos.splice(idx, 1);
  }
  saveToCache(todos);
}

async function fetchTodos() {
  const res = await fetch('https://jsonplaceholder.typicode.com/todos');
  return res.json();
}

async function getOrFetchTodo() {
  const cache = getCacheData();
  if (cache.length) {
    return cache;
  }
  const data = await fetchTodos();
  return saveToCache(data);
}

function toggleTodoElement($todo, checked) {
  $todo.style.backgroundColor = checked ? "#D7DCFF" : "white";
  const $input = $todo.querySelector("input");
  $input.checked = checked;
}

function generalListItem ({id, title, completed}) {

  const $div = document.createElement('div');
  const $name = document.createElement('p');
  const $action = document.createElement('div');
  const $checkbox = document.createElement('label');
  const $toggle = document.createElement('input');
  const $span = document.createElement('span');
  const $delete = document.createElement('button');

  $div.append($name);
  $checkbox.append($toggle, $span);
  $action.append($checkbox, $delete)
  $div.append($action); 

  $div.classList.add('task');
  $action.classList.add('task__action');
  $checkbox.classList.add('checkbox');
  $toggle.classList.add('checkbox__input');
  $span.classList.add('checkbox__button');
  $delete.classList.add('button-remove');
  $name.classList.add('task__name');

  $div.dataset.id = id;
  $toggle.setAttribute("type", "checkbox");
  $toggle.checked = completed;
  $name.innerText = title;
  $span.innerHTML = `
  <svg
    class="checkbox__icon"
    viewBox="0 0 14 14"
    xmlns="http://www.w3.org/2000/svg"
  >
    <path
      fill-rule="evenodd"
      clip-rule="evenodd"
      d="M12.0791 3.08754C12.307 3.31535 12.307 3.68469 12.0791 3.9125L5.66248 10.3292C5.43467 10.557 5.06533 10.557 4.83752 10.3292L1.92085 7.4125C1.69305 7.18469 1.69305 6.81535 1.92085 6.58754C2.14866 6.35974 2.51801 6.35974 2.74581 6.58754L5.25 9.09173L11.2542 3.08754C11.482 2.85974 11.8513 2.85974 12.0791 3.08754Z"
    />
  </svg>
`
  $delete.innerHTML = `
  <svg
    class="button-remove__img"
    viewBox="0 0 16 18"
    fill="none"
    xmlns="http://www.w3.org/2000/svg"
  >
    <path
      d="M3 18C2.45 18 1.97933 17.8043 1.588 17.413C1.196 17.021 1 16.55 1 16V3C0.716667 3 0.479 2.90433 0.287 2.713C0.0956668 2.521 0 2.28333 0 2C0 1.71667 0.0956668 1.479 0.287 1.287C0.479 1.09567 0.716667 1 1 1H5C5 0.716667 5.096 0.479 5.288 0.287C5.47933 0.0956666 5.71667 0 6 0H10C10.2833 0 10.521 0.0956666 10.713 0.287C10.9043 0.479 11 0.716667 11 1H15C15.2833 1 15.5207 1.09567 15.712 1.287C15.904 1.479 16 1.71667 16 2C16 2.28333 15.904 2.521 15.712 2.713C15.5207 2.90433 15.2833 3 15 3V16C15 16.55 14.8043 17.021 14.413 17.413C14.021 17.8043 13.55 18 13 18H3ZM3 3V16H13V3H3ZM5 13C5 13.2833 5.096 13.5207 5.288 13.712C5.47933 13.904 5.71667 14 6 14C6.28333 14 6.521 13.904 6.713 13.712C6.90433 13.5207 7 13.2833 7 13V6C7 5.71667 6.90433 5.479 6.713 5.287C6.521 5.09567 6.28333 5 6 5C5.71667 5 5.47933 5.09567 5.288 5.287C5.096 5.479 5 5.71667 5 6V13ZM9 13C9 13.2833 9.096 13.5207 9.288 13.712C9.47933 13.904 9.71667 14 10 14C10.2833 14 10.521 13.904 10.713 13.712C10.9043 13.5207 11 13.2833 11 13V6C11 5.71667 10.9043 5.479 10.713 5.287C10.521 5.09567 10.2833 5 10 5C9.71667 5 9.47933 5.09567 9.288 5.287C9.096 5.479 9 5.71667 9 6V13Z"
    />
  </svg>
`
  toggleTodoElement($div, completed);

  $toggle.addEventListener('change', (e) => {
    const { checked } = e.target;
    editCacheTodo(id, { completed: checked });
    toggleTodoElement($div, checked);
  });

  $delete.addEventListener('click', () => {

    const $popupWrapper = document.createElement('div');
    const $popup = document.createElement('div');
    const $text = document.createElement('p');
    const $hide = document.createElement('button');
    const $wrapper = document.createElement('div');
    const $cancel = document.createElement('button');
    const $delete = document.createElement('button');

    $popupWrapper.classList.add('popup__box');
    $popup.classList.add('popup');
    $text.classList.add('popup__text');
    $hide.classList.add('button-hide');
    $wrapper.classList.add('popup__wrapper');
    $cancel.classList.add('popup__button', 'popup__button--primary');
    $delete.classList.add('popup__button', 'popup__button--secondary');

    $hide.innerHTML = `
            <svg
              class="button-hide__icon"
              width="10"
              height="10"
              viewBox="0 0 10 10"
              xmlns="http://www.w3.org/2000/svg"
            >
              <path
                fill-rule="evenodd"
                clip-rule="evenodd"
                d="M9.47157 1.47141C9.73192 1.21107 9.73192 0.788955 9.47157 0.528606C9.21122 0.268256 8.78911 0.268256 8.52876 0.528606L5.00016 4.0572L1.47157 0.528606C1.21122 0.268256 0.789108 0.268256 0.528758 0.528606C0.268409 0.788955 0.268409 1.21107 0.528758 1.47141L4.05735 5.00001L0.528758 8.52861C0.268409 8.78896 0.268409 9.21107 0.528758 9.47141C0.789108 9.73176 1.21122 9.73176 1.47157 9.47141L5.00016 5.94282L8.52876 9.47141C8.78911 9.73176 9.21122 9.73176 9.47157 9.47141C9.73192 9.21107 9.73192 8.78896 9.47157 8.52861L5.94297 5.00001L9.47157 1.47141Z"
              />
            </svg>
    `
    $text.innerText = 'Do you really want to delete this task?';
    $cancel.innerText = 'No';
    $delete.innerText = 'Yes';
    $wrapper.append($cancel, $delete);
    $popup.append($text, $hide, $wrapper);
    $popupWrapper.append($popup);

    $section.prepend($popupWrapper);

    $hide.addEventListener('click', () => {
      $popupWrapper.remove();
    })
    $cancel.addEventListener('click', () => {
      $popupWrapper.remove();
    })
    $delete.addEventListener('click', () => {
      removeCacheTodo(id);
      $div.remove();
      $popupWrapper.remove();
    })
    });

    return $div;
}

function addNewTodo(title) {
  const newTodo = {
    id: Date.now(),
    title,
    completed: false
  };
  saveToCache([newTodo, ...getCacheData()]);
  const $todoList = document.getElementById(LIST_ID);
  const $newTodoItem = generalListItem(newTodo);
  $newTodoItem.style.backgroundColor = "#ECFFFA";
  setTimeout(() => {
    $newTodoItem.style.backgroundColor = null;
  }, 10000);
  $todoList.prepend($newTodoItem);
}

function renderTodoList(data) {
  const $todos = data.map(generalListItem);
  const $todoList = document.getElementById(LIST_ID);
  $todoList.replaceChildren(...$todos);
}

function onFormSubmit(event) {
  event.preventDefault();
  addNewTodo($inputAddTodo.value);
  this.reset();
}

const installTodoApp = async () => {
  const todos = await getOrFetchTodo();
  renderTodoList(todos);
  const $form = document.getElementById('form');
  $form.addEventListener('submit', onFormSubmit);
}

installTodoApp();



