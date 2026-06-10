/* 首页标语打字机动画:逐字打出、停留、删除,循环切换文案(传达内容 + 名人对宇宙的思考)。 */
(function () {
  // 把首页标题「拾光记 Lumina」拆成中/英两段,分别设字号与颜色(对齐左上角站名)
  var h1 = document.querySelector('.hero h1');
  if (h1 && !h1.querySelector('.brand-en')) {
    var m = h1.textContent.match(/^([^A-Za-z]+?)\s*([A-Za-z][\s\S]*)$/);
    if (m) {
      h1.innerHTML = '<span class="brand-zh">' + m[1].trim() + '</span><span class="brand-en">' + m[2].trim() + '</span>';
    }
  }

  var el = document.querySelector('.hero .tagline');
  if (!el) return;
  var en = (document.documentElement.lang || '').toLowerCase().indexOf('en') === 0;
  // 原版为中文的(《天问》《春江花月夜》《庄子》)在中英模式下都保留中文;
  // 原版非中文的(帕斯卡-法语、梵高-荷兰语、费曼-英语)中文模式用中译、英文模式用英文。
  var zhClassics = [
    '遂古之初，谁传道之？上下未形，何由考之？　——屈原《天问》',
    '江畔何人初见月？江月何年初照人？人生代代无穷已，江月年年望相似。　——张若虚',
    '天之苍苍，其正色邪？其远而无所至极邪？　——《庄子》',
  ];
  var phrases = en
    ? zhClassics.concat([
        'The eternal silence of these infinite spaces frightens me. — Pascal',
        'I know nothing with any certainty, but the sight of the stars makes me dream. — Van Gogh',
        'I, a universe of atoms; an atom in the universe. — Richard Feynman',
      ])
    : zhClassics.concat([
        '这些无限空间的永恒沉默，令我恐惧。　——帕斯卡',
        '我对任何事都没有把握，但群星的景象让我做梦。　——梵高',
        '我，一个由原子构成的宇宙；一个宇宙之中的原子。　——费曼',
      ]);

  el.textContent = '';
  el.classList.add('typewriter');
  var txt = document.createElement('span');
  txt.className = 'tw-text';
  var cur = document.createElement('span');
  cur.className = 'tw-cursor';
  cur.setAttribute('aria-hidden', 'true');
  el.appendChild(txt);
  el.appendChild(cur);

  var pi = 0, ci = 0, deleting = false;
  function tick() {
    var p = phrases[pi];
    if (!deleting) {
      ci++;
      txt.textContent = p.slice(0, ci);
      if (ci >= p.length) { deleting = true; return setTimeout(tick, 2000); }
      setTimeout(tick, 85 + Math.random() * 55);
    } else {
      ci--;
      txt.textContent = p.slice(0, ci);
      if (ci <= 0) { deleting = false; pi = (pi + 1) % phrases.length; return setTimeout(tick, 450); }
      setTimeout(tick, 35);
    }
  }
  setTimeout(tick, 500);
})();
