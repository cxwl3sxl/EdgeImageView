export class DragHelper {
    private readonly _ele: HTMLElement;
    private _isDragging = false;
    private _startX = 0;
    private _startY = 0;
    private _eleX = 0;
    private _eleY = 0;
    private _clickHandler: Function | undefined;
    private _dragCount: number = 0;

    constructor(ele: HTMLElement, clickHandler?: Function) {
        this._ele = ele;
        this._ele.style.position = this._ele.style.position || "absolute";
        this._ele.style.top = "100px";
        this._ele.style.left = "100px";
        this._ele.addEventListener("mousedown", this._onMouseDown);
        this._clickHandler = clickHandler;
    }

    private _onMouseDown = (e: MouseEvent) => {
        e.preventDefault();
        this._isDragging = true;
        this._startX = e.clientX;
        this._startY = e.clientY;
        this._eleX = parseInt(this._ele.style.left || "0", 10);
        this._eleY = parseInt(this._ele.style.top || "0", 10);
        this._dragCount = 0;

        document.addEventListener("mousemove", this._onMouseMove);
        document.addEventListener("mouseup", this._onMouseUp);
    };

    private _onMouseMove = (e: MouseEvent) => {
        if (!this._isDragging) return;
        this._dragCount += 1;
        const deltaX = e.clientX - this._startX;
        const deltaY = e.clientY - this._startY;
        this._ele.style.left = `${this._eleX + deltaX}px`;
        this._ele.style.top = `${this._eleY + deltaY}px`;
    };

    private _onMouseUp = () => {
        if (!this._isDragging) {
            return;
        }
        this._isDragging = false;
        document.removeEventListener("mousemove", this._onMouseMove);
        document.removeEventListener("mouseup", this._onMouseUp);
        if (this._dragCount < 10) {
            this._clickHandler?.apply(this._ele);
        }
    };
}