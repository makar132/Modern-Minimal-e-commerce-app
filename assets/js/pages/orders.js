import { db, collection, onSnapshot } from "../main.js";

document.addEventListener("DOMContentLoaded", () => {
  const tableBody = document.getElementById("ordersTable");
  const userId = JSON.parse(localStorage.getItem("user")).uid;

  const ordersCol = collection(db, "orders");
  onSnapshot(ordersCol, (snapshot) => {
    tableBody.innerHTML = "";

    snapshot.forEach((docSnap) => {
      const order = docSnap.data();
      console.log(order.status);
      if (order.customerId != userId) return;

      const itemsText = Array.isArray(order.items)
        ? order.items.map((i) => `${i.name} x${i.quantity}`).join(", ")
        : "";

      // date
      const date = order.createdAt
        ? new Date(
            order.createdAt.seconds
              ? order.createdAt.seconds * 1000
              : order.createdAt
          ).toLocaleString()
        : "";

      const tr = document.createElement("tr");
      tr.innerHTML = `
        <td>${docSnap.id}</td>
        <td>${itemsText}</td>
        <td> <span class="badge ${order.status}"> ${order.status}</span> </td>
        <td>${date}</td>
      `;
      tableBody.appendChild(tr);
    });
          const loader = document.querySelector(".loader");
    loader.remove();

  });

});
