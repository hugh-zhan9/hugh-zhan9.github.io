var oldTitle = document.title;
var titleTime; //標題恢復計時器
document.addEventListener("visibilitychange", function () {
  if (document.hidden) {
    document.querySelector("[rel='icon']").setAttribute("href", "/images/icons/favicon.ico");
    document.title = " (๑•ั็ω•็ั๑)網站崩潰啦！";
    clearTimeout(titleTime);
  } else {
    document.title = "(ฅ´ω`ฅ)喵~";
    document.querySelector("[rel='icon']").setAttribute("href", "/images/icons/crash.ico");
    titleTime = setTimeout(function () {
      document.title = oldTitle;
    }, 1000);
  }
});
