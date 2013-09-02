/* sliderPlugin by Maximiliano Benedetto

https://github.com/maxijb/sliderPlugin

To start using this plugin you need the following HTML markup:

   <div id='sliderParent'>

     <ul>

        <li>...</li>

        <li>...</li>

        <li> (n) times</li>

     </ul>
   </div>

To start using the plugin you just need to set by CSS, the width and height of the #sliderParent div. And call

  $('#sliderParent').slider();

That's it!

Of course you can name the parent div as you like, and also you have a lot of configuration you can choose. This are the defaults:

OPTIONS: 

 paginated : 1,  // number of lis showing per slide

  continuous : true,  // wheter it is autoslide, controlled by a interval

  vertical : false,  //wheter it is horizontal or vertical

  markers : false,  //does it show markers for each item?

  next : 'next',   //the id (without the #) for the next slide buttton

  prev : 'prev',   //the id (without the #) for the previous slide buttton

  markerContainerId : 'circulos',  //the id (without the #) for the container of the markers for each item

  markerClass : 'circ',  //the class of the markers 

  addButtons : false,   // should th plugin add the next and prev buttons?

  delay : 3000,  // the delay between intervals 

  speed : 600,   // the speed in milliseconds of the slide

  adaptSize : false,  //should on resize event adapt the size of the slider?

  fadeContent : null   // content elements ("p, div") that should fade after each slide  



STYLING:

There is a CSS file, with very basci configuration for styling buttons and markers. You can change there what you need, and don't forget to specifiy a width and height for the parent div. The rest is done inline by the plugin. 


*/

