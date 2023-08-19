function hideTemplates() {
    let temps = document.getElementsByTagName("component")
    for (let i = 0; i < temps.length; i++) {
        temps[i].style.display = "none";
        temps[i].style.visibility = "hidden";
    }
}

hideTemplates()

function renderComponent(name, template) {
    let elements = document.getElementsByTagName(name);
    for (let i = 0; i < elements.length; i++) {
        let element = elements[i];
        let content = template;
        let attributes = element.attributes;
        for (let j = 0; j < attributes.length; j++) {
            let attr = attributes[j];
            let value = attr.value;
            content = content.replace(new RegExp("\\$" + attr.name, "g"), value);
        }
        
        element.outerHTML = content;
    }
}

function createComponent() {
    let comps = document.getElementsByTagName("component")
    for (let i = 0; i < comps.length; i++) {
        var compName = comps[i].getAttribute("name")
        var compTemplate = comps[i].innerHTML
        renderComponent(compName, compTemplate)
    }
}

createComponent()