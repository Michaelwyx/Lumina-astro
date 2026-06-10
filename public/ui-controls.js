/* 布局交互:在左侧目录 / 右侧本页目录的边缘各放一个收起·展开按钮。
   偏好存 localStorage('wikiUI');支持可分享链接 ?ui=nosb,notoc。 */
(function () {
  var root = document.documentElement;
  var en = location.pathname.indexOf('/en') === 0;
  var T = en
    ? { sb: 'Collapse / show sidebar', toc: 'Collapse / show contents' }
    : { sb: '收起 / 展开左侧目录', toc: '收起 / 展开右侧本页目录' };

  function load() { try { return JSON.parse(localStorage.getItem('wikiUI') || '{}'); } catch (e) { return {}; } }
  function save(st) { try { localStorage.setItem('wikiUI', JSON.stringify(st)); } catch (e) {} }
  var s = load();
  try {
    var q = new URLSearchParams(location.search).get('ui');
    if (q) {
      q.split(',').forEach(function (p) {
        if (p === 'nosb') s.hideSidebar = true; else if (p === 'sb') s.hideSidebar = false;
        else if (p === 'notoc') s.hideToc = true; else if (p === 'toc') s.hideToc = false;
      });
      save(s);
    }
  } catch (e) {}

  var CHEV_L = '<svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2.5" stroke-linecap="round" stroke-linejoin="round"><polyline points="15 18 9 12 15 6"/></svg>';
  var CHEV_R = '<svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2.5" stroke-linecap="round" stroke-linejoin="round"><polyline points="9 18 15 12 9 6"/></svg>';

  function mkEdge(cls, icon, title) {
    var b = document.createElement('button');
    b.type = 'button'; b.className = 'edge-toggle ' + cls; b.title = title; b.setAttribute('aria-label', title);
    b.innerHTML = icon;
    return b;
  }
  var btnSb = mkEdge('sb', CHEV_L, T.sb);
  var btnToc = mkEdge('toc', CHEV_R, T.toc);
  document.body.appendChild(btnSb);
  document.body.appendChild(btnToc);

  var leftSb = document.querySelector('#starlight__sidebar');
  var rightToc = document.querySelector('.right-sidebar-container');

  function placeToggles() {
    if (leftSb) {
      var lx = s.hideSidebar ? 0 : Math.max(0, leftSb.getBoundingClientRect().right);
      btnSb.style.left = lx + 'px';
      btnSb.style.transform = s.hideSidebar ? 'translateY(-50%)' : 'translate(-50%,-50%)';
    } else { btnSb.style.display = 'none'; }
    if (rightToc) {
      var rr = s.hideToc ? 0 : Math.max(0, window.innerWidth - rightToc.getBoundingClientRect().left);
      btnToc.style.right = rr + 'px';
      btnToc.style.transform = s.hideToc ? 'translateY(-50%)' : 'translate(50%,-50%)';
    } else { btnToc.style.display = 'none'; }
    btnSb.style.opacity = '1'; btnToc.style.opacity = '1';
  }
  function applyState() {
    root.toggleAttribute('data-hide-sidebar', !!s.hideSidebar);
    root.toggleAttribute('data-hide-toc', !!s.hideToc);
    btnSb.classList.toggle('is-collapsed', !!s.hideSidebar);
    btnToc.classList.toggle('is-collapsed', !!s.hideToc);
    requestAnimationFrame(placeToggles);
  }

  btnSb.addEventListener('click', function () { s.hideSidebar = !s.hideSidebar; save(s); applyState(); });
  btnToc.addEventListener('click', function () { s.hideToc = !s.hideToc; save(s); applyState(); });
  window.addEventListener('resize', placeToggles);

  applyState();
})();
