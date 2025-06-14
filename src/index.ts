import { CloseButton } from "./CloseBtn";
import { DragHelper } from "./DragHelper";
import { ImageView } from "./ImageView";

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
entry.style.zIndex = "999999";
entry.style.cursor = 'move';
entry.style.borderRadius = '50%';
entry.style.boxShadow = '0 2px 8px rgba(0,0,0,0.2)';
entry.style.background = '#fff';
entry.style.userSelect = 'none';
entry.title = '点击查看本页所有图片';
document.body.appendChild(entry);
new DragHelper(entry);
const iv = new ImageView();
entry.addEventListener("click", () => {
    iv.show();
    if (iv.reloadImages()) return;
    iv.close();
});

iv.addTool(new CloseButton().setImageView(iv));