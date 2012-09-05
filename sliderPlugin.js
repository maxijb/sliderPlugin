/* sliderPlugin by Maximiliano Benedetto

https://github.com/maxijb/sliderPlugin

To start using this plugin you need the following markup:

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
						fadeContent : null
					};
						

var methods = {
	
	init : function(ops) {
	
		
		var settings = $.extend({}, defaultOptions, ops || {}); //settiings
		
		return this.each(function() {
			$this = $(this);  
			settings.actual = 0;
			$this.data('settings', settings); //we store the setting in the object
			
			//number of slides 
			settings.size = Math.ceil($this.find("li").length / settings.paginated); 
			settings.width = $this.width();
			settings.height = $this.height();
			
			//do the styling
			if ($this.css('position') == 'static') $this.css('position', 'relative');
			$this.css({"textAlign": "left", "overflow": "hidden"})
				.find("ul").css({position: "absolute", 'margin': 0, padding : 0, listStyle : 'none'}).width(settings.width * settings.size)
			
			//if adapts the size of the lis and uls after a window resize 
			if (settings.adaptSize)	{
				$this.find('li').width(settings.width).css({'margin': 0, padding : 0, overflow : 'hidden'}).height(settings.height);  //sets li to fill parent
				$(window).resize(function() {
					methods.resize.apply($this);
				});
			}
			
			//is is vertical?
			if (!settings.vertical) $this.find("li").css({"float":"left"});
					
			if (settings.size > 1) 
			{	
				if (settings.continuous) 
					settings.interval = setInterval(
						function(){
							$this.slider('callSlide', -10); //call the function that swings the elements. -10 indicates it's a interval call 
							}
						, settings.delay); //the default delay
				
					
				
				if (settings.addButtons)  //adds buttons if you want
					$this.append("<div id='"+settings.next+"'></div><div id='"+settings.prev+"'></div>");
				
				$this.find(settings.next).bind("click", function() { methods.walkSlider.apply($this, [1]); }); //sets listeners
				$this.find(settings.prev).bind("click", function() { methods.walkSlider.apply($this, [-1]); }); //sets listeners
				
				if (settings.markers) {// if we want markers
		
					
					var poner = "";
					for (var i = 0; i < settings.size; i++)
						poner += "<div class='"+settings.markerClass+"' id='"+settings.markerClass+i+"'></div>";
					
					$this.append("<div id='"+settings.markerContainerId+"'>"+poner+ "</div>");
					
					$this.find("div#"+settings.markerContainerId+ " ."+settings.markerClass).bind("click", function() {
						methods.callSlide.apply($this, [parseInt($(this).attr('id').substr(settings.markerClass.length))]);
					}).filter(":first").addClass("activo");
				}
				
				if (settings.fadeContent)  //if we need to fade content
					$this.find("li:gt(0)").find(settings.fadeContent).hide();
			
				
			}
			else { //if there is only one slide removes next and prev elemtents 
				$this.find('#'+settings.prevId+' , #'+settings.nextId).remove();
			}
		}); //each
		
	
},

		resize : function() {
			//after a resize (if enabled) we adapt width and height of thee ul and lis
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
			
			this.find('ul').css({width : ulw+'px', height: ulh+'px', top: -ult+'px', left : -ull + 'px'})
				.find('li').width(w).height(h);	
		},


		callSlide : function(num) {
			return this.each(function() {
				var $this = $(this);
				var settings = $this.data('settings');
				
				slideviejo = settings.actual;
				
				if (num == -10) settings.actual++; // -10 is the interval
				else { settings.actual = num;  
					   clearInterval(settings.interval);
					  }
				
				
				if (settings.actual >= settings.size) { settings.actual = 0;  } //if over last goes back to first
				else if (settings.actual < 0) settings.actual = settings.size - 1; //if under 0 goes to the last
			
				if (settings.actual < 0) settings.actual = 0; 
				
				if (settings.actual != slideviejo) //it it's changed
				{
					if (settings.vertical) {
						var top = -settings.height * settings.actual;
						$this.find("ul").animate({top: top}, settings.speed);
					}
					else {
						var left = -settings.width * settings.actual;
						$this.find("ul").animate({left: left}, settings.speed);
					}
			
					if (settings.markers) //if there are markes
						$this.find("div#"+settings.markerContainerId+" div#"+settings.markerClass+settings.actual)
							.addClass("activo").siblings().removeClass("activo");
					
					if (settings.fadeContent)  { //if we have to fade anything
						$this.find("li:eq("+settings.actual+")").find(settings.fadeContent).fadeIn(400);
						$this.find("li:eq("+slideviejo+")").find(settings.fadeContent).fadeOut(400);
					}
				}
			});
		},
		
		 walkSlider: function(masomenos) {
			return this.each(function() { //goes next or prev slide
				var $this = $(this);
				var settings = $this.data('settings'); 
				clearInterval(settings.interval);
				methods.callSlide.appy($this, [(settings.actual + masomenos)]);
			});
		},
		
		
		stopSlider : function () { //stops interval
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
      $.error( 'Method ' +  method + ' does not exist on jQuery.sliderPlugin' );
    }    
  
  };





})( jQuery );