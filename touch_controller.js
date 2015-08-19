
var myElement = document.getElementById('myElement');

// create a simple instance
// by default, it only adds horizontal recognizers
var mc = new Hammer(myElement);

mc.on("panleft panright tap press", function(ev) {
deltax.textContent = ev.deltaX;
deltay.textContent = ev.deltaY;
    if(ev.deltaX < 0)
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
         
    }

});