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
	
		//donde, deacuantos, continuo, vertical, circulos) {
		var settings = $.extend({}, defaultOptions, ops || {}); //settiings
		
		return this.each(function() {
			$this = $(this);
			settings.actual = 0;
			$this.data('settings', settings); 
			
			settings.size = Math.ceil($this.find("li").length / settings.paginated);
			settings.width = $this.width();
			settings.height = $this.height();
			
			if ($this.css('position') == 'static') $this.css('position', 'relative');
			$this.css({"textAlign": "left", "overflow": "hidden"})
				.find("ul").css({position: "absolute", 'margin': 0, padding : 0}).width(settings.width * settings.size)
			
			if (settings.adaptSize)	{
				$this.find('li').width(settings.width).css({'margin': 0, padding : 0, overflow : 'hidden'}).height(settings.height);  //pone ancho al ul
				$(window).resize(function() {
					methods.resize.apply($this);
				});
			}
			
			if (!settings.vertical) $this.find("li").css({"float":"left"});
					
			if (settings.size > 1) 
			{	
				if (settings.continuous) 
					settings.interval = setInterval(
						function(){
							$this.slider('llamaSlide', -10);
							}
						, settings.delay);
					//settings.interval = setInterval("llamaSlide(-10)", 7000);
					$this.find(settings.next).bind("click", function() { methods.pasarSlider.apply($this, [1]); }); //pone listeners
					$this.find(settings.prev).bind("click", function() { methods.pasarSlider.apply($this, [-1]); }); //pone listeners
				
				if (settings.addButtons) 
					$this.append("<div id='"+settings.next+"'></div><div id='"+settings.prev+"'></div>");
				
				
				if (settings.markers) {// si hay que poner ciruclitos {
		
					
					var poner = "";
					for (var i = 0; i < settings.size; i++)
						poner += "<div class='"+settings.markerClass+"' id='"+settings.markerClass+i+"'></div>";
					
					$this.append("<div id='"+settings.markerContainerId+"'>"+poner+ "</div>");
					
					$this.find("div#"+settings.markerContainerId+ " ."+settings.markerClass).bind("click", function() {
						methods.llamaSlide.apply($this, [parseInt($(this).attr('id').substr(settings.markerClass.length))]);
					}).filter(":first").addClass("activo");
				}
				
				if (settings.fadeContent) 
					$this.find("li:not(:first)").find(settings.fadeContent).hide();
			
				
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
			
			this.find('ul').css({width : ulw+'px', height: ulh+'px', top: -ult+'px', left : -ull + 'px'})
				.find('li').width(w).height(h);	
		},


		llamaSlide : function(num) {
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
						var top = -settings.height * settings.actual;
						$this.find("ul").animate({top: top}, settings.speed);
					}
					else {
						var left = -settings.width * settings.actual;
						$this.find("ul").animate({left: left}, settings.speed);
					}
			
					if (settings.markers) //si hay marcadores
						$this.find("div#"+settings.markerContainerId+" div#"+settings.markerClass+settings.actual)
							.addClass("activo").siblings().removeClass("activo");
					
					if (settings.fadeContent)  { //si hay que hacer fade con algo del contenido
						$this.find("li:eq("+settings.actual+")").find(settings.fadeContent).fadeIn(400);
						$this.find("li:eq("+slideviejo+")").find(settings.fadeContent).fadeOut(400);
					}
				}
			});
		},
		
		 pasarSlider: function(masomenos) {
			return this.each(function() {
				var $this = $(this);
				var settings = $this.data('settings'); 
				clearInterval(settings.interval);
				methods.llamaSlide.appy($this, [(settings.actual + masomenos)]);
			});
		},
		
		
		pararSlider : function () {
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