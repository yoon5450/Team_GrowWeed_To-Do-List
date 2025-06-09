import "./lib/dom.js"
import "./lib/storage.js"
import { getStorage } from "./lib/storage.js"

// save시 Prettier가 작동하도록 설정되어 있으면 아마도 한 줄로 다 엮어버릴 거에요. 
// 저는 그냥 Shift + Alt + F 눌렀을 때만 작동하도록 설정해뒀습니다.

let inputForm = document.querySelector('#add-todo-form')

// form submit 처리 방지
inputForm.addEventListener('submit', (e) => { 
    e.preventDefault();
})


// 완료 탭으로 이동
function moveToCompleteTab(){

}

// 미완료 탭으로 이동
function moveToImCompleteTab(){

}


// 할 일 항목을 문자열로 생성
function createItem(value, id){

}

// `createItem`을 사용해 생성된 `<li>`를 `target` 요소의 맨 뒤에 추가함 (ul 목록 안에 li가 삽입되는 구조)
function renderItem({target, value, id}){

}

// 해당 data-id를 가진 <li> 요소를 찾아 DOM에서 제거
function removeItem(id){

}

// 새로운 할 일을 todoListArray에 객체 형태로 추가
function addItemArray(id, value){

}

// 배열에서 해당 id와 일치하는 항목을 제거 (filter 사용)
function removeItemArray(id){

}

// <ul> 안에서 항목을 클릭하면 실행됨
// 해당 항목을 제거하고, 배열에서도 삭제하며, localStorage 업데이트
function handleRemove(e){

}


// 페이지가 로드되었을 때 실행
// localStorage에서 기존 todo 데이터를 불러와 목록 복원
function init(){

}