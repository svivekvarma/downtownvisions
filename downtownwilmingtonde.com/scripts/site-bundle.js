/******/ (function(modules) { // webpackBootstrap
/******/ 	// The module cache
/******/ 	var installedModules = {};

/******/ 	// The require function
/******/ 	function __webpack_require__(moduleId) {

/******/ 		// Check if module is in cache
/******/ 		if(installedModules[moduleId])
/******/ 			return installedModules[moduleId].exports;

/******/ 		// Create a new module (and put it into the cache)
/******/ 		var module = installedModules[moduleId] = {
/******/ 			exports: {},
/******/ 			id: moduleId,
/******/ 			loaded: false
/******/ 		};

/******/ 		// Execute the module function
/******/ 		modules[moduleId].call(module.exports, module, module.exports, __webpack_require__);

/******/ 		// Flag the module as loaded
/******/ 		module.loaded = true;

/******/ 		// Return the exports of the module
/******/ 		return module.exports;
/******/ 	}


/******/ 	// expose the modules object (__webpack_modules__)
/******/ 	__webpack_require__.m = modules;

/******/ 	// expose the module cache
/******/ 	__webpack_require__.c = installedModules;

/******/ 	// __webpack_public_path__
/******/ 	__webpack_require__.p = "";

/******/ 	// Load entry module and return exports
/******/ 	return __webpack_require__(0);
/******/ })
/************************************************************************/
/******/ ([
/* 0 */
/***/ function(module, exports, __webpack_require__) {

	__webpack_require__(1);
	__webpack_require__(3);
	module.exports = __webpack_require__(95);


/***/ },
/* 1 */
/***/ function(module, exports, __webpack_require__) {

	var debounce = __webpack_require__(2);

	/*

	  This script takes an existing relatively positioned element
	  like a header and converts it to fixed at a certain point
	  when the user is scrolling down the page.

	  To initialize it, you use a class and a couple of data
	  attributes, like this:

	  <header
	    class="show-on-scroll"
	    data-offset-el=".index-section"
	    data-offset-behavior="bottom">

	  class
	  =====
	    Put the class on the element you want to manipulate.

	  data-offset-el
	  ==============
	    The selector of the element that defines the offset
	    top value where the appearance changes. This is used
	    as a Y.one() so if you pass it a class, it will only
	    get the first instance of that class.

	  data-offset-behavior
	  ====================
	    Options are "top" or "bottom." Top is the default. The
	    .show-on-scroll element will change when you reach
	    that position on the offset element.

	*/

	Y.use('node', function(Y) {
	  window.Singleton.create({

	    ready: function() {

	      if (Y.one('.collection-type-index')) {
	        if (Y.one('.touch-styles')) {
	          return false;
	        }

	        this.initializer();
	        this.bindUI();
	        this.syncUI();
	      }

	    },

	    initializer: function() {

	      this.el = Y.one('.show-on-scroll');

	      if (this.el) {
	        this.elOffset = Y.one(this.el.getData('offset-el'));
	        this.offsetBehavior = this.el.getData('offset-behavior') || 'top';
	        if (this.elOffset) {
	          Y.one('body').prepend(Y.Node.create('<div class="show-on-scroll-wrapper" id="showOnScrollWrapper"></div>'));
	          this.wrapper = Y.one('#showOnScrollWrapper');
	          this.wrapper.setHTML(this.el._node.outerHTML);
	        } else {
	          console.warn('No show on scroll offset element found.');
	          return;
	        }
	      } else {
	        console.warn('No show on scroll element found.');
	        return;
	      }

	    },

	    bindUI: function() {

	      this.scrollEvents();

	      Y.one(window).on('resize', function() {
	        this.syncUI();
	      }, this);

	    },

	    syncUI: function() {

	      this.getVariables();

	    },

	    getVariables: function() {

	      if (this.offsetBehavior === 'bottom') {
	        this.navShowPosition = this.elOffset.getY() + this.elOffset.get('offsetHeight');
	      } else {
	        this.navShowPosition = this.elOffset.getY();
	      }

	    },

	    scrollEvents: function() {

	      this.scrolling = false;

	      Y.one(window).on('scroll', function() {
	        if (this.scrolling === false) {
	          this.scrolling = true;
	          this.scrollLogic();
	          debounce(function() {
	            this.scrolling = false;
	          }, 300, this);
	        }
	      }, this);

	    },

	    scrollLogic: function() {

	      if (window.scrollY > this.navShowPosition) {
	        this.wrapper.addClass('show');
	      } else {
	        this.wrapper.removeClass('show');
	      }

	      Y.later(100, this, function() {
	        if (this.scrolling === true) {
	          window.requestAnimationFrame(Y.bind(function() {
	            this.scrollLogic();
	          }, this));
	        }
	      });

	    }

	  });
	});

/***/ },
/* 2 */
/***/ function(module, exports) {

	
	/*
	  This function takes an event that executes
	  continuously - like scroll or resize - and
	  fires only one event when the continuous
	  events are finished.

	  debounce(function () {
	    // do stuff here.
	  });
	*/

	var timeout;

	function debounce(callback, timer, context) {

	  timer = timer || 100;
	  context = context || window;

	  if (callback) {
	    timeout && timeout.cancel();
	    timeout = Y.later(timer, context, callback);
	  }

	}

	module.exports = debounce;

/***/ },
/* 3 */
/***/ function(module, exports, __webpack_require__) {

	var debounce = __webpack_require__(2);
	var VideoBackgroundRenderer = __webpack_require__(4).VideoBackground;
	var GetVideoProps = __webpack_require__(4).getVideoProps;

	Y.use([
	  'node',
	  'squarespace-gallery-ng'
	], function(Y) {
	  window.Singleton.create({

	    ready: function() {
	      this.resetGalleryPosition();

	      if (Y.one('.collection-type-index')) {
	        this.resetIndexGalleryPosition();
	      }

	      if (Y.one('.collection-type-blog.view-list .sqs-featured-posts-gallery')) {
	        Y.one('body').addClass('has-banner-image');
	      }

	      this.init();
	      this.bindUI();
	      this.syncUI();

	    },

	    init: function() {

	      this.forceMobileNav();
	      this.promotedGalleryShrink();

	      // Text shrink in banner areas
	      if (Y.one('.has-promoted-gallery')){
	        this.textShrink('.meta-description p > strong', 'p');
	        this.textShrink('.meta-description p > em > strong', 'p');
	      } else {
	        this.textShrink('.desc-wrapper p > strong', 'p');
	        this.textShrink('.desc-wrapper p > em > strong', 'p');
	      }
	      this.textShrink('.post-title a', '.post-title');
	      this.textShrink('.blog-item-wrapper .post-title', '.title-desc-wrapper');

	      this._touch = Y.one('.touch-styles');


	      // Featured Posts Gallery
	      if (Y.one('.collection-type-blog.view-list .sqs-featured-posts-gallery')) {
	        this.makeFeaturedGallery('.posts', '.post');
	      }

	      this.hideArrowsWhenOneSlide();
	      this.repositionCartButton();

	      if (!this._touch) {
	        var preFooter = Y.one('#preFooter');
	        if (preFooter.inViewportRegion() === false) {
	          preFooter.addClass('unscrolled');
	        }

	        Y.one(window).on('scroll', function() {
	          if (preFooter.hasClass('unscrolled')) {
	            preFooter.toggleClass('unscrolled', !preFooter.inViewportRegion());
	          }
	        });
	      }

	      var videoBackgroundNodes = Array.prototype.slice.call(document.body.querySelectorAll('div.sqs-video-background'));
	      var videoBackgrounds = videoBackgroundNodes.map(function(item) {
	        return new VideoBackgroundRenderer(GetVideoProps(item));
	      });


	    },

	    bindUI: function() {

	      Y.one(window).on('resize', this.syncUI, this);

	      if (Y.one('#mobileNavToggle')){
	        Y.one('.body-overlay').on('click', function(e) {
	          e.preventDefault();
	          Y.one('#mobileNavToggle').set('checked', false);
	        });
	      }

	      // Scrolling stuff
	      var throttleScroll = Y.throttle(Y.bind(function() {
	        this.bindScroll('#preFooter', Y.one('#preFooter').height() * 0.6);
	      }, this), 200);

	      if (!this._touch) {
	        Y.one(window).on('scroll', throttleScroll);
	      }

	      Y.all('.subnav').each(function(subnav) {
	        var rect = subnav._node.getBoundingClientRect();

	        if (rect.right > Y.config.win.innerWidth) {
	          subnav.addClass('right');
	        }
	      });

	      var navLinkSelector = '#sidecarNav a[href^="#"], #sidecarNav a[href^="/#"], #sidecarNav a[href^="/"][href*="#"]';
	      Y.all(navLinkSelector).each(function(hashLink) {
	        hashLink.on('click', function(e) {
	          e.halt();

	          Y.one('#mobileNavToggle').set('checked',false);

	        }, this);
	      }, this);

	      this.showIndexNavOnScroll();
	      this.disableHoverOnScroll();

	    },

	    syncUI: function() {

	      this.forceMobileNav();

	      debounce(function() {
	        this.addPaddingToFooter();
	      }, 100, this);

	    },

	    bindScroll: function(element, offset){
	      var nextElement;

	      if (!nextElement) {
	        nextElement = Y.one(element + '.unscrolled');
	      }

	      if (nextElement){
	        var scrollPosition = window.pageYOffset + Y.one('body').get('winHeight');
	        var elementPosition = nextElement.getY() + (offset || 0);

	        if (scrollPosition >= elementPosition){
	          nextElement.removeClass('unscrolled');
	        }
	      }

	    },

	    _atLeast: 0,
	    forceMobileNav: function() {

	      var nav = Y.one('#mainNavWrapper');

	      if (nav) {

	        var windowWidth = Y.one('body').get('winWidth');
	        var header = Y.one('#header');
	        var headerWidth;
	        var navWidth;
	        var logoWidth;

	        if (Y.one('#logoWrapper')) {
	          logoWidth = parseInt(Y.Squarespace.Template.getTweakValue('logoContainerWidth'), 10);
	        } else {
	          logoWidth = parseInt(Y.Squarespace.Template.getTweakValue('siteTitleContainerWidth'), 10);
	        }

	        if (windowWidth > this._atLeast) {
	          Y.one('body').removeClass('force-mobile-nav');

	          headerWidth = header.get('offsetWidth') - parseInt(header.getStyle('paddingLeft'), 10) - parseInt(header.getStyle('paddingRight'), 10);
	          navWidth = nav.get('offsetWidth');

	          if (navWidth > headerWidth - logoWidth) {
	            Y.one('body').addClass('force-mobile-nav');
	            this._atLeast = windowWidth;
	          }
	        } else {
	          Y.one('body').addClass('force-mobile-nav');
	        }
	      }
	    },

	    makeFeaturedGallery: function(container, slides) {

	      new Y.Squarespace.Gallery2({
	        autoHeight: false,
	        container: container,
	        slides: slides,
	        elements: {
	          next: '.next-slide, .simple .next, .sqs-gallery-controls .next',
	          previous: '.previous-slide, .simple .previous, .sqs-gallery-controls .previous',
	          controls: '.dots, .circles',
	          currentIndex: '.current-index',
	          totalSlides: '.total-slides'
	        },
	        loop: true,
	        loaderOptions: {
	          load: true
	        },
	        design: 'stacked',
	        designOptions: {
	          transition: 'fade',
	          clickBehavior: 'auto'
	        },
	        refreshOnResize: true
	      });

	    },

	    promotedGalleryShrink: function() {

	      var meta = '.has-promoted-gallery #promotedGalleryWrapper .meta';
	      var promotedGalleryHeight;
	      var metaHeight;
	      var slide;

	      if (Y.one(meta)) {
	        promotedGalleryHeight = Y.one('#promotedGalleryWrapper').get('offsetHeight');
	        if (Y.one('.transparent-header')) {
	          // Provide less of an allowance if transparent header
	          promotedGalleryHeight = promotedGalleryHeight - 90;
	        }

	        Y.all(meta).each(function(current) {
	          current.setStyle('display', 'block');
	          metaHeight = current.get('offsetHeight');

	          if (metaHeight > promotedGalleryHeight) {
	            slide = current.ancestor('.slide');
	            slide.addClass('reduce-text-size');
	            metaHeight = current.get('offsetHeight');

	            if (metaHeight > promotedGalleryHeight) {
	              slide.removeClass('reduce-text-size');
	              slide.addClass('hide-body-text');
	              metaHeight = current.get('offsetHeight');

	              if (metaHeight > promotedGalleryHeight) {
	                slide.addClass('reduce-text-size');
	              }
	            }
	          }

	          current.setAttribute('style', '');
	        });

	      }
	    },

	    textShrink: function(element, ancestor) {
	      if (Y.one(element) && Y.one(element).ancestor(ancestor)) {
	        Y.all(element).each(function(item){
	          item.plug(Y.Squarespace.TextShrink, {
	            parentEl: item.ancestor(ancestor)
	          });
	        });
	      }
	    },

	    resetIndexGalleryPosition: function() {

	      var slideshows = '.collection-type-index .index-section .sqs-layout > .sqs-row:first-child > .sqs-col-12 > .gallery-block:first-child .sqs-gallery-block-slideshow';
	      var slideshowContainers = '.collection-type-index .index-section .promoted-gallery-wrapper ~ .index-section-wrapper .sqs-layout > .sqs-row:first-child > .sqs-col-12 > .gallery-block:first-child';

	      var firstPageSlideshow = Y.one('.collection-type-index .index-section:first-child .sqs-layout > .sqs-row:first-child > .sqs-col-12 > .gallery-block:first-child .sqs-gallery-block-slideshow');

	      if (firstPageSlideshow) {
	        Y.one('body').addClass('has-banner-image');
	      }

	      if (Y.one(slideshows)) {
	        Y.one('body').addClass('has-promoted-gallery');
	        Y.all(slideshowContainers).each(function(current) {
	          if (current.one('.sqs-gallery-block-slideshow')) {
	            current.ancestor('.index-section-wrapper').previous('.promoted-gallery-wrapper').addClass('promoted-full').append(current);
	          }
	        });
	      }

	    },

	    resetGalleryPosition: function() {

	      var slideshow = Y.one('.collection-type-page .main-content .sqs-layout > .sqs-row:first-child > .sqs-col-12 > .gallery-block:first-child .sqs-gallery-block-slideshow');
	      var slideshowContainer = Y.one('.collection-type-page .main-content .sqs-layout > .sqs-row:first-child > .sqs-col-12 > .gallery-block:first-child');

	      if (slideshow) {
	        Y.one('#promotedGalleryWrapper .row .col').append(slideshowContainer);
	        Y.one('body').addClass('has-promoted-gallery').addClass('has-banner-image');
	      }

	    },

	    hideArrowsWhenOneSlide: function() {

	      if (Y.one('.posts .post:only-child')) {
	        Y.all('.circles').addClass('hidden');
	      }

	    },

	    repositionCartButton: function() {

	      var headerHeight = Y.one('#header').get('offsetHeight');
	      var cartPill = Y.one('.sqs-cart-dropzone');
	      if (cartPill) {
	        if (Y.one('.transparent-header.has-banner-image')) {
	          cartPill.setStyle('top', headerHeight);
	        } else {
	          cartPill.setStyle('top', headerHeight + 20);
	        }
	      }

	    },


	    // takes care of showing the index nav on mobile
	    showIndexNavOnScroll: function() {

	      var navShowPosition;

	      var getVariables = function() {
	        if (Y.one('.index-section')) {
	          navShowPosition = Y.one('.index-section').get('offsetHeight');
	        }
	      };

	      getVariables();

	      if (Y.one('.collection-type-index') && window.innerWidth <= 640) {

	        var scrollStates = function() {

	          // scrolled past first index page?
	          if ((navShowPosition - window.pageYOffset) <= 0) {
	            Y.one('body').addClass('fix-header-nav');
	          } else {
	            Y.one('body').removeClass('fix-header-nav');
	          }

	        };

	        Y.one(window).on('resize', function() {
	          getVariables();
	        });

	        scrollStates();

	        Y.one(window).on('scroll', function() {
	          scrollStates();
	        }, this);

	        // forcibly removes fix-header-nav class for ios safari
	        // which doesn't seem to recognize opening the nav as a scroll event
	        Y.one('.mobile-nav-toggle-label.fixed-nav-toggle-label').on('click', function() {
	          if (Y.one('body').hasClass('fix-header-nav')) {
	            Y.one('body').removeClass('fix-header-nav');
	          }
	        });

	        Y.one(window).on(['touchstart', 'MSPointerDown'], function() {
	          this._timeout && this._timeout.cancel();
	          this.isHidden = true;
	          if (this.isHidden === true) {
	            Y.one('.mobile-nav-toggle-label.fixed-nav-toggle-label').setStyle('opacity', 1);
	            this.isHidden = false;
	          }
	        }, this);

	        Y.one(window).on(['touchend', 'MSPointerUp'], function() {
	          this._timeout = Y.later(1500, this, function() {
	            this.isHidden = true;
	            Y.one('.mobile-nav-toggle-label.fixed-nav-toggle-label').setStyle('opacity', 0);
	          });
	        }, this);

	      }
	    },

	    //keeps the mobile nav from peeking out of the bottom on short pages
	    addPaddingToFooter: function() {

	      var footerPadding = parseInt(Y.one('#footer').getStyle('paddingBottom'), 10);
	      var siteHeight = Y.one('#siteWrapper').get('offsetHeight');
	      var windowHeight = Y.one('body').get('winHeight');
	      if ((siteHeight - footerPadding) <= windowHeight) {
	        Y.one('#footer').setStyle('paddingBottom', windowHeight - (siteHeight - footerPadding));
	      }

	    },

	    disableHoverOnScroll: function() {
	      if (Y.UA.mobile) {
	        return false;
	      }

	      var css = '.disable-hover:not(.sqs-layout-editing), .disable-hover:not(.sqs-layout-editing) * { pointer-events: none  ; }';
	      var head = document.head || document.getElementsByTagName('head')[0];
	      var style = document.createElement('style');
	      var body = document.body;
	      var timer;

	      style.type = 'text/css';
	      if (style.styleSheet){
	        style.styleSheet.cssText = css;
	      } else {
	        style.appendChild(document.createTextNode(css));
	      }

	      head.appendChild(style);

	      window.addEventListener('scroll', function() {
	        clearTimeout(timer);
	        if (!body.classList.contains('disable-hover')) {
	          body.classList.add('disable-hover');
	        }

	        timer = setTimeout(function() {
	          body.classList.remove('disable-hover');
	        }, 300);
	      }, false);
	    }

	  });
	});


/***/ },
/* 4 */
/***/ function(module, exports, __webpack_require__) {

	var VideoBackground = __webpack_require__(5);
	var getVideoProps = __webpack_require__(94);

	module.exports = {
	  'VideoBackground': VideoBackground,
	  'getVideoProps': getVideoProps
	};


/***/ },
/* 5 */
/***/ function(module, exports, __webpack_require__) {

	'use strict';

	var VideoBackground = __webpack_require__(6);

	module.exports = VideoBackground;

/***/ },
/* 6 */
/***/ function(module, exports, __webpack_require__) {

	'use strict';

	var _assign = __webpack_require__(7);

	var _assign2 = _interopRequireDefault(_assign);

	var _typeof2 = __webpack_require__(44);

	var _typeof3 = _interopRequireDefault(_typeof2);

	var _classCallCheck2 = __webpack_require__(79);

	var _classCallCheck3 = _interopRequireDefault(_classCallCheck2);

	var _createClass2 = __webpack_require__(80);

	var _createClass3 = _interopRequireDefault(_createClass2);

	function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

	var custEvent = __webpack_require__(84);
	var parseUrl = __webpack_require__(85);

	var DEBUG = false;

	var DEFAULT_PROPERTY_VALUES = {
	  'container': '.background-wrapper',
	  'url': 'https://www.youtube.com/watch?v=xkEmYQvJ_68',
	  'fitMode': 'fill',
	  'maxLoops': '',
	  'scaleFactor': 1,
	  'playbackSpeed': 1,
	  'filter': 1,
	  'filterStrength': 50,
	  'timeCode': { 'start': 0, 'end': null },
	  'useCustomFallbackImage': false
	};

	var FILTER_OPTIONS = __webpack_require__(89).filterOptions;
	var FILTER_PROPERTIES = __webpack_require__(89).filterProperties;

	var YOUTUBE_REGEX = /^.*(youtu\.be\/|v\/|u\/\w\/|embed\/|watch\?v=|\&v=)([^#\&\?]{11}).*/;

	/**
	 * A class which uses the YouTube API to initialize an IFRAME with a YouTube video.
	 * Additional display options and functionality are configured through a set of properties,
	 * superceding default properties.
	 */

	var VideoBackground = function () {
	  /**
	   * @param {Object} props - An optional object with configuation.
	   * @param {Object} windowContext - The parent window object (due to .sqs-site-frame).
	   */

	  function VideoBackground(props) {
	    var _this = this;

	    var windowContext = arguments.length <= 1 || arguments[1] === undefined ? window : arguments[1];
	    (0, _classCallCheck3.default)(this, VideoBackground);

	    this.windowContext = windowContext;
	    this.initializeProperties(props);
	    this.setDisplayEffects();
	    this.setFallbackImage();
	    this.initializeYouTubeAPI();
	    this.bindUI();

	    if (DEBUG === true) {
	      window.vdbg = this;
	      this.debugInterval = setInterval(function () {
	        if (_this.player.getCurrentTime) {
	          _this.logger((_this.player.getCurrentTime() / _this.player.getDuration()).toFixed(2));
	        }
	      }, 900);
	    }
	  }

	  (0, _createClass3.default)(VideoBackground, [{
	    key: 'destroy',
	    value: function destroy() {
	      this.events.forEach(function (evt) {
	        evt.target.removeEventListener(evt.type, evt.handler, true);
	      });
	      this.events = null;

	      if ((0, _typeof3.default)(this.player) === 'object') {
	        try {
	          this.player.getIframe().classList.remove('ready');
	          this.player.destroy();
	          this.player = null;
	        } catch (err) {
	          console.error(err);
	        }
	      }

	      if (typeof this.timer === 'number') {
	        clearTimeout(this.timer);
	        this.timer = null;
	      }

	      if (typeof this.debugInterval === 'number') {
	        clearInterval(this.debugInterval);
	        this.debugInterval = null;
	      }
	    }
	  }, {
	    key: 'bindUI',
	    value: function bindUI() {
	      var _this2 = this;

	      this.events = [];

	      var resizeHandler = function resizeHandler() {
	        _this2.windowContext.requestAnimationFrame(function () {
	          _this2.scaleVideo();
	        });
	      };
	      this.events.push({
	        'target': this.windowContext,
	        'type': 'resize',
	        'handler': resizeHandler
	      });
	      this.windowContext.addEventListener('resize', resizeHandler, true);
	    }

	    /**
	     * Merge configuration properties with defaults with minimal validation.
	     */

	  }, {
	    key: 'initializeProperties',
	    value: function initializeProperties() {
	      var props = arguments.length <= 0 || arguments[0] === undefined ? {} : arguments[0];

	      props = (0, _assign2.default)({}, DEFAULT_PROPERTY_VALUES, props);
	      if (props.container.nodeType === 1) {
	        this.container = props.container;
	      } else if (typeof props.container === 'string') {
	        this.container = document.querySelector(props.container);
	      } else {
	        console.error('Container ' + props.container + ' not found');
	        return false;
	      }
	      this.videoId = this.getVideoID(props.url);
	      this.filter = props.filter;
	      this.filterStrength = props.filterStrength;
	      this.useCustomFallbackImage = props.useCustomFallbackImage;
	      this.fitMode = props.fitMode;
	      this.maxLoops = parseInt(props.maxLoops, 10) || null;
	      this.scaleFactor = props.scaleFactor;
	      this.playbackSpeed = parseFloat(props.playbackSpeed) === 0.0 ? 1 : parseFloat(props.playbackSpeed);
	      this.timeCode = {
	        start: this._getStartTime(props.url) || props.timeCode.start,
	        end: props.timeCode.end
	      };

	      var ua = window.navigator.userAgent;
	      this.isMobileBrowser = ua.indexOf('AppleWebKit') !== -1 && ua.indexOf('Mobile') !== -1;
	      if (this.isMobileBrowser) {
	        this.container.classList.add('mobile');
	      }
	      this.player = {};
	      this.currentLoop = 0;
	    }

	    /**
	     * All diplay related effects should be applied prior to the video loading to
	     * ensure the effects are visible on the fallback image while loading.
	     */

	  }, {
	    key: 'setDisplayEffects',
	    value: function setDisplayEffects() {
	      this.setFilter();
	    }

	    /**
	     * A default fallback image element will be create from the YouTube API, unless the
	     * custom fallback image exists.
	     */

	  }, {
	    key: 'setFallbackImage',
	    value: function setFallbackImage() {
	      var _this3 = this;

	      if (this.useCustomFallbackImage) {
	        (function () {
	          var customFallbackImage = _this3.container.querySelector('.custom-fallback-image');
	          var tempImage = document.createElement('img');
	          tempImage.src = customFallbackImage.src;
	          tempImage.addEventListener('load', function () {
	            customFallbackImage.classList.add('loaded');
	          });
	        })();
	      }

	      if (this.container.querySelector('.default-fallback-image')) {
	        this.container.querySelector('.default-fallback-image').remove();
	      }

	      if (this.isMobileBrowser) {
	        return;
	      }

	      var getBestQuality = function getBestQuality(evt) {
	        // Prefer the HD-quality image if present. If not, load the default thumbnail.
	        var defaultFallbackImage = evt.currentTarget;
	        if (defaultFallbackImage.width < 480 && defaultFallbackImage.src.indexOf('0.jpg') === -1) {
	          defaultFallbackImage.src = 'https://img.youtube.com/vi/' + _this3.videoId + '/0.jpg';
	          return;
	        }
	        // Only display a real thumbnail image, not the small YouTube gray box.
	        if (defaultFallbackImage.width >= 480) {
	          _this3.container.insertBefore(defaultFallbackImage, _this3.container.querySelector('#player'));
	          defaultFallbackImage.classList.add('loaded');
	        }
	        _this3.setDisplayEffects();
	        defaultFallbackImage.removeEventListener('load', getBestQuality);
	      };

	      var imageURL = 'https://img.youtube.com/vi/' + this.videoId + '/maxresdefault.jpg';
	      var defaultFallbackImage = document.createElement('img');
	      defaultFallbackImage.src = this.fallbackImageURL || imageURL;
	      defaultFallbackImage.classList.add('default-fallback-image');
	      defaultFallbackImage.classList.add('buffering');
	      defaultFallbackImage.addEventListener('load', getBestQuality);
	    }

	    /**
	     * Call YouTube API per their guidelines.
	     */

	  }, {
	    key: 'initializeYouTubeAPI',
	    value: function initializeYouTubeAPI() {
	      var _this4 = this;

	      if (this.windowContext.document.documentElement.querySelector('script[src*="www.youtube.com/iframe_api"].loaded')) {
	        this.setVideoPlayer();
	        return;
	      }

	      this.player.ready = false;
	      var tag = this.windowContext.document.createElement('script');
	      tag.src = 'https://www.youtube.com/iframe_api';
	      var firstScriptTag = this.windowContext.document.getElementsByTagName('script')[0];
	      firstScriptTag.parentNode.insertBefore(tag, firstScriptTag);
	      tag.addEventListener('load', function (evt) {
	        evt.currentTarget.classList.add('loaded');
	        _this4.setVideoPlayer();
	      }, true);
	    }

	    /**
	     * The ID is the only unique property need to use in the YouTube API.
	     */

	  }, {
	    key: 'getVideoID',
	    value: function getVideoID(value) {
	      if (!value) {
	        value = DEFAULT_PROPERTY_VALUES.url;
	      }

	      var match = value.match(YOUTUBE_REGEX);
	      if (match && match[2].length) {
	        return match[2];
	      }

	      return '';
	    }

	    /**
	     * Initialize a YouTube video player and register its callbacks.
	     */

	  }, {
	    key: 'setVideoPlayer',
	    value: function setVideoPlayer() {
	      var _this5 = this;

	      if (this.player.ready) {
	        try {
	          this.player.destroy();
	        } catch (e) {
	          // nothing to destroy
	        }
	      }

	      // Poll until the API is ready.
	      if (this.windowContext.YT.loaded !== 1) {
	        setTimeout(this.setVideoPlayer.bind(this), 100);
	        return false;
	      }

	      this.player = new this.windowContext.YT.Player(this.container.querySelector('#player'), {
	        height: '315',
	        width: '560',
	        videoId: this.videoId,
	        playerVars: {
	          'autohide': 1,
	          'autoplay': 0,
	          'controls': 0,
	          'enablejsapi': 1,
	          'iv_load_policy': 3,
	          'loop': 0,
	          'modestbranding': 1,
	          'playsinline': 1,
	          'rel': 0,
	          'showinfo': 0,
	          'wmode': 'opaque'
	        },
	        events: {
	          'onReady': function onReady(event) {
	            _this5.onPlayerReady(event);
	          },
	          'onStateChange': function onStateChange(event) {
	            _this5.onPlayerStateChange(event);
	          }
	        }
	      });
	    }

	    /**
	     * YouTube event handler. Add the proper class to the player element, and set
	     * player properties.
	     */

	  }, {
	    key: 'onPlayerReady',
	    value: function onPlayerReady(event) {
	      this.player.getIframe().classList.add('background-video');
	      this.syncPlayer();
	      this.player.mute();
	      if (typeof window.CustomEvent !== 'function') {
	        custEvent();
	      }
	      var readyEvent = new CustomEvent('ready');
	      this.container.dispatchEvent(readyEvent);
	      document.body.classList.add('ready');
	      this.player.ready = true;
	      if (this.isMobileBrowser) {
	        return;
	      }
	      this.player.seekTo(this.timeCode.start);
	      this.player.playVideo();
	    }

	    /**
	     * YouTube event handler. Determine whether or not to loop the video.
	     */

	  }, {
	    key: 'onPlayerStateChange',
	    value: function onPlayerStateChange(event) {
	      var _this6 = this;

	      var playerIframe = this.player.getIframe();
	      var defaultImage = this.container.querySelector('.default-fallback-image');
	      var duration = (this.player.getDuration() - this.timeCode.start) / this.playbackSpeed;

	      if (event.data === this.windowContext.YT.PlayerState.BUFFERING && this.player.getVideoLoadedFraction() !== 1 && (this.player.getCurrentTime() === 0 || this.player.getCurrentTime() > duration - -0.1)) {
	        this.logger('BUFFERING');
	        defaultImage.classList.add('buffering');
	      } else if (event.data === this.windowContext.YT.PlayerState.PLAYING) {
	        this.logger('PLAYING');
	        playerIframe.classList.add('ready');
	        defaultImage.classList.remove('buffering');

	        if (this.player.getCurrentTime() === this.timeCode.start) {
	          clearTimeout(this.timer);

	          if (this.maxLoops) {
	            this.currentLoop++;
	            if (this.currentLoop > this.maxLoops) {
	              this.player.pauseVideo();
	              this.currentLoop = 0;
	              return;
	            }
	          }

	          this.timer = setTimeout(function () {
	            _this6.player.pauseVideo();
	            _this6.player.seekTo(_this6.timeCode.start);
	          }, duration * 1000 - 100);
	        }
	      } else {
	        this.logger('PAUSED/ENDED: ' + event.data);
	        this.player.playVideo();
	      }
	    }

	    /**
	     * The IFRAME will be the entire width and height of its container, but the video
	     * may be a completely different size and ratio. Scale up the IFRAME so the inner video
	     * behaves in the proper `fitMode`, with optional additional scaling to zoom in.
	     */

	  }, {
	    key: 'scaleVideo',
	    value: function scaleVideo(scaleValue) {
	      var scale = scaleValue || this.scaleFactor;
	      var videoDimensions = this._findPlayerDimensions();
	      var playerIframe = this.player.getIframe();
	      var fallbackImg = null;
	      if (!this.useCustomFallbackImage) {
	        fallbackImg = this.container.querySelector('.default-fallback-image');
	      }

	      if (this.fitMode !== 'fill') {
	        playerIframe.style.width = '';
	        playerIframe.style.height = '';
	        if (fallbackImg) {
	          fallbackImg.style.width = '';
	          fallbackImg.style.minHeight = '';
	        }
	        return false;
	      }

	      var containerWidth = playerIframe.parentNode.clientWidth;
	      var containerHeight = playerIframe.parentNode.clientHeight;
	      var containerRatio = containerWidth / containerHeight;
	      var videoRatio = videoDimensions.width / videoDimensions.height;
	      var pWidth = 0;
	      var pHeight = 0;
	      if (containerRatio > videoRatio) {
	        // at the same width, the video is taller than the window
	        pWidth = containerWidth * scale;
	        pHeight = containerWidth * scale / videoRatio;
	        playerIframe.style.width = pWidth + 'px';
	        playerIframe.style.height = pHeight + 'px';
	      } else if (videoRatio > containerRatio) {
	        // at the same width, the video is shorter than the window
	        pWidth = containerHeight * scale * videoRatio;
	        pHeight = containerHeight * scale;
	        playerIframe.style.width = pWidth + 'px';
	        playerIframe.style.height = pHeight + 'px';
	      } else {
	        // the window and video ratios match
	        pWidth = containerWidth * scale;
	        pHeight = containerHeight * scale;
	        playerIframe.style.width = pWidth + 'px';
	        playerIframe.style.height = pHeight + 'px';
	      }
	      playerIframe.style.left = 0 - (pWidth - containerWidth) / 2 + 'px';
	      playerIframe.style.top = 0 - (pHeight - containerHeight) / 2 + 'px';

	      if (fallbackImg) {
	        if (containerRatio > videoRatio) {
	          // at the same width, the video is taller than the window
	          fallbackImg.style.width = containerWidth * scale + 'px';
	          fallbackImg.style.height = containerWidth * scale / videoRatio + 'px';
	        } else if (videoRatio > containerRatio) {
	          // at the same width, the video is shorter than the window
	          fallbackImg.style.width = containerHeight * scale * videoRatio + 'px';
	          fallbackImg.style.height = containerHeight * scale + 'px';
	        } else {
	          // the window and video ratios match
	          fallbackImg.style.width = containerWidth * scale + 'px';
	          fallbackImg.style.height = containerHeight * scale + 'px';
	        }
	      }
	    }

	    /**
	     * Play back speed options, based on the YouTube API options.
	     */

	  }, {
	    key: 'setSpeed',
	    value: function setSpeed(speedValue) {
	      this.playbackSpeed = parseFloat(this.playbackSpeed);
	      this.player.setPlaybackRate(this.playbackSpeed);
	    }

	    /**
	     * Apply filter with values based on filterStrength.
	     */

	  }, {
	    key: 'setFilter',
	    value: function setFilter() {
	      var containerStyle = this.container.style;
	      var filter = FILTER_OPTIONS[this.filter - 1];
	      var filterStyle = '';
	      if (filter !== 'none') {
	        filterStyle = this.getFilterStyle(filter, this.filterStrength);
	      }

	      // To prevent the blur effect from displaying the background at the edges as
	      // part of the blur, the filer needs to be applied to the player and fallback image,
	      // and those elements need to be scaled slightly.
	      // No other combination of filter target and scaling seems to work.
	      if (filter === 'blur') {
	        containerStyle.webkitFilter = '';
	        containerStyle.filter = '';
	        this.container.classList.add('filter-blur');

	        Array.prototype.slice.call(this.container.children).forEach(function (el) {
	          el.style.webkitFilter = filterStyle;
	          el.style.filter = filterStyle;
	        });
	      } else {
	        containerStyle.webkitFilter = filterStyle;
	        containerStyle.filter = filterStyle;
	        this.container.classList.remove('filter-blur');

	        Array.prototype.slice.call(this.container.children).forEach(function (el) {
	          el.style.webkitFilter = '';
	          el.style.filter = '';
	        });
	      }
	    }

	    /**
	     * Construct the style based on the filter, strength and `FILTER_PROPERTIES`.
	     */

	  }, {
	    key: 'getFilterStyle',
	    value: function getFilterStyle(filter, strength) {
	      return filter + '(' + (FILTER_PROPERTIES[filter].modifier(strength) + FILTER_PROPERTIES[filter].unit) + ')';
	    }

	    /**
	     * The YouTube API seemingly does not expose the actual width and height dimensions
	     * of the video itself. The video's dimensions and ratio may be completely different
	     * than the IFRAME's. This hack finds those values inside some private objects.
	     * Since this is not part of the pbulic API, the dimensions will fall back to the
	     * container width and height, in case YouTube changes the internals unexpectedly.
	     */

	  }, {
	    key: '_findPlayerDimensions',
	    value: function _findPlayerDimensions() {
	      var w = this.container.clientWidth;
	      var h = this.container.clientHeight;
	      var hasDimensions = false;
	      var playerObjs = [];
	      var player = this.player;
	      for (var o in player) {
	        if ((0, _typeof3.default)(player[o]) === 'object') {
	          playerObjs.push(player[o]);
	        }
	      }
	      playerObjs.forEach(function (obj) {
	        for (var p in obj) {
	          if (hasDimensions) {
	            break;
	          }
	          try {
	            if ((0, _typeof3.default)(obj[p]) === 'object' && !!obj[p].host) {
	              if (obj[p].width && obj[p].height) {
	                w = obj[p].width;
	                h = obj[p].height;
	                hasDimensions = true;
	              }
	            }
	          } catch (err) {
	            // console.error(err);
	          }
	        }
	      });
	      return {
	        'width': w,
	        'height': h
	      };
	    }
	  }, {
	    key: '_getStartTime',
	    value: function _getStartTime(url) {
	      var parsedUrl = new parseUrl(url, true);

	      if (!parsedUrl.query || !parsedUrl.query.t) {
	        return false;
	      }

	      var timeParam = parsedUrl.query.t;
	      var m = (timeParam.match(/\d+(?=m)/g) ? timeParam.match(/\d+(?=m)/g)[0] : 0) * 60;
	      var s = timeParam.match(/\d+(?=s)/g) ? timeParam.match(/\d+(?=s)/g)[0] : timeParam;
	      return parseInt(m, 10) + parseInt(s, 10);
	    }

	    /**
	      * Apply the purely vidual effects.
	      */

	  }, {
	    key: 'syncPlayer',
	    value: function syncPlayer() {
	      this.setDisplayEffects();
	      this.setSpeed();
	      this.scaleVideo();
	    }
	  }, {
	    key: 'logger',
	    value: function logger(msg) {
	      if (!DEBUG) {
	        return;
	      }

	      console.log(msg);
	    }
	  }]);
	  return VideoBackground;
	}();

	module.exports = VideoBackground;

/***/ },
/* 7 */
/***/ function(module, exports, __webpack_require__) {

	module.exports = { "default": __webpack_require__(8), __esModule: true };

/***/ },
/* 8 */
/***/ function(module, exports, __webpack_require__) {

	__webpack_require__(9);
	module.exports = __webpack_require__(12).Object.assign;

/***/ },
/* 9 */
/***/ function(module, exports, __webpack_require__) {

	// 19.1.3.1 Object.assign(target, source)
	var $export = __webpack_require__(10);

	$export($export.S + $export.F, 'Object', {assign: __webpack_require__(25)});

/***/ },
/* 10 */
/***/ function(module, exports, __webpack_require__) {

	var global    = __webpack_require__(11)
	  , core      = __webpack_require__(12)
	  , ctx       = __webpack_require__(13)
	  , hide      = __webpack_require__(15)
	  , PROTOTYPE = 'prototype';

	var $export = function(type, name, source){
	  var IS_FORCED = type & $export.F
	    , IS_GLOBAL = type & $export.G
	    , IS_STATIC = type & $export.S
	    , IS_PROTO  = type & $export.P
	    , IS_BIND   = type & $export.B
	    , IS_WRAP   = type & $export.W
	    , exports   = IS_GLOBAL ? core : core[name] || (core[name] = {})
	    , expProto  = exports[PROTOTYPE]
	    , target    = IS_GLOBAL ? global : IS_STATIC ? global[name] : (global[name] || {})[PROTOTYPE]
	    , key, own, out;
	  if(IS_GLOBAL)source = name;
	  for(key in source){
	    // contains in native
	    own = !IS_FORCED && target && target[key] !== undefined;
	    if(own && key in exports)continue;
	    // export native or passed
	    out = own ? target[key] : source[key];
	    // prevent global pollution for namespaces
	    exports[key] = IS_GLOBAL && typeof target[key] != 'function' ? source[key]
	    // bind timers to global for call from export context
	    : IS_BIND && own ? ctx(out, global)
	    // wrap global constructors for prevent change them in library
	    : IS_WRAP && target[key] == out ? (function(C){
	      var F = function(a, b, c){
	        if(this instanceof C){
	          switch(arguments.length){
	            case 0: return new C;
	            case 1: return new C(a);
	            case 2: return new C(a, b);
	          } return new C(a, b, c);
	        } return C.apply(this, arguments);
	      };
	      F[PROTOTYPE] = C[PROTOTYPE];
	      return F;
	    // make static versions for prototype methods
	    })(out) : IS_PROTO && typeof out == 'function' ? ctx(Function.call, out) : out;
	    // export proto methods to core.%CONSTRUCTOR%.methods.%NAME%
	    if(IS_PROTO){
	      (exports.virtual || (exports.virtual = {}))[key] = out;
	      // export proto methods to core.%CONSTRUCTOR%.prototype.%NAME%
	      if(type & $export.R && expProto && !expProto[key])hide(expProto, key, out);
	    }
	  }
	};
	// type bitmap
	$export.F = 1;   // forced
	$export.G = 2;   // global
	$export.S = 4;   // static
	$export.P = 8;   // proto
	$export.B = 16;  // bind
	$export.W = 32;  // wrap
	$export.U = 64;  // safe
	$export.R = 128; // real proto method for `library` 
	module.exports = $export;

/***/ },
/* 11 */
/***/ function(module, exports) {

	// https://github.com/zloirock/core-js/issues/86#issuecomment-115759028
	var global = module.exports = typeof window != 'undefined' && window.Math == Math
	  ? window : typeof self != 'undefined' && self.Math == Math ? self : Function('return this')();
	if(typeof __g == 'number')__g = global; // eslint-disable-line no-undef

/***/ },
/* 12 */
/***/ function(module, exports) {

	var core = module.exports = {version: '2.4.0'};
	if(typeof __e == 'number')__e = core; // eslint-disable-line no-undef

/***/ },
/* 13 */
/***/ function(module, exports, __webpack_require__) {

	// optional / simple context binding
	var aFunction = __webpack_require__(14);
	module.exports = function(fn, that, length){
	  aFunction(fn);
	  if(that === undefined)return fn;
	  switch(length){
	    case 1: return function(a){
	      return fn.call(that, a);
	    };
	    case 2: return function(a, b){
	      return fn.call(that, a, b);
	    };
	    case 3: return function(a, b, c){
	      return fn.call(that, a, b, c);
	    };
	  }
	  return function(/* ...args */){
	    return fn.apply(that, arguments);
	  };
	};

/***/ },
/* 14 */
/***/ function(module, exports) {

	module.exports = function(it){
	  if(typeof it != 'function')throw TypeError(it + ' is not a function!');
	  return it;
	};

/***/ },
/* 15 */
/***/ function(module, exports, __webpack_require__) {

	var dP         = __webpack_require__(16)
	  , createDesc = __webpack_require__(24);
	module.exports = __webpack_require__(20) ? function(object, key, value){
	  return dP.f(object, key, createDesc(1, value));
	} : function(object, key, value){
	  object[key] = value;
	  return object;
	};

/***/ },
/* 16 */
/***/ function(module, exports, __webpack_require__) {

	var anObject       = __webpack_require__(17)
	  , IE8_DOM_DEFINE = __webpack_require__(19)
	  , toPrimitive    = __webpack_require__(23)
	  , dP             = Object.defineProperty;

	exports.f = __webpack_require__(20) ? Object.defineProperty : function defineProperty(O, P, Attributes){
	  anObject(O);
	  P = toPrimitive(P, true);
	  anObject(Attributes);
	  if(IE8_DOM_DEFINE)try {
	    return dP(O, P, Attributes);
	  } catch(e){ /* empty */ }
	  if('get' in Attributes || 'set' in Attributes)throw TypeError('Accessors not supported!');
	  if('value' in Attributes)O[P] = Attributes.value;
	  return O;
	};

/***/ },
/* 17 */
/***/ function(module, exports, __webpack_require__) {

	var isObject = __webpack_require__(18);
	module.exports = function(it){
	  if(!isObject(it))throw TypeError(it + ' is not an object!');
	  return it;
	};

/***/ },
/* 18 */
/***/ function(module, exports) {

	module.exports = function(it){
	  return typeof it === 'object' ? it !== null : typeof it === 'function';
	};

/***/ },
/* 19 */
/***/ function(module, exports, __webpack_require__) {

	module.exports = !__webpack_require__(20) && !__webpack_require__(21)(function(){
	  return Object.defineProperty(__webpack_require__(22)('div'), 'a', {get: function(){ return 7; }}).a != 7;
	});

/***/ },
/* 20 */
/***/ function(module, exports, __webpack_require__) {

	// Thank's IE8 for his funny defineProperty
	module.exports = !__webpack_require__(21)(function(){
	  return Object.defineProperty({}, 'a', {get: function(){ return 7; }}).a != 7;
	});

/***/ },
/* 21 */
/***/ function(module, exports) {

	module.exports = function(exec){
	  try {
	    return !!exec();
	  } catch(e){
	    return true;
	  }
	};

/***/ },
/* 22 */
/***/ function(module, exports, __webpack_require__) {

	var isObject = __webpack_require__(18)
	  , document = __webpack_require__(11).document
	  // in old IE typeof document.createElement is 'object'
	  , is = isObject(document) && isObject(document.createElement);
	module.exports = function(it){
	  return is ? document.createElement(it) : {};
	};

/***/ },
/* 23 */
/***/ function(module, exports, __webpack_require__) {

	// 7.1.1 ToPrimitive(input [, PreferredType])
	var isObject = __webpack_require__(18);
	// instead of the ES6 spec version, we didn't implement @@toPrimitive case
	// and the second argument - flag - preferred type is a string
	module.exports = function(it, S){
	  if(!isObject(it))return it;
	  var fn, val;
	  if(S && typeof (fn = it.toString) == 'function' && !isObject(val = fn.call(it)))return val;
	  if(typeof (fn = it.valueOf) == 'function' && !isObject(val = fn.call(it)))return val;
	  if(!S && typeof (fn = it.toString) == 'function' && !isObject(val = fn.call(it)))return val;
	  throw TypeError("Can't convert object to primitive value");
	};

/***/ },
/* 24 */
/***/ function(module, exports) {

	module.exports = function(bitmap, value){
	  return {
	    enumerable  : !(bitmap & 1),
	    configurable: !(bitmap & 2),
	    writable    : !(bitmap & 4),
	    value       : value
	  };
	};

/***/ },
/* 25 */
/***/ function(module, exports, __webpack_require__) {

	'use strict';
	// 19.1.2.1 Object.assign(target, source, ...)
	var getKeys  = __webpack_require__(26)
	  , gOPS     = __webpack_require__(41)
	  , pIE      = __webpack_require__(42)
	  , toObject = __webpack_require__(43)
	  , IObject  = __webpack_require__(30)
	  , $assign  = Object.assign;

	// should work with symbols and should have deterministic property order (V8 bug)
	module.exports = !$assign || __webpack_require__(21)(function(){
	  var A = {}
	    , B = {}
	    , S = Symbol()
	    , K = 'abcdefghijklmnopqrst';
	  A[S] = 7;
	  K.split('').forEach(function(k){ B[k] = k; });
	  return $assign({}, A)[S] != 7 || Object.keys($assign({}, B)).join('') != K;
	}) ? function assign(target, source){ // eslint-disable-line no-unused-vars
	  var T     = toObject(target)
	    , aLen  = arguments.length
	    , index = 1
	    , getSymbols = gOPS.f
	    , isEnum     = pIE.f;
	  while(aLen > index){
	    var S      = IObject(arguments[index++])
	      , keys   = getSymbols ? getKeys(S).concat(getSymbols(S)) : getKeys(S)
	      , length = keys.length
	      , j      = 0
	      , key;
	    while(length > j)if(isEnum.call(S, key = keys[j++]))T[key] = S[key];
	  } return T;
	} : $assign;

/***/ },
/* 26 */
/***/ function(module, exports, __webpack_require__) {

	// 19.1.2.14 / 15.2.3.14 Object.keys(O)
	var $keys       = __webpack_require__(27)
	  , enumBugKeys = __webpack_require__(40);

	module.exports = Object.keys || function keys(O){
	  return $keys(O, enumBugKeys);
	};

/***/ },
/* 27 */
/***/ function(module, exports, __webpack_require__) {

	var has          = __webpack_require__(28)
	  , toIObject    = __webpack_require__(29)
	  , arrayIndexOf = __webpack_require__(33)(false)
	  , IE_PROTO     = __webpack_require__(37)('IE_PROTO');

	module.exports = function(object, names){
	  var O      = toIObject(object)
	    , i      = 0
	    , result = []
	    , key;
	  for(key in O)if(key != IE_PROTO)has(O, key) && result.push(key);
	  // Don't enum bug & hidden keys
	  while(names.length > i)if(has(O, key = names[i++])){
	    ~arrayIndexOf(result, key) || result.push(key);
	  }
	  return result;
	};

/***/ },
/* 28 */
/***/ function(module, exports) {

	var hasOwnProperty = {}.hasOwnProperty;
	module.exports = function(it, key){
	  return hasOwnProperty.call(it, key);
	};

/***/ },
/* 29 */
/***/ function(module, exports, __webpack_require__) {

	// to indexed object, toObject with fallback for non-array-like ES3 strings
	var IObject = __webpack_require__(30)
	  , defined = __webpack_require__(32);
	module.exports = function(it){
	  return IObject(defined(it));
	};

/***/ },
/* 30 */
/***/ function(module, exports, __webpack_require__) {

	// fallback for non-array-like ES3 and non-enumerable old V8 strings
	var cof = __webpack_require__(31);
	module.exports = Object('z').propertyIsEnumerable(0) ? Object : function(it){
	  return cof(it) == 'String' ? it.split('') : Object(it);
	};

/***/ },
/* 31 */
/***/ function(module, exports) {

	var toString = {}.toString;

	module.exports = function(it){
	  return toString.call(it).slice(8, -1);
	};

/***/ },
/* 32 */
/***/ function(module, exports) {

	// 7.2.1 RequireObjectCoercible(argument)
	module.exports = function(it){
	  if(it == undefined)throw TypeError("Can't call method on  " + it);
	  return it;
	};

/***/ },
/* 33 */
/***/ function(module, exports, __webpack_require__) {

	// false -> Array#indexOf
	// true  -> Array#includes
	var toIObject = __webpack_require__(29)
	  , toLength  = __webpack_require__(34)
	  , toIndex   = __webpack_require__(36);
	module.exports = function(IS_INCLUDES){
	  return function($this, el, fromIndex){
	    var O      = toIObject($this)
	      , length = toLength(O.length)
	      , index  = toIndex(fromIndex, length)
	      , value;
	    // Array#includes uses SameValueZero equality algorithm
	    if(IS_INCLUDES && el != el)while(length > index){
	      value = O[index++];
	      if(value != value)return true;
	    // Array#toIndex ignores holes, Array#includes - not
	    } else for(;length > index; index++)if(IS_INCLUDES || index in O){
	      if(O[index] === el)return IS_INCLUDES || index || 0;
	    } return !IS_INCLUDES && -1;
	  };
	};

/***/ },
/* 34 */
/***/ function(module, exports, __webpack_require__) {

	// 7.1.15 ToLength
	var toInteger = __webpack_require__(35)
	  , min       = Math.min;
	module.exports = function(it){
	  return it > 0 ? min(toInteger(it), 0x1fffffffffffff) : 0; // pow(2, 53) - 1 == 9007199254740991
	};

/***/ },
/* 35 */
/***/ function(module, exports) {

	// 7.1.4 ToInteger
	var ceil  = Math.ceil
	  , floor = Math.floor;
	module.exports = function(it){
	  return isNaN(it = +it) ? 0 : (it > 0 ? floor : ceil)(it);
	};

/***/ },
/* 36 */
/***/ function(module, exports, __webpack_require__) {

	var toInteger = __webpack_require__(35)
	  , max       = Math.max
	  , min       = Math.min;
	module.exports = function(index, length){
	  index = toInteger(index);
	  return index < 0 ? max(index + length, 0) : min(index, length);
	};

/***/ },
/* 37 */
/***/ function(module, exports, __webpack_require__) {

	var shared = __webpack_require__(38)('keys')
	  , uid    = __webpack_require__(39);
	module.exports = function(key){
	  return shared[key] || (shared[key] = uid(key));
	};

/***/ },
/* 38 */
/***/ function(module, exports, __webpack_require__) {

	var global = __webpack_require__(11)
	  , SHARED = '__core-js_shared__'
	  , store  = global[SHARED] || (global[SHARED] = {});
	module.exports = function(key){
	  return store[key] || (store[key] = {});
	};

/***/ },
/* 39 */
/***/ function(module, exports) {

	var id = 0
	  , px = Math.random();
	module.exports = function(key){
	  return 'Symbol('.concat(key === undefined ? '' : key, ')_', (++id + px).toString(36));
	};

/***/ },
/* 40 */
/***/ function(module, exports) {

	// IE 8- don't enum bug keys
	module.exports = (
	  'constructor,hasOwnProperty,isPrototypeOf,propertyIsEnumerable,toLocaleString,toString,valueOf'
	).split(',');

/***/ },
/* 41 */
/***/ function(module, exports) {

	exports.f = Object.getOwnPropertySymbols;

/***/ },
/* 42 */
/***/ function(module, exports) {

	exports.f = {}.propertyIsEnumerable;

/***/ },
/* 43 */
/***/ function(module, exports, __webpack_require__) {

	// 7.1.13 ToObject(argument)
	var defined = __webpack_require__(32);
	module.exports = function(it){
	  return Object(defined(it));
	};

/***/ },
/* 44 */
/***/ function(module, exports, __webpack_require__) {

	"use strict";

	exports.__esModule = true;

	var _iterator = __webpack_require__(45);

	var _iterator2 = _interopRequireDefault(_iterator);

	var _symbol = __webpack_require__(65);

	var _symbol2 = _interopRequireDefault(_symbol);

	var _typeof = typeof _symbol2.default === "function" && typeof _iterator2.default === "symbol" ? function (obj) { return typeof obj; } : function (obj) { return obj && typeof _symbol2.default === "function" && obj.constructor === _symbol2.default ? "symbol" : typeof obj; };

	function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

	exports.default = typeof _symbol2.default === "function" && _typeof(_iterator2.default) === "symbol" ? function (obj) {
	  return typeof obj === "undefined" ? "undefined" : _typeof(obj);
	} : function (obj) {
	  return obj && typeof _symbol2.default === "function" && obj.constructor === _symbol2.default ? "symbol" : typeof obj === "undefined" ? "undefined" : _typeof(obj);
	};

/***/ },
/* 45 */
/***/ function(module, exports, __webpack_require__) {

	module.exports = { "default": __webpack_require__(46), __esModule: true };

/***/ },
/* 46 */
/***/ function(module, exports, __webpack_require__) {

	__webpack_require__(47);
	__webpack_require__(60);
	module.exports = __webpack_require__(64).f('iterator');

/***/ },
/* 47 */
/***/ function(module, exports, __webpack_require__) {

	'use strict';
	var $at  = __webpack_require__(48)(true);

	// 21.1.3.27 String.prototype[@@iterator]()
	__webpack_require__(49)(String, 'String', function(iterated){
	  this._t = String(iterated); // target
	  this._i = 0;                // next index
	// 21.1.5.2.1 %StringIteratorPrototype%.next()
	}, function(){
	  var O     = this._t
	    , index = this._i
	    , point;
	  if(index >= O.length)return {value: undefined, done: true};
	  point = $at(O, index);
	  this._i += point.length;
	  return {value: point, done: false};
	});

/***/ },
/* 48 */
/***/ function(module, exports, __webpack_require__) {

	var toInteger = __webpack_require__(35)
	  , defined   = __webpack_require__(32);
	// true  -> String#at
	// false -> String#codePointAt
	module.exports = function(TO_STRING){
	  return function(that, pos){
	    var s = String(defined(that))
	      , i = toInteger(pos)
	      , l = s.length
	      , a, b;
	    if(i < 0 || i >= l)return TO_STRING ? '' : undefined;
	    a = s.charCodeAt(i);
	    return a < 0xd800 || a > 0xdbff || i + 1 === l || (b = s.charCodeAt(i + 1)) < 0xdc00 || b > 0xdfff
	      ? TO_STRING ? s.charAt(i) : a
	      : TO_STRING ? s.slice(i, i + 2) : (a - 0xd800 << 10) + (b - 0xdc00) + 0x10000;
	  };
	};

/***/ },
/* 49 */
/***/ function(module, exports, __webpack_require__) {

	'use strict';
	var LIBRARY        = __webpack_require__(50)
	  , $export        = __webpack_require__(10)
	  , redefine       = __webpack_require__(51)
	  , hide           = __webpack_require__(15)
	  , has            = __webpack_require__(28)
	  , Iterators      = __webpack_require__(52)
	  , $iterCreate    = __webpack_require__(53)
	  , setToStringTag = __webpack_require__(57)
	  , getPrototypeOf = __webpack_require__(59)
	  , ITERATOR       = __webpack_require__(58)('iterator')
	  , BUGGY          = !([].keys && 'next' in [].keys()) // Safari has buggy iterators w/o `next`
	  , FF_ITERATOR    = '@@iterator'
	  , KEYS           = 'keys'
	  , VALUES         = 'values';

	var returnThis = function(){ return this; };

	module.exports = function(Base, NAME, Constructor, next, DEFAULT, IS_SET, FORCED){
	  $iterCreate(Constructor, NAME, next);
	  var getMethod = function(kind){
	    if(!BUGGY && kind in proto)return proto[kind];
	    switch(kind){
	      case KEYS: return function keys(){ return new Constructor(this, kind); };
	      case VALUES: return function values(){ return new Constructor(this, kind); };
	    } return function entries(){ return new Constructor(this, kind); };
	  };
	  var TAG        = NAME + ' Iterator'
	    , DEF_VALUES = DEFAULT == VALUES
	    , VALUES_BUG = false
	    , proto      = Base.prototype
	    , $native    = proto[ITERATOR] || proto[FF_ITERATOR] || DEFAULT && proto[DEFAULT]
	    , $default   = $native || getMethod(DEFAULT)
	    , $entries   = DEFAULT ? !DEF_VALUES ? $default : getMethod('entries') : undefined
	    , $anyNative = NAME == 'Array' ? proto.entries || $native : $native
	    , methods, key, IteratorPrototype;
	  // Fix native
	  if($anyNative){
	    IteratorPrototype = getPrototypeOf($anyNative.call(new Base));
	    if(IteratorPrototype !== Object.prototype){
	      // Set @@toStringTag to native iterators
	      setToStringTag(IteratorPrototype, TAG, true);
	      // fix for some old engines
	      if(!LIBRARY && !has(IteratorPrototype, ITERATOR))hide(IteratorPrototype, ITERATOR, returnThis);
	    }
	  }
	  // fix Array#{values, @@iterator}.name in V8 / FF
	  if(DEF_VALUES && $native && $native.name !== VALUES){
	    VALUES_BUG = true;
	    $default = function values(){ return $native.call(this); };
	  }
	  // Define iterator
	  if((!LIBRARY || FORCED) && (BUGGY || VALUES_BUG || !proto[ITERATOR])){
	    hide(proto, ITERATOR, $default);
	  }
	  // Plug for library
	  Iterators[NAME] = $default;
	  Iterators[TAG]  = returnThis;
	  if(DEFAULT){
	    methods = {
	      values:  DEF_VALUES ? $default : getMethod(VALUES),
	      keys:    IS_SET     ? $default : getMethod(KEYS),
	      entries: $entries
	    };
	    if(FORCED)for(key in methods){
	      if(!(key in proto))redefine(proto, key, methods[key]);
	    } else $export($export.P + $export.F * (BUGGY || VALUES_BUG), NAME, methods);
	  }
	  return methods;
	};

/***/ },
/* 50 */
/***/ function(module, exports) {

	module.exports = true;

/***/ },
/* 51 */
/***/ function(module, exports, __webpack_require__) {

	module.exports = __webpack_require__(15);

/***/ },
/* 52 */
/***/ function(module, exports) {

	module.exports = {};

/***/ },
/* 53 */
/***/ function(module, exports, __webpack_require__) {

	'use strict';
	var create         = __webpack_require__(54)
	  , descriptor     = __webpack_require__(24)
	  , setToStringTag = __webpack_require__(57)
	  , IteratorPrototype = {};

	// 25.1.2.1.1 %IteratorPrototype%[@@iterator]()
	__webpack_require__(15)(IteratorPrototype, __webpack_require__(58)('iterator'), function(){ return this; });

	module.exports = function(Constructor, NAME, next){
	  Constructor.prototype = create(IteratorPrototype, {next: descriptor(1, next)});
	  setToStringTag(Constructor, NAME + ' Iterator');
	};

/***/ },
/* 54 */
/***/ function(module, exports, __webpack_require__) {

	// 19.1.2.2 / 15.2.3.5 Object.create(O [, Properties])
	var anObject    = __webpack_require__(17)
	  , dPs         = __webpack_require__(55)
	  , enumBugKeys = __webpack_require__(40)
	  , IE_PROTO    = __webpack_require__(37)('IE_PROTO')
	  , Empty       = function(){ /* empty */ }
	  , PROTOTYPE   = 'prototype';

	// Create object with fake `null` prototype: use iframe Object with cleared prototype
	var createDict = function(){
	  // Thrash, waste and sodomy: IE GC bug
	  var iframe = __webpack_require__(22)('iframe')
	    , i      = enumBugKeys.length
	    , gt     = '>'
	    , iframeDocument;
	  iframe.style.display = 'none';
	  __webpack_require__(56).appendChild(iframe);
	  iframe.src = 'javascript:'; // eslint-disable-line no-script-url
	  // createDict = iframe.contentWindow.Object;
	  // html.removeChild(iframe);
	  iframeDocument = iframe.contentWindow.document;
	  iframeDocument.open();
	  iframeDocument.write('<script>document.F=Object</script' + gt);
	  iframeDocument.close();
	  createDict = iframeDocument.F;
	  while(i--)delete createDict[PROTOTYPE][enumBugKeys[i]];
	  return createDict();
	};

	module.exports = Object.create || function create(O, Properties){
	  var result;
	  if(O !== null){
	    Empty[PROTOTYPE] = anObject(O);
	    result = new Empty;
	    Empty[PROTOTYPE] = null;
	    // add "__proto__" for Object.getPrototypeOf polyfill
	    result[IE_PROTO] = O;
	  } else result = createDict();
	  return Properties === undefined ? result : dPs(result, Properties);
	};

/***/ },
/* 55 */
/***/ function(module, exports, __webpack_require__) {

	var dP       = __webpack_require__(16)
	  , anObject = __webpack_require__(17)
	  , getKeys  = __webpack_require__(26);

	module.exports = __webpack_require__(20) ? Object.defineProperties : function defineProperties(O, Properties){
	  anObject(O);
	  var keys   = getKeys(Properties)
	    , length = keys.length
	    , i = 0
	    , P;
	  while(length > i)dP.f(O, P = keys[i++], Properties[P]);
	  return O;
	};

/***/ },
/* 56 */
/***/ function(module, exports, __webpack_require__) {

	module.exports = __webpack_require__(11).document && document.documentElement;

/***/ },
/* 57 */
/***/ function(module, exports, __webpack_require__) {

	var def = __webpack_require__(16).f
	  , has = __webpack_require__(28)
	  , TAG = __webpack_require__(58)('toStringTag');

	module.exports = function(it, tag, stat){
	  if(it && !has(it = stat ? it : it.prototype, TAG))def(it, TAG, {configurable: true, value: tag});
	};

/***/ },
/* 58 */
/***/ function(module, exports, __webpack_require__) {

	var store      = __webpack_require__(38)('wks')
	  , uid        = __webpack_require__(39)
	  , Symbol     = __webpack_require__(11).Symbol
	  , USE_SYMBOL = typeof Symbol == 'function';

	var $exports = module.exports = function(name){
	  return store[name] || (store[name] =
	    USE_SYMBOL && Symbol[name] || (USE_SYMBOL ? Symbol : uid)('Symbol.' + name));
	};

	$exports.store = store;

/***/ },
/* 59 */
/***/ function(module, exports, __webpack_require__) {

	// 19.1.2.9 / 15.2.3.2 Object.getPrototypeOf(O)
	var has         = __webpack_require__(28)
	  , toObject    = __webpack_require__(43)
	  , IE_PROTO    = __webpack_require__(37)('IE_PROTO')
	  , ObjectProto = Object.prototype;

	module.exports = Object.getPrototypeOf || function(O){
	  O = toObject(O);
	  if(has(O, IE_PROTO))return O[IE_PROTO];
	  if(typeof O.constructor == 'function' && O instanceof O.constructor){
	    return O.constructor.prototype;
	  } return O instanceof Object ? ObjectProto : null;
	};

/***/ },
/* 60 */
/***/ function(module, exports, __webpack_require__) {

	__webpack_require__(61);
	var global        = __webpack_require__(11)
	  , hide          = __webpack_require__(15)
	  , Iterators     = __webpack_require__(52)
	  , TO_STRING_TAG = __webpack_require__(58)('toStringTag');

	for(var collections = ['NodeList', 'DOMTokenList', 'MediaList', 'StyleSheetList', 'CSSRuleList'], i = 0; i < 5; i++){
	  var NAME       = collections[i]
	    , Collection = global[NAME]
	    , proto      = Collection && Collection.prototype;
	  if(proto && !proto[TO_STRING_TAG])hide(proto, TO_STRING_TAG, NAME);
	  Iterators[NAME] = Iterators.Array;
	}

/***/ },
/* 61 */
/***/ function(module, exports, __webpack_require__) {

	'use strict';
	var addToUnscopables = __webpack_require__(62)
	  , step             = __webpack_require__(63)
	  , Iterators        = __webpack_require__(52)
	  , toIObject        = __webpack_require__(29);

	// 22.1.3.4 Array.prototype.entries()
	// 22.1.3.13 Array.prototype.keys()
	// 22.1.3.29 Array.prototype.values()
	// 22.1.3.30 Array.prototype[@@iterator]()
	module.exports = __webpack_require__(49)(Array, 'Array', function(iterated, kind){
	  this._t = toIObject(iterated); // target
	  this._i = 0;                   // next index
	  this._k = kind;                // kind
	// 22.1.5.2.1 %ArrayIteratorPrototype%.next()
	}, function(){
	  var O     = this._t
	    , kind  = this._k
	    , index = this._i++;
	  if(!O || index >= O.length){
	    this._t = undefined;
	    return step(1);
	  }
	  if(kind == 'keys'  )return step(0, index);
	  if(kind == 'values')return step(0, O[index]);
	  return step(0, [index, O[index]]);
	}, 'values');

	// argumentsList[@@iterator] is %ArrayProto_values% (9.4.4.6, 9.4.4.7)
	Iterators.Arguments = Iterators.Array;

	addToUnscopables('keys');
	addToUnscopables('values');
	addToUnscopables('entries');

/***/ },
/* 62 */
/***/ function(module, exports) {

	module.exports = function(){ /* empty */ };

/***/ },
/* 63 */
/***/ function(module, exports) {

	module.exports = function(done, value){
	  return {value: value, done: !!done};
	};

/***/ },
/* 64 */
/***/ function(module, exports, __webpack_require__) {

	exports.f = __webpack_require__(58);

/***/ },
/* 65 */
/***/ function(module, exports, __webpack_require__) {

	module.exports = { "default": __webpack_require__(66), __esModule: true };

/***/ },
/* 66 */
/***/ function(module, exports, __webpack_require__) {

	__webpack_require__(67);
	__webpack_require__(76);
	__webpack_require__(77);
	__webpack_require__(78);
	module.exports = __webpack_require__(12).Symbol;

/***/ },
/* 67 */
/***/ function(module, exports, __webpack_require__) {

	'use strict';
	// ECMAScript 6 symbols shim
	var global         = __webpack_require__(11)
	  , has            = __webpack_require__(28)
	  , DESCRIPTORS    = __webpack_require__(20)
	  , $export        = __webpack_require__(10)
	  , redefine       = __webpack_require__(51)
	  , META           = __webpack_require__(68).KEY
	  , $fails         = __webpack_require__(21)
	  , shared         = __webpack_require__(38)
	  , setToStringTag = __webpack_require__(57)
	  , uid            = __webpack_require__(39)
	  , wks            = __webpack_require__(58)
	  , wksExt         = __webpack_require__(64)
	  , wksDefine      = __webpack_require__(69)
	  , keyOf          = __webpack_require__(70)
	  , enumKeys       = __webpack_require__(71)
	  , isArray        = __webpack_require__(72)
	  , anObject       = __webpack_require__(17)
	  , toIObject      = __webpack_require__(29)
	  , toPrimitive    = __webpack_require__(23)
	  , createDesc     = __webpack_require__(24)
	  , _create        = __webpack_require__(54)
	  , gOPNExt        = __webpack_require__(73)
	  , $GOPD          = __webpack_require__(75)
	  , $DP            = __webpack_require__(16)
	  , $keys          = __webpack_require__(26)
	  , gOPD           = $GOPD.f
	  , dP             = $DP.f
	  , gOPN           = gOPNExt.f
	  , $Symbol        = global.Symbol
	  , $JSON          = global.JSON
	  , _stringify     = $JSON && $JSON.stringify
	  , PROTOTYPE      = 'prototype'
	  , HIDDEN         = wks('_hidden')
	  , TO_PRIMITIVE   = wks('toPrimitive')
	  , isEnum         = {}.propertyIsEnumerable
	  , SymbolRegistry = shared('symbol-registry')
	  , AllSymbols     = shared('symbols')
	  , OPSymbols      = shared('op-symbols')
	  , ObjectProto    = Object[PROTOTYPE]
	  , USE_NATIVE     = typeof $Symbol == 'function'
	  , QObject        = global.QObject;
	// Don't use setters in Qt Script, https://github.com/zloirock/core-js/issues/173
	var setter = !QObject || !QObject[PROTOTYPE] || !QObject[PROTOTYPE].findChild;

	// fallback for old Android, https://code.google.com/p/v8/issues/detail?id=687
	var setSymbolDesc = DESCRIPTORS && $fails(function(){
	  return _create(dP({}, 'a', {
	    get: function(){ return dP(this, 'a', {value: 7}).a; }
	  })).a != 7;
	}) ? function(it, key, D){
	  var protoDesc = gOPD(ObjectProto, key);
	  if(protoDesc)delete ObjectProto[key];
	  dP(it, key, D);
	  if(protoDesc && it !== ObjectProto)dP(ObjectProto, key, protoDesc);
	} : dP;

	var wrap = function(tag){
	  var sym = AllSymbols[tag] = _create($Symbol[PROTOTYPE]);
	  sym._k = tag;
	  return sym;
	};

	var isSymbol = USE_NATIVE && typeof $Symbol.iterator == 'symbol' ? function(it){
	  return typeof it == 'symbol';
	} : function(it){
	  return it instanceof $Symbol;
	};

	var $defineProperty = function defineProperty(it, key, D){
	  if(it === ObjectProto)$defineProperty(OPSymbols, key, D);
	  anObject(it);
	  key = toPrimitive(key, true);
	  anObject(D);
	  if(has(AllSymbols, key)){
	    if(!D.enumerable){
	      if(!has(it, HIDDEN))dP(it, HIDDEN, createDesc(1, {}));
	      it[HIDDEN][key] = true;
	    } else {
	      if(has(it, HIDDEN) && it[HIDDEN][key])it[HIDDEN][key] = false;
	      D = _create(D, {enumerable: createDesc(0, false)});
	    } return setSymbolDesc(it, key, D);
	  } return dP(it, key, D);
	};
	var $defineProperties = function defineProperties(it, P){
	  anObject(it);
	  var keys = enumKeys(P = toIObject(P))
	    , i    = 0
	    , l = keys.length
	    , key;
	  while(l > i)$defineProperty(it, key = keys[i++], P[key]);
	  return it;
	};
	var $create = function create(it, P){
	  return P === undefined ? _create(it) : $defineProperties(_create(it), P);
	};
	var $propertyIsEnumerable = function propertyIsEnumerable(key){
	  var E = isEnum.call(this, key = toPrimitive(key, true));
	  if(this === ObjectProto && has(AllSymbols, key) && !has(OPSymbols, key))return false;
	  return E || !has(this, key) || !has(AllSymbols, key) || has(this, HIDDEN) && this[HIDDEN][key] ? E : true;
	};
	var $getOwnPropertyDescriptor = function getOwnPropertyDescriptor(it, key){
	  it  = toIObject(it);
	  key = toPrimitive(key, true);
	  if(it === ObjectProto && has(AllSymbols, key) && !has(OPSymbols, key))return;
	  var D = gOPD(it, key);
	  if(D && has(AllSymbols, key) && !(has(it, HIDDEN) && it[HIDDEN][key]))D.enumerable = true;
	  return D;
	};
	var $getOwnPropertyNames = function getOwnPropertyNames(it){
	  var names  = gOPN(toIObject(it))
	    , result = []
	    , i      = 0
	    , key;
	  while(names.length > i){
	    if(!has(AllSymbols, key = names[i++]) && key != HIDDEN && key != META)result.push(key);
	  } return result;
	};
	var $getOwnPropertySymbols = function getOwnPropertySymbols(it){
	  var IS_OP  = it === ObjectProto
	    , names  = gOPN(IS_OP ? OPSymbols : toIObject(it))
	    , result = []
	    , i      = 0
	    , key;
	  while(names.length > i){
	    if(has(AllSymbols, key = names[i++]) && (IS_OP ? has(ObjectProto, key) : true))result.push(AllSymbols[key]);
	  } return result;
	};

	// 19.4.1.1 Symbol([description])
	if(!USE_NATIVE){
	  $Symbol = function Symbol(){
	    if(this instanceof $Symbol)throw TypeError('Symbol is not a constructor!');
	    var tag = uid(arguments.length > 0 ? arguments[0] : undefined);
	    var $set = function(value){
	      if(this === ObjectProto)$set.call(OPSymbols, value);
	      if(has(this, HIDDEN) && has(this[HIDDEN], tag))this[HIDDEN][tag] = false;
	      setSymbolDesc(this, tag, createDesc(1, value));
	    };
	    if(DESCRIPTORS && setter)setSymbolDesc(ObjectProto, tag, {configurable: true, set: $set});
	    return wrap(tag);
	  };
	  redefine($Symbol[PROTOTYPE], 'toString', function toString(){
	    return this._k;
	  });

	  $GOPD.f = $getOwnPropertyDescriptor;
	  $DP.f   = $defineProperty;
	  __webpack_require__(74).f = gOPNExt.f = $getOwnPropertyNames;
	  __webpack_require__(42).f  = $propertyIsEnumerable;
	  __webpack_require__(41).f = $getOwnPropertySymbols;

	  if(DESCRIPTORS && !__webpack_require__(50)){
	    redefine(ObjectProto, 'propertyIsEnumerable', $propertyIsEnumerable, true);
	  }

	  wksExt.f = function(name){
	    return wrap(wks(name));
	  }
	}

	$export($export.G + $export.W + $export.F * !USE_NATIVE, {Symbol: $Symbol});

	for(var symbols = (
	  // 19.4.2.2, 19.4.2.3, 19.4.2.4, 19.4.2.6, 19.4.2.8, 19.4.2.9, 19.4.2.10, 19.4.2.11, 19.4.2.12, 19.4.2.13, 19.4.2.14
	  'hasInstance,isConcatSpreadable,iterator,match,replace,search,species,split,toPrimitive,toStringTag,unscopables'
	).split(','), i = 0; symbols.length > i; )wks(symbols[i++]);

	for(var symbols = $keys(wks.store), i = 0; symbols.length > i; )wksDefine(symbols[i++]);

	$export($export.S + $export.F * !USE_NATIVE, 'Symbol', {
	  // 19.4.2.1 Symbol.for(key)
	  'for': function(key){
	    return has(SymbolRegistry, key += '')
	      ? SymbolRegistry[key]
	      : SymbolRegistry[key] = $Symbol(key);
	  },
	  // 19.4.2.5 Symbol.keyFor(sym)
	  keyFor: function keyFor(key){
	    if(isSymbol(key))return keyOf(SymbolRegistry, key);
	    throw TypeError(key + ' is not a symbol!');
	  },
	  useSetter: function(){ setter = true; },
	  useSimple: function(){ setter = false; }
	});

	$export($export.S + $export.F * !USE_NATIVE, 'Object', {
	  // 19.1.2.2 Object.create(O [, Properties])
	  create: $create,
	  // 19.1.2.4 Object.defineProperty(O, P, Attributes)
	  defineProperty: $defineProperty,
	  // 19.1.2.3 Object.defineProperties(O, Properties)
	  defineProperties: $defineProperties,
	  // 19.1.2.6 Object.getOwnPropertyDescriptor(O, P)
	  getOwnPropertyDescriptor: $getOwnPropertyDescriptor,
	  // 19.1.2.7 Object.getOwnPropertyNames(O)
	  getOwnPropertyNames: $getOwnPropertyNames,
	  // 19.1.2.8 Object.getOwnPropertySymbols(O)
	  getOwnPropertySymbols: $getOwnPropertySymbols
	});

	// 24.3.2 JSON.stringify(value [, replacer [, space]])
	$JSON && $export($export.S + $export.F * (!USE_NATIVE || $fails(function(){
	  var S = $Symbol();
	  // MS Edge converts symbol values to JSON as {}
	  // WebKit converts symbol values to JSON as null
	  // V8 throws on boxed symbols
	  return _stringify([S]) != '[null]' || _stringify({a: S}) != '{}' || _stringify(Object(S)) != '{}';
	})), 'JSON', {
	  stringify: function stringify(it){
	    if(it === undefined || isSymbol(it))return; // IE8 returns string on undefined
	    var args = [it]
	      , i    = 1
	      , replacer, $replacer;
	    while(arguments.length > i)args.push(arguments[i++]);
	    replacer = args[1];
	    if(typeof replacer == 'function')$replacer = replacer;
	    if($replacer || !isArray(replacer))replacer = function(key, value){
	      if($replacer)value = $replacer.call(this, key, value);
	      if(!isSymbol(value))return value;
	    };
	    args[1] = replacer;
	    return _stringify.apply($JSON, args);
	  }
	});

	// 19.4.3.4 Symbol.prototype[@@toPrimitive](hint)
	$Symbol[PROTOTYPE][TO_PRIMITIVE] || __webpack_require__(15)($Symbol[PROTOTYPE], TO_PRIMITIVE, $Symbol[PROTOTYPE].valueOf);
	// 19.4.3.5 Symbol.prototype[@@toStringTag]
	setToStringTag($Symbol, 'Symbol');
	// 20.2.1.9 Math[@@toStringTag]
	setToStringTag(Math, 'Math', true);
	// 24.3.3 JSON[@@toStringTag]
	setToStringTag(global.JSON, 'JSON', true);

/***/ },
/* 68 */
/***/ function(module, exports, __webpack_require__) {

	var META     = __webpack_require__(39)('meta')
	  , isObject = __webpack_require__(18)
	  , has      = __webpack_require__(28)
	  , setDesc  = __webpack_require__(16).f
	  , id       = 0;
	var isExtensible = Object.isExtensible || function(){
	  return true;
	};
	var FREEZE = !__webpack_require__(21)(function(){
	  return isExtensible(Object.preventExtensions({}));
	});
	var setMeta = function(it){
	  setDesc(it, META, {value: {
	    i: 'O' + ++id, // object ID
	    w: {}          // weak collections IDs
	  }});
	};
	var fastKey = function(it, create){
	  // return primitive with prefix
	  if(!isObject(it))return typeof it == 'symbol' ? it : (typeof it == 'string' ? 'S' : 'P') + it;
	  if(!has(it, META)){
	    // can't set metadata to uncaught frozen object
	    if(!isExtensible(it))return 'F';
	    // not necessary to add metadata
	    if(!create)return 'E';
	    // add missing metadata
	    setMeta(it);
	  // return object ID
	  } return it[META].i;
	};
	var getWeak = function(it, create){
	  if(!has(it, META)){
	    // can't set metadata to uncaught frozen object
	    if(!isExtensible(it))return true;
	    // not necessary to add metadata
	    if(!create)return false;
	    // add missing metadata
	    setMeta(it);
	  // return hash weak collections IDs
	  } return it[META].w;
	};
	// add metadata on freeze-family methods calling
	var onFreeze = function(it){
	  if(FREEZE && meta.NEED && isExtensible(it) && !has(it, META))setMeta(it);
	  return it;
	};
	var meta = module.exports = {
	  KEY:      META,
	  NEED:     false,
	  fastKey:  fastKey,
	  getWeak:  getWeak,
	  onFreeze: onFreeze
	};

/***/ },
/* 69 */
/***/ function(module, exports, __webpack_require__) {

	var global         = __webpack_require__(11)
	  , core           = __webpack_require__(12)
	  , LIBRARY        = __webpack_require__(50)
	  , wksExt         = __webpack_require__(64)
	  , defineProperty = __webpack_require__(16).f;
	module.exports = function(name){
	  var $Symbol = core.Symbol || (core.Symbol = LIBRARY ? {} : global.Symbol || {});
	  if(name.charAt(0) != '_' && !(name in $Symbol))defineProperty($Symbol, name, {value: wksExt.f(name)});
	};

/***/ },
/* 70 */
/***/ function(module, exports, __webpack_require__) {

	var getKeys   = __webpack_require__(26)
	  , toIObject = __webpack_require__(29);
	module.exports = function(object, el){
	  var O      = toIObject(object)
	    , keys   = getKeys(O)
	    , length = keys.length
	    , index  = 0
	    , key;
	  while(length > index)if(O[key = keys[index++]] === el)return key;
	};

/***/ },
/* 71 */
/***/ function(module, exports, __webpack_require__) {

	// all enumerable object keys, includes symbols
	var getKeys = __webpack_require__(26)
	  , gOPS    = __webpack_require__(41)
	  , pIE     = __webpack_require__(42);
	module.exports = function(it){
	  var result     = getKeys(it)
	    , getSymbols = gOPS.f;
	  if(getSymbols){
	    var symbols = getSymbols(it)
	      , isEnum  = pIE.f
	      , i       = 0
	      , key;
	    while(symbols.length > i)if(isEnum.call(it, key = symbols[i++]))result.push(key);
	  } return result;
	};

/***/ },
/* 72 */
/***/ function(module, exports, __webpack_require__) {

	// 7.2.2 IsArray(argument)
	var cof = __webpack_require__(31);
	module.exports = Array.isArray || function isArray(arg){
	  return cof(arg) == 'Array';
	};

/***/ },
/* 73 */
/***/ function(module, exports, __webpack_require__) {

	// fallback for IE11 buggy Object.getOwnPropertyNames with iframe and window
	var toIObject = __webpack_require__(29)
	  , gOPN      = __webpack_require__(74).f
	  , toString  = {}.toString;

	var windowNames = typeof window == 'object' && window && Object.getOwnPropertyNames
	  ? Object.getOwnPropertyNames(window) : [];

	var getWindowNames = function(it){
	  try {
	    return gOPN(it);
	  } catch(e){
	    return windowNames.slice();
	  }
	};

	module.exports.f = function getOwnPropertyNames(it){
	  return windowNames && toString.call(it) == '[object Window]' ? getWindowNames(it) : gOPN(toIObject(it));
	};


/***/ },
/* 74 */
/***/ function(module, exports, __webpack_require__) {

	// 19.1.2.7 / 15.2.3.4 Object.getOwnPropertyNames(O)
	var $keys      = __webpack_require__(27)
	  , hiddenKeys = __webpack_require__(40).concat('length', 'prototype');

	exports.f = Object.getOwnPropertyNames || function getOwnPropertyNames(O){
	  return $keys(O, hiddenKeys);
	};

/***/ },
/* 75 */
/***/ function(module, exports, __webpack_require__) {

	var pIE            = __webpack_require__(42)
	  , createDesc     = __webpack_require__(24)
	  , toIObject      = __webpack_require__(29)
	  , toPrimitive    = __webpack_require__(23)
	  , has            = __webpack_require__(28)
	  , IE8_DOM_DEFINE = __webpack_require__(19)
	  , gOPD           = Object.getOwnPropertyDescriptor;

	exports.f = __webpack_require__(20) ? gOPD : function getOwnPropertyDescriptor(O, P){
	  O = toIObject(O);
	  P = toPrimitive(P, true);
	  if(IE8_DOM_DEFINE)try {
	    return gOPD(O, P);
	  } catch(e){ /* empty */ }
	  if(has(O, P))return createDesc(!pIE.f.call(O, P), O[P]);
	};

/***/ },
/* 76 */
/***/ function(module, exports) {

	

/***/ },
/* 77 */
/***/ function(module, exports, __webpack_require__) {

	__webpack_require__(69)('asyncIterator');

/***/ },
/* 78 */
/***/ function(module, exports, __webpack_require__) {

	__webpack_require__(69)('observable');

/***/ },
/* 79 */
/***/ function(module, exports) {

	"use strict";

	exports.__esModule = true;

	exports.default = function (instance, Constructor) {
	  if (!(instance instanceof Constructor)) {
	    throw new TypeError("Cannot call a class as a function");
	  }
	};

/***/ },
/* 80 */
/***/ function(module, exports, __webpack_require__) {

	"use strict";

	exports.__esModule = true;

	var _defineProperty = __webpack_require__(81);

	var _defineProperty2 = _interopRequireDefault(_defineProperty);

	function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

	exports.default = function () {
	  function defineProperties(target, props) {
	    for (var i = 0; i < props.length; i++) {
	      var descriptor = props[i];
	      descriptor.enumerable = descriptor.enumerable || false;
	      descriptor.configurable = true;
	      if ("value" in descriptor) descriptor.writable = true;
	      (0, _defineProperty2.default)(target, descriptor.key, descriptor);
	    }
	  }

	  return function (Constructor, protoProps, staticProps) {
	    if (protoProps) defineProperties(Constructor.prototype, protoProps);
	    if (staticProps) defineProperties(Constructor, staticProps);
	    return Constructor;
	  };
	}();

/***/ },
/* 81 */
/***/ function(module, exports, __webpack_require__) {

	module.exports = { "default": __webpack_require__(82), __esModule: true };

/***/ },
/* 82 */
/***/ function(module, exports, __webpack_require__) {

	__webpack_require__(83);
	var $Object = __webpack_require__(12).Object;
	module.exports = function defineProperty(it, key, desc){
	  return $Object.defineProperty(it, key, desc);
	};

/***/ },
/* 83 */
/***/ function(module, exports, __webpack_require__) {

	var $export = __webpack_require__(10);
	// 19.1.2.4 / 15.2.3.6 Object.defineProperty(O, P, Attributes)
	$export($export.S + $export.F * !__webpack_require__(20), 'Object', {defineProperty: __webpack_require__(16).f});

/***/ },
/* 84 */
/***/ function(module, exports) {

	'use strict';

	/**
	 * CustomEvent polyfill for Internet Explorer versions >= 9
	 * Polyfill from
	 *   https://developer.mozilla.org/en-US/docs/Web/API/CustomEvent/CustomEvent
	 */
	var custEvent = function custEvent() {
	  (function () {

	    function CustomEvent(event, params) {
	      params = params || { bubbles: false, cancelable: false, detail: undefined };
	      var evt = document.createEvent('CustomEvent');
	      evt.initCustomEvent(event, params.bubbles, params.cancelable, params.detail);
	      return evt;
	    }

	    CustomEvent.prototype = window.Event.prototype;

	    window.CustomEvent = CustomEvent;
	  })();
	};

	module.exports = custEvent;

/***/ },
/* 85 */
/***/ function(module, exports, __webpack_require__) {

	'use strict';

	var required = __webpack_require__(86)
	  , lolcation = __webpack_require__(87)
	  , qs = __webpack_require__(88)
	  , relativere = /^\/(?!\/)/
	  , protocolre = /^([a-z0-9.+-]+:)?(\/\/)?(.*)$/i; // actual protocol is first match

	/**
	 * These are the parse instructions for the URL parsers, it informs the parser
	 * about:
	 *
	 * 0. The char it Needs to parse, if it's a string it should be done using
	 *    indexOf, RegExp using exec and NaN means set as current value.
	 * 1. The property we should set when parsing this value.
	 * 2. Indication if it's backwards or forward parsing, when set as number it's
	 *    the value of extra chars that should be split off.
	 * 3. Inherit from location if non existing in the parser.
	 * 4. `toLowerCase` the resulting value.
	 */
	var instructions = [
	  ['#', 'hash'],                        // Extract from the back.
	  ['?', 'query'],                       // Extract from the back.
	  ['/', 'pathname'],                    // Extract from the back.
	  ['@', 'auth', 1],                     // Extract from the front.
	  [NaN, 'host', undefined, 1, 1],       // Set left over value.
	  [/\:(\d+)$/, 'port'],                 // RegExp the back.
	  [NaN, 'hostname', undefined, 1, 1]    // Set left over.
	];

	 /**
	 * @typedef ProtocolExtract
	 * @type Object
	 * @property {String} protocol Protocol matched in the URL, in lowercase
	 * @property {Boolean} slashes Indicates whether the protocol is followed by double slash ("//")
	 * @property {String} rest     Rest of the URL that is not part of the protocol
	 */

	 /**
	  * Extract protocol information from a URL with/without double slash ("//")
	  *
	  * @param  {String} address   URL we want to extract from.
	  * @return {ProtocolExtract}  Extracted information
	  * @private
	  */
	function extractProtocol(address) {
	  var match = protocolre.exec(address);
	  return {
	    protocol: match[1] ? match[1].toLowerCase() : '',
	    slashes: !!match[2],
	    rest: match[3] ? match[3] : ''
	  };
	}

	/**
	 * The actual URL instance. Instead of returning an object we've opted-in to
	 * create an actual constructor as it's much more memory efficient and
	 * faster and it pleases my CDO.
	 *
	 * @constructor
	 * @param {String} address URL we want to parse.
	 * @param {Object|String} location Location defaults for relative paths.
	 * @param {Boolean|Function} parser Parser for the query string.
	 * @api public
	 */
	function URL(address, location, parser) {
	  if (!(this instanceof URL)) {
	    return new URL(address, location, parser);
	  }

	  var relative = relativere.test(address)
	    , parse, instruction, index, key
	    , type = typeof location
	    , url = this
	    , i = 0;

	  //
	  // The following if statements allows this module two have compatibility with
	  // 2 different API:
	  //
	  // 1. Node.js's `url.parse` api which accepts a URL, boolean as arguments
	  //    where the boolean indicates that the query string should also be parsed.
	  //
	  // 2. The `URL` interface of the browser which accepts a URL, object as
	  //    arguments. The supplied object will be used as default values / fall-back
	  //    for relative paths.
	  //
	  if ('object' !== type && 'string' !== type) {
	    parser = location;
	    location = null;
	  }

	  if (parser && 'function' !== typeof parser) {
	    parser = qs.parse;
	  }

	  location = lolcation(location);

	  // extract protocol information before running the instructions
	  var extracted = extractProtocol(address);
	  url.protocol = extracted.protocol || location.protocol || '';
	  url.slashes = extracted.slashes || location.slashes;
	  address = extracted.rest;

	  for (; i < instructions.length; i++) {
	    instruction = instructions[i];
	    parse = instruction[0];
	    key = instruction[1];

	    if (parse !== parse) {
	      url[key] = address;
	    } else if ('string' === typeof parse) {
	      if (~(index = address.indexOf(parse))) {
	        if ('number' === typeof instruction[2]) {
	          url[key] = address.slice(0, index);
	          address = address.slice(index + instruction[2]);
	        } else {
	          url[key] = address.slice(index);
	          address = address.slice(0, index);
	        }
	      }
	    } else if (index = parse.exec(address)) {
	      url[key] = index[1];
	      address = address.slice(0, address.length - index[0].length);
	    }

	    url[key] = url[key] || (instruction[3] || ('port' === key && relative) ? location[key] || '' : '');

	    //
	    // Hostname, host and protocol should be lowercased so they can be used to
	    // create a proper `origin`.
	    //
	    if (instruction[4]) {
	      url[key] = url[key].toLowerCase();
	    }
	  }

	  //
	  // Also parse the supplied query string in to an object. If we're supplied
	  // with a custom parser as function use that instead of the default build-in
	  // parser.
	  //
	  if (parser) url.query = parser(url.query);

	  //
	  // We should not add port numbers if they are already the default port number
	  // for a given protocol. As the host also contains the port number we're going
	  // override it with the hostname which contains no port number.
	  //
	  if (!required(url.port, url.protocol)) {
	    url.host = url.hostname;
	    url.port = '';
	  }

	  //
	  // Parse down the `auth` for the username and password.
	  //
	  url.username = url.password = '';
	  if (url.auth) {
	    instruction = url.auth.split(':');
	    url.username = instruction[0] || '';
	    url.password = instruction[1] || '';
	  }

	  //
	  // The href is just the compiled result.
	  //
	  url.href = url.toString();
	}

	/**
	 * This is convenience method for changing properties in the URL instance to
	 * insure that they all propagate correctly.
	 *
	 * @param {String} prop          Property we need to adjust.
	 * @param {Mixed} value          The newly assigned value.
	 * @param {Boolean|Function} fn  When setting the query, it will be the function used to parse
	 *                               the query.
	 *                               When setting the protocol, double slash will be removed from
	 *                               the final url if it is true.
	 * @returns {URL}
	 * @api public
	 */
	URL.prototype.set = function set(part, value, fn) {
	  var url = this;

	  if ('query' === part) {
	    if ('string' === typeof value && value.length) {
	      value = (fn || qs.parse)(value);
	    }

	    url[part] = value;
	  } else if ('port' === part) {
	    url[part] = value;

	    if (!required(value, url.protocol)) {
	      url.host = url.hostname;
	      url[part] = '';
	    } else if (value) {
	      url.host = url.hostname +':'+ value;
	    }
	  } else if ('hostname' === part) {
	    url[part] = value;

	    if (url.port) value += ':'+ url.port;
	    url.host = value;
	  } else if ('host' === part) {
	    url[part] = value;

	    if (/\:\d+/.test(value)) {
	      value = value.split(':');
	      url.hostname = value[0];
	      url.port = value[1];
	    }
	  } else if ('protocol' === part) {
	    url.protocol = value;
	    url.slashes = !fn;
	  } else {
	    url[part] = value;
	  }

	  url.href = url.toString();
	  return url;
	};

	/**
	 * Transform the properties back in to a valid and full URL string.
	 *
	 * @param {Function} stringify Optional query stringify function.
	 * @returns {String}
	 * @api public
	 */
	URL.prototype.toString = function toString(stringify) {
	  if (!stringify || 'function' !== typeof stringify) stringify = qs.stringify;

	  var query
	    , url = this
	    , protocol = url.protocol;

	  if (protocol && protocol.charAt(protocol.length - 1) !== ':') protocol += ':';

	  var result = protocol + (url.slashes ? '//' : '');

	  if (url.username) {
	    result += url.username;
	    if (url.password) result += ':'+ url.password;
	    result += '@';
	  }

	  result += url.hostname;
	  if (url.port) result += ':'+ url.port;

	  result += url.pathname;

	  query = 'object' === typeof url.query ? stringify(url.query) : url.query;
	  if (query) result += '?' !== query.charAt(0) ? '?'+ query : query;

	  if (url.hash) result += url.hash;

	  return result;
	};

	//
	// Expose the URL parser and some additional properties that might be useful for
	// others.
	//
	URL.qs = qs;
	URL.location = lolcation;
	module.exports = URL;


/***/ },
/* 86 */
/***/ function(module, exports) {

	'use strict';

	/**
	 * Check if we're required to add a port number.
	 *
	 * @see https://url.spec.whatwg.org/#default-port
	 * @param {Number|String} port Port number we need to check
	 * @param {String} protocol Protocol we need to check against.
	 * @returns {Boolean} Is it a default port for the given protocol
	 * @api private
	 */
	module.exports = function required(port, protocol) {
	  protocol = protocol.split(':')[0];
	  port = +port;

	  if (!port) return false;

	  switch (protocol) {
	    case 'http':
	    case 'ws':
	    return port !== 80;

	    case 'https':
	    case 'wss':
	    return port !== 443;

	    case 'ftp':
	    return port !== 21;

	    case 'gopher':
	    return port !== 70;

	    case 'file':
	    return false;
	  }

	  return port !== 0;
	};


/***/ },
/* 87 */
/***/ function(module, exports, __webpack_require__) {

	/* WEBPACK VAR INJECTION */(function(global) {'use strict';

	var slashes = /^[A-Za-z][A-Za-z0-9+-.]*:\/\//;

	/**
	 * These properties should not be copied or inherited from. This is only needed
	 * for all non blob URL's as a blob URL does not include a hash, only the
	 * origin.
	 *
	 * @type {Object}
	 * @private
	 */
	var ignore = { hash: 1, query: 1 }
	  , URL;

	/**
	 * The location object differs when your code is loaded through a normal page,
	 * Worker or through a worker using a blob. And with the blobble begins the
	 * trouble as the location object will contain the URL of the blob, not the
	 * location of the page where our code is loaded in. The actual origin is
	 * encoded in the `pathname` so we can thankfully generate a good "default"
	 * location from it so we can generate proper relative URL's again.
	 *
	 * @param {Object|String} loc Optional default location object.
	 * @returns {Object} lolcation object.
	 * @api public
	 */
	module.exports = function lolcation(loc) {
	  loc = loc || global.location || {};
	  URL = URL || __webpack_require__(85);

	  var finaldestination = {}
	    , type = typeof loc
	    , key;

	  if ('blob:' === loc.protocol) {
	    finaldestination = new URL(unescape(loc.pathname), {});
	  } else if ('string' === type) {
	    finaldestination = new URL(loc, {});
	    for (key in ignore) delete finaldestination[key];
	  } else if ('object' === type) {
	    for (key in loc) {
	      if (key in ignore) continue;
	      finaldestination[key] = loc[key];
	    }

	    if (finaldestination.slashes === undefined) {
	      finaldestination.slashes = slashes.test(loc.href);
	    }
	  }

	  return finaldestination;
	};

	/* WEBPACK VAR INJECTION */}.call(exports, (function() { return this; }())))

/***/ },
/* 88 */
/***/ function(module, exports) {

	'use strict';

	var has = Object.prototype.hasOwnProperty;

	/**
	 * Simple query string parser.
	 *
	 * @param {String} query The query string that needs to be parsed.
	 * @returns {Object}
	 * @api public
	 */
	function querystring(query) {
	  var parser = /([^=?&]+)=([^&]*)/g
	    , result = {}
	    , part;

	  //
	  // Little nifty parsing hack, leverage the fact that RegExp.exec increments
	  // the lastIndex property so we can continue executing this loop until we've
	  // parsed all results.
	  //
	  for (;
	    part = parser.exec(query);
	    result[decodeURIComponent(part[1])] = decodeURIComponent(part[2])
	  );

	  return result;
	}

	/**
	 * Transform a query string to an object.
	 *
	 * @param {Object} obj Object that should be transformed.
	 * @param {String} prefix Optional prefix.
	 * @returns {String}
	 * @api public
	 */
	function querystringify(obj, prefix) {
	  prefix = prefix || '';

	  var pairs = [];

	  //
	  // Optionally prefix with a '?' if needed
	  //
	  if ('string' !== typeof prefix) prefix = '?';

	  for (var key in obj) {
	    if (has.call(obj, key)) {
	      pairs.push(encodeURIComponent(key) +'='+ encodeURIComponent(obj[key]));
	    }
	  }

	  return pairs.length ? prefix + pairs.join('&') : '';
	}

	//
	// Expose the module.
	//
	exports.stringify = querystringify;
	exports.parse = querystring;


/***/ },
/* 89 */
/***/ function(module, exports, __webpack_require__) {

	'use strict';

	var _freeze = __webpack_require__(90);

	var _freeze2 = _interopRequireDefault(_freeze);

	function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

	var filterOptions = ['none', 'blur', 'brightness', 'contrast', 'invert', 'opacity', 'saturate', 'sepia', 'drop-shadow', 'grayscale', 'hue-rotate'];

	(0, _freeze2.default)(filterOptions);

	/**
	 * Each filter style needs to adjust the strength value (1 - 100) by a `modifier`
	 * function and a unit, as appropriate. The `modifier` is purely subjective.
	 */
	var filterProperties = {
	  'blur': {
	    'modifier': function modifier(value) {
	      return value * 0.3;
	    },
	    'unit': 'px'
	  },
	  'brightness': {
	    'modifier': function modifier(value) {
	      return value * 0.009 + 0.1;
	    },
	    'unit': ''
	  },
	  'contrast': {
	    'modifier': function modifier(value) {
	      return value * 0.4 + 80;
	    },
	    'unit': '%'
	  },
	  'grayscale': {
	    'modifier': function modifier(value) {
	      return value;
	    },
	    'unit': '%'
	  },
	  'hue-rotate': {
	    'modifier': function modifier(value) {
	      return value * 3.6;
	    },
	    'unit': 'deg'
	  },
	  'invert': {
	    'modifier': function modifier(value) {
	      return 1;
	    },
	    'unit': ''
	  },
	  'opacity': {
	    'modifier': function modifier(value) {
	      return value;
	    },
	    'unit': '%'
	  },
	  'saturate': {
	    'modifier': function modifier(value) {
	      return value * 2;
	    },
	    'unit': '%'
	  },
	  'sepia': {
	    'modifier': function modifier(value) {
	      return value;
	    },
	    'unit': '%'
	  }
	};

	(0, _freeze2.default)(filterProperties);

	module.exports = {
	  filterOptions: filterOptions,
	  filterProperties: filterProperties
	};

/***/ },
/* 90 */
/***/ function(module, exports, __webpack_require__) {

	module.exports = { "default": __webpack_require__(91), __esModule: true };

/***/ },
/* 91 */
/***/ function(module, exports, __webpack_require__) {

	__webpack_require__(92);
	module.exports = __webpack_require__(12).Object.freeze;

/***/ },
/* 92 */
/***/ function(module, exports, __webpack_require__) {

	// 19.1.2.5 Object.freeze(O)
	var isObject = __webpack_require__(18)
	  , meta     = __webpack_require__(68).onFreeze;

	__webpack_require__(93)('freeze', function($freeze){
	  return function freeze(it){
	    return $freeze && isObject(it) ? $freeze(meta(it)) : it;
	  };
	});

/***/ },
/* 93 */
/***/ function(module, exports, __webpack_require__) {

	// most Object methods by ES6 should accept primitives
	var $export = __webpack_require__(10)
	  , core    = __webpack_require__(12)
	  , fails   = __webpack_require__(21);
	module.exports = function(KEY, exec){
	  var fn  = (core.Object || {})[KEY] || Object[KEY]
	    , exp = {};
	  exp[KEY] = exec(fn);
	  $export($export.S + $export.F * fails(function(){ fn(1); }), 'Object', exp);
	};

/***/ },
/* 94 */
/***/ function(module, exports) {

	var getPropsFromNode = function(node) {
	  var props = {
	    'container': node
	  };

	  if (node.getAttribute('data-config-url')) {
	    props.url = node.getAttribute('data-config-url');
	  }

	  if (node.getAttribute('data-config-playback-speed')) {
	    props.playbackSpeed = node.getAttribute('data-config-playback-speed');
	  }

	  if (node.getAttribute('data-config-filter')) {
	    props.filter = node.getAttribute('data-config-filter');
	  }

	  if (node.getAttribute('data-config-filter-strength')) {
	    props.filterStrength = node.getAttribute('data-config-filter-strength');
	  }

	  return props;
	};

	module.exports = getPropsFromNode;


/***/ },
/* 95 */
/***/ function(module, exports, __webpack_require__) {

	var debounce = __webpack_require__(2);
	var imgLoad = __webpack_require__(96);
	var URL = __webpack_require__(85);

	Y.use('node', function() {
	  window.Singleton.create({

	    ready: function() {

	      this._touch = Y.one('.touch-styles');

	      this.bindUI();

	      if (this._touch || Y.one('.force-mobile-nav') || window.innerWidth <= 640) {
	        this.radioCheckboxes('#mainNavigation');
	        this.radioCheckboxes('#mobileNavigation');
	      } else {
	        this.folderRedirect('#headerNav .folder-toggle-label');
	        this.folderRedirect('#footer .folder-toggle-label');
	      }

	    },


	    bindUI: function() {

	      this.dataToggleBody();
	      this.dataToggleEl();
	      this.dataLightbox();

	      this.scrollAnchors();

	      Y.one(window).on('resize', this.syncUI, this);

	    },


	    syncUI: function() {

	      debounce(function() {
	        imgLoad();
	      }, 100, this);

	    },


	    radioCheckboxes: function(wrapper, checkbox, label) {

	      /*
	        Makes a group of checkboxes behave more
	        like radios.

	        Only the wrapper param is required.
	        Checkbox and label default to the most
	        generic selectors possible, but you can
	        make them more specific.

	        helper.radioCheckboxes('#nav', '.folder-checkbox', '.folder-label');
	      */

	      if (!wrapper) {
	        console.warn('radioCheckboxes: Must define a wrapper.');
	        return;
	      }

	      if (!Y.one(wrapper)) {
	        console.warn('radioCheckboxes: No wrapper found on page.');
	        return;
	      }

	      checkbox = checkbox || '[type="checkbox"]';
	      label = label || 'label[for]';

	      if (Y.one(wrapper).all(checkbox).size() > 1) {
	        Y.one(wrapper).delegate('click', function(e) {
	          e.preventDefault();
	          var currentCheck = Y.one('#' + e.currentTarget.getAttribute('for'));
	          if (currentCheck.get('checked') === false) {
	            Y.one(wrapper).all(checkbox).each(function(current) {
	              current.set('checked', false);
	            });
	            currentCheck.set('checked', true);
	          } else {
	            currentCheck.set('checked', false);
	          }
	        }, label);
	      }

	    },


	    folderRedirect: function(folder, wrapper) {

	      /*
	        Redirects the main folder link to the first
	        page in the folder. Relies on a data attribute
	        in the markup.

	        <label for="{id}" data-href="{urlId}">Folder</label>
	      */

	      folder = folder || 'label[for]';
	      wrapper = wrapper || 'body';

	      if (Y.one(folder)) {
	        Y.one(wrapper).delegate('click', function(e) {
	          e.preventDefault();
	          var link = e.currentTarget.getData('href');
	          if (link) {
	            window.location = link;
	          } else {
	            console.warn('folderRedirect: You must add a data-href attribute to the label.');
	          }
	        }, folder);
	      }

	    },


	    dataLightbox: function() {

	      /*
	        Creates a lightbox when you click on any image/video.
	        To initialize, add a data attribute to any img or video tag

	        <img data-lightbox="set-name"/>
	      */

	      var lightboxSets = {};

	      Y.all('[data-lightbox]').each(function(elem) {
	        var name = elem.getAttribute('data-lightbox');
	        lightboxSets[name] = lightboxSets[name] || [];

	        lightboxSets[name].push({
	          content: elem,
	          meta: elem.getAttribute('alt')
	        });

	        elem.on('click', function(e) {
	          e.halt();

	          new Y.Squarespace.Lightbox2({
	            set: lightboxSets[name],
	            currentSetIndex: Y.all('[data-lightbox]').indexOf(elem),
	            controls: { previous: true, next: true }
	          }).render();
	        });
	      });

	    },


	    dataToggleBody: function() {

	      /*
	        Toggles a class on the body when you click an
	        element. To initialize, add a data attribute to
	        any element, like so.

	        <div class="shibe" data-toggle-body="doge"></div>
	      */

	      Y.one('body').delegate('click', function(e) {
	        Y.one('body').toggleClass(e.currentTarget.getData('toggle-body'));
	      }, '[data-toggle-body]');

	    },


	    dataToggleEl: function() {

	      /*
	        Toggles a class on any element when you click on
	        it. To initialize, add a data attribute to any
	        element, like so.

	        <div class="shibe" data-toggle="doge"></div>
	      */

	      Y.one('body').delegate('click', function(e) {
	        var current = e.currentTarget;
	        current.toggleClass(current.getData('toggle'));
	      }, '[data-toggle]');

	    },



	    scrollAnchors: function() {

	      /*
	        Makes anchor links scroll smoothly instead of jumping
	        down the page. The "el" argument is optional. By
	        default, invoking this function will create the smooth
	        scrolling behavior on every hash link.
	      */

	      if (!history.pushState) {
	        return false;
	      }

	      var anchors = 'a[href*="#"]';

	      Y.one('body').delegate('click', function(e) {

	        var href = e.currentTarget.get('href');
	        var hash = this._getSamePageHash(href);

	        if (hash && Y.one(hash)) {

	          e.halt();

	          // Close overlay nav
	          if (Y.one('#mobileNavToggle')) {
	            Y.one('#mobileNavToggle')
	              .set('checked', false)
	              .simulate('change');
	          }

	          this.smoothScrollTo(Y.one(hash).getY());
	          history.pushState({}, hash, hash);

	        }
	      }, anchors, this);

	    },


	    _getSamePageHash: function(url) {

	      /*
	        Checks to see if given url is a hash link to a location
	        on the same page. If so, returns the hash link. If not,
	        returns null.
	      */

	      var url = new URL(url);
	      var loc = new URL(window.location.href);

	      if (url.host !== loc.host || url.pathname !== loc.pathname || url.hash === '') {
	        return null;
	      }

	      return url.hash;

	    },


	    smoothScrollTo: function(point) {

	      /*
	        Scrolls to some point on the Y axis of a page.
	        Accepts a number as an argument.
	      */

	      if (!Y.Lang.isNumber(point)) {
	        try {
	          point = parseInt(point);
	        } catch (e) {
	          console.warn('helpers.js: scrollTo was passed an invalid argument.');
	          return false;
	        }
	      }

	      var a = new Y.Anim({
	        node: Y.one(Y.UA.gecko || Y.UA.ie || !!navigator.userAgent.match(/Trident.*rv.11\./) ? 'html' : 'body'),
	        to: {
	          scrollTop: point
	        },
	        duration: 0.4,
	        easing: 'easeOut'
	      });

	      a.run();

	      a.on('end', function() {
	        a.destroy();
	      });

	    }

	  });
	});


/***/ },
/* 96 */
/***/ function(module, exports) {

	
	/*
	  Pass an image selector to this function and
	  Squarespace will load up the proper image
	  size.

	  ex: this.imgLoad('img[data-src]');
	*/

	function imgLoad(el) {

	  el = el || 'img[data-src]';

	  Y.one(el) && Y.all(el).each(function(img) {
	    ImageLoader.load(img);
	  });

	}

	module.exports = imgLoad;

/***/ }
/******/ ]);