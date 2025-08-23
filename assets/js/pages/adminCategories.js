/**
 * Admin: Categories page
 *
 * CRUD operations for product categories with real-time updates.
 *
 */
import {
  db,
  collection,
  doc,
  addDoc,
  updateDoc,
  deleteDoc,
  onSnapshot,
  getDoc,
  serverTimestamp,
  query,
} from "../main.js";
import { qs, qsa, setText } from "../main.js";
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
function watchCategories() {
  const q2 = query(categoriesCol);
  return onSnapshot(q2, (snap) => {
    els.tbody.innerHTML = "";
    snap.forEach((docu) => {
      const tr = renderCategory({ id: docu.id, ...docu.data() });
      els.tbody.appendChild(tr);
    });
  });
}
function attachTableEvents() {
  els.tbody.addEventListener("click", async (e) => {
    const btn = e.target.closest("button");
    if (!btn) return;
    const id = btn.dataset.id;
    if (btn.classList.contains("edit")) {
      prefillCategoryForm(id);
    } else if (btn.classList.contains("delete")) {
      if (confirm("Delete this category?")) {
        await deleteDoc(doc(db, "categories", id));
      }
    }
  });
}
export async function prefillCategoryForm(id) {
  const ref = doc(db, "categories", id);
  const snap = await getDoc(ref);
  if (!snap.exists()) return;
  const p = snap.data();
  els.form.categoryId.value = id;
  els.form.name.value = p.name || "";
  setText(els.submitBtn, "Update Category");
}
window.prefillCategoryForm = prefillCategoryForm;
function resetForm() {
  // UX
  els.form.reset();
  els.submitBtn.textContent = "Add Category";
  els.form.categoryId.value = "";
}
async function handleSubmit(e) {
  e.preventDefault();
  const fd = new FormData(els.form);
  const id = fd.get("categoryId");
  const data = {
    name: fd.get("name").trim(),
    updatedAt: serverTimestamp(),
  };
  if (id) {
    await updateDoc(doc(db, "categories", id), data);
  } else {
    await addDoc(collection(db, "categories"), {
      ...data,
      createdAt: serverTimestamp(),
    });
  }
  resetForm();
}
export function initAdminCategories() {
  if (!els.form || !els.tbody) return;
  els.form.addEventListener("submit", handleSubmit);
  els.form.addEventListener("reset", resetForm);
  watchCategories();
  attachTableEvents();
}
initAdminCategories();
