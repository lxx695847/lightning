export const addEvent = function( obj, type, fn ) {
  if (obj.addEventListener)
      obj.addEventListener( type, fn, false );
  else if (obj.attachEvent) {
      obj["e"+type+fn] = fn;
      obj.attachEvent( "on"+type, function() {
          obj["e"+type+fn].call(obj, window.event);
      } );
  }
};

export const removeEvent = function( obj, type, fn ) {
  if (obj.removeEventListener)
      obj.removeEventListener( type, fn, false );
  else if (obj.detachEvent) {
      obj.detachEvent(  "on" +type, obj["e"+type+fn] );
      obj["e"+type+fn] = null;
  }
};

export const stopEvent = function(e){
  e = e || window.event;
  if(e.preventDefault) {
    e.preventDefault();
    e.stopPropagation();
  }else{
    e.returnValue = false;
    e.cancelBubble = true;
  }
}

