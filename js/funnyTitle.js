// <!--浏览器搞笑标题-->
/* 离开当前页面时修改网页标题，回到当前页面时恢复原来标题 */
window.onload = function() {
    var OriginTitile = document.title;
    var titleTime;
    document.addEventListener('visibilitychange', function() {
      if(document.hidden) {
        $('[rel="icon"]').attr('href', "/failure.ico");
        $('[rel="shortcut icon"]').attr('href', "/failure.ico");
        document.title = '喔唷，崩溃啦！';
        clearTimeout(titleTime);
      } else {
        $('[rel="icon"]').attr('href', "/ayer.svg");
        $('[rel="shortcut icon"]').attr('href', "/ayer.svg");
        document.title = '咦，页面又好了！';
        titleTime = setTimeout(function() {
          document.title = OriginTitile;
        }, 2000);
      }
    });
  }
  