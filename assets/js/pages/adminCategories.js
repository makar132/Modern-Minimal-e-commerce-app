// adminCategories.js — placeholder
import {
  collection,
  doc,
  addDoc,
  setDoc,
  updateDoc,
  deleteDoc,
  onSnapshot,
  getDoc,
  getDocs,
  serverTimestamp,
  query,
  orderBy,
} from "../main.js";
import { qsa } from "../main.js";
const categoriesCol = collection(db, "categories");
const els = {
  tbody: document.getElementById("adminCategories"),
  form: document.getElementById("categoryForm"),
  submitBtn: document.querySelector("#categoryForm button[type='submit']"),
};
function renderCategory(category) {
  const tr = document.createElement("tr");
  tr.dataset.id = category.id;
  tr.innerHTML = `
    <td>${category.id}</td>
    <td>${category.name}</td>
    <td>
      <button class="btn btn-outline edit" data-id="${category.id}">Edit</button>
      <button class="btn btn-danger delete" data-id="${category.id}">Delete</button>
    </td>
  `;
  return tr;
}
export function initAdminCategories() {
  /* implement page wiring here */
}
