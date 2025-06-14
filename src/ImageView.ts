import { DragHelper } from "./DragHelper";
import { ITool } from "./ITool";

export class ImageView {

    private readonly _mask: HTMLElement;
    private readonly _bigImage: HTMLImageElement;
    private readonly _toolbar: HTMLElement;
    private _images: Array<HTMLImageElement>;
    private _current: number = 0;
    private _scale: number = 1;
    private _rotate: number = 0;

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

    }

    private _updateTransform() {
        this._bigImage.style.transform = `scale(${this._scale}) rotate(${this._rotate}deg)`;
    }

    public show(): void {
        document.body.appendChild(this._mask);
    }

    public close(): void {
        this._mask.remove();
    }

    public reloadImages(): boolean {
        const imgs = Array.from(document.images)
            .filter(img => img.width > 60 && img.height > 60 && img.src);
        if (imgs.length === 0) {
            alert('未找到合适的图片');
            return false;
        }
        this._images = imgs;
        this._current = 0;
        this._bigImage.src = this._images[this._current].src;
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