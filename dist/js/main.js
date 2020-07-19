"use strict";

//
var _carousel = $('[data-c-area="circle-carousel"]');

var _btn_next = $('[data-c-action="next"]');

var _btn_prev = $('[data-c-action="prev"]'); // copy items


_carousel.find('.__circle_item').clone().appendTo(_carousel); // reverse original


var _original_items = $($('[data-c-area="circle-carousel"] .__circle_item').get().reverse());

_carousel.append(_original_items);

_carousel.on('circle_slider:next', function () {
  console.log('trigger next item'); // TODO: move next
  // delete last item
  // append to start of _carousel()
});

_carousel.on('circle_slider:prev', function () {
  console.log('trigger prev item'); // TODO: move prev
  // delete first item
  // append to end of _carousel()
});

_btn_next.on('click', function () {
  _carousel.trigger('circle_slider:next');
});

_btn_prev.on('click', function () {
  _carousel.trigger('circle_slider:prev');
});