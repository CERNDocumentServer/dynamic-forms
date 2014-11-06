# Dynamic forms

[![Build Status](https://travis-ci.org/CERNDocumentServer/dynamic-forms.svg?branch=master)](https://travis-ci.org/CERNDocumentServer/dynamic-forms)

Dynamic forms.

## Installation

`bower install dynamic-forms`

## Usage

In your web page:

```html
<script src="../bower_components/jquery/dist/jquery.js"></script>
<script src="../bower_components/handlebars/handlebars.js"></script>
<script src="../bower_components/dynamic-forms/dist/jquery.dynamic-forms.js"></script>

<script>
jQuery(function($) {
  $('#dynamic-forms').dynamicForms({
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

<div id="dynamic-forms"></div>
```

## Documentation

_(Coming Soon)
