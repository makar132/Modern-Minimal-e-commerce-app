
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

    // Firebase من CDN
    import { initializeApp } from "https://www.gstatic.com/firebasejs/10.12.2/firebase-app.js";
    import { 
      getFirestore, collection, addDoc, getDocs 
    } from "https://www.gstatic.com/firebasejs/10.12.2/firebase-firestore.js";

    // Firebase Console(config)
const firebaseConfig = {
  apiKey: "AIzaSyAcictnKPsnIq7Udyiz2XGIuMo72dRdlvU",
  authDomain: "e-commerce-js-app.firebaseapp.com",
  projectId: "e-commerce-js-app",
  storageBucket: "e-commerce-js-app.firebasestorage.app",
  messagingSenderId: "383942089852",
  appId: "1:383942089852:web:99224fda7fd586e7cafdf9",
  measurementId: "G-TV0G1TS360",
};

    //on fribase
    const app = initializeApp(firebaseConfig);
    const db = getFirestore(app);

    // readproducts 
    var productCard=document.getElementById('productCard');
var productList=document.querySelector('.product-list');
var category=document.getElementById('category');
var collectionRef = collection(db, "products");
        const querySnapshot = await getDocs(collection(db, "products"));
        productList.innerHTML = ''; // Clear existing products
        querySnapshot.forEach(product => {
            const card = productCard.cloneNode(true);
            productList
            card.querySelector('img').src = product.image;
            card.querySelector('h3').textContent = product.name;
            card.querySelector('.price').textContent = `$${product.price}`;
            card.setAttribute('data-category', product.category);
            productList.appendChild(card);
          
            
        });
           
productList.innerHTML = ''; // Clear existing products

querySnapshot.forEach((doc) => {
    const data = doc.data();
    const card = productCard.cloneNode(true);

    //  details product
    card.querySelector('img').src = data.image;
    card.querySelector('h3').textContent = data.name;
    card.querySelector('.price').textContent = `$${data.price}`;
    card.setAttribute('data-category', data.category);

    
    card.setAttribute('data-id', doc.id);

    card.addEventListener('click', () => {
        window.location.href = `storeProduct.html?id=${doc.id}`;
    });

    productList.appendChild(card);
});

        
  querySnapshot.forEach((doc) => {
    console.log(doc.id, " => ", doc.data());
  });
