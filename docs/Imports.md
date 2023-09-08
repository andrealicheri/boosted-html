You might want to incapsulate different templates in a different html document, so that's when the `<include>` tags comes in. Let's say we have a document that has as path `/test.html` that contains:

    <template id="hello">Hi!</template>

We can include this template in a document by using:

    <include url="/test.html"></include>

This will render:

    <include url="/test.html"><function id="hello">Hi!</function></include>

**Warning**: if the HTML is from a different origin, check that the server has the appropriate CORS policy