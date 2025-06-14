import { DragHelper } from "./DragHelper";
import { ITool } from "./ITool";

export class ImageView {

    private readonly _mask: HTMLElement;
    private readonly _bigImage: HTMLImageElement;
    private readonly _toolbar: HTMLElement;
    private readonly _thumbBar: HTMLElement;
    private _images: Array<HTMLImageElement>;
    private _current: number = 0;
    private _scale: number = 1;
    private _rotate: number = 0;
    private _isShowen: boolean = false;

    constructor() {
        this._mask = document.createElement('div');
        this._mask.id = 'imageview-album-mask';
        this._mask.style.position = 'fixed';
        this._mask.style.left = "0px";
        this._mask.style.top = "0px";
        this._mask.style.width = '100vw';
        this._mask.style.height = '100vh';
        this._mask.style.background = 'rgba(0,0,0,0.55)';
        this._mask.style.zIndex = "1000000";
        this._mask.style.display = 'flex';
        this._mask.style.flexDirection = 'column';
        this._mask.style.alignItems = 'center';
        this._mask.style.justifyContent = 'center';

        this._images = [];

        this._bigImage = document.createElement('img');
        this._bigImage.id = 'imageview-bigimg';
        //  this._bigImage.src = this._images[this._current].src;
        this._bigImage.style.maxWidth = '80vw';
        this._bigImage.style.maxHeight = '70vh';
        this._bigImage.style.borderRadius = '8px';
        this._bigImage.style.boxShadow = '0 4px 24px rgba(0,0,0,0.4)';
        this._bigImage.style.transition = 'transform 0.3s';
        this._bigImage.addEventListener("wheel", this._scaleImage.bind(this));
        this._mask.appendChild(this._bigImage);

        new DragHelper(this._bigImage);

        this._toolbar = document.createElement('div');
        this._toolbar.style.margin = '16px 0 8px 0';
        this._toolbar.style.display = 'flex';
        this._toolbar.style.top = "0px";
        this._toolbar.style.position = "fixed";
        this._toolbar.style.right = "10px";
        this._toolbar.style.gap = '16px';
        this._toolbar.style.justifyContent = 'center';
        this._toolbar.style.alignItems = 'center';
        this._toolbar.style.padding = "8px 10px";
        this._toolbar.style.borderRadius = "8px"
        this._toolbar.style.background = 'rgba(30,30,30,0.85)';
        this._toolbar.style.boxShadow = '0 2px 12px rgba(0,0,0,0.25)';
        this._mask.appendChild(this._toolbar);

        this._thumbBar = document.createElement('div');
        this._thumbBar.style.position = 'fixed';
        this._thumbBar.style.left = '50%';
        this._thumbBar.style.transform = 'translateX(-50%)';
        this._thumbBar.style.bottom = '20px';
        this._thumbBar.style.display = 'flex';
        this._thumbBar.style.overflowX = 'auto';
        this._thumbBar.style.gap = '8px';
        this._thumbBar.style.margin = '0';
        this._thumbBar.style.padding = '8px 10px';
        this._thumbBar.style.maxWidth = '80vw';
        this._thumbBar.style.background = 'rgba(30,30,30,0.85)';
        this._thumbBar.style.borderRadius = '8px';
        this._thumbBar.style.boxShadow = '0 2px 12px rgba(0,0,0,0.25)';
        this._thumbBar.style.zIndex = "1000001";
        this._mask.appendChild(this._thumbBar);

        document.addEventListener("keyup", this._handleKeyUp.bind(this));
    }

    private _updateTransform() {
        this._bigImage.style.transform = `scale(${this._scale}) rotate(${this._rotate}deg)`;
    }

    private _handleKeyUp(e: KeyboardEvent) {
        if (!this._isShowen) return;
        var i = 0;
        if (e.key == "ArrowRight") {
            i = 1;
        }
        else if (e.key == "ArrowLeft") {
            i = -1;
        }
        else {
            return;
        }
        const newIdx = this._current + i;
        if (newIdx < 0) return;
        if (newIdx >= this._images.length) return;
        this._current = newIdx;
        this._syncDisplayIndex();
    }

    private _scaleImage(e: WheelEvent) {
        e.preventDefault();
        if (e.deltaY < 0) {
            this._scale += 0.15;
        } else {
            this._scale = Math.max(0.2, this._scale - 0.15);
        }
        this._updateTransform();
    }

    private _switchToImage(e: MouseEvent) {
        if (e.currentTarget instanceof HTMLElement) {
            const idx = e.currentTarget.dataset.index;
            this._current = parseInt(idx!);
            this._syncDisplayIndex();
        }
    }

    private _syncDisplayIndex() {
        this._bigImage.src = this._images[this._current].src;
        this._scale = 1;
        this._rotate = 0;
        this._updateTransform();
        Array.from(this._thumbBar.children).forEach(ele => {
            if (ele instanceof HTMLElement) {
                ele.style.border = parseInt(ele.dataset.index!) === this._current ? '2px solid #00f' : '2px solid transparent'
            }
        });
    }

    public show(): void {
        document.body.appendChild(this._mask);
        this._isShowen = true;
    }

    public close(): void {
        this._mask.remove();
        this._isShowen = false;
    }

    public reloadImages(): boolean {
        this._thumbBar.innerHTML = '';
        const imgs = Array.from(document.images)
            .filter(img => img.width > 60 && img.height > 60 && img.src && img.id != "imageview-bigimg");
        if (imgs.length === 0) {
            alert('未找到合适的图片');
            return false;
        }
        this._images = imgs;
        this._current = 0;
        this._bigImage.src = this._images[this._current].src;

        imgs.forEach((img, idx) => {
            const thumb = document.createElement('img');
            thumb.src = img.src;
            thumb.style.width = '56px';
            thumb.style.height = '56px';
            thumb.style.objectFit = 'cover';
            thumb.style.borderRadius = '6px';
            thumb.style.cursor = 'pointer';
            thumb.dataset.index = `${idx}`;
            thumb.style.border = idx === this._current ? '2px solid #00f' : '2px solid transparent';
            thumb.addEventListener("click", this._switchToImage.bind(this));
            this._thumbBar.appendChild(thumb);
        });

        return true;
    }

    public addTool(tool: ITool): void {
        this._toolbar.append(tool.render());
    }

    public rotate(deg: number): void {
        this._rotate = deg;
        this._updateTransform();
    }

    public getCurrentImageSrc(): string {
        return this._bigImage.src;
    }
}