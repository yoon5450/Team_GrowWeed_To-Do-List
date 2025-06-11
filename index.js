import { insertLast, getNode } from "./lib/dom.js";
import { getStorage, setStorage } from "./lib/storage.js";

// save시 Prettier가 작동하도록 설정되어 있으면 아마도 한 줄로 다 엮어버릴 거에요.
// 저는 그냥 Shift + Alt + F 눌렀을 때만 작동하도록 설정해뒀습니다.

// 탭 상태를 보기 위한 전역 flag
let tabFlag = false;

let inputForm = getNode("#add-todo-form");
let inputToDoText = getNode("#add-todo-input");
let todoUl = getNode("#todo-list-ul");
let completeTabBtn = getNode("#select-complete-btn");
let incompleteTabBtn = getNode("#select-incomplete-btn");

// 윈도우가 로드 될 때 초기 실행
window.addEventListener("load", () => {
  init();
});

// 페이지가 로드되었을 때 실행
// localStorage에서 기존 todo 데이터를 불러와 목록 복원
function init() {
  let todoListArray = getStorage();
  todoListArray.forEach((element) => {
    element.date = new Date(element.date);
    if (tabFlag === element.complete) renderItem(element);
  });
}

// 할 일 클릭 이벤트
// 동적으로 생성된 요소들 이벤트 위임(todoList 자체가 동적으로 생성될 시 document에 이벤트)
// 김윤지
todoUl.addEventListener("click", (e) => {
  const id = e.target.closest("li.todo-list-cell").dataset.id;

  // 할 일 완료 이벤트
  if (e.target.closest(".todo-list-complete-btn")) {
    handleComplete(id);
    return;
  }

  // 할 일 제거 이벤트
  if (e.target.closest(".todo-list-optional")) {
    handleRemove(id);
  }
});

completeTabBtn.addEventListener("click", (e) => {
  if (!tabFlag) {
    moveToCompleteTab();
    completeTabBtn.classList.add("active-tab");
    incompleteTabBtn.classList.remove("active-tab");
  }
});

incompleteTabBtn.addEventListener("click", (e) => {
  if (tabFlag) {
    moveToInCompleteTab();
    incompleteTabBtn.classList.add("active-tab");
    completeTabBtn.classList.remove("active-tab");
  }
});

// 할 일 추가 이벤트
// Form에서 submit event 발생하면 동작(enter, +버튼)
// 김윤지
inputForm.addEventListener("submit", (e) => {
  // reload 방지
  e.preventDefault();
  handleAdd();
});

// 완료 탭으로 이동
// 성창식
function moveToCompleteTab() {
  tabFlag = true;
  todoUl.innerHTML = "";
  let todoListArray = getStorage();
  todoListArray
    .filter((item) => item.complete)
    .forEach((item) => {
      item.date = new Date(item.date);
      renderItem(item);
    });
}

// 미완료 탭으로 이동
// ImComplete -> InComplete로 변경
// 성창식
function moveToInCompleteTab() {
  tabFlag = false;
  todoUl.innerHTML = "";
  let todoListArray = getStorage();
  todoListArray
    .filter((item) => !item.complete)
    .forEach((item) => {
      item.date = new Date(item.date);
      renderItem(item);
    });
}

// 추가된 함수 : 버튼과 keydown 이벤트를 한번에 관리하기 위한 컨트롤러
function handleAdd() {
  // validation
  if (inputToDoText.value.trim() === "") {
    return;
  }

  // id : 난수 id, value : 입력값(Contents), itemObj : 아이템 객체, updated : 새로운 아이템 객체가 추가된 Array
  let id = self.crypto.randomUUID();
  let value = inputToDoText.value;
  let itemObj = createItemObject(id, value);

  addItemArray(itemObj);
  // 완료한 작업에서 입력 시에 방지.
  if(!tabFlag) renderItem(itemObj);
}

// 2. 새로운 할 일을 todoListArray에 객체 형태로 추가 + localStorage 저장
// 정소영
function addItemArray(todoListObj) {
  let todoListArray = getStorage();
  let updated = todoListArray.concat(todoListObj);
  inputToDoText.value = "";

  //localStorage 저장처리
  setStorage(updated);
}

// <ul> 안에서 항목을 클릭하면 실행됨
// 해당 항목을 제거하고, 배열에서도 삭제하며, localStorage 업데이트
function handleRemove(id) {
  removeItemArray(id);
  removeItem(id);
}

function handleComplete(id) {
  let updated = getCompleteTodoListArray(id);
  setStorage(updated);
  // removeItem 재사용
  removeItem(id);
}

// 추가된 함수 : 아이템 객체를 반환함.
function createItemObject(id, value) {
  return {
    id,
    contents: value,
    date: new Date(Date.now()),
    complete: false,
  };
}

// 추가된 함수 : Date에서 월, 일 format으로 출력
function dateFormat(date) {
  return `${date.getMonth() + 1}월 ${date.getDate()}일`;
}

// 오늘의 date를 format으로 받아오는 함수
// 손영웅
function getDate(){
	let now = new Date();
	let date = `${now.getMonth() + 1}월 ${now.getDate()}일`;

	return date;
}

