import { ImageView } from "./ImageView";

export interface ITool {
    render(): HTMLElement;

    setImageView(view: ImageView): ITool;
}