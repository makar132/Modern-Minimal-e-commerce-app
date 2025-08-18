import {
  db, collection, doc, getDoc, getDocs,
  deleteDoc, updateDoc, addDoc, serverTimestamp
} from "../main.js";

const user = JSON.parse(localStorage.getItem("user"));
const userId = user.uid;

// 1. load cart items
async function loadCheckout() {
  const cartRef = collection(db, "users", userId, "cart");
  const snapshot = await getDocs(cartRef);
  let cartItems = [];
  let subtotal = 0;

  for (const cartDoc of snapshot.docs) {
    const cartData = cartDoc.data();
    const productRef = doc(db, "products", cartData.productId);
    const productSnap = await getDoc(productRef);
    if (!productSnap.exists()) continue;

    const productData = productSnap.data();
    const total = productData.price * cartData.quantity;
    subtotal += total;

    cartItems.push({
      cartId: cartDoc.id,
      productId: cartData.productId,
      name: productData.name,
      price: productData.price,
      quantity: cartData.quantity,
      total
    });
  }

  renderCheckout(cartItems, subtotal);
}

// 2. render data into HTML
function renderCheckout(items, subtotal) {
  const tbody = document.getElementById("cart-body");
  tbody.innerHTML = items.map(item => `
    <tr>
      <td>${item.name}</td>
      <td>$${item.price}</td>
      <td>${item.quantity}</td>
      <td>$${item.total}</td>
    </tr>
  `).join("");

  document.getElementById("subtotal").textContent = subtotal;

  attachCheckoutEvents(items, subtotal);
}
// 3. handle confirm order
function attachCheckoutEvents(items, subtotal) {
  const form = document.getElementById("checkout-form");

  form.addEventListener("submit", async (e) => {
    e.preventDefault();

    const name = document.getElementById("name").value;
    const email = document.getElementById("email").value;
    const address = document.getElementById("address").value;
    const phone = document.getElementById("phone").value;

    try {
      // re-read cart to confirm latest data
      const cartRef = collection(db, "users", userId, "cart");
      const snapshot = await getDocs(cartRef);
      let finalItems = [];
      let total = 0;

      for (const cartDoc of snapshot.docs) {
        const cartData = cartDoc.data();
        const productRef = doc(db, "products", cartData.productId);
        const productSnap = await getDoc(productRef);
        if (!productSnap.exists()) continue;

        const productData = productSnap.data();
        if (productData.stock < cartData.quantity) {
          alert(`Not in stock: ${productData.name}`);
          return;
        }

        await updateDoc(productRef, {
          stock: productData.stock - cartData.quantity
        });

        const totalItem = productData.price * cartData.quantity;
        total += totalItem;

        finalItems.push({
          productId: cartData.productId,
          name: productData.name,
          price: productData.price,
          quantity: cartData.quantity
        });
      }

      await addDoc(collection(db, "orders"), {
        customerId: userId,
        customerEmail: email,
        customerName: name,
        customerPhone: phone,
        customerAddress: address,
        items: finalItems,
        total,
        status: "pending",
        createdAt: serverTimestamp()
      });

      for (const cartDoc of snapshot.docs) {
        await deleteDoc(cartDoc.ref);
      }

      window.location.href = "../orders.html";
    } catch (err) {
      console.error("Error confirming order:", err);
      alert("Error occurred during creating order");
    }
  });
}

// 4. start
loadCheckout();