(function( $ ){


var defaultOptions = {  paginated : 1,
						continuous : true,
						vertical : false,
						markers : false,
						next : 'next',
						prev : 'prev',
						markerContainerId : 'circulos',
						markerClass : 'circ',
						addButtons : false, 
						delay : 3000,
						speed : 600,
						adaptSize : false,
						adaptParentToChildSize : false,
						fadeContent : '', 
						item : 'li',
						list : 'ul',
						originX : 0,
						originY : 0
					};
						

var methods = {
	
	init : function(ops) {
		//donde, deacuantos, continuo, vertical, circulos) {
		var settings = $.extend({}, defaultOptions, ops || {}); //settiings
		
		return this.each(function() {
			var $this = $(this);
			settings.actual = 0;
			$this.data('settings', settings); 
			
			settings.size = Math.ceil($this.find(settings.item).length / settings.paginated);
			settings.width = $this.width();
			settings.height = $this.height();
			
			if ($this.css('position') == 'static') $this.css('position', 'relative');
			$this.css({"textAlign": "left", "overflow": "hidden"});
			var $ul = $(settings.list + ":first", $this);
				$ul.css({position: "absolute", 'margin': 0, padding : 0});
			
			if (!settings.vertical)	$ul.width(settings.width * settings.size);
			else $ul.height(settings.height * settings.size);
			
			if (settings.adaptSize)	{
				$this.find(settings.item).width(settings.width).css({'margin': 0, padding : 0, overflow : 'hidden'}).height(settings.height);  //pone ancho al ul
				$(window).resize(function() {
					methods.resize.apply($this);
				});
			}

			if (settings.adaptParentToChildSize) {
				var he = $this.find(settings.item+":first").height();
				$(this).css({height: he});
			}
			
			if (!settings.vertical) $this.find(settings.item).css({"float":"left"});
					
			if (settings.size > 1) 
			{	
				if (settings.continuous) 
					settings.interval = setInterval(
						function(){
							$this.slider('callSlide', -10);
							}
						, settings.delay);
					//settings.interval = setInterval("callSlide(-10)", 7000);
					
				if (settings.addButtons) 
					$this.append("<div id='"+settings.next+"'></div><div id='"+settings.prev+"'></div>");
				$this.find('#'+settings.next).bind("click", function() { methods.walkSlider.apply($this, [1]); }); //pone listeners
				$this.find('#'+settings.prev).bind("click", function() { methods.walkSlider.apply($this, [-1]); }); //pone listeners
				
				if (settings.markers) {// si hay que poner ciruclitos {
		
					
					var poner = "";
					for (var i = 0; i < settings.size; i++)
						poner += "<div class='"+settings.markerClass+"' id='"+settings.markerClass+i+"'></div>";
					
					$this.append("<div id='"+settings.markerContainerId+"'>"+poner+ "</div>");
					
					$this.find("div#"+settings.markerContainerId+ " ."+settings.markerClass).bind("click", function() {
						methods.callSlide.apply($this, [parseInt($(this).attr('id').substr(settings.markerClass.length))]);
					}).filter(":first").addClass("activo");
				}
				
				if (settings.fadeContent != '') 
					$this.find(settings.item+":gt(0)").find(settings.fadeContent).hide();
			
				
			}
			else {
				$this.find('#'+settings.prevId+' , #'+settings.nextId).remove();
			}
		}); //each
		console.log(settings);
	
},

		resize : function() {
			
			var w = this.width();
			var h = this.height();
			var settings = this.data('settings');
			settings.height =h;
			settings.width = w;
			var ulw, ulh, ult, ull;
			if (settings.vertical) {
				ulw = w;
				ulh = h*settings.size;
				ult = h*settings.actual;
				ull = 0;	
			}
			else {
				ulw = w*settings.size;
				ulh = h;
				ult = 0;
				ull = w*settings.actual;
			}
			
			this.find(settings.list+':first').css({width : ulw+'px', height: ulh+'px', top: -ult+'px', left : -ull + 'px'})
				.find(settings.item).width(w).height(h);	
		},


		callSlide : function(num) {
			return this.each(function() {
				var $this = $(this);
				var settings = $this.data('settings');
				
				slideviejo = settings.actual;
				
				if (num == -10) settings.actual++; // -10 es el interval
				else { settings.actual = num;  
					   clearInterval(settings.interval);
					  }
				
				
				if (settings.actual >= settings.size) { settings.actual = 0;  } //si pasa del ultimo vuielve al primero
				else if (settings.actual < 0) settings.actual = settings.size - 1; //si pasa del plrimero vuelve al ultimo
			
				if (settings.actual < 0) settings.actual = 0; 
				
				if (settings.actual != slideviejo) //si ha cambiado
				{
					if (settings.vertical) {
						var top = -settings.height * settings.actual + settings.originY;
						$this.find(settings.list+":first").animate({top: top}, settings.speed);
					}
					else {
						var left = -settings.width * settings.actual + settings.originX;
						$this.find(settings.list+":first").animate({left: left}, settings.speed);
						if (settings.adaptParentToChildSize) {
							var he = $this.find(settings.item+":eq("+settings.actual+")").height();
							$(this).animate({height: he}, 400);
						}
					}
			
					if (settings.markers) //si hay marcadores
						$this.find("div#"+settings.markerContainerId+" div#"+settings.markerClass+settings.actual)
							.addClass("activo").siblings().removeClass("activo");
					
					if (settings.fadeContent)  { //si hay que hacer fade con algo del contenido
						$this.find(settings.item+":eq("+settings.actual+")").find(settings.fadeContent).fadeIn(400);
						$this.find(settings.item+":eq("+slideviejo+")").find(settings.fadeContent).fadeOut(400);
					}
				}
			});
		},
		
		 walkSlider: function(masomenos) {
		 	console.log(this);
			return this.each(function() {
				var $this = $(this);
				var settings = $this.data('settings'); 
				clearInterval(settings.interval);
				console.log('llama');
				methods.callSlide.apply($this, [(settings.actual + masomenos)]);
			});
		},
		
		
		stopSlider : function () {
			return this.each(function() {
				var $this = $(this);
				var settings = $this.data('settings'); 
				clearInterval(settings.interval);
			});
		}

}; //methods


 $.fn.slider = function( method ) {
    
    if ( methods[method] ) {
      return methods[method].apply( this, Array.prototype.slice.call( arguments, 1 ));
    } else if ( typeof method === 'object' || ! method ) {
      return methods.init.apply( this, arguments );
    } else {
      $.error( 'Method ' +  method + ' does not exist on jQuery.tooltip' );
    }    
  
  };





})( jQuery );
