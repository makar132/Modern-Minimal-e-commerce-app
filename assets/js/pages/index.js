import { db, collection, getDocs } from "../main.js";

const APP_BASE = "/Modern-Minimal-e-commerce-app/";
const goto = (p) =>
  location.replace(new URL(p, location.origin + APP_BASE).href);

document.querySelector(".menu-btn").addEventListener("click", function () {
  document.querySelector("nav ul").classList.toggle("show");
});

document.getElementById("darkModeBtn").addEventListener("click", function () {
  document.body.classList.toggle("dark");
  if (document.body.classList.contains("dark")) {
    document.body.style.backgroundColor = "#1e1e1e";
    document.body.style.color = "#aaaaaa";
  } else {
    document.body.style.backgroundColor = "white";
    document.body.style.color = "black";
  }
});

var productCard = document.getElementById("productCard");
var productList = document.querySelector(".product-list");
var categorySelect = document.getElementById("category");

var collectionRef = collection(db, "products");
const querySnapshot = await getDocs(collectionRef);

// نخزن كل الـ products في Array
let products = [];
querySnapshot.forEach((doc) => {
  let data = doc.data();
  data.id = doc.id; // نحفظ الـ id
  products.push(data);
});

// Function لعرض المنتجات (مع الفلترة)
function renderProducts(filterCategory = "All Categories") {
  productList.innerHTML = "";

  products.forEach((data) => {
    if (
      filterCategory === "All Categories" ||
      data.category.toLowerCase() === filterCategory.toLowerCase()
    ) {
      const card = productCard.cloneNode(true);
      card.querySelector("img").src = data.image;
      card.querySelector("h3").textContent = data.name;
      card.querySelector(".price").textContent = `$${data.price}`;
      card.setAttribute("data-category", data.category);
      card.setAttribute("data-id", data.id);

      // لما اضغط على الكارد يفتح صفحة المنتج
      card.addEventListener("click", () => {
        goto(`product.html?id=${data.id}`);
      });

      productList.appendChild(card);
    }
  });
}

// نعرض الكل أول مرة
renderProducts();

// نسمع لأي تغيير في الـ dropdown
categorySelect.addEventListener("change", (e) => {
  renderProducts(e.target.value);
});
