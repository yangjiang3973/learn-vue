"use strict";

new Vue({
  el: '#demo',
  render: function render(h) {
    return h("AnchoredHeading", {
      "attrs": {
        "level": 1
      }
    }, [h("span", ["Hello"]), " world!"]);
  }
});
