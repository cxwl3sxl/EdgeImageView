import { ImageView } from "./ImageView";
import { ITool } from "./ITool";

export class CloseButton implements ITool {

    private readonly _btn: HTMLElement;
    private _iv: ImageView | undefined;

    constructor() {
        this._btn = document.createElement('button');
        this._btn.textContent = '关闭';
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
        this._iv?.close();
    }
}