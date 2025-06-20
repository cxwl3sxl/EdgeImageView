import { CloseButton } from "./CloseBtn";
import { DownloadButton } from "./DownloadBtn";
import { DragHelper } from "./DragHelper";
import Icon from "./Icon";
import { ImageView } from "./ImageView";
import { RefreshButton } from "./RefreshBtn";
import { RotateButton } from "./RotateBtn";

// 创建可拖动入口
const entry = document.createElement('img');
entry.src = Icon;
entry.id = 'imageview-entry';
entry.style.position = 'fixed';
entry.style.left = `${window.innerWidth - 20 - 48}px`;
entry.style.top = `${window.innerHeight - 50 - 48}px`;
entry.style.width = '48px';
entry.style.height = '48px';
entry.style.zIndex = "999999";
entry.style.cursor = 'grab';
entry.style.borderRadius = '50%';
entry.style.boxShadow = '0 2px 8px rgba(0,0,0,0.2)';
entry.style.background = '#fff';
entry.style.userSelect = 'none';
entry.title = '点击查看本页所有图片';
document.body.appendChild(entry);
const iv = new ImageView();
new DragHelper(entry, () => {
    iv.show();
    if (iv.reloadImages()) return;
    iv.close();
});

iv.addTool(new DownloadButton().setImageView(iv));
iv.addTool(new RotateButton().setImageView(iv));
iv.addTool(new RefreshButton().setImageView(iv));
iv.addTool(new CloseButton().setImageView(iv));