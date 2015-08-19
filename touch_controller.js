
var myElement = document.getElementById('myElement');

// create a simple instance
// by default, it only adds horizontal recognizers
var mc = new Hammer(myElement);
mc.get('pan').set({ direction: Hammer.DIRECTION_ALL });

mc.on("panleft panright panup pandown tap press", function(ev) {

console.log(ev.center);
  /*  if(ev.deltaX < 0)
    {
        console.log('izq');
    	
    }else{

        console.log('der');
    }

    if(ev.deltaY > 0)
    {
        console.log('abajo');

    }else{

        console.log('arriba');

    }*/

});