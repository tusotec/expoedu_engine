
var myElement = document.getElementById('myElement');

// create a simple instance
// by default, it only adds horizontal recognizers
var mc = new Hammer(myElement);

mc.on("panleft panright tap press", function(ev) {
deltax.textContent = ev.deltaX;
deltay.textContent = ev.deltaY;
    if(ev.deltaX < 0)
    {console.log('izq');
    	band.left = true;
    	band.down = band.up = band.left = false;
    }else{console.log('der');
    	band.right = true;
    	band.down = band.left = band.up = false;
    }

    if(ev.deltaY > 0)
    {console.log('abajo');
    	band.down = true;
    	band.up = band.left = band.left = false;
    }else{console.log('arriba');
   		band.up = true;
   		band.down = band.left = band.left = false;
    
    }

});