boosted-html comes with a minimalist router called boosted-router. You can enable it in a div using the `route` attribute, like this:

    <div route>
        <a href="/route.html">Hello!</a>
    </div>

An event listener will be attached to the anchor that will prevent the default behavior, swap the body of the document with the body of the route and change the URL with the Histroy API, which is also used for back and forward navigation. If the URL does not allow CORS or it's not an HTML file, the anchor will fallback to default behavior. Meta tags and duplicate link and script tags are removed automatically, while the title of the document is updated if a title tag is present in the target route.

**Note**: the router only works with anchors. Forms will be implemented in the future.
    