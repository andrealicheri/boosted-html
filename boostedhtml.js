// boosted-html main framework

function normalize() {
    const linkElement = document.createElement("link");
    linkElement.rel = "stylesheet";
    linkElement.href = "https://gist.githubusercontent.com/andrealicheri/f936346f5f0a1e70b7cf4eb388975d30/raw/9663622bcb0d90a4d28a3d84a631236cf3b979ad/gistfile1.txt";
    document.head.appendChild(linkElement);
}

// Component logic relies on single IDs, so this check is crucial to avoid a lot of Github issues
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

function handleImport() {
    const importTags = document.querySelectorAll("include");
    importTags.forEach(importElement => {
        const url = importElement.getAttribute("url");

        if (url) {
            fetch(url)
                .then(response => response.text())
                .then(html => {
                    importElement.innerHTML = html;
                })
                .catch(error => {
                    console.error("boosted-html error: failed to retrieve include (", error, ")");
                });
        }
    });
}

function componentTag() {
    const comps = document.querySelectorAll('[component]')
    comps.forEach(element => {
        let outerHTML = element.outerHTML;
        let tag = outerHTML.split("<")[1].split(" ")[0]
        let toUse = document.createElement("read")
        toUse.setAttribute("target", tag)
        element.removeAttribute("component")
        for (var j = 0; j < element.attributes.length; j++) {
            var attr = element.attributes[j];
            toUse.setAttribute(attr.name, attr.value);
        }
        element.parentNode.replaceChild(toUse, element)
    })

}

function readTag() {
    let readTags = document.getElementsByTagName("read")
    for (var i = 0; i < readTags.length; i++) {
        let tag = readTags[i]
        const slot = tag.innerHTML
        var variable = tag.getAttribute("target")
        let target = document.getElementById(variable)
        if (target) {
            // Rudimental slot implementation
            tag.innerHTML = target.innerHTML.replace("<slot />", slot).replace("<slot>", slot)
        } else {
            console.error('boosted-html error: read target with id "', variable, '" not found')
        }
    }
}

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

function generateRandomString(length) {
    const charset = "abcdefghijklmnopqrstuvwxyzABCDEFGHIJKLMNOPQRSTUVWXYZ0123456789";
    let randomString = "";
    for (let i = 0; i < length; i++) {
        const randomIndex = Math.floor(Math.random() * charset.length);
        randomString += charset[randomIndex];
    }
    return randomString;
}

function nestedTemplate() {
    const scopedElements = document.querySelectorAll('[scoped]');
    scopedElements.forEach(element => {
        const randomId = generateRandomString(64);
        element.setAttribute("class", randomId)
        element.setAttribute("style", "all:initial")
        const styleTags = element.querySelectorAll('style');
        styleTags.forEach(styleTag => {
            const cssText = styleTag.textContent.trim();
            const modifiedCssText = cssText.replace(/([^{]+)\{/g, (_, selectors) => {
                const modifiedSelectors = selectors.split(',').map(selector => `.${randomId} ${selector.trim()}`).join(', ');
                return `${modifiedSelectors} {`;
            });
            styleTag.textContent = modifiedCssText;
        });
    });
};

function main() {
    idCheck()
    handleImport()
    componentTag()
    readTag()
    replaceTag()
    nestedTemplate()
}

main()

// Since the main() function is re-executed every time boosted-router changes page, modern normalize
// is added only on page load.
normalize()

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
            main()
        })
        .catch(error => {
            window.location.href = path
        });
}

function navigateTo(path) {
    history.pushState(null, null, path);
    updateBodyContent(path);
}

window.addEventListener('popstate', () => updateBodyContent(window.location.pathname) && main());

document.addEventListener('click', (event) => {
    const target = event.target;
    const closestRouteDiv = target.closest('div[route]');
    if (closestRouteDiv && target.tagName === 'A') {
        event.preventDefault();
        navigateTo(target.getAttribute('href'));
    }
});