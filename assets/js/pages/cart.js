import {
  db,
  collection,
  doc,
  updateDoc,
  deleteDoc,
  onSnapshot,
  getDoc,
} from "../main.js";

const user = JSON.parse(localStorage.getItem("user"));
const userId = user.uid;

const APP_BASE = "/Modern-Minimal-e-commerce-app/";
const cartItems = [];

/**
 * Navigate to a relative path within the app base.
 * Uses URL to safely concatenate paths and origin.
 * @param {string} p relative path (e.g., "product.html?id=123")
 */
const goto = (p) =>
  (window.location.href = new URL(p, location.origin + APP_BASE).href);

function getCartItems() {
  const cartRef = collection(db, "users", userId, "cart");

  return onSnapshot(cartRef, async (snapshot) => {
    // Build a fresh array from the snapshot
    const items = (
      await Promise.all(
        snapshot.docs.map(async (docItem) => {
          const cartData = docItem.data();
          const productSnap = await getDoc(
            doc(db, "products", cartData.productId)
          );
          if (!productSnap.exists()) return null;
          const productData = productSnap.data();

          return {
            id: docItem.id,
            productId: cartData.productId,
            quantity: cartData.quantity,
            ...productData,
          };
        })
      )
    ).filter(Boolean);

    cartItems.length = 0;
    cartItems.push(...items);

    generateCartItems(items);
  });
}

// 2. Generate HTML table
function generateCartItems(cartItems) {
  let subtotal = 0;
  let rowsHTML = cartItems
    .map((item) => {
      let total = item.price * item.quantity;
      subtotal += total;

      return `
      <tr>
        <td> ${item.name}</td>
        <td>$${item.price}</td>
        <td>
          <input 
            type="number" 
            class="qty-input" 
            data-id="${item.id}" 
            data-stock="${item.stock}"
            value="${item.quantity}" 
          />
        </td>
        <td>$${total}</td>
        <td><button class="btn btn-danger-outline remove-btn" data-id="${item.id}">Remove</button></td>
      </tr>
    `;
    })
    .join("");

  let tableHTML = `
      <table>
        <thead>
          <tr>
            <th>Product</th><th>Price</th><th>Quantity</th>
            <th>Subtotal</th><th>Action</th>
          </tr>
        </thead>
        <tbody>${rowsHTML}</tbody>
      </table>
    <div class="mt-3" style="text-align:right; font-size:1.2rem; font-weight:bold;">
      Total: <span id="cartTotal">$${subtotal.toFixed(2)}</span>
    </div>
    <div class="mt-2" style="text-align:right;">
      <button class="btn checkout-btn">Proceed to Checkout</button>
    </div>  `;
  document.querySelector(".container").innerHTML = tableHTML;
  attachCartEvents();
}
// 3. Handle quantity changes & delete
function attachCartEvents() {
  // change quantity
  document.querySelectorAll(".qty-input").forEach((input) => {
    input.setAttribute("min", 1);
    input.setAttribute("max", input.getAttribute("data-stock"));
    input.addEventListener("change", async (e) => {
      let newQty = parseInt(e.target.value);
      const cartDocId = e.target.getAttribute("data-id");
      await updateDoc(doc(db, "users", userId, "cart", cartDocId), {
        quantity: newQty,
      });
    });
  });
  // remove item
  document.querySelectorAll(".remove-btn").forEach((btn) => {
    btn.addEventListener("click", async () => {
      const cartDocId = btn.getAttribute("data-id");
      console.log("remove item", userId, cartDocId);
      await deleteDoc(doc(db, "users", userId, "cart", cartDocId));
    });
  });
  // checkout
  const checkoutBtn = document.querySelector(".checkout-btn");
  if (checkoutBtn) {
    checkoutBtn.addEventListener("click", () => {
      if (cartItems.length === 0) {
        alert("Your cart is empty!");
        return;
      }
      goto("checkout.html");
    });
  }
}
getCartItems();
