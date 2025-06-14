export class DragHelper {
    private readonly _ele: HTMLElement;
    private _isDragging = false;
    private _startX = 0;
    private _startY = 0;
    private _eleX = 0;
    private _eleY = 0;

    constructor(ele: HTMLElement) {
        this._ele = ele;
        this._ele.style.position = this._ele.style.position || "absolute";
        this._ele.addEventListener("mousedown", this._onMouseDown);
    }

    private _onMouseDown = (e: MouseEvent) => {
        e.preventDefault();
        this._isDragging = true;
        this._startX = e.clientX;
        this._startY = e.clientY;
        this._eleX = parseInt(this._ele.style.left || "0", 10);
        this._eleY = parseInt(this._ele.style.top || "0", 10);

        document.addEventListener("mousemove", this._onMouseMove);
        document.addEventListener("mouseup", this._onMouseUp);
    };

    private _onMouseMove = (e: MouseEvent) => {
        if (!this._isDragging) return;
        const deltaX = e.clientX - this._startX;
        const deltaY = e.clientY - this._startY;
        this._ele.style.left = `${this._eleX + deltaX}px`;
        this._ele.style.top = `${this._eleY + deltaY}px`;
    };

    private _onMouseUp = () => {
        if (!this._isDragging) return;
        this._isDragging = false;
        document.removeEventListener("mousemove", this._onMouseMove);
        document.removeEventListener("mouseup", this._onMouseUp);
    };
}