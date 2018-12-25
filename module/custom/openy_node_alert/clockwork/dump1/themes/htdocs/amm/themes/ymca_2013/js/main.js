
Array.prototype.shuffle = function() {
  var array = this,
      currentIndex = array.length,
      temporaryValue,
      randomIndex;

  // While there remain elements to shuffle...
  while (0 !== currentIndex) {

    // Pick a remaining element...
    randomIndex = Math.floor(Math.random() * currentIndex);
    currentIndex -= 1;

    // And swap it with the current element.
    temporaryValue = array[currentIndex];
    array[currentIndex] = array[randomIndex];
    array[randomIndex] = temporaryValue;
  }

  return array;
};

(function($){
  "use strict";
  init();

  (function(){
    var cb = CW.cache_buster?CW.cache_buster.replace('?',''):'',
        nav = CW.Navigation.JSON
                .load('ymca_2013_json', cb);
    nav.done(
      function(){
        var jsonnav = CW.Navigation.JSON.get(CW.page.id),
            clone = jQuery.extend(true, {}, jsonnav );
        if(!jsonnav){
          return console.error(
              [ 'No active pages found: It appears the ',
                'page tree was not rebuilt, and the current ',
                'page could not be found for page ID:',
                CW.page.id
              ].join('')
            );
        }
		CW.navs = CW.navs || {};
		CW.navs.global = {children: [clone]};
		CW.path = CW.page.liveUrl.split('/').slice(1,-1);
		initSiteNav();
		buildSubnav();
		buildLocationNav();
		setJoinButton();
      }
    );
  })();

  if (!Array.prototype.indexOf) {
    Array.prototype.indexOf = function(obj, start) {
      for (var i = (start || 0), j = this.length; i < j; i++) {
        if (this[i] === obj) { return i; }
      }
      return -1;
    };
  }
  if (("standalone" in window.navigator) && window.navigator.standalone) {
    // For iOS Web Apps
    jQuery('body').on('click', 'a', function(e){
      e.preventDefault();
      var location = jQuery(this).attr('href'),
          isajax = jQuery(this).attr('class').match(/sign-in|sign-out/);
      if (
          location !== undefined && 
          location.substr(0, 1) !== '#' && 
          jQuery(this).attr('data-method') === undefined &&
          ! isajax
          ){
        window.location = location;
      }
    });
  }
  var ua = navigator.userAgent;
  if( ua.indexOf("Android") >= 0  && ua.indexOf("Chrome") < 0)
  {
    var index   = ua.indexOf("Android")+8,
        version = ua.slice(index, index+5).replace(/\./gi,'-');
    jQuery('html').addClass('android android-'+version);
    
  }else if(ua.match(/OS 5(_\d)+ like Mac OS X/i)){
    jQuery('html').addClass('ios5');
  }

  // Kill Prototype's hide function. We no longer use Prototype 
  // for UI
  if(typeof Element != 'undefined'){
    if (Element.addMethods) {
      Element
        .addMethods({
          hide: function(element) {},
          show: function(element) {}
        });
    }
  }


  (function(){
    var week = [ 'Sun',
                  'Mon',
                  'Tue',
                  'Wed',
                  'Thu',
                  'Fri',
                  'Sat'
                ],
        today = new Date().getDay(),
        hours = [];
    
    jQuery('#all-hours table:first tr, #all-hours ul:first li').each(function(){
      var match = jQuery(this).text().match(/(\w+)\s?-?–?\s?(\w+)?:?\s?(.+)/),
          daysHrs = match[3],
          i, days, l, day, range;
      //find days and time range
      //

      // extract start and end day
      days = match.splice(1,2);

      // convert day names to intergers
      for(i = 0, l = days.length; i<l; i++){
        day = days[i]?days[i].match(/\w{3}/)[0]:null;
        if(week.indexOf(day) < 0){
          days.splice(i,1);
        }else{
          days[i] = week.indexOf(day);
        }
      }

      // populate hours array 
      if(days.length > 1){
        
        // if we have a range, loop through days between and populate
        range = days[1] - days[0];

        // if range is less than 0 then we started higher than we ended
        // jumping a weekend, so we get the last items and start from zero
        if(range < 0){
          for (i = days[0], l = 7-days[0]; i < 7; i++){
            hours[i] = daysHrs;
          }
          for (i = 0, l = days[1]; i <= l; i++){
            hours[i] = daysHrs;
          }
        // otherwise its a simple array population based on the range
        }else{
          for(i = days[0], l = days[0]+range; i <= l; i++){
            hours[i] = daysHrs;
          }
        }
      }else{
        // if just one day, add to hours array
        index = days[0];
        hours[index] = daysHrs;
      }

    });
    jQuery('#todays-hours').html(hours[today]);

  })();
  (function(){
    jQuery('#masthead-menu')
    .on('shown.bs.dropdown', function(){
      jQuery('body').addClass('masthead-menu-active');
      setDropdownHeight();
    })
    .on('hide.bs.dropdown', function(){
      jQuery('body').removeClass('masthead-menu-active');
    });
    function setDropdownHeight(){
      var windowHeight  = jQuery(window).height(),
      menu              = jQuery('#masthead-menu'),
      isFixed           = menu.hasClass('affix'),
      offset            = menu.length?
                            isFixed?
                              menu.position().top + menu.height():
                              menu.position().top - jQuery(window).scrollTop() + menu.height():
                              null;

      if(!offset) return;
      jQuery('#masthead-menu .open .dropdown-menu')
        .css('max-height', (windowHeight - offset)-30);
    }

    if(!jQuery('#masthead-menu').length) return;
    jQuery(window).on('resize', setDropdownHeight);

  })();
  (function(){
    jQuery('.activity-day').text(function(){
      return jQuery(this).text().match(/[\w]{3}/);
    })
    .addClass('truncated');

    jQuery('#group-ex-carousel .slider')
    .slider()
    .on('slide', function(e){
      var scrollPane = jQuery('#group-ex-carousel .carousel-inner'),
          scrollInner = scrollPane[0].scrollWidth - scrollPane.width();
      scrollPane.scrollLeft(e.value/100*scrollInner);
    })
    .on('slideStart', function(e){
      jQuery('html').addClass('sliding');
    })
    .on('slideStop', function(e){
      jQuery('html').removeClass('sliding');
    });
  })();


  Handlebars.registerHelper('overview',
    function(options) {
      if(!this.children)
        return options.fn(this);
      return options.inverse(this);
    }
  );

  // enhance sidebar collapse
  var current_scroll = 0;
  (function()
    {
      jQuery('.sidebar')
        .on('show.bs.collapse',
          // add custom class for expand specific styling. in = open
          function(e){
            jQuery(this)
              .next('.viewport')
              .addBack()
              .removeClass('out')
              .addClass('collapsing-in');


               current_scroll = jQuery(window).scrollTop();
            jQuery('.nav-global').css({
                top: current_scroll
            });
          }
        )
        .on('shown.bs.collapse',
          // allow css to control open rest state
          function(){
            jQuery(this)
              .next('.viewport')
              .addBack()
              .removeClass('collapsing-in')
              .addClass('in');

              var body =  jQuery('body');

              body.addClass('sidebar-in');

               jQuery("html").addClass('sidebar-in');
            jQuery('#page-head').css({
                "margin-top": -(current_scroll)
            });
          }
        )
        .on('hide.bs.collapse',
          // add custom class for collapse specific styling. out = closed
          function(e){
            var sidebar = jQuery(this);
            sidebar
              .next('.viewport')
              .addBack()
              .removeClass('in')
              .addClass('collapsing-out');

            jQuery(window).scrollTop(current_scroll);

              jQuery('#page-head').css({
                  "margin-top": ''
              });

            }
        )
        .on('hidden.bs.collapse',
          // allow css to control closed rest state
          function(){
            jQuery(this)
              .next('.viewport')
              .addBack()
              .addClass('out')
              .removeClass('collapsing-out');
              
               jQuery('body').removeClass('sidebar-in');
                jQuery("html").removeClass('sidebar-in');

              jQuery('.nav-global').css({
                top: 0
              });
          }
        )
        .find('li')
        .on('hide.bs.dropdown',
          // for nested dropdowns, prevent collapse of other dropdowns
          function(e){
            e.preventDefault();
          }
        );
    }
  )();

  //  home nav overview row
  (function()
    {
      jQuery('.nav-home .nav-level-2')
        .each(function()
          {
            jQuery(this)
              .children('.dropdown')
              .wrapAll('<li><ul class="row-level-2"></ul></li>');
          }
        );
    }
  )();


  // decorate promos
  (function()
    {
      var mainPromos    = jQuery('.main-promos > *')
                            .addClass('col-md-4 col-sm-6'),
          sidebarPromos = jQuery('.sidebar-promos > .richtext'),
          promos        = mainPromos.add(sidebarPromos);
        
      promos
        .each(
          function(){

            var el          = jQuery(this),
                links       = jQuery(this).find('a'),
                link        = links.eq(0),
                title       = link.text(),
                href        = link.attr('href'),
                clickable   = links.length == 1 || el.is('.video'),
                wrapper     = clickable ? jQuery('<a class="wrapper"/>')
                                .attr('href', href)
                                .attr('title', title): '<div class="text-promo"/>',
                thumb       = el
                                .find('img')
                                .addClass('img-responsive')
                                .removeAttr('height')
                                .removeAttr('width')
                                .wrap('<div class="img-crop img-crop-horizontal"/>')
                                .parent();

            if(clickable) link.remove();
            el
              .wrapInner(wrapper)
              .children()
              .eq(0)
              .prepend(thumb);

            jQuery(this).find('p:empty').remove();
          }
        );
      
      jQuery('.main-promos').removeClass('hidden');

    }
  )();

  // Make sure lead copy is full width when call to action is empty
  (function(){
    jQuery('.lead.call-to-action:empty')
      .prev('.lead')
      .removeClass('col-sm-8')
      .addClass('col-sm-12');
  })();


  // Trying to fix for IE youtube
  (function(){
    jQuery('iframe').each(function(){
      var src = jQuery(this).attr('src');
      // looking for all youtube iframes without wmode transparent set
      if( ! src.match(/youtube(?!.*\?.*wmode=transparent)/) ) return;
      src = src.replace(/\?|$/,'?wmode=transparent&'); // prepend to query string or stick on end
      jQuery(this).attr('src', src);
    });
    jQuery('.content_wrapper.video').on('click', function(){
      
      if(!jQuery(this).find('iframe').length) return;
      
      var iframe = jQuery(this).find('iframe').clone(),
          src = iframe.attr('src'),
          headline = jQuery(this).find('h1,h2,h3,h4,h5').text();
      if(src.match(/youtube/)){
        iframe.height((jQuery(window).width()*0.8) * (9/16));
      }
      // iframe.height(jQuery(window).height()*.75);
      jQuery('#modal-body').html(iframe);
      jQuery('#modal-title').text(headline);
      jQuery('#modal').modal('show');
    });
//    jQuery(document)
//      .on('hide.bs.modal', function(){
//        jQuery('#modal-body').empty();
//		jQuery('#modal-title').empty();
//      });
  })();

  // enhance subnav dropdowns for transitions
  function initSubnavs(){
    jQuery('.panel-subnav .active.dropdown').addClass('open');
    jQuery('.panel-subnav li')
      .on('click.bs.dropdown',function(e){
        e.stopPropagation();
      })
      .filter('.dropdown')
      .each(function(){
        var dropdown = jQuery(this),
            menu = jQuery(this).children('.dropdown-menu'),
            height;

        jQuery(this)
          .on('click.bs.dropdown', function(e){
            var dropdown = jQuery(this);
            e.stopPropagation();
            return;

            // for toggleable navs
            
            // e.preventDefault();
            // if(dropdown.hasClass('open')){
            //   dropdown
            //     .removeClass('open')
            //     .trigger('hide.bs.dropdown');
            // }else{
            //   dropdown
            //     .addClass('open')
            //     .trigger('show.bs.dropdown');
            // }
            // return false;
          })
          .on('show.bs.dropdown', function(e){
            e.preventDefault();
            e.stopPropagation();


            jQuery(this)
              .siblings('.dropdown')
              .trigger('hide.bs.dropdown');

            menu
              .addClass('dropping')
              .removeClass('collapse');

            height = menu[0].scrollHeight;

            menu
              .height(height)
              .one($.support.transition.end,
                function (){
                  menu
                    .trigger('shown.bs.dropdown');
                }
              )
              .emulateTransitionEnd(300);
          })
          .on('shown.bs.dropdown',
            function(e){
              e.preventDefault();

              dropdown
                .addClass('open');

              menu
                .removeClass('dropping')
                .height('auto');
            }
          )
          .on('hide.bs.dropdown',
            function(e){
              e.preventDefault();
              e.stopPropagation();
              return false;

              // menu
              //   .height(menu.height())
              //   [0].offsetHeight; // force redraw

              // menu
              //   .addClass('dropping')
              //   .height(0)
              //   .one($.support.transition.end,
              //     function () {
              //       menu
              //         .trigger('hidden.bs.dropdown');
              //     }
              //   )
              //   .emulateTransitionEnd(300)
            }
          )
          .on('hidden.bs.dropdown',
            function(e){
              e.preventDefault();
              e.stopPropagation();

              menu
                .removeAttr('height')
                .removeClass('dropping')
                .addClass('collapse');

              jQuery(this)
                .find('.dropdown.open')
                .trigger('hide.bs.dropdown');

              dropdown.removeClass('open');
            }
          );   
      });
  }


  (function(){
    var headerImgSrc = jQuery('.header-image .img-responsive')
                          .addClass('visible-xs')
                          .attr('src');
    if(!headerImgSrc) return;
    jQuery('.header-image')
      .css('background-image', 'url('+headerImgSrc+')');
  })();

  (function(){
    var scrollWidth, carouselWidth;

    jQuery('#group-ex-locations .btn')
      .on('click', function(e){
        if(jQuery('#group-ex-locations .btn.active').length >= 4 && !jQuery(this).is('.active')){
          return false;
        }
      });

    jQuery('.group-ex .btn:not(.date .btn, .pagination .btn)').on('click', function(e){
      var icon = jQuery(this).find('.glyphicon'),
          name = jQuery(this).find('input').attr('name');

      if(jQuery(this).has('[type=radio]').length){
        // radios only react if innactive
        if(!jQuery(this).hasClass('active')){
          jQuery('input[name='+name+']')
            .parents('.btn')
            .find('.glyphicon')
            .removeClass('glyphicon-check')
            .addClass('glyphicon-unchecked');

          icon
              .toggleClass('glyphicon-unchecked')
              .toggleClass('glyphicon-check');
          
        }
      }
      else{
        
        // checkboxes are straightforward
        
        if(jQuery(this).is('#group-ex-locations .btn')){
          if(
            jQuery('#group-ex-locations input:checked')
              .length >= 4 && !jQuery(this).is('.active'))
            {
            return false;
          }
        }
        icon
          .toggleClass('glyphicon-unchecked')
          .toggleClass('glyphicon-check');
      }

    });
    jQuery('#group-ex-carousel .item:first')
      .addClass('active');

    jQuery('#group-ex-carousel .slide-to')
      .each(function(){
        jQuery(this)
          .find('li')
          .attr('data-slide-to', function(i){
            return i;
          })
          .click(function(){
            jQuery(window).scrollTop(0);
          });
      } 
      );

    jQuery('#group-ex-carousel .panel-group')
      .each(function(i, el){
        var id = 'accordion_'+i;
        jQuery(this)
          .attr('id',id)
          .find('.accordion-toggle')
          .attr('data-parent', '#'+id);
      });

    if(!jQuery('.carousel-inner')[0]) return;

    scrollWidth = jQuery('.carousel-inner')[0].scrollWidth;
    carouselWidth = jQuery('.carousel-inner').width();

    if( scrollWidth > carouselWidth )
      jQuery('.carousel-container').addClass('scroll');

    if(jQuery('#group-ex-carousel .panel-group').length < 2){
      jQuery('#group-ex-carousel .pagination').remove();
    }

    jQuery('#group-ex-carousel').addClass(function(){
      var cols = jQuery('#group-ex-carousel .panel-group').length;
      return 'columns-'+cols;
    });
  })();

  (function(){
	  /*
    var excerpts    = [],
        source      = jQuery('#excerpt-template').html(),
        template    = Handlebars.compile(source),
        data        = jQuery('#excerpt-source'),
        imgSrc      = '/amm/themes/ymca_2013/img/placeholder-square.png',
        excerptList;

    data
      .find('> .post_excerpt').each(
        function(i,element){
          var el        = jQuery(element),
              img       = el.find('img').remove(),
              imgprops  = {src: img.attr('src') || imgSrc},
              title     = el.find('.post-title').text(),
              link      = el.find('.post-title a'),
              linkprops = { title: link.text(),
                            href: link.attr('href')
                          },
              emptys    = el.find('p:empty').remove(),
              headlines = el.find('h1,h2,h3,h4,h5,h6').remove(),
              links     = el.find('.richtext a')
                            .each(
                              function(){
                                jQuery(this)
                                  .replaceWith(jQuery(this).contents());
                              }),
              copy      = el.find('.richtext').html(),
              author    = el.find('.author').text(),
              date      = el.find('.date').text(),
              excerpt   = { title: title,
                            image: imgprops,
                            link: linkprops,
                            author: author,
                            copy: copy
                          };
          excerpts.push(excerpt);
        }
      );
    excerptList = template({excerpts: excerpts});
	jQuery('#excerpt-source').html(excerptList).removeClass('hidden');
	   */


  })();


  // build slideshow
  (function()
    {
      var slides      = [],
          source      = jQuery('#slides-template').html(),
          template    = Handlebars.compile(source),
          data        = jQuery('#slide-data'),
          carouselInner,
          sequence    = [],
          i;

      data
        .find('> .richtext').each(
          function(i, element){
            var el = jQuery(element),
                img = el.find('img:first').remove(),
                imgprops = { src: img.attr('src')},
                link = el.find('a').remove().eq(0),
                linkprops = { title  : link.text(),
                              href   : link.attr('href')
                            },
                emptys = el.find('p:empty').remove(),
                copy = el.html(),
                slide = { img: imgprops,
                          link: linkprops,
                          copy: copy,
                          id: i
                        };

            slides.push(slide);
          }
          
      );
      
      slides.shuffle();

      for(i = 0; i < slides.length; i++){
        sequence.push(slides[i].id+1);
      }
      carouselInner = jQuery(template({slides: slides}));

      carouselInner
        .find('.btn-primary')
        .on('click', function(){
          var i       = carouselInner.find('.btn-primary').index(jQuery(this)),
              index   = sequence[i],
              title   = index+': '+jQuery(this)
                          .parents('.carousel-caption')
                          .find('h1')
                          .text(),
              order = sequence.join(',');

          _gaq.push([
              '_setCustomVar',
              1,                   // slot
              'Carousel Sequence', // category
              order,            // variable
              2                    // scope
            ]);
          _gaq.push([
              '_setCustomVar',
              2,                   // slot
              'Selected Slide', // category
              title,            // variable
              2                    // scope
            ]);
          _gaq.push([
              '_trackEvent',
              'Promotions',             // category
              'Carousel Call To Action' // action
            ]);

        });
        
      data
        .after(carouselInner)
        .remove();

      if(slides.length <= 1){
        jQuery('.carousel-control, .carousel-indicators').remove();
      }
      

      jQuery('#carousel')
        .swipe({
          swipeLeft: function(){
            jQuery(this).carousel('next');
          },
          swipeRight: function(){
            jQuery(this).carousel('prev');
          },
          threshold: 100
        });

      var currentHeight;
      var currentWidth;

      function evenHeights(){
        var selectors = [ '.carousel-inner .carousel-caption',
                          '.main-promos .wrapper, .main-promos .text-promo'],
            windowHeight = jQuery(window).height(),
            windowWidth = jQuery(window).width(),
            maxHeight, i, l;

        jQuery('.page-middle iframe, object').height(function(){
          return jQuery(this).width() * (9/16);
        });
        // IE 8 is a little over-sensitive to resize events
        if(windowHeight == currentHeight && currentWidth == windowWidth) return;
        
        currentHeight = windowHeight;
        currentWidth = windowWidth;

        function compareHeight(i, el){
          maxHeight = Math.max(maxHeight, el.scrollHeight);
        }
        for(i = 0, l = selectors.length; i < l; i++){
          maxHeight = 0;
          if(! jQuery(selectors[i]).length) continue;
          jQuery(selectors[i])
            .parents('.carousel-inner, .promos')
            .removeClass('even-heights');
          var foo = jQuery(selectors[i])
            [0].offsetHeight;

          jQuery(selectors[i])
            .css('height', 'auto')
            .each(compareHeight)
            .css('height', maxHeight)
            .parents('.carousel-inner, .promos')
            .addClass('even-heights');
        }

      }
      jQuery(window)
        .on('resize', function(){
          evenHeights();
        })
        .on('load', function(){
          evenHeights();
        });

    }
  )();

  (function(){
    jQuery('#nav-location').each(
      function(i, el){
        jQuery(this).affix({
          offset: {
            top:
              function(){
                var affix = this,
                    offset = jQuery('.lead-copy').offset().top - 52;
                return offset;
              }
          }
        });
      }
    );
    jQuery('#masthead-menu').each(
      function(i, el){
        jQuery(this).affix({
          offset: {
            top:
              function(){
                var affix = this,
                    masthead = jQuery('.masthead').outerHeight(true),
                    offset = masthead?jQuery('.masthead').outerHeight(true) - 52:10;

                return offset;
              }
          }
        });
      }
    );
    jQuery('#group-ex-slider').each(
      function(i, el){
        jQuery(this).affix({
          offset: {
            top:
              function(){
                var affix = this,
                offset = jQuery('#group-ex-carousel').offset().top - jQuery('.navbar-fixed-top').height();
                return offset;
              }
          }
        });
      }
    );
  })();

  function buildSubnav(){
    var source    = jQuery('#subnav-template').html(),
        template  = Handlebars.compile(source),
        depth     = 0,
        context   = (typeof(isCampLocation)!='undefined')?
                      getLevel(CW.navs.global, 1):CW.navs.global,
        html      = template(context);

    function getLevel(ctx, level){
      var children = ctx.children,
          i, l;

      for(i=0,l=children.length; i<l; i++){
        if(children[i].active && children[i].children && depth == level){
          return children[i];
        }
        if(children[i].active && children[i].children){
          depth = depth + 1;
          return getLevel(children[i], level);
        }
      }
    }

    jQuery('.panel-subnav').append(html);
    initSubnavs();
  }

	function setJoinButton() {
		var activeLocation,
			children = CW.navs.global.children,
			isCamp = false,
			$joinBtn;

		// If on locations page, use custom join-buttons
		if( jQuery('.theme_ymca_2013_location_home, .theme_ymca_2013_location_primary_landing, .theme_ymca_2013_location_category_and_detail, .theme_ymca_2013_location_schedules').length !== 0 ) {
			var $masthead_btn = jQuery('#masthead-button');
			if( $masthead_btn.children().length === 0 ) {
				$masthead_btn.append( jQuery('<a href="" id="join-button">Try the Y For Free</a>') );
			}
		}

		$joinBtn = jQuery('#join-button');
		if(!$joinBtn.length) return;

		function findLocation(children) {
			var childName, ii, l;
			for (var i = 0; i < children.length; i++) {
				if (children[i].overview) continue;
				if (children[i].active && children[i].nav_level == 3) {
					childName = isCamp ? 'Register' : 'Join';
					if (!children[i].children) return;
					for (ii = 0, l = children[i].children.length; ii < l; ii++) {
						if (children[i].children[ii].page_name == childName)
							return children[i].children[ii].url;
					}
					return children[i].url;
				}
				if (children[i].active) {
					if (children[i].page_name.toLowerCase() == 'camps') isCamp = true;
					return findLocation(children[i].children);
				}
			}
		}

		var url = findLocation(children);
		$joinBtn.attr('href', url).removeClass('hidden');
	}

  function buildLocationNav(){
    var source       = jQuery('#location-nav-template').html(),
        template     = Handlebars.compile(source),
        context      = CW.navs.global,
        html         = template(context);
    jQuery('#nav-location').append(html);
  }
  // build json nav

  function initSiteNav(){
    var   source     = jQuery('#nav-item-template').html(),
          template   = Handlebars.compile(source),
          parent     = CW.navs.global,
          path       = CW.page.liveUrl.split('/').slice(1,-1);

    function decorate(ancestor){
      var children = ancestor.children,
          array       = [],
          id, overview;
      if(!children) return; // we hit a link, bail on this routine
      
      for(var i = 0; i < children.length; i++){
      // for(id sin children){
        var child       = ancestor.children[i],
            symbols     = /[-!$%^&*()_+|~=`{}\[\]:";'<>?,.\/]/g,
            dasherized  = child.page_name
                              .replace(symbols, '')
                              .replace(/[\s]+/g, '-')
                              .toLowerCase(),
            classes     = '';
        if(child.current) classes+='current ';
        if(child.parent) classes+='parent ';
        if(child.active) classes+='active ';
        if(child.abe_page) classes+='abe ';
        child.exclude_from_nav = Boolean(child.exclude_from_nav);
        jQuery.extend(
            child,
            { nav_level   : (parseInt(child.nav_level, 10)||0)+1,
              dasherized  : dasherized,
              classes     : classes,
              id          : parseInt(id, 10)
            }
        );
        array.push(child);
        if(child.children) child = decorate(child);
        // decorate this item's children
      }

      // Fake overview nav items for all items under level 2
      overview = jQuery.extend(
      {},
      ancestor,
      {
        overview: true,
        current: ancestor.current,
        active: false,
        parent: false,
        children: null
      });

      overview.nav_level = ancestor.nav_level + 1;

      if(ancestor.nav_level > 1 && ancestor.page_abbr !== 'home'){
        array.unshift(overview);
      }

      if(ancestor.page_abbr === 'home'){
        ancestor.page_name = ancestor.page_title = 'Back to Full Menu';
        delete ancestor.page_abbr;
        delete ancestor.page_abbr;
        delete ancestor.id;
        ancestor.parent = true;
        ancestor.dasherized = 'back-to-full-menu';
        // overview.current = true;
        delete ancestor.current;
        array.unshift(overview);
      }
      ancestor.children = array;

      return;
    }

    function findActive(parent){
      var found = false,
          parentFound = false;

      function traversePages(parent, property){
        var children = parent.children,
            isParent = false,
            child, i, isCurrent, isMatch;
        if(!children) return;

        for(i = 0; i < children.length; i++){
          child = children[i];
          isMatch = child[property] == CW.page[property];
          isCurrent = isMatch && !child.children;
          if(isCurrent){  
            found = true;
          }
          if(!found){
            traversePages(child, property);
          }
          if(found){
            if( !isCurrent && !parentFound ){
              parentFound = true; // we're bubbling back up. set parentFound
              isParent = true;
            }
            jQuery.extend(
            child,
            {
              current : isCurrent,
              parent : isParent,
              match : isMatch,
              active: true
            });
            return;
          }
           
        }
      }

      function urlDig(){
        CW.page.liveUrl = '/'+path.join('/')+'/';
        traversePages(parent, 'id');
        path.pop();
        if(!path.length) return;
        if(!found) urlDig();
      }

      // traversePages(parent, 'id');

      urlDig(); // kickoff url dig

    }

    decorate(parent);
    // findActive(parent);

    function render(parent, filter){

      var children = parent.children,
          items = [],
          list = [],
          el, child, html, item;

      if (! children) return;

      function buildChildren(e){

        var child        = e.data.child,
            target      = jQuery(e.target),
            items       = render(child),
            ancestors   = target.parents('.dropdown'),
            dropdown    = ancestors.eq(0),
            top         = ancestors.last(),
            level       = top.find('.open'),
            categories  = top.find(' > .dropdown-menu > li'),
            siblings    = dropdown.siblings('li'),
            menu        = dropdown.children('.dropdown-menu'),
            children    = menu.children(),
            decendants  = menu.find('li'),
            others      = top
                            .find('li')
                            .not(ancestors.slice(0))
                            .add(decendants),
            sidebar     = jQuery('#sidebar'),
            offset      = ancestors
                            .eq(1)
                            .offset()?
                              sidebar.scrollTop() + 
                              ancestors.eq(1).offset().top + 
                              target.height():0;

        if( target.attr('href')) return; // this is a link, we're done playing.

        e.stopPropagation(); // prevent dropdown events from cascading

        if (dropdown.hasClass('active') && child.children){
          ancestors
            .eq(1)
            .find('a')
            .click();
          return; // reclicked open dropdown
        }
        
        if(!child.children) return; // links dont have dropdown
          
        ancestors
          .removeClass('active')
          .addClass('open');

        dropdown
          .removeClass('collapse')
          .addClass('active open');

        decendants
          .removeClass('active open');

        e.stopPropagation();
        
        if(!children) return;
        dropdown.on('hide.bs.dropdown',
          function(e){
            e.preventDefault();
          }
        );
        
        menu
          .append(items);

        sidebar.animate(
          {scrollTop: offset},
          300
        );
        
        setTimeout(function(){

        },300);

        function replace(e){
          if(!e || !e.originalEvent || e.originalEvent.propertyName != 'opacity'){
            others
              .remove(); 
          }
        }

        if(! siblings.length) replace();

        siblings
            .last()
            .one( jQuery.support.transition.end, replace)
            .emulateTransitionEnd(300);
      }
      for(var i = 0, l = children.length; i < l; i++){
      // for(child in children){
        child = children[i];
        el = jQuery(jQuery.trim(template(child)));

        el
          .click({child: child}, buildChildren);
        
        child.el = el;
        if(! filter) // no filter, just pushing new items into a list
        {
          items.push(el);
        }
        else
        {
          if(!child[filter]) continue; // this item didnt match the filter
          return child;
        }
      }
      if(! filter) return items;

      return false;
    }

    function buildNav(parent){
      var ancestors, menu;
      
      return getChildren(parent);

      function getChildren(parent){
        var child = render(parent, 'active'),
            el;
        if(!child){
          ancestors
            .addClass('active')
            .find('.dropdown-menu')
            .append(render(parent));
          return ancestors;
        }

        el = child.el.addClass('open');

        if(!ancestors){
          ancestors = parent.el = el;
          return getChildren(child);
        }

        menu = parent.el.find('.dropdown-menu');
        
        if(child.current){
          if(child.children){
            // overview page has children and current
            // we want to render children of this page and bail
            
            el.addClass('active open');
            
            menu
              .append(el) // add current el as parent
              .find('.dropdown-menu')
              .append(render(child)); // render kids
            return ancestors;          
          }
          // current page found.
          // render siblings, make parent active and bail
          parent
            .el
            .addClass('active');

          menu
            .append(render(parent));

          return ancestors;          
        }

        // not current page, append and keep digging
        menu.append(el);

        return getChildren(child);
      }
    }
    
    function initSidebarNav(){
      var markup = buildNav(CW.navs.global);
      if(!markup) return false;    
      jQuery('#sidebar-nav')
        .html(markup);
    }

    jQuery('.sidebar').on('hidden.bs.collapse', initSidebarNav);

    initSidebarNav();
    jQuery('#sidebar-nav')
        .on('hide.bs.dropdown',
          function(e){
            e.preventDefault();
          }
        );

    ( function(){
      var topLevel  = CW.navs.global.children,
          global    = 0,
          context   = CW.navs.global.children[global],
          source    = jQuery('#programs-services-nav-template').html(),
          template  = Handlebars.compile(source),
          html      = template(context);

      jQuery(".nav-home .navbar-nav").html(html);
    })();
  }

  (function(){
    var url = jQuery('body').attr('data-section-header-url');
    jQuery('#utility-nav')
      .find('a[href*="'+url+'"]')
      .eq(0)
      .parent()
      .addClass('active');
  })();

  (function(){
    jQuery('#site-search')
      .on('shown.bs.collapse',
        function(){
          jQuery('#site-search input').focus();
        });
  })();

  (function(){
    jQuery('.print-page').on('click', function(){
      window.print();
    });
  })();

  // Load Sign In SSO link as a frontend redirect
  (function(){
    function redirect(e){
      var target = e.target,
          href = jQuery(target).attr('href');
      e.preventDefault();
      jQuery.get(href, function(response){
        var ssoLink = jQuery('<div/>').html(response).find('a').attr('href');
        document.location = ssoLink;
      });
      return false;
    }

    jQuery('body').on('click', '.sign-in a, .sign-out a, a.sign-out, a.sign-in', redirect);
  })();


  // Store Alert Preference
  (function(){
    if ( ! jQuery.trim(jQuery('#alerts .message').html())){
      jQuery('#alerts').remove();
    }else{
      jQuery('html').addClass('alert-active');
    }

    jQuery('.alert').each(function(){
      var messageSpan = jQuery(this)
                          .find(
                            [ '.message > .plaintext',
                              '.message .richtext']
                            .join(','))
                          .eq(0),
          id = messageSpan?
                messageSpan.attr('id'):
                jQuery(this).attr('id');

      if(!id) return; // only alerts with ids are remembered.

      jQuery(this)
        .on('close.bs.alert', 
          function(){
            jQuery.cookie(id, true, {expires:1, path:'/'});
            jQuery('html').removeClass('alert-active');
          }
        );
      if(jQuery.cookie(id)){
        jQuery(this).alert('close');
        jQuery('html').removeClass('alert-active');
      }else{
        jQuery(this).removeClass('hidden');
      }
    });
  })();

  (function(){
    jQuery('object')
      .append('<param name="wmode" value="transparent">')
      .find('embed')
      .attr('wmode', 'transparent')
      .parents('object')
      .wrap('<div>');
  })();

  // Location masthead button creation
  (function(){
    jQuery('.call').attr('href', function(){
      return 'tel:'+jQuery.trim(jQuery('.tel .plaintext').text());
    });
    jQuery('.directions')
      .attr('href', 
        function(){
          var url     = 'http://maps.google.com/?q=',
              address = jQuery('.address').find('.plaintext').text();
          return url + jQuery.trim(address);
        }
      );

    // Method to break up address text so it breaks on mobile 
    var address = jQuery('.address .plaintext'),
        split   = address.text().match(/([^,]+\,)(.+$)/);
    if(split)
      address.html(split[1]+'<br class="visible-xs">'+split[2]);

  })();
  (function(){
    //quick fixes for group ex form
    jQuery('.group-ex-date [value=day]').click();
    var d = new Date();
    var curr_date = d.getDate();
    var curr_month = d.getMonth();
    curr_month++;
    var curr_year = d.getFullYear().toString().slice(2);
   jQuery('.group-ex [name=filter_date]')
      .val(curr_month + "/" + curr_date + "/" + curr_year);
  })();
})();

(function($){
	"use strict";

	/**************************************************************************
	* Track GA Conversion and Facebook events when clicking register links
	***************************************************************************/
	var trackGAConversionEvent = function(e) {
		// set google variables as globals
		window.google_conversion_id = 1035347098;
		window.google_conversion_language = "en";
		window.google_conversion_format = "3";
		window.google_conversion_color = "ffffff";
		window.google_conversion_label = "jDaJCMCCmAgQmsnY7QM";
		window.google_remarketing_only = false;

		var oldDocWrite = document.write; // save old doc write
		document.write = function(node){ // change doc write to be friendlier, temporary for google's conversion.js script
			$("body").append(node);
		};

		$.getScript("//www.googleadservices.com/pagead/conversion.js", $.proxy( function(original_event, evt) {
			setTimeout(function() { // let the above script run, then replace doc.write
				document.write = oldDocWrite;
			}, 50);
//			console.log("tracked GA event");
			trackFBOffsiteEvent(original_event);
		}, this, e ));
	};

	var trackFBOffsiteEvent = function(e) {
		var el = $(e.target);
		var trackingUrl = "https://www.facebook.com/offsite_event.php?id=6015496710686&amp;value=0&amp;currency=USD";

		$('<img />').on('load', function(){ // when the image loads...
//			console.log("tracked FB event");
			document.location.href=el.attr('href');
		}).attr('src', trackingUrl );
		return false;
	};

	// If on "Camps" page, track GA Conversion and Facebook, else just Facebook.
	var trackEventsOnClick = function(e) {
		e.preventDefault();
		if(CW.path[0] === "camps") {
			trackGAConversionEvent(e);
		}
		else {
			trackFBOffsiteEvent(e);
		}
	};

	$('[href^="http://ymcatc.ebiz.uapps.net/"], [href*="register"], #join-button').on( 'click', trackEventsOnClick );




	/**************************************************************************
	 * Full-width background image replacement
	 ***************************************************************************/
	$(".full-width-background-image").each( function() {
		var $el = $(this);
		$el.css("background-image", "url(" + window.location.protocol + "//" + window.location.host + $el.find("> img").attr("src") + ")");
//		console.log("Setting: url(" + window.location.protocol + "//" + window.location.host + $el.find("> img").attr("src") + ")");
	});


	/**************************************************************************
	 * Modal opening
	 ***************************************************************************/

	// :containsNC is a case-insensitive ":contains"
	$.extend($.expr[":"], {
		"containsNC": function(elem, i, match, array) {
			return (elem.textContent || elem.innerText || "").toLowerCase().indexOf((match[3] || "").toLowerCase()) >= 0;
		}
	});

	var $user_modals = $('#user_modals');

	$("a[href^='#modal_']").each(function(){
		var $el = $(this);
//		var component_id = "#component_" + $el.attr("href").split("#modal_")[1];
		var $component_h2 = $user_modals.find("h2:containsNC('" + $el.attr("href").split("#modal_")[1].replace(/_/g, " ") +"')");

//		if( $user_modals.find(component_id).length ) { // check if user-generated modal exists
		if( $component_h2.length ) { // check if user-generated modal exists
			var $container = $component_h2.parent().parent();

			$el.on('click', { $container: $container }, function(e) {
				e.preventDefault();
//				var $container	= $user_modals.find(component_id);
				var $body			= $container.find('.modal-body');
				var $modal			= $('#modal');
				var $title			= $modal.find('.modal-title');
				var current_scroll	= $("body").scrollTop();

				if( $body.length ) {
					$container.find('.modal-header').children().clone().appendTo( $title );
					$body.children().clone().appendTo( $modal.find('.modal-body') );
				}
				else { // modal not properly set up with header/body content wrappers; just get all the inner content
					$container.children().clone().appendTo( $modal.find('.modal-body') );
				}

				// add telephone classes, etc. (this should only be done on the membership page)
				$title.find('.plaintext').first()
					.wrap( '<div class="col-md-3 phone clearfix"></div>' )
					.wrapInner( '<span class="tel"></span>' )
					.prepend( '<span class="glyphicon glyphicon-earphone bullet"></span>' );

				$title.find('.plaintext').eq(1)
					.wrap( '<div class="col-md-6 address clearfix"></div>' )
					.prepend( '<span class="glyphicon glyphicon-map-marker bullet"></span>' );

				$title.find('a:last').addClass("directions")
					.append('<span class="glyphicon glyphicon-share"></span>');

				// init carousel
				// TODO: make this more modular (usable on non-modal components)
				var $carousel = $modal.find('.carousel-wrapper');
				$carousel.append('<a class="left carousel-control cycle-prev hidden-xs"><span class="icon-prev"></span></a>');
				$carousel.append('<a class="right carousel-control cycle-next hidden-xs" ><span class="icon-next"></span></a>');

				$carousel.cycle({
					slides			: '> .image_component',
					fx				: 'scrollHorz',
					easing			: 'easeOutQuint',
					log				: false
				});

//				$(".viewport").css({"position": "fixed", "overflow": "hidden", "height":"100%"});

				$modal.on('hidden.bs.modal', function(){
					$carousel.cycle('destroy');
					$('#modal-body').empty();
					$('#modal-title').empty();
					$modal.off('hidden.bs.modal');
					$("body").scrollTop(current_scroll);
					setTimeout( function() { $("body").scrollTop(current_scroll); }, 1 );
				});

				// show modal
				$modal.modal('show');
				$(".viewport").scrollTop(current_scroll);
			});
		}
		else {
			console.warn("Could not find user-generated modal:" + $el.attr("href") );
		}
	});


	if( $('.page_membership, .page_membership_new').length )
	{
		// if on membership page & there is a hash, expand and preselect
		if( window.location.hash ) {
			$(window).scrollTop($('h2').first().offset().top-120);
			var $expander = $('.content .accordion-toggle').first().trigger('click');

			// pre-select form dropdown
			var hash = window.location.hash.substring(1).replace(/_/g, " ");
			$("#c_339239_question_623").find("option:containsNC('" + hash + "')").prop( 'selected', true );
		}

		// Expand form when clicking Get Started on the right
		$('a[href=#form]').on('click', function(e) {
			e.preventDefault();
			$('.content .accordion-toggle').first().trigger('click');
		});

		// Expand and focus form if there was an error when submitting
		if( $('.alert-error').length ) {
			$(window).scrollTop($('h2').first().offset().top);
			$('.content .accordion-toggle').first().trigger('click');
		}

		// If there errors on form, move them right above the membership form.
		var $inline_messages = $('.inline-messages');
		if( $inline_messages.length ) {
			$('.content').first().find('.panel-body').first().prepend( $('.inline-messages') )
		}
	}

	// Thank You page scripts
	if( $('.page_thank_you').length ) {
		// reset map zoom
		var my_map;
		$('.map').on('initialized', function(event, map) {
			my_map = map;
		});

		$(window).on('load', function() {
			if( typeof my_map !== "undefined" ) {
				my_map.setZoom(11);
			}
		});


		// AdWords Conversion Code for Membership Thank You page
		window.google_conversion_id = 972477237;
		window.google_conversion_language = "en";
		window.google_conversion_format = "3";
		window.google_conversion_color = "ffffff";
		window.google_conversion_label = "bbNBCLvm2AgQtabbzwM";
		window.google_remarketing_only = false;

		var oldDocWrite = document.write; // save old doc write
		document.write = function(node){ // change doc write to be friendlier, temporary for google's conversion.js script
			$("body").append(node);
		};

		$.getScript("//www.googleadservices.com/pagead/conversion.js", $.proxy( function(original_event, evt) {
			setTimeout(function() { // let the above script run, then replace doc.write
				document.write = oldDocWrite;
			}, 50);
		}, this ));
	}

	/**************************************************************************
	 * Facebook - track all all camp/summer program pages 2014
	 ***************************************************************************/
	var splitURL = CW.page.liveUrl.split("/");
	if( (splitURL[1] === "camps") || (splitURL[1] == "child_care" && splitURL[2] === "summer_programs") ) {
		window._fbq = window._fbq || [];
		window._fbq.push(['track', 'PixelInitialized', {}]);
		var _fbq = window._fbq || (window._fbq = []);
		if (!_fbq.loaded) {
			var fbds = document.createElement('script');
			fbds.async = true;
			fbds.src = '//connect.facebook.net/en_US/fbds.js';
			var s = document.getElementsByTagName('script')[0];
			s.parentNode.insertBefore(fbds, s);
			_fbq.loaded = true;
		}
		_fbq.push(['addPixelId', '1438804779686566']);
	}


	/**************************************************************************
	 * Placeholder replacement
	 ***************************************************************************/
	$('input, textarea').placeholder();


	/**************************************************************************
	 * Re-usable dropdown prepopulation via URL hash
	 ***************************************************************************/
	CW.prepopulate_dropdown = function( dropdown_selector ) {
		// if on membership page & there is a hash, expand and preselect
		if( window.location.hash ) {
			// pre-select form dropdown
			var hash = window.location.hash.substring(1).replace(/_/g, " ");
			$(dropdown_selector).find("option:containsNC('" + hash + "')").prop( 'selected', true );
			return true;
		}
		return false;
	};

	/**************************************************************************
	 * Blog Categories activation
	 ***************************************************************************/
	var cw_path_arr = CW.page.liveUrl.split('/').slice(1,-1);
	if( cw_path_arr[0] == "health_resources" && typeof cw_path_arr[1] != "undefined" ) {
		$('#blog_submenus').find('a:containsNC(' + cw_path_arr[1].replace(/_/g, " ") + ')').addClass("active");
	}
})(jQuery);

(function($) {
  if( $('[data-stacking-order]').length > 0 ) {
   var win =  $(window),
      reordered = false,
       important_content = $('[data-stacking-order]'),
       lesser_content = $(".lead-copy .row > .col-sm-4"),
       append_to      = $(".lead-copy .row")
       stack_content = function(event) {

        if( win.width() < 768 ) {
          if( reordered ) {
            return;
          }
          else {
            lesser_content.insertAfter(important_content);
            reordered = true;
          }
        }
        else {
          if( !reordered ) {
            return
          }
          else {
            append_to.append(lesser_content);
            reordered = false;
          }
        }
      }   
 
    $(window).on('resize', stack_content);
    stack_content();
  }
})(CWjQuery);
CWjQuery('.registration_block_id_80').siblings('.text-right').find('small').text('All fields required');
