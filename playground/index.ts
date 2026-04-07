import "./styles.css";

import { Editor } from "@tiptap/core";
import StarterKit from "@tiptap/starter-kit";
import Highlight from "@tiptap/extension-highlight";
import { Markdown } from "@tiptap/markdown";

import Copyable from "../src/index";

function main() {
    const editor = new Editor({
        element: document.querySelector(".element"),
        extensions: [StarterKit, Markdown, Highlight, Copyable],
        content: "<p>Hello World!</p>",
    });

    document.querySelector("#GetText")?.addEventListener("click", () => {
        console.log(editor.getText());
    });
    document.querySelector("#GetJSON")?.addEventListener("click", () => {
        console.log(editor.getJSON());
    });
    document.querySelector("#GetMarkdown")?.addEventListener("click", () => {
        console.log(editor.getMarkdown());
    });
    document.querySelector("#GetHTML")?.addEventListener("click", () => {
        console.log(editor.getHTML());
    });
}

window.addEventListener("load", main);
