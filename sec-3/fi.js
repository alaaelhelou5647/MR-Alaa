import { initializeApp } from "https://www.gstatic.com/firebasejs/10.8.0/firebase-app.js";
import { 
  getFirestore, 
  collection, 
  query, 
  where, 
  getDocs 
} from "https://www.gstatic.com/firebasejs/10.8.0/firebase-firestore.js";

const firebaseConfig = {
  apiKey: "AIzaSyCTLfpSbUAhiKFKE7xAUrQUL5-Lravz9wk",
  authDomain: "lectures-123.firebaseapp.com",
  projectId: "lectures-123",
  storageBucket: "lectures-123.firebasestorage.app",
  messagingSenderId: "973877461046",
  appId: "1:973877461046:web:3f592e25dc5cccc2acd897",
  measurementId: "G-S11P8RK046"
};

const app = initializeApp(firebaseConfig);
const db = getFirestore(app);

let currentFilter = "sec-3";

async function loadLectures(filterGrade = "sec-3"){
  const container = document.getElementById("lectures");
  
  // إظهار حالة التحميل
  container.innerHTML = `
    <div class="loading">
      <i class="fas fa-spinner fa-spin"></i>
      
    </div>
  `;

  try {
    let q;
    if (filterGrade === "all") {
      // جلب جميع المحاضرات بدون فلترة
      q = query(collection(db, "lectures"));
    } else {
      // الفلترة حسب الصف
      q = query(
        collection(db, "lectures"),
        where("grade", "==", "sec-3")
      );
    }

    const querySnapshot = await getDocs(q);
    
    // إذا لم توجد نتائج
    if (querySnapshot.empty) {
      container.innerHTML = `
        <div class="empty-state">
          <i class="far fa-folder-open"></i>
          <h3>لا توجد محاضرات متاحة حالياً</h3>
          <p>سيتم إضافة محاضرات جديدة قريباً</p>
        </div>
      `;
      return;
    }

    // عرض المحاضرات
    container.innerHTML = "";
    
    querySnapshot.forEach(doc => {
      const d = doc.data();
      
      // تحديد لون البادجة بناءً على السعر
      const badgeClass = d.paid === "free" ? "badge free" : "badge";
      const badgeText = d.paid === "free" ? "مجاني" : d.price + " جنيه";
      
      const card = `
      <div class="card">
        <div class="card-image">
          <div class="overlay"></div>
          <img src="${d.image_link || 'https://images.unsplash.com/photo-1501504905252-473c47e087f8?ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D&auto=format&fit=crop&w=800&q=80'}" alt="${d.col}">
        </div>
        <div class="card-content">
          <h3 class="card-title">${d.col}</h3>
          <div class="card-details">
            <div class="detail-item">
              <i class="fas fa-book-open"></i>
              <span>المادة: ${d.subject || "غير محدد"}</span>
            </div>
            <div class="detail-item">
              <i class="fas fa-video"></i>
              <span>عدد الفيديوهات: ${d.videoCount || 0}</span>
            </div>

             <div class="detail-item">
              <span class="${badgeClass}"><i class="fas fa-money-bill-wave"></i> ${badgeText}</span>
            </div>
          </div>
          <a class="button" href="watch/?lecture=${encodeURIComponent(d.col)}">
            <i class="fas fa-play-circle"></i> ابدأ المشاهدة
          </a>
        </div>
      </div>
      `;

      container.innerHTML += card;
    });
  } catch (error) {
    console.error("خطأ في تحميل المحاضرات:", error);
    container.innerHTML = `
      <div class="empty-state">
        <i class="fas fa-exclamation-triangle"></i>
        <h3>حدث خطأ في تحميل المحاضرات</h3>
        <p>يرجى المحاولة مرة أخرى لاحقاً</p>
      </div>
    `;
  }
}



// تفعيل أزرار الفلترة
function setupFilterButtons() {
  const filterButtons = document.querySelectorAll('.filter-btn');
  
  filterButtons.forEach(button => {
    button.addEventListener('click', () => {
      // إزالة النشاط من جميع الأزرار
      filterButtons.forEach(btn => btn.classList.remove('active'));
      
      // إضافة النشاط للزر المحدد
      button.classList.add('active');
      
      // تحديث المرشح الحالي
      currentFilter = button.dataset.grade;
      
      // تحميل المحاضرات بناءً على المرشح الجديد
      loadLectures(currentFilter);
    });
  });
}

document.addEventListener('DOMContentLoaded', () => {
  loadLectures();
  setupFilterButtons();
});
