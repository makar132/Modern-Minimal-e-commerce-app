
document.querySelector(".menu-btn").addEventListener("click", function() {
    document.querySelector("nav ul").classList.toggle("show");
});

document.getElementById("darkModeBtn").addEventListener("click", function() {
    document.body.classList.toggle("dark");
    if (document.body.classList.contains("dark")) {
        document.body.style.backgroundColor = "#222";
        document.body.style.color = "#fff";
    } else {
        document.body.style.backgroundColor = "#f9f9f9";
        document.body.style.color = "#333";
    }
}); 
 import { initializeApp } from "https://www.gstatic.com/firebasejs/10.12.2/firebase-app.js";
    import { getFirestore, doc, getDoc, setDoc } from "https://www.gstatic.com/firebasejs/10.12.2/firebase-firestore.js";

    // Firebase Config
    const firebaseConfig = {
      apiKey: "AIzaSyAcictnKPsnIq7Udyiz2XGIuMo72dRdlvU",
      authDomain: "e-commerce-js-app.firebaseapp.com",
      projectId: "e-commerce-js-app",
      storageBucket: "e-commerce-js-app.firebasestorage.app",
      messagingSenderId: "383942089852",
      appId: "1:383942089852:web:99224fda7fd586e7cafdf9",
      measurementId: "G-TV0G1TS360",
    };

    // Initialize Firebase
    const app = initializeApp(firebaseConfig);
    const db = getFirestore(app);

    // Read productId from URL
    const urlParams = new URLSearchParams(window.location.search);
    const productId = urlParams.get("id");

    if (productId) {
      const productRef = doc(db, "products", productId);
      const productSnap = await getDoc(productRef);

      if (productSnap.exists()) {
        const data = productSnap.data();
        document.getElementById("product-img").src = data.image || "images/default.jpg";
        document.getElementById("product-title").textContent = data.name || "No name";
        document.getElementById("product-price").textContent = `$${data.price || 0}`;
        document.getElementById("product-description").textContent = data.description || "No description";
        document.getElementById("product-category").textContent = `Category: ${data.category || "Uncategorized"}`;
      } else {
        document.getElementById("product-title").textContent = "Product not found!";
      }
    } else {
      document.getElementById("product-title").textContent = "No product selected!";
    }

    // زرار الإضافة
    const AddCartBttn = document.getElementById('AddCartBtn');
  

    /**
     * يرسل المنتج إلى عربة التسوق الخاصة بالمستخدم المسجل حاليًا (من localStorage)
     */
    async function addProductToUserCart(product) {
      const userData = JSON.parse(localStorage.getItem('user'));

      if (userData) {
        try {
          const cartItemRef = doc(db, "users", userData.uid, "cart", product.id);
          await setDoc(cartItemRef, {
            productId: product.id,
            name: product.name,
            price: product.price,
            imageUrl: product.image,
            quantity: 1,
            createdAt: new Date()
          });

          alert(`${product.name} تم إضافته إلى عربة التسوق بنجاح!`);
        } catch (error) {
          console.error("Error adding product to cart: ", error);
        }
      } else {
        alert("يرجى تسجيل الدخول أولاً لإضافة منتجات!");
      }
    }

    // لما يضغط على الزر
    AddCartBttn.addEventListener('click', () => {
      const product = {
        id: productId,
        name: document.getElementById("product-title").textContent,
        price: parseFloat(document.getElementById("product-price").textContent.replace('$', '')),
        image: document.getElementById("product-img").src
      };
      addProductToUserCart(product);
    });
    // زرار الإضافة إلى المفضلة
      var WishlistBttn = document.getElementById('WishlistBtn');
       async function addProductToUserwishList(product) {
      const userData = JSON.parse(localStorage.getItem('user'));

      if (userData) {
        try {
          const WishlistItemRef = doc(db, "users", userData.uid, "whishlist", product.id);
          await setDoc(WishlistItemRef, {
            productId: product.id,
            name: product.name,
            price: product.price,
            imageUrl: product.image,
            quantity: 1,
            createdAt: new Date()
          });

          alert(`${product.name} تم إضافته إلى عربة التسوق بنجاح!`);
        } catch (error) {
          console.error("Error adding product to cart: ", error);
        }
      } else {
        alert("يرجى تسجيل الدخول أولاً لإضافة منتجات!");
      }
    }
    WishlistBttn.addEventListener('click', () => {
      const product = {
        id: productId,
        name: document.getElementById("product-title").textContent,
        price: parseFloat(document.getElementById("product-price").textContent.replace('$', '')),
        image: document.getElementById("product-img").src
      };
      addProductToUserwishList(product);
    });