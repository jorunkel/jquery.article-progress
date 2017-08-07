/**
 * The MIT License (MIT)
 * 
 * Copyright (c) 2017 Johannes Runkel (www.jrunkel.de)
 * 
 * Permission is hereby granted, free of charge, to any person obtaining a copy
 * of this software and associated documentation files (the "Software"), to deal
 * in the Software without restriction, including without limitation the rights
 * to use, copy, modify, merge, publish, distribute, sublicense, and/or sell
 * copies of the Software, and to permit persons to whom the Software is
 * furnished to do so, subject to the following conditions:
 * 
 * The above copyright notice and this permission notice shall be included in all
 * copies or substantial portions of the Software.
 * 
 * THE SOFTWARE IS PROVIDED "AS IS", WITHOUT WARRANTY OF ANY KIND, EXPRESS OR
 * IMPLIED, INCLUDING BUT NOT LIMITED TO THE WARRANTIES OF MERCHANTABILITY,
 * FITNESS FOR A PARTICULAR PURPOSE AND NONINFRINGEMENT. IN NO EVENT SHALL THE
 * AUTHORS OR COPYRIGHT HOLDERS BE LIABLE FOR ANY CLAIM, DAMAGES OR OTHER
 * LIABILITY, WHETHER IN AN ACTION OF CONTRACT, TORT OR OTHERWISE, ARISING FROM,
 * OUT OF OR IN CONNECTION WITH THE SOFTWARE OR THE USE OR OTHER DEALINGS IN THE
 * SOFTWARE.
 */

;(function($, window) {
	
	var pluginName = 'articleProgress';
	
	var defaults = {
		target: null,
		mode: 'width',
		advance: 30,
		circleBg: '#fff',
		circleFg: 'green'
	};
	
	function Plugin(element, options) {
		this.element = element;
		this.options = $.extend({},	defaults, options);
		if(!this.options.target) {
			var progress = $('<div style="position: fixed; top: 0; left: 0; right: 0; height: 2px; background: transparent;"></div>').append('<div style="position: absolute; width: 0%; height: 100%; left: 0; top: 0; background: green;"></div>');
			$('body').append(progress);
			this.options.target = progress.children();
		}
		this._default = defaults;
		this._name = pluginName;
		this.lastValue = -1;
		this.init();
	}
	
	Plugin.prototype.init = function() {
		var t = this;
		$(window).on('resize scroll', function() { t.update(); });
		this.update();
	};
	
	Plugin.prototype.update = function() {
		var $el = $(this.element).eq(0);
		var offset = $el.offset();
		var scrollTop = $(window).scrollTop();
		var articleHeight = $el.height();
		var advanceHeight = $(window).height() * this.options.advance / 100;
		var beforeArticle = scrollTop - offset.top + advanceHeight < 0;
		var behindArticle = offset.top + articleHeight - scrollTop - advanceHeight < 0;
		var onArticle = !beforeArticle && !behindArticle;
		var percent = 0;
		if(behindArticle) {
			percent = 100;
		} else if(!beforeArticle) {
			percent = (scrollTop - offset.top + advanceHeight) / articleHeight * 100;
			if(percent<0) percent = 0;
		}
		if(percent===this.lastValue) return;
		this.lastValue = percent;
		this.change(percent);
	};
	
	Plugin.prototype.change = function(percent) {
		var modes = this.options.mode.split(" ");
		var $target = $(this.options.target);
		for(var i in modes) {
			var mode = modes[i];
			switch(mode) {
				case 'width':
					$target.css('width', percent+'%');
					break;
				case 'text':
					$target.text(Math.round(percent)+'%');
					break;
				case 'circle':
					if(percent===100) {
						$target.css('background-image', 'none');
					} else {
						var deg = 90 + (360 * percent/100);
						var col1 = percent<50 ? 'transparent' : this.options.circleFg;
						var col2 = percent<50 ? this.options.circleBg : 'transparent';
						$target.css('background-image', 'linear-gradient('+deg+'deg, '+col1+' 50%, '+col2+' 50%), linear-gradient(90deg, '+this.options.circleBg+' 50%, transparent 50%)');
					}
					break;
			}
		}
	};
	
	$.fn[pluginName] = function(options) {
		return this.each(function() {
			new Plugin(this, options);
		});
	};
	
})(jQuery, window);
