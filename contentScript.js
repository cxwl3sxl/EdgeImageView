// 插件内容脚本，负责插入口和相册逻辑
(function () {
  // 随机图片占位符（可替换为任意图片链接）
  const randomImg = 'https://picsum.photos/48?random=' + Math.floor(Math.random() * 1000);
  // 创建可拖动入口
  const entry = document.createElement('img');
  entry.src = randomImg;
  entry.id = 'imageview-entry';
  entry.style.position = 'fixed';
  entry.style.top = '120px';
  entry.style.left = '20px';
  entry.style.width = '48px';
  entry.style.height = '48px';
  entry.style.zIndex = 999999;
  entry.style.cursor = 'move';
  entry.style.borderRadius = '50%';
  entry.style.boxShadow = '0 2px 8px rgba(0,0,0,0.2)';
  entry.style.background = '#fff';
  entry.style.userSelect = 'none';
  entry.title = '点击查看本页所有图片';
  document.body.appendChild(entry);

  // 拖动逻辑
  let isDragging = false, offsetX = 0, offsetY = 0;
  entry.addEventListener('mousedown', function (e) {
    isDragging = true;
    offsetX = e.clientX - entry.offsetLeft;
    offsetY = e.clientY - entry.offsetTop;
    document.body.style.userSelect = 'none';
  });
  document.addEventListener('mousemove', function (e) {
    if (isDragging) {
      entry.style.left = (e.clientX - offsetX) + 'px';
      entry.style.top = (e.clientY - offsetY) + 'px';
    }
  });
  document.addEventListener('mouseup', function () {
    isDragging = false;
    document.body.style.userSelect = '';
  });

  // 点击入口，筛选页面所有图片
  entry.addEventListener('click', function (e) {
    if (isDragging) return;
    const imgs = Array.from(document.images)
      .filter(img => img.width > 60 && img.height > 60 && img.src && !img.src.startsWith('data:'));
    if (imgs.length === 0) {
      alert('未找到合适的图片');
      return;
    }
    // 创建相册遮罩层
    if (document.getElementById('imageview-album-mask')) return;
    const mask = document.createElement('div');
    mask.id = 'imageview-album-mask';
    mask.style.position = 'fixed';
    mask.style.left = 0;
    mask.style.top = 0;
    mask.style.width = '100vw';
    mask.style.height = '100vh';
    mask.style.background = 'rgba(0,0,0,0.55)';
    mask.style.zIndex = 1000000;
    mask.style.display = 'flex';
    mask.style.flexDirection = 'column';
    mask.style.alignItems = 'center';
    mask.style.justifyContent = 'center';
    document.body.appendChild(mask);

    // 当前大图索引
    let current = 0;
    // 大图展示区
    const bigImg = document.createElement('img');
    bigImg.id = 'imageview-bigimg';
    bigImg.src = imgs[current].src;
    bigImg.style.maxWidth = '80vw';
    bigImg.style.maxHeight = '70vh';
    bigImg.style.borderRadius = '8px';
    bigImg.style.boxShadow = '0 4px 24px rgba(0,0,0,0.4)';
    bigImg.style.transition = 'transform 0.3s';
    mask.appendChild(bigImg);

    // 工具栏（仅旋转、下载、关闭）
    const toolbar = document.createElement('div');
    toolbar.style.margin = '16px 0 8px 0';
    toolbar.style.display = 'flex';
    toolbar.style.top = "0px";
    toolbar.style.position = "fixed";
    toolbar.style.right = "10px";
    toolbar.style.gap = '16px';
    toolbar.style.justifyContent = 'center';
    toolbar.style.alignItems = 'center';
    toolbar.style.padding = "8px 10px";
    toolbar.style.borderRadius = "8px"
    toolbar.style.background = 'rgba(30,30,30,0.85)';
    toolbar.style.boxShadow = '0 2px 12px rgba(0,0,0,0.25)';
    mask.appendChild(toolbar);
    let scale = 1, rotate = 0;
    function updateTransform() {
      bigImg.style.transform = `scale(${scale}) rotate(${rotate}deg)`;
    }
    // 旋转按钮
    const rotateBtn = document.createElement('button');
    rotateBtn.textContent = '旋转';
    rotateBtn.onclick = () => { rotate = (rotate + 90) % 360; updateTransform(); };
    // 下载按钮
    const downloadBtn = document.createElement('button');
    downloadBtn.textContent = '下载';
    downloadBtn.onclick = () => {
      const a = document.createElement('a');
      a.href = bigImg.src;
      a.download = 'image.jpg';
      a.click();
    };
    // 关闭按钮
    const closeBtn = document.createElement('button');
    closeBtn.textContent = '关闭';
    closeBtn.onclick = () => mask.remove();
    toolbar.append(rotateBtn, downloadBtn, closeBtn);

    // 缩略图切换条
    const thumbBar = document.createElement('div');
    thumbBar.style.position = 'fixed';
    thumbBar.style.left = '50%';
    thumbBar.style.transform = 'translateX(-50%)';
    thumbBar.style.bottom = '20px';
    thumbBar.style.display = 'flex';
    thumbBar.style.overflowX = 'auto';
    thumbBar.style.gap = '8px';
    thumbBar.style.margin = '0';
    thumbBar.style.padding = '8px 10px';
    thumbBar.style.maxWidth = '80vw';
    thumbBar.style.background = 'rgba(30,30,30,0.85)';
    thumbBar.style.borderRadius = '8px';
    thumbBar.style.boxShadow = '0 2px 12px rgba(0,0,0,0.25)';
    thumbBar.style.zIndex = 1000001;
    mask.appendChild(thumbBar);
    imgs.forEach((img, idx) => {
      const thumb = document.createElement('img');
      thumb.src = img.src;
      thumb.style.width = '56px';
      thumb.style.height = '56px';
      thumb.style.objectFit = 'cover';
      thumb.style.borderRadius = '6px';
      thumb.style.cursor = 'pointer';
      thumb.style.border = idx === current ? '2px solid #fff' : '2px solid transparent';
      thumb.onclick = () => {
        current = idx;
        bigImg.src = imgs[current].src;
        scale = 1; rotate = 0; updateTransform();
        Array.from(thumbBar.children).forEach((t, i) => t.style.border = i === current ? '2px solid #fff' : '2px solid transparent');
      };
      thumbBar.appendChild(thumb);
    });
    // 鼠标滚轮缩放
    bigImg.addEventListener('wheel', function (e) {
      e.preventDefault();
      if (e.deltaY < 0) {
        scale += 0.15;
      } else {
        scale = Math.max(0.2, scale - 0.15);
      }
      updateTransform();
    });
  });
})();