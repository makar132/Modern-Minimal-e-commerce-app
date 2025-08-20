import { db, collection, getDocs, doc, setDoc, deleteDoc } from "../main.js";

const user = JSON.parse(localStorage.getItem("user"));
const tbody = document.getElementById("wishlist-body");

if (!user) {
  alert("يرجى تسجيل الدخول لعرض المفضلة.");
} else {
  const wishlistRef = collection(db, "users", user.uid, "whishlist");
  const loadWishlist = async () => {
    tbody.innerHTML = "";
    const snapshot = await getDocs(wishlistRef);
    snapshot.forEach((docSnap) => {
      const data = docSnap.data();
      const row = `
            <tr>
              <td>${data.name}</td>
              <td>$${data.price}</td>
              <td class="action_Buttons">
                <button class="btn addBut" onclick="addToCart('${docSnap.id}', '${data.name}', ${data.price}, '${data.imageUrl}')">Add to cart</button>
                <button class="btn btn-danger-outline" onclick="removeFromWishlist('${docSnap.id}')">Remove</button>
              </td>
            </tr>
          `;
      tbody.innerHTML += row;
    });
    const loader = document.querySelector(".loader");
    loader.remove();
  };

  window.addToCart = async (productId, name, price, imageUrl) => {
    const cartRef = doc(db, "users", user.uid, "cart", productId);
    await setDoc(cartRef, {
      productId,
      name,
      price,
      imageUrl,
      quantity: 1,
      createdAt: new Date(),
    });
    alert(`${name} تمت إضافته إلى السلة`);
  };

  window.removeFromWishlist = async (productId) => {
    await deleteDoc(doc(db, "users", user.uid, "whishlist", productId));
    alert("تم الحذف من المفضلة");
    loadWishlist();
  };

  loadWishlist();
}
