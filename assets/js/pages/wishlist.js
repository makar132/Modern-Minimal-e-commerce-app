// wishlist.js — placeholder
export function initWishlist(){ /* implement page wiring here */ }
 import { initializeApp } from "https://www.gstatic.com/firebasejs/10.12.2/firebase-app.js";
    import { getFirestore, collection, getDocs, doc, setDoc, deleteDoc } from "https://www.gstatic.com/firebasejs/10.12.2/firebase-firestore.js";

    const firebaseConfig = {
      apiKey: "AIzaSyAcictnKPsnIq7Udyiz2XGIuMo72dRdlvU",
      authDomain: "e-commerce-js-app.firebaseapp.com",
      projectId: "e-commerce-js-app",
      storageBucket: "e-commerce-js-app.appspot.com",
      messagingSenderId: "383942089852",
      appId: "1:383942089852:web:99224fda7fd586e7cafdf9",
      measurementId: "G-TV0G1TS360",
    };

    const app = initializeApp(firebaseConfig);
    const db = getFirestore(app);

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
                <button class="btn" onclick="removeFromWishlist('${docSnap.id}')">Remove</button>
              </td>
            </tr>
          `;
          tbody.innerHTML += row;
        });
      };

      window.addToCart = async (productId, name, price, imageUrl) => {
        const cartRef = doc(db, "users", user.uid, "cart", productId);
        await setDoc(cartRef, {
          productId,
          name,
          price,
          imageUrl,
          quantity: 1,
          createdAt: new Date()
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
//   </script> -->

//   <!-- Other Scripts -->
//   <!-- <>
    function toggleMenu() {
      const nav = document.getElementById('navMenu');
      nav.classList.toggle('show');
    }

    document.addEventListener("DOMContentLoaded", () => {
      const toggleBtn = document.getElementById("dark-mode-toggle");

      toggleBtn.addEventListener("click", () => {
        document.body.classList.toggle("dark-mode");
        toggleBtn.textContent = document.body.classList.contains("dark-mode") ? "Light" : "Dark";
      });
    });
