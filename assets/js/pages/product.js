// assets/js/pages/product.js (module)
import { db, doc, getDoc } from "../main.js";
import { addToCart, addToWishlist } from "../utils/user_actions.js";

/* ------------------------
   Tiny utils
------------------------ */
const $ = (sel) => document.querySelector(sel);
const money = (v) => `$${Number(v ?? 0).toFixed(2)}`;
const getProductId = () => new URLSearchParams(location.search).get("id");

/* ------------------------
   Firestore
------------------------ */
async function fetchProduct(id) {
  const snap = await getDoc(doc(db, "products", id));
  return snap.exists() ? { id: snap.id, ...snap.data() } : null;
}

/* ------------------------
   Rendering
------------------------ */
/** Put a simple message in the detail area. */
function renderMessage(text) {
  const root = ensureDetailRoot();
  root.innerHTML = `<div class="alert">${text}</div>`;
}

/** Ensure we have a #productDetail container to render into. */
function ensureDetailRoot() {
  let root = $("#productDetail");
  if (!root) {
    root = document.createElement("div");
    root.id = "productDetail";
    document.querySelector("main")?.appendChild(root);
  }
  // Apply the layout from your snippet
  Object.assign(root.style, {
    display: "flex",
    flexWrap: "wrap",
    gap: "2rem",
    alignItems: "flex-start",
  });
  return root;
}

/** Build the card DOM using your snippet (no innerHTML, no inline onclick). */
function buildDetailCard(p) {
  const img = document.createElement("img");
  img.src = p.image || "images/default.jpg";
  img.alt = p.name || "Product";
  Object.assign(img.style, {
    maxWidth: "400px",
    width: "100%",
    borderRadius: "8px",
  });

  const right = document.createElement("div");
  Object.assign(right.style, { flex: "1", minWidth: "250px" });

  const h2 = document.createElement("h2");
  h2.textContent = p.name || "No name";

  const cat = document.createElement("p");
  cat.textContent = `Category: ${p.category || "Uncategorized"}`;
  cat.style.color = "var(--muted-text-color)";

  const price = document.createElement("p");
  price.textContent = money(p.price);
  Object.assign(price.style, {
    fontSize: "1.3rem",
    color: "var(--primary-color)",
    fontWeight: "bold",
  });

  const desc = document.createElement("p");
  desc.className = "mt-1";
  desc.style.lineHeight = "1.6";
  desc.textContent = p.description || "No description";

  const actions = document.createElement("div");
  actions.className = "mt-3";
  Object.assign(actions.style, { display: "flex", gap: "0.8rem" });

  const addBtn = document.createElement("button");
  addBtn.className = "btn";
  addBtn.textContent = "Add to Cart";
  addBtn.addEventListener("click", () => addToCart(p));

  const wishBtn = document.createElement("button");
  wishBtn.className = "btn btn-outline";
  wishBtn.textContent = "Wishlist";
  wishBtn.addEventListener("click", () => addToWishlist(p));

  actions.append(addBtn, wishBtn);
  right.append(h2, cat, price, desc, actions);

  const frag = document.createDocumentFragment();
  frag.append(img, right);
  return frag;
}

/** Render the product into #productDetail. */
function renderProduct(p) {
  if (!p) return renderMessage("Product not found!");
  const root = $(".container");
  //create product details div
  const productDetails = document.createElement("div");
  productDetails.style =
    "display:flex; flex-wrap:wrap; gap:2rem; align-items:center; justify-content:center;";
  productDetails.append(buildDetailCard(p));
  root.innerHTML = ""; // clear previous
  root.append(productDetails);
}

/* ------------------------
   Init
------------------------ */
async function init() {
  const id = getProductId();
  if (!id) return renderMessage("No product selected!");

  const product = await fetchProduct(id);
  renderProduct(product);
}

document.addEventListener("DOMContentLoaded", init);