// 추가된 함수 : 현재 시각과 targetDate와의 차이 비교해서 return
function getDateDiff(targetDate) {
  const now = new Date(); // 현재 시각
  const today = new Date(now.getFullYear(), now.getMonth(), now.getDate());

  const target = new Date(targetDate);
  const targetDateOnly = new Date(
    target.getFullYear(),
    target.getMonth(),
    target.getDate()
  );

  const diffTime = today - targetDateOnly;
  const diffDays = Math.floor(diffTime / (1000 * 60 * 60 * 24));

  if (diffDays < 1) return 0;
  else if (diffDays <= 3) return 1;
  else if (diffDays > 3) return 2;

  // 음수일 경우
  return "";
}

// 추가된 함수 : 해당 아이템 완료된 결과를 리턴하는 함수
function getCompleteTodoListArray(id) {
  let todoListArray = getStorage();
  let updated = todoListArray.map((el) =>
    el.id === id ? { ...el, complete: !el.complete } : el
  );
  return updated;
}

// `createItem`을 사용해 생성된 `<li>`를 `target` 요소의 맨 뒤에 추가함 (ul 목록 안에 li가 삽입되는 구조)
function renderItem(itemObj) {
  const createdLi = createItem(itemObj);
  insertLast(todoUl, createdLi);
}

// 할 일 항목을 문자열로 생성
// 항목이 늘어나 파라미터를 객체로 변경.
function createItem(itemObj) {
  // 작업 완료 상태, font-color class 정의
  const svgIcons = {
    false: `<svg width="24" height="24" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg">
  <path
    d="M12 2C6.48 2 2 6.48 2 12C2 17.52 6.48 22 12 22C17.52 22 22 17.52 22 12C22 6.48 17.52 2 12 2Z
       M12 20C7.59 20 4 16.41 4 12C4 7.59 7.59 4 12 4C16.41 4 20 7.59 20 12C20 16.41 16.41 20 12 20Z
       M16.59 7.58L10 14.17L7.41 11.59L6 13L10 17L18 9L16.59 7.58Z"
    fill="#9CE3A5"
  />
</svg>`,
    true: `<svg
  width="22"
  height="22"
  viewBox="0 0 22 22"
  xmlns="http://www.w3.org/2000/svg"
>
  <path
    d="M8.67 6.576L7.176 3.988L5.808 9.09L10.911 10.457L9.417 7.87C11.558 6.633 14.303 7.369 15.539 9.51C16.776 11.652 16.04 14.397 13.899 15.633C11.757 16.869 9.012 16.134 7.776 13.993L6.482 14.74C8.133 17.599 11.786 18.578 14.646 16.927C17.505 15.276 18.484 11.623 16.833 8.763C15.182 5.904 11.529 4.925 8.67 6.576Z"
    fill="#8C8C8C"
  />
  <circle
    cx="11"
    cy="11"
    r="10.5"
    stroke="#8C8C8C"
    stroke-width="1.5"
    fill="none"
  />
</svg>

    `,
  };

  const fontColorClasses = ["date-normal", "date-warm", "date-danger"];

  let DateDiffClass = tabFlag
    ? ""
    : fontColorClasses[getDateDiff(itemObj.date)];

  /* html */
  // closet(selector) 가장 근처에 있는 부모 요소를 가져온다.
  return `
    <li class="todo-list-cell" data-id='${itemObj.id}'>
            <div class="align-wrap">
              <button class="todo-list-complete-btn" >
              ${svgIcons[String(itemObj.complete)]}
              </button>
              <div class="todo-list-text">${itemObj.contents}</div>
            </div>
            <div class="align-wrap">
            <div class="todo-list-date ${DateDiffClass}">${dateFormat(
    itemObj.date
  )}</div>
            <button type="button" class="todo-list-optional">
              <svg
                width="20"
                height="20"
                viewBox="0 0 20 20"
                fill="none"
                xmlns="http://www.w3.org/2000/svg"
              >
                <path
                  d="M5 9V11H15V9H5ZM10 0C4.48 0 0 4.48 0 10C0 15.52 4.48 20 10 20C15.52 20 20 15.52 20 10C20 4.48 15.52 0 10 0ZM10 18C5.59 18 2 14.41 2 10C2 5.59 5.59 2 10 2C14.41 2 18 5.59 18 10C18 14.41 14.41 18 10 18Z"
                  fill="#FF6969"
                />
              </svg>
            </button>
            </div>
          </li>
    `;
}

// 해당 data-id를 가진 <li> 요소를 찾아 DOM에서 제거
function removeItem(id) {
  // 지금 전체에 li 1개당 1개 요소씩
  let todoNodeList = Array.from(todoUl.children);
  todoNodeList.forEach((todoNodeLi) => {
    if (todoNodeLi.dataset.id === id) {
      todoNodeLi.remove();
    }
  });
}

// 7. 배열에서 해당 id와 일치하는 항목을 제거 (filter 사용)
// 정소영
function removeItemArray(id) {
  let todoListArray = getStorage();
  let updated = todoListArray.filter((todoList) => todoList.id !== id);
  setStorage(updated);
}

// 추가된 함수 : 탭이 변경되었을 때 호출됨.
function renderTab() {
  todoUl.innerHTML = "";
  init();
}