//@prepros-append jq-start.js
//@prepros-append forms.js
//@prepros-append script.js
//@prepros-append jq-end.js
$(document).ready(function() {
		var w=$(window).outerWidth();
		var h=$(window).outerHeight();
		var ua = window.navigator.userAgent;
		var msie = ua.indexOf("MSIE ");
		var isMobile = {Android: function() {return navigator.userAgent.match(/Android/i);},BlackBerry: function() {return navigator.userAgent.match(/BlackBerry/i);},iOS: function() {return navigator.userAgent.match(/iPhone|iPad|iPod/i);},Opera: function() {return navigator.userAgent.match(/Opera Mini/i);},Windows: function() {return navigator.userAgent.match(/IEMobile/i);},any: function() {return (isMobile.Android() || isMobile.BlackBerry() || isMobile.iOS() || isMobile.Opera() || isMobile.Windows());}};
	function isIE() {
		ua = navigator.userAgent;
		var is_ie = ua.indexOf("MSIE ") > -1 || ua.indexOf("Trident/") > -1;
		return is_ie; 
	}
	if(isIE()){
		$('body').addClass('ie');
	}
	if(isMobile.any()){
		$('body').addClass('touch');
	}
//FORMS
function forms(){
	//FIELDS
	$('input,textarea').focus(function(){
		if($(this).val() == $(this).attr('data-value')){
				$(this).addClass('focus');
				$(this).parent().addClass('focus');
			if($(this).attr('data-type')=='pass'){
				$(this).attr('type','password');
			};
			$(this).val('');
		};
		removeError($(this));
	});
	$('input[data-value], textarea[data-value]').each(function() {
		if (this.value == '' || this.value == $(this).attr('data-value')) {
			this.value = $(this).attr('data-value');
			if($(this).hasClass('l') && $(this).parent().find('.form__label').length==0){
				$(this).parent().append('<div class="form__label">'+$(this).attr('data-value')+'</div>');
			}
		}
		if(this.value!=$(this).attr('data-value') && this.value!=''){
			$(this).addClass('focus');
			$(this).parent().addClass('focus');
			if($(this).hasClass('l') && $(this).parent().find('.form__label').length==0){
				$(this).parent().append('<div class="form__label">'+$(this).attr('data-value')+'</div>');
			}
		}

		$(this).click(function() {
			if (this.value == $(this).attr('data-value')) {
				if($(this).attr('data-type')=='pass'){
					$(this).attr('type','password');
				};
				this.value = '';
			};
		});
		$(this).blur(function() {
			if (this.value == '') {
				this.value = $(this).attr('data-value');
					$(this).removeClass('focus');
					$(this).parent().removeClass('focus');
				if($(this).attr('data-type')=='pass'){
					$(this).attr('type','text');
				};
			};
		});
	});
	
	// Masks
	$.each($('input.phone'), function(index, val) {
		$(this).attr('type','tel');
		$(this).focus(function(){
			$(this).inputmask('+7(999) 999 9999',{clearIncomplete: true,clearMaskOnLostFocus: true,
				"onincomplete": function(){maskclear($(this));}
			});
			$(this).addClass('focus');
			$(this).parent().addClass('focus');
			$(this).parent().removeClass('err');
			$(this).removeClass('err');
		});
	});
	$('input.phone').focusout(function(event) {
		maskclear($(this));
	});
	$.each($('input.num'), function(index, val) {
		$(this).focus(function(){
			$(this).inputmask('9{1,1000}',{clearIncomplete: true,placeholder:"",clearMaskOnLostFocus: true,"onincomplete": function(){maskclear($(this));}});
			$(this).addClass('focus');
			$(this).parent().addClass('focus');
			$(this).parent().removeClass('err');
			$(this).removeClass('err');
		});
	});
	$('input.num').focusout(function(event) {
		maskclear($(this));
	});
	//CHECK
	$.each($('.check'), function(index, val) {
		if($(this).find('input').prop('checked')==true){
			$(this).addClass('active');
		}
	});
	$('body').off('click','.check',function(event){});
	$('body').on('click','.check',function(event){
		if(!$(this).hasClass('disable')){
				var target = $(event.target);
			if (!target.is("a")){
					$(this).toggleClass('active');
				if($(this).hasClass('active')){
					$(this).find('input').prop('checked', true);
				}else{
					$(this).find('input').prop('checked', false);
				}
			}
		}
	});

	//RANGE
	if($("#range-price" ).length>0){
		$("#range-price" ).slider({
			range: true,
			min: $("#range-price" ).data('min-price'),
			max: $("#range-price" ).data('max-price'),
			values: [ parseInt($("#range-price" ).data('min-price')),  parseInt($("#range-price" ).data('max-price'))],
			slide: function( event, ui ) {
				$( "#range-price-min" ).val( ui.values[ 0 ] );
				$( "#range-price-max" ).val( ui.values[ 1 ] );
			}
		});
		$("#range-price-min").on('keyup', function(){
			if($(this).val() < $("#range-price" ).data('min-price')){
				$(this).val($("#range-price" ).data('min-price'));
			}
			$("#range-price").slider( "option", "min", parseInt($("#range-price-min").val()) );
		});
		$("#range-price-max").on('keyup', function(){
			if($(this).val() > $("#range-price" ).data('max-price')){
				$(this).val($("#range-price" ).data('max-price'));
			}
			$("#range-price").slider( "option", "max", parseInt($("#range-price-max").val()) );
		});
	}
}
forms();
function digi(str){
	var r=str.toString().replace(/(\d)(?=(\d\d\d)+([^\d]|$))/g, '$1 ');
	return r;
}
//VALIDATE FORMS
$('form button[type=submit]').click(function(){
	var er=0;
	var form=$(this).parents('form');
	var ms=form.data('ms');
	$.each(form.find('.req'), function(index, val) {
		er+=formValidate($(this));
	});
	if(er==0){
		removeFormError(form);

		if(ms!=null && ms!=''){
			showMessageByClass(ms);
			return false;
		}
	}else{
		return false;
	}
});
function formValidate(input){
	var er=0;
	var form=input.parents('form');
	if(input.attr('name')=='email' || input.hasClass('email')){
		if(input.val()!=input.attr('data-value')){
			var em=input.val().replace(" ","");
			input.val(em);
		}
		if(!(/^\w+([\.-]?\w+)*@\w+([\.-]?\w+)*(\.\w{2,4})+$/.test(input.val())) || input.val()==input.attr('data-value')){
			er++;
			addError(input);
		}else{
			removeError(input);
		}
	}else{
		if(input.val()=='' || input.val()==input.attr('data-value')){
			er++;
			addError(input);
		}else{
			removeError(input);
		}
	}
	if(input.attr('type')=='checkbox'){
		if(input.prop('checked') == true){
			input.removeClass('err').parent().removeClass('err');
		}else{
			er++;
			input.addClass('err').parent().addClass('err');
		}
	}
	if(input.hasClass('name')){
		if(!(/^[А-Яа-яa-zA-Z-]{3}$/.test(input.val()))){
			er++;
			addError(input);
		}
	}
	if(input.hasClass('pass-2')){
		if(form.find('.pass-1').val()!=form.find('.pass-2').val()){
			addError(input);
		}else{
			removeError(input);
		}
	}
	return er;
}
function showMessageByClass(ms){
	$('.popup').hide();
	popupOpen('message.'+ms,'');
}
function showMessage(html){
	$('.popup-loading').remove();
	$('.popup-message-body').show().html(html);
}
function clearForm(form){
	$.each(form.find('.input'), function(index, val) {
		$(this).removeClass('focus').val($(this).data('value'));
		$(this).parent().removeClass('focus');
		if($(this).hasClass('phone')){
			maskclear($(this));
		}
	});
}
function addError(input){
	input.addClass('err');
	input.parent().addClass('err');
	input.parent().find('.form__error').remove();
	if(input.hasClass('email')){
		var error='';
		if(input.val()=='' || input.val()==input.attr('data-value')){
			error=input.data('error');
		}else{
			error=input.data('error');
		}
		if(error!=null){
			input.parent().append('<div class="form__error">'+error+'</div>');
		}
	}else{
		if(input.data('error')!=null && input.parent().find('.form__error').length==0){
			input.parent().append('<div class="form__error">'+input.data('error')+'</div>');
		}
	}
	if(input.parents('.select-block').length>0){
		input.parents('.select-block').parent().addClass('err');
		input.parents('.select-block').find('.select').addClass('err');
	}
}
function addErrorByName(form,input__name,error_text){
	var input=form.find('[name="'+input__name+'"]');
	input.attr('data-error',error_text);
	addError(input);
}
function addFormError(form, error_text){
	form.find('.form__generalerror').show().html(error_text);
}
function removeFormError(form){
	form.find('.form__generalerror').hide().html('');
}
function removeError(input){
	input.removeClass('err');
	input.parent().removeClass('err');
	input.parent().find('.form__error').remove();
}
function removeFormErrors(form){
	form.find('.err').removeClass('err');
	form.find('.form__error').remove();
}
function maskclear(n){
	if(n.val()==""){
		n.inputmask('remove');
		n.val(n.attr('data-value'));
		n.removeClass('focus');
		n.parent().removeClass('focus');
	}
}
	var isMobile = {Android: function() {return navigator.userAgent.match(/Android/i);},BlackBerry: function() {return navigator.userAgent.match(/BlackBerry/i);},iOS: function() {return navigator.userAgent.match(/iPhone|iPad|iPod/i);},Opera: function() {return navigator.userAgent.match(/Opera Mini/i);},Windows: function() {return navigator.userAgent.match(/IEMobile/i);},any: function() {return (isMobile.Android() || isMobile.BlackBerry() || isMobile.iOS() || isMobile.Opera() || isMobile.Windows());}};if(isMobile.any()){}	if(location.hash){		var hsh=location.hash.replace('#','');	if($('.popup-'+hsh).length>0 && hsh != 'one-click'){		popupOpen(hsh);	}else if($('div.'+hsh).length>0){		$('body,html').animate({scrollTop:$('div.'+hsh).offset().top,},500, function(){});	}}$('.wrapper').addClass('loaded');$("body").removeClass("no-js");	var act="click";if(isMobile.iOS()){	var act="touchstart";}$('.header-menu__icon').click(function(event) {	$(this).addClass('active');	$('.header-bottom').addClass('active');	if($(this).hasClass('active')){		$('body').data('scroll',$(window).scrollTop());	}	$('body').addClass('lock');});$('.header-menu__close').click(function(event) {	$('.header-menu__icon').removeClass('active');	$('.header-bottom').removeClass('active');	$('body').removeClass('lock');	$('body,html').scrollTop(parseInt($('body').data('scroll')));});$('.fotorama').fotorama({    nav: 'thumbs',    thumbwidth: 50,    thumbheight: 50,    click: false,    swipe: true,    transition: 'crossfade',    fit: 'cover',    allowfullscreen: true});//POPUP$('.pl').click(function(event) {		var pl=$(this).attr('href').replace('#','');		var v=$(this).data('vid');	popupOpen(pl,v);	return false;});function popupOpen(pl,v){	$('.popup').removeClass('active').hide();	if(!$('.header-menu').hasClass('active')){		$('body').data('scroll',$(window).scrollTop());	}	if(!isMobile.any()){		$('body').css({paddingRight:$(window).outerWidth()-$('.wrapper').outerWidth()}).addClass('lock');		$('.pdb').css({paddingRight:$(window).outerWidth()-$('.wrapper').outerWidth()});	}else{		setTimeout(function() {			$('body').addClass('lock');		},300);	}	history.pushState('', '', '#'+pl);	if(v!='' && v!=null){		$('.popup-'+pl+' .popup-video__value').html('<iframe src="https://www.youtube.com/embed/'+v+'?autoplay=1"  allow="autoplay; encrypted-media" allowfullscreen></iframe>');	}	$('.popup-'+pl).fadeIn(300).delay(300).addClass('active');	if($('.popup-'+pl).find('.slick-slider').length>0){		$('.popup-'+pl).find('.slick-slider').slick('setPosition');	}}function openPopupById(popup_id){	$('#'+popup_id).fadeIn(300).delay(300).addClass('active');}function popupClose(){	$('.popup').removeClass('active').fadeOut(300);	if(!$('.header-menu').hasClass('active')){		if(!isMobile.any()){			setTimeout(function() {				$('body').css({paddingRight:0});				$('.pdb').css({paddingRight:0});			},200);			setTimeout(function() {				$('body').removeClass('lock');				$('body,html').scrollTop(parseInt($('body').data('scroll')));			},200);		}else{			$('body').removeClass('lock');			$('body,html').scrollTop(parseInt($('body').data('scroll')));		}	}	$('.popup-video__value').html('');	history.pushState('', '', window.location.href.split('#')[0]);}$('.popup-close,.popup__close').click(function(event) {	popupClose();	return false;});$('.popup').click(function(e) {	if (!$(e.target).is(".popup>.popup-table>.cell *") || $(e.target).is(".popup-close") || $(e.target).is(".popup__close")) {		popupClose();		return false;	}});$(document).on('keydown',function(e) {	if(e.which==27){		popupClose();	}});$('.goto').click(function() {		var el=$(this).attr('href').replace('#','');		var offset=0;	$('body,html').animate({scrollTop:$('.'+el).offset().top+offset},500, function() {});	if($('.header-menu').hasClass('active')){		$('.header-menu,.header-menu__icon').removeClass('active');		$('body').removeClass('lock');	}	return false;});function ibg(){	$.each($('.ibg'), function(index, val) {		if($(this).find('img').length>0){			$(this).css('background-image','url("'+$(this).find('img').attr('src')+'")');		}	});}ibg();	//Клик вне области$(document).on('click touchstart',function(e) {	if (!$(e.target).is(".select *")) {		$('.select').removeClass('active');	};});//UP$(window).scroll(function() {		var w=$(window).width();	if($(window).scrollTop()>50){		$('#up').fadeIn(300);	}else{		$('#up').fadeOut(300);	}});$('#up').click(function(event) {	$('body,html').animate({scrollTop:0},300);});$(".popular-slider").on("init reinit", function(event, slick){	ibg();});$(".popular-slider").slick({	slidesToShow: 4,	prevArrow: '<div class="slick-arrow slick-prev"></div>',	nextArrow: '<div class="slick-arrow slick-next"></div>',	infinite: false,	draggable: false,	autoplay: true,	autoplaySpeed: 2000,	responsive: [		{			breakpoint: 1024,			settings: {				slidesToShow: 3,				arrows: false,				draggable: true,			}		},		{			breakpoint: 768,			settings: {				slidesToShow: 2,				arrows: false,				draggable: true,			}		},		{			breakpoint: 480,			settings: {				slidesToShow: 1,				arrows: false,				draggable: true,			}		}	]});$(".popular-item__oneclick").on("click", function(){	var src = $(this).parents('.popular-item').find(".popular-item__image img").attr("src");	var title = $(this).parents('.popular-item').find(".popular-item__title").text();	var id = $(this).parents('.popular-item').data("id");	$('.popup-one-click .popup__title').text('Купить "' + title + '"');	$('.popup-one-click .popup-image img').attr("src", src);	$('.popup-one-click .form__btn').attr('data-id', id);	ibg();});$('body').on('click','.tab__navitem',function(event) {			var eq=$(this).index();		if($(this).hasClass('parent')){			var eq=$(this).parent().index();		}	if(!$(this).hasClass('active')){			$(this).closest('.tabs').find('.tab__navitem').removeClass('active');			$(this).addClass('active');			$(this).closest('.tabs').find('.tab__item').removeClass('active').eq(eq).addClass('active');		if($(this).closest('.tabs').find('.slick-slider').length>0){			$(this).closest('.tabs').find('.slick-slider').slick('setPosition');		}	}});$.each($('.spoller.active'), function(index, val) {	$(this).next().show();});$('body').on('click','.spoller',function(event) {	if($(this).hasClass('mob') && !isMobile.any()){		return false;	}	if($(this).hasClass('closeall') && !$(this).hasClass('active')){		$.each($(this).closest('.spollers').find('.spoller'), function(index, val) {			$(this).removeClass('active');			$(this).next().slideUp(300);		});	}	$(this).toggleClass('active').next().slideToggle(300,function(index, val) {			if($(this).parent().find('.slick-slider').length>0){				$(this).parent().find('.slick-slider').slick('setPosition');			}	});	return false;});$('.catalog-filter__title').on('click', function(){	$(this).next().stop().slideToggle('fast');	$(this).parent().toggleClass('active');});$('.catalog-filter__toggle').on('click', function(){	$(this).next().stop().slideToggle('fast');	$(this).toggleClass('active');});$('.catalog-filter__btn').on('click', function(){	$(this).parents('form').trigger('reset');	$(this).parents('form').find('.check').removeClass('active');	$("#range-price" ).slider({		range: true,		min: $("#range-price" ).data('min-price'),		max: $("#range-price" ).data('max-price'),		values: [ parseInt($("#range-price" ).data('min-price')),  parseInt($("#range-price" ).data('max-price'))],		slide: function( event, ui ) {			$( "#range-price-min" ).val( ui.values[ 0 ] );			$( "#range-price-max" ).val( ui.values[ 1 ] );		}	});});function scrolloptions(){		var scs=100;		var mss=50;		var bns=false;	if(isMobile.any()){		scs=10;		mss=1;		bns=true;	}	var opt={		cursorcolor:"#fff",		cursorwidth: "4px",		background: "",		autohidemode:true,		cursoropacitymax: 0.4,		bouncescroll:bns,		cursorborderradius: "0px",		scrollspeed:scs,		mousescrollstep:mss,		directionlockdeadzone:0,		cursorborder: "0px solid #fff",	};	return opt;}function scroll(){	$('.scroll-body').niceScroll('.scroll-list',scrolloptions());}if(navigator.appVersion.indexOf("Mac")!=-1){}else{	if($('.scroll-body').length>0){scroll();}}/*function scrollwhouse(){		var scs=100;		var mss=50;		var bns=false;	if(isMobile.any()){		scs=10;		mss=1;		bns=true;	}	var opt={		cursorcolor:"#afafaf",		cursorwidth: "5px",		background: "",		autohidemode:false,		railalign: 'left',		cursoropacitymax: 1,		bouncescroll:bns,		cursorborderradius: "0px",		scrollspeed:scs,		mousescrollstep:mss,		directionlockdeadzone:0,		cursorborder: "0px solid #fff",	};	return opt;}$('.whouse-content-body').niceScroll('.whouse-content-scroll',scrollwhouse());$('.whouse-content-body').scroll(function(event) {		var s=$(this).scrollTop();		var r=Math.abs($(this).outerHeight()-$('.whouse-content-scroll').outerHeight());		var p=s/r*100;	$('.whouse-content__shadow').css({opacity:1-1/100*p});});*/if($('.t,.tip').length>0){	tip();}function tip(){	$('.t,.tip').webuiPopover({		placement:'top',		trigger:'hover',		backdrop: false,		//selector:true,		animation:'fade',		dismissible: true,		padding:false,		//hideEmpty: true		onShow: function($element) {},		onHide: function($element) {},	}).on('show.webui.popover hide.webui.popover', function(e){		$(this).toggleClass('active');	});}
});
