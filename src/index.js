'use strict';
//SELECTORS
const $inputTodo = document.querySelector('[name="todo"]');
const $buttonTodo = document.querySelector('#add');
const $buttonImgTodo = document.querySelector('.button__plus')
const $todoList = document.querySelector('#todo-list');

//EVENT LISTENERS
window.addEventListener('DOMContentLoaded', getTodos);
$buttonTodo.addEventListener('click', addTodo);
$todoList.addEventListener('click', deleteCheck);
$inputTodo.addEventListener('input', highlightButton);

//FUNCTIONS
function highlightButton() {
  if ($inputTodo.value.length >= 1) {
    $buttonTodo.classList.add('active');
    $buttonImgTodo.classList.add('active');
  }
  else {
    $buttonTodo.classList.remove('active');
    $buttonImgTodo.classList.remove('active');
  }
}


function addTodo(event) {
  event.preventDefault();
  //CREATE DIV
  const $todoDiv = document.createElement('div');
  $todoDiv.classList.add('task');
  //CREATE P
  const $todoName = document.createElement('p');
  $todoName.classList.add('task__name');
  $todoName.innerText = $inputTodo.value;
  $todoDiv.append($todoName);


  const $action = document.createElement('div');
  $action.classList.add('task__action');
  //CHECK MARK BUTTON
  const $checkbox = document.createElement('label');
  $checkbox.classList.add('checkbox');
  const $completedButton = document.createElement('input');
  $completedButton.setAttribute("type", "checkbox");
  $completedButton.classList.add('checkbox__input');
  const $span = document.createElement('span');
  $span.classList.add('checkbox__button');
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
  //CHECK DELETE BUTTON
  const $deleteButton = document.createElement('button');
  $deleteButton.classList.add('button-remove');
  $deleteButton.innerHTML = `
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
  $todoDiv.style.backgroundColor = '#ECFFFA';
  $todoDiv.style.transition = 'background-color .3s ease';
  setTimeout(() => {
    $todoDiv.style.backgroundColor = null;
  }, 10000);
  $checkbox.append($completedButton, $span);
  $action.append($checkbox, $deleteButton)
  $todoDiv.append($action);

  //ADD TODO TO LOCALSTORAGE
  saveLocalTodos($inputTodo.value);

  //APPEND TO LIST
  $todoList.appendChild($todoDiv);
  $inputTodo.value = '';
  $inputTodo.focus();
}

function deleteCheck(e) {
  const item = e.target;
  //DELETE TODO
  if (item.classList[0] === 'button-remove'){
    const todo = item.closest('.task')
    todo.classList.add('fall');
    removeLocalTodos(todo);
    todo.addEventListener('transitionend', function( ) {
      todo.remove();
    })
  }
  //CHECK TODO
  if (item.classList[0] === 'checkbox__input') {
    const todo = item.closest('.task');
    todo.classList.toggle('done');
  };
};

function saveLocalTodos(todo) {
  //CHECK
  let todos;
  if (localStorage.getItem('todos') === null) {
    todos = [];
  }
  else {
    todos = JSON.parse(localStorage.getItem('todos')); 
  }
  todos.push(todo);
  localStorage.setItem('todos', JSON.stringify(todos));
}

function getTodos() {
  let todos;
  if (localStorage.getItem('todos') === null) {
    todos = [];
  }
  else {
    todos = JSON.parse(localStorage.getItem('todos')); 
  }
  todos.forEach((todo) => {
    const $todoDiv = document.createElement('div');
      $todoDiv.classList.add('task');
      //CREATE P
      const $todoName = document.createElement('p');
      $todoName.classList.add('task__name');
      $todoName.innerText = todo;
      $todoDiv.append($todoName);


      const $action = document.createElement('div');
      $action.classList.add('task__action');
      //CHECK MARK BUTTON
      const $checkbox = document.createElement('label');
      $checkbox.classList.add('checkbox');
      const $completedButton = document.createElement('input');
      $completedButton.setAttribute("type", "checkbox");
      $completedButton.classList.add('checkbox__input');
      const $span = document.createElement('span');
      $span.classList.add('checkbox__button');
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
      //CHECK DELETE BUTTON
      const $deleteButton = document.createElement('button');
      $deleteButton.classList.add('button-remove');
      $deleteButton.innerHTML = `
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
      // $todoDiv.style.backgroundColor = '#ECFFFA';
      // $todoDiv.style.transition = 'background-color .3s ease';
      // setTimeout(() => {
      //   $todoDiv.style.backgroundColor = null;
      // }, 10000);
      $checkbox.append($completedButton, $span);
      $action.append($checkbox, $deleteButton)
      $todoDiv.append($action);

      //APPEND TO LIST
      $todoList.appendChild($todoDiv);
  });
}

function removeLocalTodos(todo) {
  let todos;
  if (localStorage.getItem('todos') === null) {
    todos = [];
  }
  else {
    todos = JSON.parse(localStorage.getItem('todos')); 
  }
  const todoIndex = todo.children[0].innerText;
  todos.splice(todos.indexOf(todoIndex), 1);
  localStorage.setItem('todos', JSON.stringify(todos)); 
}