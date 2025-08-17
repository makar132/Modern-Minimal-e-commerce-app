/**
 * Admin: Products page
 *
 * CRUD operations for products; syncs with categories list.
 *
 */
// Admin products: full CRUD with real-time UI updates.
import {
  db,
  collection,
  doc,
  addDoc,
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
const productsCol = collection(db, "products");
const els = {
  tbody: document.getElementById("adminProducts"),
  form: document.getElementById("productForm"),
  submitBtn: document.querySelector("#productForm button[type='submit']"),
};

// Populate category <select> used in forms (has class 'category-select')
async function populateCategorySelects() {
  const selects = qsa("select.category-select");
  if (!selects.length) return;
  const q2 = query(collection(db, "categories"), orderBy("updatedAt", "asc"));
  const snap = await getDocs(q2);
  const options = [
    `<option value="" disabled selected hidden>Select a category</option>`,
  ];
  snap.forEach((doc) => {
    options.push(`<option value="${doc.id}">${doc.data().name}</option>`);
  });
  const html = options.join("");
  selects.forEach((sel) => (sel.innerHTML = html));
}

// Render table rows
function renderRow(id, data) {
  const tr = document.createElement("tr");
  tr.dataset.id = id;
  tr.innerHTML = `
    <td>${id}</td>
    <td>${data.name}</td>
    <td class="category" data-category-id="${data.category}"><${
    data.category
  }</td>
    <td>${Number(data.price).toFixed(2)}</td>
    <td>${data.stock ?? 0}</td>
    <td>
      <button class="btn btn-outline edit" data-id="${id}">Edit</button>
      <button class="btn btn-danger delete" data-id="${id}">Delete</button>
    </td>
  `;
  return tr;
}

// Prefill form
export async function prefillProductForm(id) {
  const ref = doc(db, "products", id);
  const snap = await getDoc(ref);
  if (!snap.exists()) return;
  const p = snap.data();
  els.form.productId.value = id;
  els.form.name.value = p.name || "";
  els.form.price.value = p.price || 0;
  els.form.category.value = p.category || "";
  els.form.description.value = p.description || "";
  els.form.stock.value = p.stock ?? 0;
  els.form.image.value = p.image || "";
  els.submitBtn.textContent = "Save Changes";
}
// Attach to window to support inline onclick if any HTML or innerHTML uses it
window.prefillProductForm = prefillProductForm;

// Submit handler (create or update)
async function handleSubmit(e) {
  e.preventDefault();
  const fd = new FormData(els.form);
  const id = fd.get("productId");
  const data = {
    name: fd.get("name").trim(),
    price: Number(fd.get("price")),
    category: fd.get("category"),
    description: fd.get("description").trim(),
    stock: Number(fd.get("stock")),
    image: fd.get("image").trim(),
    updatedAt: serverTimestamp(),
  };
  // Basic validation
  if (!data.name || !data.category || isNaN(data.price) || isNaN(data.stock)) {
    alert("Please fill all fields correctly.");
    return;
  }

  if (id) {
    await updateDoc(doc(db, "products", id), data);
  } else {
    await addDoc(productsCol, { ...data, createdAt: serverTimestamp() });
  }
  // UX
  els.form.reset();
  els.submitBtn.textContent = "Add Product";
  els.form.productId.value = "";
}

function attachTableEvents() {
  els.tbody.addEventListener("click", async (e) => {
    const btn = e.target.closest("button");
    if (!btn) return;
    const id = btn.dataset.id;
    if (btn.classList.contains("edit")) {
      prefillProductForm(id);
    } else if (btn.classList.contains("delete")) {
      if (confirm("Delete this product?")) {
        await deleteDoc(doc(db, "products", id));
      }
    }
  });
}

function watchProducts() {
  const q2 = query(productsCol);
  return onSnapshot(q2, (snap) => {
    els.tbody.innerHTML = "";
    snap.forEach((docu) => {
      const tr = renderRow(docu.id, docu.data());
      els.tbody.appendChild(tr);
    });
    resolveCategorys();
  });
}

async function resolveCategorys() {
  const q2 = query(collection(db, "categories"), orderBy("updatedAt", "asc"));
  const snap = await getDocs(q2);
  snap.forEach((doc) => {
    const el = document.querySelector(
      `.category[data-category-id="${doc.id}"]`
    );
    if (!el) return;
    el.textContent = doc.data().name;
  });
}

export function initAdminProducts() {
  if (!els.form || !els.tbody) return;
  els.form.addEventListener("submit", handleSubmit);
  populateCategorySelects();
  watchProducts();
  attachTableEvents();
}

initAdminProducts();
