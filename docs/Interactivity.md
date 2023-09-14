One of the main concerns of today's apps is interactivity. boosted-html allows to reference an element with by id by prefixing native event handlers (like `onclick`, `onmouseover`, etc.) with `html:`.

E.G.: When this element will be clicked...

    <button html:onclick="test"></button>

...it will be swapped with:

    <read target="test"></read>

## Specifing a target

If you don't want to swap the trigger element itself, you can use the `html:target` attribute by specifing the ID of the element you want swapped instead.

E.G.: When this element will be clicked...

    <button html:onclick="test" html:target="hello"></button>
    <div id="hello"></div>

...it will be swapped with:

    <button html:onclick="test" html:target="hello"></button>
    <read target="test"></read>

When the ID specified in `html:target` is not paired with any element, it will fallback to swap the trigger element. Also, the id is inherited from the target element to the generated `<read>` tag

## Reactivity

boosted-html main function runs every 53 milliseconds, meaning that when all boosted-html features don't become stale and are up to date with the DOM