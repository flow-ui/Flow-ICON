/**
 * index
 */
define(function(require) {
	var $ = require('jquery');
	var funImgFilter = function() {};
	require('mousemenu');
	require('box');

	var optSmartMenu = [
			//右键菜单配置
			[{
				text: "定制PNG",
				func: function() {
					var iconfont = $(this).children('i').eq(0);
					var name = $(this).data('tags');
					funImgFilter(iconfont, name);
				}
			}, {
				text: "获得代码",
				func: function() {
					$(this).trigger('click');
				}
			}]
		],
		convertCanvasToImage = function(canvas) {
			//canvas转图片
			var image = canvas.toDataURL("image/png").replace("image/png", "image/octet-stream;");
			return image;
		};

	//单击选中代码
	$('body')
		.on('click', '.demo li', function() {
			setTimeout($.proxy(function() {
				$(this).find('._code').show().select()
					.end().siblings().find('._code').hide();
			}, this), 0);
		})
		.on('mouseenter', '.demo li', function() {
			$(this).siblings().find('._code').hide();
		})
		.on('change', '.demo ._code', function() {
			$(this).val($(this).data('code'));
		});

	//右键菜单
	// $('.demo li').mousemenu(optSmartMenu, {
	// 	name: "download"
	// });

	//html2canvas2png
	funImgFilter = function(imgfile, name) {
		var htmlIcon = imgfile.clone().removeClass('rotation heartbeat trigger').addClass('htmlIcon');
		$('#mycanvas').append(htmlIcon);

		$('#size_val').val($('#filt_size').val());

		htmlIcon.css({
			'font-size': $('#filt_size').val() + 'px',
			'color': $('#filt_color').val()
		});

		//监听	
		$('.pannel').on('change', 'input', function() {
			if ($(this).attr('id') == 'filt_size') {

				$('#size_val').val($('#filt_size').val());

				htmlIcon.css({
					'font-size': $('#filt_size').val() + 'px'
				});

			} else {

				htmlIcon.css({
					'color': $('#filt_color').val()
				});

			}
		});

		$.box.open($('.boxToView'), {
			title: name,
			onshow: function() {
				window.iconName = name;
			},
			onclose: function() {
				$('#mycanvas').children().remove();
			}
		});
	};

	$('#_download').on('click', function(e) {
		e.preventDefault();
		var aLink = document.createElement('a');
		var blobArr = [];
		var blob = null;
		var evt = document.createEvent("HTMLEvents");
		evt.initEvent("click", false, false);
		//下载
		html2canvas($('#mycanvas .htmlIcon').get(0), {
			onrendered: function(canvas) {
				if (canvas.toBlob) {
					canvas.toBlob(function(content) {
						blob = new Blob([content]);
						aLink.download = iconName + ".png";
						aLink.href = URL.createObjectURL(blob);
						aLink.dispatchEvent(evt);
					}, 'image/png');
				}
				return true;
			}
		});
	});

	//返回顶部搜索
	$('.gotop').on('click', function() {
		$('#search').focus();
	});

	//请求demo文件
	var globalLoading = $.box.msg('加载中...');
	$.ajax({
		url: seajs.root + '/font/demo_unicode.html',
		dataType: 'html',
		success: function(res) {
			var nodes = $(res).find('.icon_lists').find('li');
			var name, code, html = '';
			nodes.each(function(i, e) {
				name = $(e).find('.name').text();
				code = $(e).find('.code').text();
				//return console.log($.parseHTML(code))
				html += ('<li data-tags="' + name + '" title="' + name + '" data-pack="default">\
			        <i class="ion">' + code + '</i>\
			        <input class="_code" type="text" data-code="' + code.replace('&', '&amp;') + '">\
			    </li>');
			});
			$('#icons').html(html).find('._code').each(function(i, e) {
				$(e).val($(e).data('code'));
			});
			$('.demo li').mousemenu(optSmartMenu, {
				name: "download"
			});
			//搜索
			require.async('./search');
		}
	}).always(function() {
		$.box.hide(globalLoading);
	});



});