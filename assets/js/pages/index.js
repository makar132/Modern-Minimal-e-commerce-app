/**
 * assets/js/pages/index.js
 * ----------------------------------------------
 * Home page script for Minimal Store.
 *
 * Responsibilities:
 *  - Fetch all products from Firestore.
 *  - Build a unique categories list and populate <select id="filterCategory">.
 *  - Render product cards into <div id="productGrid">.
 *  - Wire "Add to Cart" / "Wishlist" actions via shared services.
 *  - Filter visible products when category selection changes.
 *
 * Dependencies:
 *  - ../main.js: initialized Firebase app + Firestore (db, collection, getDocs).
 *  - ../services/user_actions.js: { addToCart, addToWishlist } reusable routines.
 */

import { db, collection, getDocs } from "../main.js";
import { addToCart, addToWishlist } from "../utils/user_actions.js";

/** Base path for routing when app is not served at domain root. */
const APP_BASE = "/Modern-Minimal-e-commerce-app/";

/**
 * Navigate to a relative path within the app base.
 * Uses URL to safely concatenate paths and origin.
 * @param {string} p relative path (e.g., "product.html?id=123")
 */
const goto = (p) =>
  (window.location.href = new URL(p, location.origin + APP_BASE).href);

/** Shorthand query selector. */
const $ = (sel, root = document) => root.querySelector(sel);

/**
 * @typedef {Object} Product
 * @property {string} id
 * @property {string} [name]
 * @property {number} [price]
 * @property {string} [image]
 * @property {string} [description]
 * @property {string} [category]
 */

/* ----------------------------------------------
 * Data
 * ----------------------------------------------*/

/**
 * Fetch all products from Firestore "products" collection.
 */
async function fetchProducts() {
  const snap = await getDocs(collection(db, "products"));
  return snap.docs.map((d) => ({ id: d.id, ...d.data() }));
}

// Fetch all categories from Firestore "categories" collection
async function fetchCategories() {
  const snap = await getDocs(collection(db, "categories"));
  console.log("[fetchCategories]", snap.docs);
  return snap.docs.map((d) => ({
    // console.log("category data",d.id,d.data());
    id: d.id,
    name: d.data().name,
  }));
}

/* ----------------------------------------------
 * UI
 * ----------------------------------------------*/

/**
 * Populate a <select> element with category options.
 * Overwrites any existing options and prepends "All Categories".
 * @param {HTMLSelectElement|null} selectEl
 * @param {string[]} categories
 */
function populateCategorySelect(selectEl, categories) {
  if (!selectEl) return;

  // Reset and add the "All" option
  selectEl.innerHTML = "";
  const optAll = document.createElement("option");
  optAll.value = "all";
  optAll.textContent = "All Categories";
  selectEl.appendChild(optAll);

  // Add one option per category
  for (const c of categories) {
    const o = document.createElement("option");
    console.log(c);
    o.value = c.id;
    o.textContent = c.name;
    selectEl.appendChild(o);
  }

  // Default selection
  selectEl.value = "all";
}

/**
 * Create a DOM node for a single product card using the app's design.
 * Also wires:
 *  - Add to Cart / Wishlist buttons (stopping propagation)
 *  - Card click to navigate to product details
 */

function createBadge(label) {
  const span = document.createElement("span");
  span.className = "badge";
  span.setAttribute("aria-label", "Category");
  span.textContent = (label && String(label).trim()) || "Uncategorized";
  return span;
}

function createProductCard(p) {
  const card = document.createElement("div");
  card.className = "product-card";
  card.dataset.id = p.id || "";
  card.dataset.category = p.category || "Uncategorized";

  // Media (image + category badge)
  const media = document.createElement("div");
  media.className = "media";

  const img = document.createElement("img");
  img.src = p.image || "images/placeholder.png";
  img.alt = p.name || "Product";
  img.loading = "lazy";

  const badge = createBadge(p.category);
  media.append(img, badge);

  // Content
  const content = document.createElement("div");
  content.className = "card-content";

  const title = document.createElement("div");
  title.className = "title";
  title.textContent = p.name || "Unnamed Product";

  const price = document.createElement("div");
  price.className = "price";
  price.textContent = `$${Number(p.price ?? 0).toFixed(2)}`;

  const desc = document.createElement("div");
  desc.className = "description";
  desc.textContent = p.description || "";

  // Actions
  const actions = document.createElement("div");
  actions.className = "actions";

  const addBtn = document.createElement("button");
  addBtn.className = "btn";
  addBtn.textContent = "Add to Cart";
  addBtn.addEventListener("click", (e) => {
    e.stopPropagation();
    addToCart(p);
  });

  const wishBtn = document.createElement("button");
  wishBtn.className = "btn btn-outline";
  wishBtn.textContent = "Wishlist";
  wishBtn.addEventListener("click", (e) => {
    e.stopPropagation();
    addToWishlist(p);
  });

  actions.append(addBtn, wishBtn);

  // Assemble
  content.append(title, price, desc, actions);
  card.append(media, content);

  // Card navigation (ignore button clicks)
  card.addEventListener("click", (e) => {
    if (e.target.closest(".actions")) return;
    if (p.id) goto(`product.html?id=${p.id}`);
  });

  return card;
}

/**
 * Render a list of products into the given container element.
 * Clears existing children before rendering.
 */
function renderProducts(container, products) {
  container.innerHTML = "";
  // const productGrid = `<div id="productGrid" class="product-grid"></div>`;
  //create product grid div
  const productGrid = document.createElement("div");
  productGrid.id = "productGrid";
  productGrid.className = "product-grid";
  const frag = document.createDocumentFragment();
  for (const p of products) frag.appendChild(createProductCard(p));
  productGrid.appendChild(frag);
  container.appendChild(productGrid);
  // container.appendChild(frag);
}

/**
 * Filter products by a category value.
 * If selected is "all" (or empty), returns the original list.
 */
function filterByCategory(products, selected) {
  if (!selected || selected === "all") return products;
  const sel = selected.toLowerCase();
  return products.filter((p) => (p.category || "").toLowerCase() === sel);
}

/* ----------------------------------------------
 * Boot
 * ----------------------------------------------*/

/**
 * Entry point:
 *  - Grabs DOM refs (.container, #filterCategory).
 *  - Fetches products.
 *  - Populates category select.
 *  - Renders products.
 *  - Removes loader.
 *  - Hooks change listener to re-render on category change.
 */
document.addEventListener("DOMContentLoaded", async () => {
  /** @type {HTMLElement|null} */
  const container = $(".container");
  /** @type {HTMLSelectElement|null} */
  const select = /** @type {HTMLSelectElement|null} */ ($("#filterCategory"));

  if (!container) return;

  // Optional loading spinner inside #productGrid
  const loader = container.querySelector(".loader");

  try {
    const products = await fetchProducts();
    const categories = await fetchCategories();
    console.log("[index] Fetched products:", products);
    console.log("[index] Fetched categories:", categories);
    populateCategorySelect(select, categories);
    renderProducts(container, products);

    // Remove loader after successful render
    loader?.remove();

    // Re-render on category change
    select?.addEventListener("change", () => {
      const filtered = filterByCategory(products, select.value);
      renderProducts(container, filtered);
    });
  } catch (err) {
    console.error("[index] Failed to load products:", err);
    loader?.remove();
    container.innerHTML = `<div class="alert">Failed to load products.</div>`;
  }
});
