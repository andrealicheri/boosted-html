# Boosted HTML

Add modern UI features to HTML. **Still in alpha**

## How to use

Just include the boostedhtml.js file with a script tag:

    <script src="/boostedhtml.js"></script>

## Components

Boosted HTML gives you the ability to create reusable components and pass arguments to them

### Creating a component

You can create a component with the `<component>` tag.

    <component name="test">
        <p>Hi, Watson</p>
    </component>

### Use a component

You can use a component by the name tag you assigned it:

    <test />

### Arguments

You can declare arguments in the template with a dollar sign...

    <component name="test">
        <p>Hi $you</p>
    </component>

...and specify it within the name tag arguments:

    <test you="Watson" />

Output:

    <p>Hi Watson</p>