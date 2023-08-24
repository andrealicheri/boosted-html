function readTag() {
    let readTags = document.getElementsByTagName("read")
    for (var i = 0; i < readTags.length; i++) {
        let tag = readTags[i]
        const slot = tag.innerHTML
        var variable = tag.getAttribute("target")
        let target = document.getElementById(variable)
        if (target) {
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
    document.addEventListener('DOMContentLoaded', idCheck);
    readTag()
    replaceTag()
}

main()