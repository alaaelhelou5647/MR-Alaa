function show() {
  const menu = document.getElementById("men");
  const overlay = document.getElementById("overlay");

  menu.classList.toggle("active");
  overlay.classList.toggle("active");

  document.body.classList.toggle("no-scroll");
}

// لما تدوس برا يقفل ويرجع السكرول
document.getElementById("overlay").addEventListener("click", function(){
  document.getElementById("men").classList.remove("active");
  this.classList.remove("active");
  document.body.classList.remove("no-scroll");
});