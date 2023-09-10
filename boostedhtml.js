// boosted-html main framework

/**  Component logic relies on single IDs. It's crucial to avoid a lot of Github issues */
function idCheck() {
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
function handleImport() {
    const importTags = document.querySelectorAll("include");
    const fetchPromises = [];
    importTags.forEach(importElement => {
        const url = importElement.getAttribute("url");
        if (url) {
            const fetchPromise = fetch(url)
                .then(response => response.text())
                .then(html => {
                    importElement.innerHTML = html;
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
function evaluateComponent(attribute) {
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
function componentTag() {
    evaluateComponent("component")
    evaluateComponent("data-component")
}

/** Evaluates the read tags. Crucial for component logic (element reproduction) */
function readTag() {
    let readTags = document.getElementsByTagName("read");
    for (let i = 0; i < readTags.length; i++) {
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
            for (let j = 0; j < slotTags.length; j++) {
                let slotTag = slotTags[j];
                tag.innerHTML = tag.innerHTML.replace(slotTag.outerHTML, slot);
            }
            
            // Didn't want to refactor the code, so just I transfered the read tag to a new one
            let newDiv = document.createElement("div")
            var index;
            while (tag.firstChild) {
                newDiv.appendChild(tag.firstChild);
            }
            for (index = tag.attributes.length - 1; index >= 0; --index) {
                newDiv.attributes.setNamedItem(tag.attributes[index].cloneNode()); 
            }
            for (var j = 0; j < newDiv.attributes.length; j++) {
                var attr = newDiv.attributes[j];
                newDiv.innerHTML = newDiv.innerHTML.replace(`{{prop:${attr.name}}}`, attr.value)
            }
            tag.parentNode.replaceChild(newDiv, tag);
            newDiv.removeAttribute("target")
        }
    }
}

/** Evaluates the replace tags. Crucial for component logic (imperative templating) */
function replaceTag() {
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
function createCustomElement(htmlContent) {
    const elementName = 'scoped-' + Math.random().toString(36).substring(2);
    customElements.define(
        elementName,
        class extends HTMLElement {
            constructor() {
                super();
                const shadowRoot = this.attachShadow({ mode: 'open' });
                shadowRoot.innerHTML = htmlContent;
            }
        }
    );
    return document.createElement(elementName);
}

/** Nestes elements with a specific attribute with the createCustomElement() function
 * @param {string} attribute - Defines the specific attribute
 * @see createCustomElement()
 */
function replaceScopedElements(attribute) {
    const scopedElements = document.querySelectorAll(`[${attribute}]`);
    scopedElements.forEach((element) => {
        element.removeAttribute(attribute)
        const htmlContent = element.outerHTML;
        const customElement = createCustomElement(htmlContent);
        element.parentNode.replaceChild(customElement, element);
    });
}

/**  References the replaceScopedElements() with the scoped attribute and the data variant
 * @see replaceScopedElements()
*/
function scopedElements() {
    replaceScopedElements("scoped");
    replaceScopedElements("data-scoped");
}

/** Main boosted-html function, async to await handleImport() */
async function main() {
    idCheck()
    await handleImport()
    componentTag()
    readTag()
    replaceTag()
    scopedElements()
}

/** Loops the function indefinetely every time that a specific interval elapses
 * @param {int} timing - Defines the specific interval
*/
function reactive(timing) {
    main()
    setTimeout(main, timing)
}

reactive(53)

// boosted-router

function duplicateRemover(element) {
    const metaTags = document.querySelectorAll(element);
    const uniqueMetaTags = {};
    metaTags.forEach(metaTag => {
        const tagContent = metaTag.outerHTML;
        if (uniqueMetaTags[tagContent]) {
            metaTag.parentNode.removeChild(metaTag);
        } else {
            uniqueMetaTags[tagContent] = true;
        }
    });
}

// Swaps title and removes meta tags
function processContent(htmlContent) {
    const tempElement = document.createElement('div');
    tempElement.innerHTML = htmlContent;
    const titleElement = tempElement.querySelector('title');
    if (titleElement) {
        document.title = titleElement.textContent;
        titleElement.remove()
    }
    const metaTags = tempElement.querySelectorAll('meta');
    metaTags.forEach(metaTag => {
        metaTag.parentNode.removeChild(metaTag);
    });
    return tempElement.innerHTML;
}

function updateBodyContent(path) {
    fetch(path)
        .then(response => response.text())
        .then(content => {
            document.body.innerHTML = processContent(content)
            duplicateRemover("script"); duplicateRemover("link");
        })
        .catch(
            window.location.href = path
        );
}

function navigateTo(path) {
    history.pushState(null, null, path);
    updateBodyContent(path);
}

window.addEventListener('popstate', () => updateBodyContent(window.location.pathname));

const elementsWithRouteAttribute = document.querySelectorAll('[route]');
elementsWithRouteAttribute.forEach((element) => {
    const anchorElements = element.querySelectorAll('a');
    anchorElements.forEach((anchor) => {
        anchor.addEventListener('click', (event) => {
            event.preventDefault();
            navigateTo(anchor.getAttribute('href'));
        });
    });
});