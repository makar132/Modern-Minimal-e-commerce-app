// adminOrders.js — placeholder
import {
  db,
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
const ordersCol = collection(db, "orders");
console.log(ordersCol);
console.log(db);

const els = {
  tbody: document.getElementById("adminOrders"),
};
function renderOrder(order) {
  const tr = document.createElement("tr");
  tr.innerHTML = `
        <td>${order.id}</td>
        <td>${order.customerEmail || order.customerId}</td>
        <td>${order.items?.length || 0}</td>
        <td>${order.total?.toFixed?.(2) ?? ""}</td>
        <td>${order.status}</td>
        <td>
          <button class="btn confirm" data-id="${order.id}" ${
    order.status !== "pending" ? "disabled" : ""
  }>Confirm</button>
          <button class="btn btn-outline reject" data-id="${order.id}" ${
    order.status !== "pending" ? "disabled" : ""
  }>Reject</button>
        </td>`;
  return tr;
}
function attachTableEvents() {
  console.log("attachTableEvents", qsa(".confirm"));
  els.tbody.addEventListener("click", async (e) => {
    const btn = e.target.closest("button");
    if (!btn) return;
    const id = btn.dataset.id;
    if (btn.classList.contains("confirm")) {
      await updateDoc(doc(db, "orders", id), { status: "confirmed" });
    } else if (btn.classList.contains("reject")) {
      await updateDoc(doc(db, "orders", id), { status: "rejected" });
    }
  });
}
function watchOrders() {
  const q = query(ordersCol);
  console.log("orders query", q);
  return onSnapshot(q, (snap) => {
    els.tbody.innerHTML = "";
    snap.forEach((docu) => {
      console.log(docu.id, docu.data());
      const tr = renderOrder({ id: docu.id, ...docu.data() });
      els.tbody.appendChild(tr);
    });
  });
}
export function initAdminOrders() {
  /* implement page wiring here */
  watchOrders();
  attachTableEvents();
}
initAdminOrders();
