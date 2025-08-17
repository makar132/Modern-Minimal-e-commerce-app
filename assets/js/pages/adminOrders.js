/**
 * Admin: Orders page
 *
 * Review/confirm/reject orders; updates status in Firestore.
 *
 */

import { db, collection, doc, updateDoc, onSnapshot, query } from "../main.js";
import { qsa } from "../main.js";
const ordersCol = collection(db, "orders");
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
        <td > <span class="badge ${order.status}"> ${order.status}</span> </td>
        <td> ${
          order.status === "pending"
            ? `   <button class="btn confirm" data-id="${order.id}">Confirm</button>
          <button class="btn btn-outline reject" data-id="${order.id}" >Reject</button>
       `
            : ""
        }
        </td>`;
  return tr;
}
function attachTableEvents() {
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
  return onSnapshot(q, (snap) => {
    els.tbody.innerHTML = "";
    snap.forEach((docu) => {
      const tr = renderOrder({ id: docu.id, ...docu.data() });
      els.tbody.appendChild(tr);
    });
  });
}
export function initAdminOrders() {
  watchOrders();
  attachTableEvents();
}
initAdminOrders();
