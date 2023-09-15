// boosted-html main framework

class boostedHTML {

    /**  Component logic relies on single IDs. It's crucial to avoid a lot of Github issues */
    idCheck() {
        const idSet = new Set();
        const duplicateIds = [];
        const elementsWithIds = document.querySelectorAll('[id]');
        elementsWithIds.forEach(element => {
            const id = element.id;
            if (idSet.has(id)) {
                duplicateIds.push(id);
            } else {
                idSet.add(id);
            }
        });
        if (duplicateIds.length > 0) {
            console.error('boosted-html error: duplicated id found (', duplicateIds, ')');
        }
    }

    /**  Handles import tags and returns a promise when it finishes */
    handleImport() {
        const importTags = document.querySelectorAll("include");
        const fetchPromises = [];
        importTags.forEach(importElement => {
            const url = importElement.getAttribute("url");
            if (url) {
                const fetchPromise = fetch(url)
                    .then(response => response.text())
                    .then(html => {
                        importElement.outerHTML = html;
                    })
                    .catch(error => {
                        console.error("boosted-html error: failed to retrieve include (", error, ")");
                    });
                fetchPromises.push(fetchPromise);
            }
        });
        return Promise.all(fetchPromises);
    }

    /**  Allows referencing read tags with the component syntax, check the wiki
     * @param {string} attribute - The component attribute
    */
    evaluateComponent(attribute) {
        const comps = document.querySelectorAll(`[${attribute}]`)
        comps.forEach(element => {
            let tag = element.tagName.toLowerCase()
            let toUse = document.createElement("read")
            toUse.innerHTML = element.innerHTML;
            toUse.setAttribute("target", tag)
            element.removeAttribute("component")
            for (var j = 0; j < element.attributes.length; j++) {
                var attr = element.attributes[j];
                toUse.setAttribute(attr.name, attr.value);
            }
            element.parentNode.replaceChild(toUse, element)
        })
    }

    /**  References the evaluateComponent() with the component attribute and the data variant
     * @see evaluateComponent()
    */
    componentTag() {
        boosted.evaluateComponent("component")
        boosted.evaluateComponent("data-component")
    }

    /** Evaluates the read tags. Crucial for component logic (element reproduction) */
    readTag() {
        let readTags = document.getElementsByTagName("read");
        for (let i = 0; i < readTags.length; i++) {
            boosted.slotCount += 1
            let tag = readTags[i];
            let variable = tag.getAttribute("target");
            let target = document.getElementById(variable);
            const slot = tag.innerHTML;
            if (!variable) {
                console.error('boosted-html error: read target not mentioned')
            } else if (!target) {
                console.error('boosted-html error: read target with id "', variable, '" not found');
            } else {
                let content = '';

                // CrazyHack™ to check that the referenced ID is a template, and use the right proprety accordingly
                if (target.tagName.toLowerCase() === 'template') {
                    const contentNodes = target.content.childNodes;
                    contentNodes.forEach((node) => {
                        content += node.nodeType === Node.ELEMENT_NODE ? node.outerHTML : node.textContent;
                    });
                } else {
                    content = target.innerHTML;
                }

                tag.innerHTML = content;

                // Slot handling
                let slotTags = tag.getElementsByTagName('slot');
                if (!tag.hasAttribute("data-original-slot")) {
                    tag.setAttribute("data-original-slot", slot)
                }
                for (let j = 0; j < slotTags.length; j++) {
                    let slotTag = slotTags[j];
                    tag.innerHTML = tag.innerHTML.replace(slotTag.outerHTML, tag.getAttribute("data-original-slot"));
                }

                // Prop templates handling
                for (var j = 0; j < tag.attributes.length; j++) {
                    var attr = tag.attributes[j];
                    tag.innerHTML = tag.innerHTML.replace(`{{prop:${attr.name}}}`, attr.value)
                }
            }
        }
    }

