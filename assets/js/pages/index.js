const APP_BASE = "/Modern-Minimal-e-commerce-app/";
const goto = (p) =>
  location.replace(new URL(p, location.origin + APP_BASE).href);

document.querySelector(".menu-btn").addEventListener("click", function () {
  document.querySelector("nav ul").classList.toggle("show");
});

document.getElementById("darkModeBtn").addEventListener("click", function () {
  document.body.classList.toggle("dark");
  if (document.body.classList.contains("dark")) {
    document.body.style.backgroundColor = "#222";
    document.body.style.color = "#fff";
  } else {
    document.body.style.backgroundColor = "#f9f9f9";
    document.body.style.color = "#333";
  }
});

import { db, collection, getDocs } from "../main.js";

// readproducts
var productCard = document.getElementById("productCard");
var productList = document.querySelector(".product-list");
var category = document.getElementById("category");
var collectionRef = collection(db, "products");
const querySnapshot = await getDocs(collection(db, "products"));
console.log("All products", querySnapshot);
productList.innerHTML = ""; // Clear existing products
querySnapshot.forEach((product) => {
  const card = productCard.cloneNode(true);
  productList;
  card.querySelector("img").src = product.image;
  card.querySelector("h3").textContent = product.name;
  card.querySelector(".price").textContent = `$${product.price}`;
  card.setAttribute("data-category", product.category);
  console.log(card);
  productList.appendChild(card);
});

productList.innerHTML = ""; // Clear existing products

querySnapshot.forEach((doc) => {
  const data = doc.data();
  const card = productCard.cloneNode(true);

  //  details product
  card.querySelector("img").src = data.image;
  card.querySelector("h3").textContent = data.name;
  card.querySelector(".price").textContent = `$${data.price}`;
  card.setAttribute("data-category", data.category);

  card.setAttribute("data-id", doc.id);

  card.addEventListener("click", () => {
    goto(`product.html?id=${doc.id}`);
  });

  productList.appendChild(card);
});

querySnapshot.forEach((doc) => {
  console.log(doc.id, " => ", doc.data());
});
