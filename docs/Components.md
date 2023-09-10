One of the main boosted-html purposes is to bring a modern component system to basic html. To achieve this it uses three custom tags and attributes.

## The read tag

The `<read>` tag replaces its inner HTML with the one of the element that has as an ID the value of the `target` attribute.

E.G.: The following code...

    <template id="test">Veeeeeeeeeeeeeeeeeeeeeeeeeeeeeeeeeeeeeeeery loooooooooooooong teeeeeeeeeeeeeeeeeeeeext</template>
    <read target="test"></read>

...will render as:

    <template id="test">Veeeeeeeeeeeeeeeeeeeeeeeeeeeeeeeeeeeeeeeery loooooooooooooong teeeeeeeeeeeeeeeeeeeeext</template>
    <div>Veeeeeeeeeeeeeeeeeeeeeeeeeeeeeeeeeeeeeeeery loooooooooooooong teeeeeeeeeeeeeeeeeeeeext</div>

### The component attribute

For a modern and more syntetic syntax you can add to an element the `component` attribute to interpret the tagname as an ID for a read target attribute. 

E.G.: The following code ...

    <test component />

...will render as :

    <read target="test"></read>

## Templating

The read tag makes reusing pieces of HTML very easy, however, you still can't pass arguments to components. There are three ways to achieve this.

### Read slots

The primary way to do templeating are `<slot>` tags. The HTML content of a read tag will be injected into the slot tags present in the target element, if any:

E.G.: The following code ...

    <template id="test">Hello, <slot></template>
    <read target="test">Andrea</read>

...will render as:


    <template id="test">Hello, <slot></template>
    <div>Hello, Andrea</div>

However slot tags capabilities are limited, as you can only specify one value to be replaced.

### The replace tag

The `<replace>` tag comes to rescue.
The `<replace>` tag searches the inner HTML of the element that has as an ID the value of the `target` attribute for the `from` attribute value and replaces it with the `to` attribute value.

E.G.: The following code ...

    <p id="test">Hi, my name is $name</p>
    <replace target="test" from="$name" to="Andrea"></replace>

...will render as:

    <p id="test">Hi, my name is Andrea</p>

This allows you to create your own templating system for whatever you want, for example, to pass an argument to a component:

E.G.: The following code ...

    <template id="test">Hi, my name is $name</template>
    <read target="test" id="test2"></read>
    <read target="test" id="test3"></read>  
    <replace target="test2" from="$name" to="Andrea"></replace>
    <replace target="test3" from="$name" to="Marco"></replace>


...will render as:

    <template id="test">Hi, my name is $name</template>
    <div id="test2">Hi, my name is Andrea</div>
    <div id="test3">Hi, my name is Marco</div>  

The`<replace>` has still some problems of its own you might encounter while using the replace tag:

- It's verbose, having to specify three attributes to swap one value
- It's imperative, and as such you don't have any idea that a swap happens in your component until you check the `<replace>` tags.
- It's unsafe, as the `to` value is replaced with the `from` value without any means to distinguish a simple word from a templating target

## Prop templates

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