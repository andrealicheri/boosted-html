One of the main concerns of today's apps is interactivity. boosted-html allows to reference an element with by id by prefixing native event handlers (like `onclick`, `onmouseover`, etc.) with `html:`.

E.G.: When this element will be clicked...

    <button html:onclick="test"></button>

...it will be swapped with:

    <read target="test"></read>

## Specifing a target

If you don't want to swap the trigger element itself, you can use the `?target` attribute by specifing the ID of the element you want swapped instead.

E.G.: When this element will be clicked...

    <button html:onclick="test"?target="hello"></button>
    <div id="hello"></div>

...it will be swapped with:

    <button html:onclick="test"?target="hello"></button>
    <read target="test"></read>

When the ID specified in `?target` is not paired with any element, it will fallback to swap the trigger element.

### Avoiding ID inheritance

The ID of the target is inherited by the generated `<read>` tag. To prevent this behavior (for example when replicating the same element) you can use the `?discard-attribute` attribute. Here's an example that makes use of it:

    <template id="spider">
        <li>
            <p>I'm a spider</p>
            <div id="list"></div>
        </li>
    </template>
    <button html:onclick="spider"?target="list"?discard-attribute>Add a spider</button>
    <ul>
        <div id="list"></div>
    </ul>

Try removing the `?discard-attribute` and see what happens ;)

## Reactivity

boosted-html main function runs every 53 milliseconds, meaning that when all boosted-html features don't become stale and are up to date with the DOM