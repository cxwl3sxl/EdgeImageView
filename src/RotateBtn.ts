import { ImageView } from "./ImageView";
import { ITool } from "./ITool";

export class RotateButton implements ITool {

    private readonly _btn: HTMLElement;
    private _iv: ImageView | undefined;
    private _rotate: number = 0;

    constructor() {
        this._btn = document.createElement('button');
        this._btn.textContent = '旋转';
        this._btn.addEventListener("click", this._clickHandler.bind(this));
    }

    setImageView(view: ImageView): ITool {
        this._iv = view;
        return this;
    }
    render(): HTMLElement {
        return this._btn;
    }

    _clickHandler() {
        this._rotate = (this._rotate + 90) % 360;
        this._iv?.rotate(this._rotate);
    }
}