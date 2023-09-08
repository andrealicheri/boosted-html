One of the main boosted-html purposes is to bring a modern component system to basic html. To achieve this it uses three custom tags and attributes.

## The read tag

The `<read>` tag replaces its inner HTML with the one of the element that has as an ID the value of the `target` attribute.

E.G.: The following code...

    <template id="test">Veeeeeeeeeeeeeeeeeeeeeeeeeeeeeeeeeeeeeeeery loooooooooooooong teeeeeeeeeeeeeeeeeeeeext</template>
    <read target="test"></read>

...will render as:

    <template id="test">Veeeeeeeeeeeeeeeeeeeeeeeeeeeeeeeeeeeeeeeery loooooooooooooong teeeeeeeeeeeeeeeeeeeeext</template>
    <read target="test">Veeeeeeeeeeeeeeeeeeeeeeeeeeeeeeeeeeeeeeeery loooooooooooooong teeeeeeeeeeeeeeeeeeeeext</read>



### Read slots

The HTML content of a read tag will be injected into the slot tags present in the target element, if any:

E.G.: The following code ...

    <template id="test">Hello, <slot></template>
    <read target="test">Andrea</read>

...will render as:


    <template id="test">Hello, <slot></template>
    <read target="test">Hello, Andrea</read>

### The component attribute

For a modern and more syntetic syntax you can add to an element the `component` attribute to interpret the tagname as an ID for a read target attribute. 

E.G.: The following code ...

    <test component />

...will render as :

    <read target="test"></read>

## The replace tag

The read tag makes reusing pieces of HTML very easy, however, you still can't pass arguments to the components. The `<replace>` tag searches the inner HTML of the element that has as an ID the value of the `target` attribute for the `from` attribute value and replaces it with the `to` attribute value.

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
    <read target="test" id="test2">Hi, my name is Andrea</read>
    <read target="test" id="test3">Hi, my name is Marco</read>  
