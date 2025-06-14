import { ImageView } from "./ImageView";
import { ITool } from "./ITool";

export class DownloadButton implements ITool {

    private readonly _btn: HTMLElement;
    private _iv: ImageView | undefined;

    constructor() {
        this._btn = document.createElement('button');
        this._btn.textContent = '下载';
        this._btn.addEventListener("click", this._clickHandler.bind(this));
    }

    setImageView(view: ImageView): ITool {
        this._iv = view;
        return this;
    }
    render(): HTMLElement {
        return this._btn;
    }

    async _clickHandler() {
        const src = this._iv?.getCurrentImageSrc();
        if (!src) return;

        // 尝试通过 fetch 获取图片并转为 blob，避免新标签页打开
        try {
            const response = await fetch(src, { mode: "cors" });
            const blob = await response.blob();
            const url = URL.createObjectURL(blob);

            const a = document.createElement('a');
            a.style.display = 'none';
            a.href = url;
            a.download = 'image.jpg';
            document.body.appendChild(a);
            a.click();
            document.body.removeChild(a);
            URL.revokeObjectURL(url);
        } catch {
            // fallback: 直接下载（如 data URL 或同源图片）
            const a = document.createElement('a');
            a.style.display = 'none';
            a.href = src;
            a.download = 'image.jpg';
            document.body.appendChild(a);
            a.click();
            document.body.removeChild(a);
        }
    }
}