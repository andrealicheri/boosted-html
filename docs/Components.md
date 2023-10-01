One of the main boosted-html purposes is to bring a modern component system to basic html. To achieve this it uses three custom tags and attributes.

## The b-read attribute

The `b-read` attribute replaces the inner HTML of the tag which its assigned to with the one of the element that has as an ID the value of the attribute itself.

E.G.: The following code...

    <template id="test">Veeeeeeeeeeeeeeeeeeeeeeeeeeeeeeeeeeeeeeeery loooooooooooooong teeeeeeeeeeeeeeeeeeeeext</template>
    <div b-read="test"></read>

...will render as:

    <template id="test">Veeeeeeeeeeeeeeeeeeeeeeeeeeeeeeeeeeeeeeeery loooooooooooooong teeeeeeeeeeeeeeeeeeeeext</template>
    <div b-read="test">Veeeeeeeeeeeeeeeeeeeeeeeeeeeeeeeeeeeeeeeery loooooooooooooong teeeeeeeeeeeeeeeeeeeeext</div>

### The component attribute

For a modern and more syntetic syntax you can add to an element the `component` attribute to interpret the tagname as an ID for a read target attribute. 

E.G.: The following code ...

    <test component />

...will render as :

    <div b-read="test"></div>

## Templating

The read tag makes reusing pieces of HTML very easy, however, you still can't pass arguments to components. There are two ways to achieve this.

### Read slots

The primary way to do templeating are `<slot>` tags. The HTML content of a read tag will be injected into the slot tags present in the target element, if any:

E.G.: The following code ...

    <template id="test">Hello, <slot></template>
    <div b-read="test">Andrea</div>

...will render as:


    <template id="test">Hello, <slot></template>
    <div b-read="test">Hello, Andrea</div>

However slot tags capabilities are limited, as you can only specify one value to be replaced.

## Prop templates

The prop tags come to rescue:
Meet the prop templates. Let's take this template:

    <template id="hello">
        <p>Hi, {{prop:name}}!</p>
    <template>

When it's replicated by this `<read>` tag...

    <read target="hello" name="Andrea">

...it renders as:

    <div>
        <p>Hi, Andrea!</p>
    <div>

A prop template references an attribute of the read tag and it's replaced with the referenced value. This makes it short, declarative and safer than the read tag, because you have to wrap the desired attribute name in a mustache and precede it with a `prop:` prefix.