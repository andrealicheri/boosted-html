If you want to make the CSS of a component relevant only to that component itself, you can use the `scoped` attribute (or alternatevely, `data-scoped`)

### How does it work?

When you use the `scoped` attribute, the original element is nested within a randomly custom element, and as such is placed in the shadow DOM and isolated from the rest of the document. 

E.G.: This code...

    <div scoped>
        <p>Hello</p>
        <style>p {color: green;}</style>
    </div>

...will render as:

    <scoped-fo3ktvlm9ze>
        <div>
            <p>Hello</p>
            <style>p {color: green;}</style>
        </div>
    </scoped-fo3ktvlm9ze>
