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
    handleImport(attribute) {
        const importTags = document.querySelectorAll(`[${attribute}]`);
        const fetchPromises = [];
        importTags.forEach(importElement => {
            const url = importElement.getAttribute(attribute);
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

    /**  Allows referencing b-read attributes with the component syntax, check the wiki
     * @param {string} attribute - The component attribute
    */
    evaluateComponent(attribute) {
        const comps = document.querySelectorAll(`[${attribute}]`)
        comps.forEach(element => {
            let tag = element.tagName.toLowerCase()
            let toUse = document.createElement("div")
            toUse.innerHTML = element.innerHTML;
            toUse.setAttribute("b-read", tag)
            element.removeAttribute("component")
            for (var j = 0; j < element.attributes.length; j++) {
                var attr = element.attributes[j];
                toUse.setAttribute(attr.name, attr.value);
            }
            element.parentNode.replaceChild(toUse, element)
        })
    }

    /** Evaluates the b-read attibute. Crucial for component logic (element reproduction) */
    readAttribute(attribute) {
        let readTags = document.querySelectorAll(`*[${attribute}]`);
        readTags.forEach(element => {
            let variable = element.getAttribute(attribute);
            let target = document.getElementById(variable);
            const slot = element.innerHTML;
            if (!variable) {
                console.error('boosted-html error: b-read reference not mentioned')
            } else if (!target) {
                console.error('boosted-html error: b-read reference with id "', variable, '" not found');
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

                element.innerHTML = content;

                // Slot handling
                let slotTags = element.getElementsByTagName('slot');
                if (!element.hasAttribute("data-original-slot")) {
                    element.setAttribute("data-original-slot", slot)
                }
                for (let j = 0; j < slotTags.length; j++) {
                    let slotTag = slotTags[j];
                    element.innerHTML = element.innerHTML.replace(slotTag.outerHTML, element.getAttribute("data-original-slot"));
                }

                // Prop templates handling
                for (var j = 0; j < element.attributes.length; j++) {
                    var attr = element.attributes[j];
                    var regex = new RegExp(`{{prop:${attr.name}}}`, 'g');
                    element.innerHTML = element.innerHTML.replace(regex, attr.value);
                }

                if (!element.hasAttribute("data-boosted-internal-event")) {
                    element.setAttribute("ref-boost-read", variable)
                }

                element.removeAttribute(attribute)
            }
        })
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

    generateRandomString(length) {
        const charset = "ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789";
        let randomString = "";
        for (let i = 0; i < length; i++) {
            const randomIndex = Math.floor(Math.random() * charset.length);
            randomString += charset[randomIndex];
        }
        return randomString;
    }

    /** Writes a b-read tag to a specific element outerHTML
    * @param {string} target - The reference of the b-read attribute
    * @param {HTMLelement} element - The reference of the specific element
    */
    writeFunction(target, element) {
        let toSet = element != false ? element : event.target.innerHTML
        var isID = ""
        toSet.outerHTML = `<div data-boosted-internal-event b-read="${target}"></div>`
        let readTags = document.querySelectorAll(`*[ref-boost-read]`);
        readTags.forEach(element => {
            var test = element.getAttribute("ref-boost-read")
            element.removeAttribute("ref-boost-read")
            element.setAttribute("b-read", test)

        })
        boosted.main()
    }

    /** Custom event listener with a custom prefix that interfaces with writeFunction()
     * @param {string} prefix - The name of the prefix
     */
    htmlEventListener(prefix) {
        const allElements = document.querySelectorAll('*');
        allElements.forEach(element => {
            let toSet = "false"
            const attributes = element.attributes;
            if (element.hasAttribute("?target")) {
                toSet = `document.getElementById("${element.getAttribute("?target")}")`
            }
            for (let j = 0; j < attributes.length; j++) {
                let attr = attributes[j];
                if (attr.name.startsWith(prefix + ":")) {
                    const newAttribute = attr.name.slice(prefix.length + 1)
                    const newValue = `boosted.writeFunction("${attr.value}", ${toSet})`
                    element.removeAttribute(attr.name)
                    element.setAttribute(newAttribute, newValue)
                }
            }
        });
    }


    /** Execute a function whenever the DOM isn't changed by the same
    * @param {Function} func - The function to be looped
    */
    reactive() {
        // OK!
        let readTags = document.querySelectorAll(`*[b-read]`);
        console.log(readTags.length)
        if (readTags.length > 0) {
            boosted.readAttribute("b-read")
        }

        // OK!
        let importTags = document.querySelectorAll(`*[b-import]`);
        if (importTags.length > 0) {
            boosted.handleImport("b-import")
        }

        // OK!
        let componentTags = document.querySelectorAll(`*[b-component]`);
        if (componentTags.length > 0) {
            boosted.evaluateComponent("b-component")
        }
        // OK!
        let scopedTags = document.querySelectorAll(`*[b-scoped]`);
        if (scopedTags.length > 0) {
            boosted.replaceScopedElements("b-scoped")
        }

        // OK!
        let onTags = document.querySelectorAll(`*[b-import]`);
        if (onTags.length > 0) {
            boosted.handleImport("b-import")
        }

        boosted.idCheck()


    }

    beReactive() {
        const observer = new MutationObserver((mutations) => {
            mutations.forEach((mutation) => {
                if (mutation.type === 'childList') {
                    boosted.reactive()
                }
            });
        });

        observer.observe(document.body, {
            childList: true,
            subtree: true
        });
    }

    /** Main boosted-html function, async to await handleImport() */
    async main() {
        boosted.idCheck()
        boosted.handleImport("b-import")
        boosted.evaluateComponent("b-component")
        boosted.readAttribute("b-read")
        boosted.replaceScopedElements("b-scoped")
        boosted.htmlEventListener("b-read")
    }

}

const boosted = new boostedHTML();
document.addEventListener("DOMContentLoaded", (event) => {
    boosted.main()
    boosted.beReactive()
});