    /** Evaluates the replace tags. Crucial for component logic (imperative templating) */
    replaceTag() {
        let replaceTags = document.getElementsByTagName("replace")
        for (var i = 0; i < replaceTags.length; i++) {
            let tag = replaceTags[i]
            var variable = tag.getAttribute("target")
            var from = tag.getAttribute("from")
            var to = tag.getAttribute("to")
            let target = document.getElementById(variable)
            if (target) {
                target.innerHTML = target.innerHTML.replace(from, to)
            } else {
                console.error('boosted-html error: replace target with id "', variable, '" not found')
            }
            tag.remove()
        }
    }

    /** Nestes a specific string in the shadow DOM
     * @param {string} htmlContent - Defines the specific string
      */
    createCustomElement(htmlContent) {
        const elementName = 'scoped-' + Math.random().toString(36).substring(2);
        customElements.define(
            elementName,
            class extends HTMLElement {
                constructor() {
                    super();
                    const shadowRoot = this.attachShadow({ mode: "closed" });
                    shadowRoot.innerHTML = '<div style="all:initial">' + htmlContent + '</div>';
                }
            }
        );
        return document.createElement(elementName);
    }

    /** Nestes elements with a specific attribute with the createCustomElement() function
     * @param {string} attribute - Defines the specific attribute
     * @see createCustomElement()
     */
    replaceScopedElements(attribute) {
        const scopedElements = document.querySelectorAll(`[${attribute}]`);
        scopedElements.forEach((element) => {
            element.removeAttribute(attribute)
            const htmlContent = element.outerHTML;
            const customElement = boosted.createCustomElement(htmlContent);
            element.parentNode.replaceChild(customElement, element);
        });
    }

    /**  References the replaceScopedElements() with the scoped attribute and the data variant
     * @see replaceScopedElements()
    */
    scopedElements() {
        boosted.replaceScopedElements("scoped");
        boosted.replaceScopedElements("data-scoped");
    }

    /** Writes a read tag to a specific element outerHTML
    * @param {string} target - The target of the read tag
    * @param {HTMLelement} element - The reference of the specific element
    */
    writeFunction(target, element) {
        let toSet = element ?? event.target
        toSet.outerHTML = `<read id="${element.id}" target="${target}"></read>`
    }

    /** Custom event listener with a custom prefix that interfaces with writeFunction()
     * @param {string} prefix - The name of the prefix
     */
    htmlEventListener(prefix) {
        const allElements = document.querySelectorAll('*');
        allElements.forEach(element => {
            let toSet = "null"
            const attributes = element.attributes;
            for (var j = 0; j < attributes.length; j++) {
                var attr = attributes[j];
                if (attr.name.startsWith(prefix + ":target")) {
                    toSet = `document.getElementById("${attr.value}")`
                }
            }
            for (j = 0; j < attributes.length; j++) {
                attr = attributes[j];
                if (attr.name.startsWith(prefix + ":")) {
                    const newAttribute = attr.name.slice(prefix.length + 1)
                    const newValue = `boosted.writeFunction("${attr.value}", ${toSet})`
                    element.removeAttribute(attr.name)
                    element.setAttribute(newAttribute, newValue)
                }
            }
        });
    }

    interactivity() {
        boosted.htmlEventListener("html")
        boosted.htmlEventListener("data-html")
    }


    /** Main boosted-html function, async to await handleImport() */
    async main() {
        boosted.idCheck()
        await boosted.handleImport()
        boosted.componentTag()
        boosted.readTag()
        boosted.replaceTag()
        boosted.scopedElements()
        boosted.interactivity()
    }

    /** Loops a function indefinetely every time that a specific interval elapses
    * @param {Function} func - The function to be looped
    * @param {number} timing - Defines the specific interval
    */
    reactive(func, timing) {
        func
        setInterval(func, timing)
    }
}

const boosted = new boostedHTML();

// This interval was choosen because no human can notice delay at it
boosted.reactive(boosted.main, 53)