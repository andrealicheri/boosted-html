This is a series of best practices when using boosted-html

## Components

- Use the `<read>` tag when using read slots
- Use the `component` attribute for everything else

## Templating

- Use read slots when you need to insert a chunk of HTML in a component (e.g.: layout)
- Use prop templates when you need multiple replaceable values or one replaceable value that isn't HTML
- Use `<replace>` tags when there's the need to swap a specific value (best avoided)

## Imports

- Don't use any attribute besides `url` in `<include>` tags. The content fetched from `<include>` tags is swapped with the tags themselves

## Routing

- Keep the scripts, styles and HTML includes that you want to keep running across navigation in the head of the document. Script in the body are constantly swapped
