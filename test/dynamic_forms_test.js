(function($) {
  /*
    ======== A Handy Little QUnit Reference ========
    http://api.qunitjs.com/

    Test methods:
      module(name, {[setup][ ,teardown]})
      test(name, callback)
      expect(numberOfAssertions)
      stop(increment)
      start(decrement)
    Test assertions:
      ok(value, [message])
      equal(actual, expected, [message])
      notEqual(actual, expected, [message])
      deepEqual(actual, expected, [message])
      notDeepEqual(actual, expected, [message])
      strictEqual(actual, expected, [message])
      notStrictEqual(actual, expected, [message])
      throws(block, [expected], [message])
  */

  module('jQuery#dynamicForms', {
    // This will run before each test in this module.
    setup: function() {
      this.elem = $('#qunit-dynamicForms');
    }
  });
  test('is rendering properly', function() {
    expect(1);
    var data = [
        {
            type: "input",
            label: "A nice label",
            value: "test",
            name: "title",
            placeholder: "Placeholder",
        },
        {
            type: "hidden",
            label: "A nice label",
            value: "test",
            name: "title",
            placeholder: "Placeholder",
        },
        {
            type: "textarea",
            value: "test",
            label: "A nice label",
            name: "description",
            placeholder: "Placeholder",
        },
        {
            type: "select",
            label: "A nice label",
            name: "select description",
            values:[
            {
                value: "en",
                option: "English"
            },
            {
                value: "fr",
                option: "French"
            }
            ]
        }
    ];

    var test_element = this.elem.dynamicForms({
        'url': 'http://example.com',
        data:{
            content: data
        }
    });
    var test_html = "<div class=\"dynamicForms-messages\"></div> <div class=\"dynamicForms-loading\"></div> <div class=\"dynamicForms-description\"></div><form class=\"dynamicForms-form\"><label for=\"title\">A nice label</label><input type=\"text\" name=\"title\" value=\"test\" placeholder=\"Placeholder\"><input type=\"hidden\" name=\"title\" value=\"test\"><label for=\"description\">A nice label</label><textarea name=\"description\"></textarea><label for=\"select description\">A nice label</label><select name=\"select description\"><option value=\"en\">English</option><option value=\"fr\">French</option></select> <button class=\"dynamicForms-form-submit\" type=\"submit\">Save</button></form>";
    strictEqual(test_element.html(), test_html, 'should be equals');
  });
}(jQuery));
