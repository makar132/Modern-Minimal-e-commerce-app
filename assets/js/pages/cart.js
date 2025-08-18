import {db,collection,doc,updateDoc,deleteDoc,onSnapshot,getDoc} from "../main.js";

const user = JSON.parse(localStorage.getItem("user"));
const userId = user.uid;
// 1. Fetch cart items for the test user
function getCartItems() {
  const cartRef = collection(db, "users", userId, "cart");
  onSnapshot(cartRef, async (snapshot) => {
    let cartItems = [];
    // loop over each cart item
    for (const docItem of snapshot.docs) {
      const cartData = docItem.data(); 
      // get product details
      const productRef = doc(db, "products", cartData.productId);
      const productSnap = await getDoc(productRef);
      if (productSnap.exists()) {
        const productData = productSnap.data(); 
        cartItems.push({
          id: docItem.id,       
          productId: cartData.productId,
          quantity: cartData.quantity,
          ...productData
        });
      }
    }
    generateCartItems(cartItems);
  });
}
// 2. Generate HTML table
function generateCartItems(cartItems) {
    let subtotal = 0;
    let rowsHTML = cartItems.map(item => {
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
            value="${item.quantity}" 
          />
        </td>
        <td>$${total}</td>
        <td><button class="remove-btn" data-id="${item.id}">Remove</button></td>
      </tr>
    `;
  }).join("");

  let tableHTML = `
    <div class="table-container">
      <table>
        <thead>
          <tr>
            <th>Product</th><th>Price</th><th>Quantity</th>
            <th>Subtotal</th><th>Action</th>
          </tr>
        </thead>
        <tbody>${rowsHTML}</tbody>
      </table>
    </div>
      <div class="total">Total:$${subtotal}</div>
      <a  class="colored-btn">Proceed to checkout</a>
  `;
  document.querySelector(".container").innerHTML = tableHTML;
  attachCartEvents();
}
// 3. Handle quantity changes & delete
function attachCartEvents() {
  // change quantity
  document.querySelectorAll(".qty-input").forEach(input => {
    input.addEventListener("change", async (e) => {
      let newQty = parseInt(e.target.value);
      let cartDocId = e.target.getAttribute("data-id");
      if (newQty > 0) {
        await updateDoc(doc(db, "users", userId, "cart", cartDocId), {
          quantity: newQty
        });
      }
    });
  });
  // remove item
  document.querySelectorAll(".remove-btn").forEach(btn => {
    btn.addEventListener("click", async () => {
      let cartDocId = btn.getAttribute("data-id");
      await deleteDoc(doc(db, "users", userId, "cart", cartDocId));
    });
  });
  // checkout
  const checkoutBtn = document.querySelector(".colored-btn");
  if (checkoutBtn) {
  checkoutBtn.addEventListener("click", () => {
    window.location.href = "/checkout.html";
  });
}
}
getCartItems();
