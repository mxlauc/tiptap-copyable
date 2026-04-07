import { InputRule, mergeAttributes, Node } from "@tiptap/core"
import "./style.css"

const Copyable = Node.create(() => {
    return {
        name: "copyable",
        group: "inline",
        inline: true,
        content: "text*",
        atom: false,
        selectable: true,
        draggable: true,

        addAttributes() {
            return {
                hover: {
                    default: false,
                    rendered: false,
                },
            }
        },
        addOptions() {
            return {
                HTMLAttributes: {},
            }
        },
        parseHTML() {
            return [
                {
                    tag: "span",
                },
            ]
        },
        renderHTML({ HTMLAttributes }) {
            return [
                "span",
                mergeAttributes(this.options.HTMLAttributes, HTMLAttributes),
                0,
            ]
        },
        renderMarkdown(node, helpers) {
            const content = helpers.renderChildren(node.content || [])
            return `::${content}::`
        },
        parseMarkdown(token, helpers) {
            const content = helpers.parseInline(token.tokens || [])
            return {
                type: this.name,
                content,
            }
        },

        addNodeView() {
            return ({ getPos, editor }) => {
                const { view } = editor
                const dom = document.createElement("span")
                const content = document.createElement("span")
                dom.appendChild(content)

                const button = document.createElement("button")

                button.contentEditable = "false"
                button.addEventListener("mousedown", (e) => {
                    e.preventDefault()
                })
                button.addEventListener("click", () => {
                    const node = editor.state.doc.nodeAt(getPos()!)

                    navigator.clipboard.writeText(node?.textContent!)
                })

                button.addEventListener("mouseenter", () => {
                    view.dispatch(
                        view.state.tr.setNodeMarkup(getPos()!, undefined, {
                            hover: true,
                        }),
                    )
                })

                button.addEventListener("mouseleave", () => {
                    view.dispatch(
                        view.state.tr.setNodeMarkup(getPos()!, undefined, {
                            //hover: false,
                        }),
                    )
                })

                dom.appendChild(button)

                dom.classList.add("copyable-container")
                content.classList.add("copyable-content")
                button.classList.add("copyable-button")

                return {
                    dom,
                    contentDOM: content,

                    update: (updatedNode) => {
                        if (updatedNode.attrs.hover) {
                            content.classList.add("copyable-underline")
                        } else {
                            content.classList.remove("copyable-underline")
                        }

                        return true
                    },
                }
            }
        },

        addInputRules() {
            return [
                new InputRule({
                    find: /((?:^|\s))::(.*?)::/,
                    handler: ({ state, range, match }) => {
                        const { tr } = state
                        const start = range.from + match[1].length // se captura el espacio adelante
                        const end = range.to

                        // El texto que estaba entre los ::
                        const content = match[2]

                        if (content) {
                            tr.replaceWith(
                                start,
                                end,
                                this.type.create(
                                    { text: content },
                                    state.schema.text(content),
                                ),
                            )
                        }
                    },
                }),
            ]
        },
    }
})

export { Copyable }
