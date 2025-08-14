// adminProducts.js — placeholder
import {
  app,
  db,
  collection,
  getDocs,
  getDoc,
  doc,
  addDoc,
  updateDoc,
  deleteDoc,
} from "../main.js";
// console.log(app);

(function initAdminProducts() {
  console.log(app);
  console.log(db);
})();

// ---------- Admin Products ----------
export async function fetchAndRenderData() {
  // Reference to the "products" collection
  const productsRef = collection(db, "products");

  try {
    // Fetch the documents from the "products" collection
    const snapshot = await getDocs(productsRef);
    const productList = snapshot.docs.map((doc) => ({
      id: doc.id,
      ...doc.data(),
    }));
    console.log("productList", productList[0]["id"]);
    // Call the function to render data
    renderAdminProducts(productList);
  } catch (error) {
    console.error("Error fetching documents: ", error);
  }
}

function renderAdminProducts(products) {
  const container = document.getElementById("adminProducts");
  if (!container) return;
  container.innerHTML = "";
  products.forEach((prod) => {
    console.log("prod", prod);

    const row = document.createElement("tr");

    // Utility function to make a <td> with plain text
    const makeCell = (text) => {
      const td = document.createElement("td");
      td.textContent = text;
      return td;
    };

    // Add product info cells
    row.appendChild(makeCell(prod.id));
    row.appendChild(makeCell(prod.name));
    row.appendChild(makeCell(prod.category));
    row.appendChild(makeCell(`$${prod.price.toFixed(2)}`));
    row.appendChild(makeCell(prod.stock));

    // Create actions cell
    const actionsCell = document.createElement("td");

    // Edit button
    const editBtn = document.createElement("button");
    editBtn.classList.add("btn", "edit-btn");
    editBtn.dataset.id = prod.id;
    editBtn.textContent = "Edit";
    editBtn.addEventListener("click", () => prefillProductForm(prod.id));

    // Delete button
    const deleteBtn = document.createElement("button");
    deleteBtn.classList.add("btn", "btn-outline");
    deleteBtn.textContent = "Delete";
    deleteBtn.addEventListener("click", () => deleteProduct(prod.id));

    // Append buttons to actions cell
    actionsCell.appendChild(editBtn);
    actionsCell.appendChild(deleteBtn);

    // Add actions cell to the row
    row.appendChild(actionsCell);

    container.appendChild(row);
  });
}
async function fetchProductById(productId) {
  // Reference to the "products" collection
  console.log("fetchProductById", productId);
  const productRef = doc(db, "products", productId);
  const docSnap = await getDoc(productRef);

  if (docSnap.exists()) {
    console.log("Product data:", { id: docSnap.id, ...docSnap.data() });
    return { id: docSnap.id, ...docSnap.data() };
  } else {
    console.log("No such product!");
    return null;
  }
}
async function updateProduct(id, data) {
  console.log("updateProduct", id, data);
  const ref = doc(db, "products", id);
    await updateDoc(ref, {
      name: data.name,
      price: data.price,
      category: data.category,
      description: data.description,
      stock: data.stock,
      image: data.image,
    });
}
async function deleteProduct(id) {
  const ref = doc(db, "products", id);
  await deleteDoc(ref);
}
export async function prefillProductForm(id) {
  console.log(id);
  const product = await fetchProductById(id);
  if (!product) return;
  console.log("this is the product", product);
  const form = document.getElementById("productForm");
  form.productId.value = product.id;
  form.name.value = product.name;
  form.price.value = product.price;
  form.category.value = product.category;
  form.description.value = product.description;
  form.stock.value = product.stock;
  form.image.value = product.image;
  form.querySelector('button[type="submit"]').textContent = "Update Product";
  form.querySelector('button[type="submit"]').addEventListener("click", (e) => {
    // e.preventDefault();
    updateProduct(product.id, {
      name: form.name.value.trim(),
      price: parseFloat(form.price.value),
      category: form.category.value,
      description: form.description.value.trim(),
      stock: parseInt(form.stock.value),
      image: form.image.value.trim(),
    });
    // form.querySelector('button[type="submit"]').textContent = "Update Product";
  });
}

fetchAndRenderData();
document.addEventListener("DOMContentLoaded", () => {
  fetchAndRenderData();
});
