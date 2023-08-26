function checkStructure() {
    var htmlContent = document.documentElement.innerHTML;

    if (!document.querySelector('html')) {
      var htmlElement = document.createElement('html');
      document.replaceChild(htmlElement, document.documentElement);
      htmlElement.innerHTML = htmlContent;
    }
  
    if (!document.querySelector('body')) {
      var bodyElement = document.createElement('body');
      document.querySelector('html').appendChild(bodyElement);
      bodyElement.innerHTML = htmlContent;
    }

    if (!document.querySelector('head')) {
        var headElement = document.createElement('head');
        document.querySelector('html').insertBefore(headElement, document.querySelector('body'));
    } else {
        // Since the head will be wrapped inside the body tag, we take it out
        const head = document.head
        document.createElement('head').remove()
        document.querySelector('html').insertBefore(head, document.querySelector('body'));
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
                    console.error("Error fetching content:", error);
                });
        }
    });
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

// Needed for nestedTemplate()
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

function main() {
    checkStructure()
    idCheck()
    handleImport()
    readTag()
    replaceTag()
    nestedTemplate()
}

main()