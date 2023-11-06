jQuery(document).ready(function($){
	var node = new Object();
	var method = new Object();
	var val = new Object();

	node.hamburger = $("a.hamburger");
	node.hamburgerClose = $("#hamburger").find("a.close");

	method.HamburgerEvent = function(e){
		var html = $("html");
		var target = $("#hamburger");
		var blackShadow = $(".black_shadow");
		if(!html.hasClass("active")){
			target.show();
			blackShadow.show();
			html.addClass("active");
		}else{
			target.hide();
			blackShadow.hide();
			html.removeClass("active");
		}
		return false;
	}

	method.windowResizeEvent = function(e){
		var html = $("html");
		var target = $("#hamburger");
		var blackShadow = $(".black_shadow");		
		var width = $(this).width();
		var limitX = 980;
		if(width > limitX){
			html.removeClass("active");
			target.hide();
			blackShadow.hide();
		}
	}
	node.hamburger.on("click",method.HamburgerEvent);
	node.hamburgerClose.on("click",method.HamburgerEvent)
	$(window).on("resize",method.windowResizeEvent);
 	
 
 });
	

jQuery(function($){

///////////메뉴////////	
  $(".main .gnb-area > ul > li> a").hover(function(){	
     $(".gnb-area > ul > li > ul").css("display","none");
     $(".gnb-cover").css("display","none");
  
  });
  
  $(".gnb-area > ul > li:nth-child(1) > a, .gnb-area > ul > li:nth-child(5) > a").hover(function(){	
     $(".gnb-area > ul > li > ul").css("display","none");
     $(".gnb-cover").css("display","block");
     $(this).next().show();
  });
  
$(".main  .gnb-cover").mouseleave(function(){	
    $(this).css("display","none");
    $(".gnb-area > ul > li > ul").css("display","none");
  });
  
$(".main  .gnb-area > ul > li > ul").mouseleave(function(){	
    $(this).css("display","none");
    $(".gnb-cover").css("display","none");
  }); 
  

	///////////메인스크롤////////	

    var swiper = new Swiper('.swiper-main', {	
    loop: true,
        autoplay: {
        delay: 5000,
        disableOnInteraction: false,
      },	 
    });
	
	 var swiper = new Swiper('.swiper-banner', {
	    slidesPerView: 4,      
        slidesPerGroup:1,
        loop: true,
 
        navigation: {
          nextEl: ".swiper-button-next",
          prevEl: ".swiper-button-prev",
        },		
				
		breakpoints: {
         320: {
            slidesPerView: 1,           
          },
          420: {
            slidesPerView: 2,           
			spaceBetween: 10,
          },
		    620: {
            slidesPerView: 3,           
			spaceBetween: 10,
          },
		    1200: {
            slidesPerView: 4,           
          },
		  },	 
	 });

	
	///////////툴팁////////	
	
 $(".actcstxt .tip").click(function(){
   $(this).find('em').toggle();
  });
	
	
	///////////게시판////////
	
$("#file").on('change',function(){
  var fileName = $("#file").val();
  $(".upload-name").val(fileName);
});	
	
 $(".popimg").click(function(){
    $(".popup").css("display","none");
     $(".black_cover").css("display","none");
	 $(".header").css("z-index","3");
  });

 $("#del").click(function(){
    $(".popup").css("display","block");
    $(".black_cover").css("display","block");
	 $(".header").css("z-index","1");
	
  });

	
	
});





