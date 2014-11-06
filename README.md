# Suggestions

[![Build Status](https://travis-ci.org/CERNDocumentServer/suggestions.svg?branch=master)](https://travis-ci.org/CERNDocumentServer/suggestions)

User suggestions.

## Installation

`bower install suggestions`

## Usage

In your web page:

```html
<script src="../bower_components/jquery/dist/jquery.js"></script>
<script src="../bower_components/handlebars/handlebars.js"></script>
<script src="../bower_components/suggestions/dist/jquery.suggestions.js"></script>

<script>
jQuery(function($) {
  $('#suggestions').suggestion({
    url: 'http://EXAMPLE.com',
    data:{
        content:[
            {
                type: "input",
                label: "A nice label",
                value: "test",
                name: "title",
                placeholder: "Placeholder"
            }
        ]
    }
  });
});
</script>

<div id="suggestions"></div>
```

## Documentation

_(Coming Soon)
