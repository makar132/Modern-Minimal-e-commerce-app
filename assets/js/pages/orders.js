import {
  db,
  collection,
  onSnapshot
} from "../main.js";

document.addEventListener("DOMContentLoaded", () => {
  const tableBody = document.getElementById("ordersTable");
  const userId = "1";

  const ordersCol = collection(db, "orders");
  onSnapshot(ordersCol, (snapshot) => {
    tableBody.innerHTML = "";

    snapshot.forEach((docSnap) => {
      const order = docSnap.data();

      const itemsText = Array.isArray(order.items)
        ? order.items.map(i => `${i.name} x${i.quantity}`).join(", ")
        : "";

      // date
      const date = order.createdAt
        ? new Date(
          order.createdAt.seconds
            ? order.createdAt.seconds * 1000
            : order.createdAt
        ).toLocaleString()
        : "";

      let statusClass = "pend";
      if (order.status === "confirmed") statusClass = "conf";
      else if (order.status === "rejected") statusClass = "rej";

      
      const tr = document.createElement("tr");
      tr.innerHTML = `
        <td>${docSnap.id}</td>
        <td>${itemsText}</td>
        <td><button class="butt ${statusClass}">${order.status || "pending"}</button></td>
        <td>${date}</td>
      `;
      tableBody.appendChild(tr);
    });
  });
});

