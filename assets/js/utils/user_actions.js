// assets/js/services/user_actions.js
import { db, doc, setDoc } from "../main.js";

const WISHLIST_COLLECTION = "wishlist"; // change to "wishlist" if you rename it

const getCurrentUser = () => {
  try {
    return JSON.parse(localStorage.getItem("user") || "null");
  } catch {
    return null;
  }
};

const buildItem = (p) => ({
  productId: p.id,
  name: p.name,
  price: p.price,
  imageUrl: p.image,
  quantity: 1,
  stock: p.stock,
  createdAt: new Date(),
});

const saveItem = (uid, subcol, p) =>
  setDoc(doc(db, "users", uid, subcol, p.id), buildItem(p));

export async function addToCart(p) {
  const user = getCurrentUser();
  if (!user) return alert("يرجى تسجيل الدخول أولاً لإضافة منتجات!");
  try {
    await saveItem(user.uid, "cart", p);
    alert(`${p.name} تم إضافته إلى عربة التسوق بنجاح!`);
  } catch (e) {
    console.error("addToCart error:", e);
    alert("حدث خطأ أثناء إضافة المنتج إلى السلة.");
  }
}

export async function addToWishlist(p) {
  const user = getCurrentUser();
  if (!user) return alert("يرجى تسجيل الدخول أولاً لإضافة منتجات!");
  try {
    await saveItem(user.uid, WISHLIST_COLLECTION, p);
    alert(`${p.name} تم إضافته إلى المفضلة بنجاح!`);
  } catch (e) {
    console.error("addToWishlist error:", e);
    alert("حدث خطأ أثناء إضافة المنتج إلى المفضلة.");
  }
}
