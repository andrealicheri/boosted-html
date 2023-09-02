// boosted-html main framework
function normalize() {
    const linkElement = document.createElement("style");
    linkElement.innerHTML = `progress,sub,sup{vertical-align:baseline}*,::after,::before{box-sizing:border-box}html{font-family:system-ui,'Segoe UI',Roboto,Helvetica,Arial,sans-serif,'Apple Color Emoji','Segoe UI Emoji';line-height:1.15;-webkit-text-size-adjust:100%;-moz-tab-size:4;tab-size:4}body{margin:0}hr{height:0;color:inherit}abbr[title]{text-decoration:underline dotted}b,strong{font-weight:bolder}code,kbd,pre,samp{font-family:ui-monospace,SFMono-Regular,Consolas,'Liberation Mono',Menlo,monospace;font-size:1em}small{font-size:80%}sub,sup{font-size:75%;line-height:0;position:relative}sub{bottom:-.25em}sup{top:-.5em}table{text-indent:0;border-color:inherit}button,input,optgroup,select,textarea{font-family:inherit;font-size:100%;line-height:1.15;margin:0}button,select{text-transform:none}[type=button],[type=reset],[type=submit],button{-webkit-appearance:button}::-moz-focus-inner{border-style:none;padding:0}:-moz-focusring{outline:ButtonText dotted 1px}:-moz-ui-invalid{box-shadow:none}legend{padding:0}::-webkit-inner-spin-button,::-webkit-outer-spin-button{height:auto}[type=search]{-webkit-appearance:textfield;outline-offset:-2px}::-webkit-search-decoration{-webkit-appearance:none}::-webkit-file-upload-button{-webkit-appearance:button;font:inherit}summary{display:list-item}`
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

function templates() {
    const functions = document.getElementsByTagName("function")
    for (let i = 0; i < functions.length; i++) {
        let func = functions[i]
        func.style.display = "none"
        func.style.visibility = "hidden"
    }
}

function componentTag() {
    const comps = document.querySelectorAll('[component]')
    comps.forEach(element => {
        let outerHTML = element.outerHTML;
        let innerHTML = element.innerHTML; 
        let tag = outerHTML.split("<")[1].split(" ")[0]
        let toUse = document.createElement("read")
        toUse.innerHTML = innerHTML
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
    let readTags = document.getElementsByTagName("read");
    for (let i = 0; i < readTags.length; i++) {
        let tag = readTags[i];
        const slot = tag.innerHTML;
        let variable = tag.getAttribute("target");
        let target = document.getElementById(variable);
        if (target) {
            let content = '';

            if (target.tagName.toLowerCase() === 'template') {
                const contentNodes = target.content.childNodes;
                contentNodes.forEach((node) => {
                    content += node.nodeType === Node.ELEMENT_NODE ? node.outerHTML : node.textContent;
                });
            } else {
                content = target.innerHTML;
            }

            tag.innerHTML = content;

            let slotTags = tag.getElementsByTagName('slot');
            for (let j = 0; j < slotTags.length; j++) {
                let slotTag = slotTags[j];
                tag.innerHTML = tag.innerHTML.replace(slotTag.outerHTML, slot);
            }
        } else {
            console.error('boosted-html error: read target with id "', variable, '" not found');
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
        const randomId = generateRandomString(32);
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

async function main() {
    idCheck()
    await handleImport()
    componentTag()
    templates()
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
