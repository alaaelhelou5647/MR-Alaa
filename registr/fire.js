import { initializeApp } from "https://www.gstatic.com/firebasejs/10.8.0/firebase-app.js";
import { getDatabase, ref, push, set } from "https://www.gstatic.com/firebasejs/10.8.0/firebase-database.js";

const firebaseConfig = {
  apiKey: "AIzaSyBB-L6uhazoGVYg2lkphimDMbdjFhrfXjw",
  authDomain: "login-87618.firebaseapp.com",
  projectId: "login-87618",
  storageBucket: "login-87618.firebasestorage.app",
  messagingSenderId: "915916987311",
  appId: "1:915916987311:web:0da484d712d79b50916d5a"
};

const app = initializeApp(firebaseConfig);
window.db = getDatabase(app);   // نخليها عامة عشان نستخدمها تحت
window.ref = ref;
window.push = push;
window.set = set;

function generateID(){
  return "MR-" + Date.now().toString().slice(-8);
}

function validPhone(num){
  return /^(010|011|012|015)\d{8}$/.test(num);
}

async function register(){
  let name = document.getElementById("name").value.trim();
  let sPhone = document.getElementById("studentPhone").value.trim();
  let pPhone = document.getElementById("parentPhone").value.trim();
  let grade = document.getElementById("grade").value;
  let gov = document.getElementById("gov").value;
  let pass = document.getElementById("password").value;

  if(name.split(" ").length < 3){
    alert("اكتب الاسم الثلاثي كامل!");
    return;
  }

  if(!validPhone(sPhone)){
    alert("رقم الطالب لازم يبدأ بـ 010/011/012/015 ويكون 11 رقم!");
    return;
  }

  if(pPhone.length < 10){
    alert("اكتب رقم ولي الأمر صحيح!");
    return;
  }

  if(!grade || !gov || pass.length < 4){
    alert("اكمل كل البيانات وكلمة المرور 4 أحرف على الأقل");
    return;
  }

  let id = generateID();

  let studentData = {
    id: id,
    name: name,
    studentPhone: sPhone,
    parentPhone: pPhone,
    grade: grade,
    governorate: gov,
    password: pass,
    createdAt: new Date().toLocaleString()
  };

  try {
    const studentsRef = window.ref(window.db, "students");
    const newStudentRef = window.push(studentsRef);
    await window.set(newStudentRef, studentData);

    document.getElementById("result").style.display = "block";
    document.getElementById("msg").innerHTML = `
    ✅ تم الحفظ في Firebase بنجاح!<br>
    🆔 معرفك: <b>${id}</b><br>
    🔑 كلمة المرور: <b>${pass}</b>
    `;
  } catch (err) {
    alert("خطأ في الحفظ: " + err.message);
  }
}