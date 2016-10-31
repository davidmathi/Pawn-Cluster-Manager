var dragMe = document.getElementById('dragMe');
var withMe = document.getElementById('withMe');

var shouldntHappen = function() {
console.log("THIS SHOULDN HAPPEN");
}


var dragRef = DragDrop.bind(dragMe, {
anchor: withMe,
boundingBox: 'offsetParent',
dragstart: function(evt) {
console.log('DragDrop.bind dragstart', evt);
},
drag: function(evt) {
console.log('DragDrop.bind drag', evt);
},
dragend: function(evt) {
console.log('DragDrop.bind dragend', evt);
}
});


dragRef.bindEvent('dragstart', function(evt) {
console.log('DragDrop.bindEvent dragstart', evt);
});
dragRef.bindEvent('drag', function(evt) {
console.log('DragDrop.bindEvent drag', evt);
});
dragRef.bindEvent('dragend', function(evt) {
console.log('DragDrop.bindEvent dragend', evt);
});


dragRef.bindEvent('dragstart', shouldntHappen);
dragRef.unbindEvent('dragstart', shouldntHappen);

dragRef.bindEvent('drag', shouldntHappen);
dragRef.unbindEvent('drag', shouldntHappen);

dragRef.bindEvent('dragend', shouldntHappen);
dragRef.unbindEvent('dragend', shouldntHappen);
