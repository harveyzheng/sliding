$.fn.Sliding=function(obj){
	//开始啦
	var that=$(this);
	
	//设置全屏
	function fullScreen(){
		var w=$(window).innerWidth();
		var h=$(window).innerHeight();
		if(transverse){
			if(h>w){
				zwidth=h;
				state=false;
				var z_top=(h-w)/2;
	    		var z_left=0-(h-w)/2;
		  		$(".Sliding-wrap").css({"width":h,"height":w,'position':'absolute','top':z_top,'left':z_left,'overflow':'hidden','transform':'rotate(90deg)'});
			}else{
				zwidth=w;
				state=true;
				$(".Sliding-wrap").css({"width":w,"height":h,'position':'absolute','top':0,'left':0,'overflow':'hidden','transform':'rotate(0deg)'});
			}
		}
		that.css({
			'transition-duration': '0ms',
			'transform':'translate3d('+(-zwidth*zindex)+'px, 0px, 0px)'
		});
		return;
	}
	
	//判断是否支持touch
	var sunscreen="ontouchstart" in document ? true : false;
	if(sunscreen){
		ztrigger={
			start:'touchstart',
			move:'touchmove',
			end:'touchend'
		};
	}else{
		ztrigger={
			start:'mousedown',
			move:'mousemove',
			end:'mouseup'
		};
	}
	
	//指向标
	var zindex=0;
	
	//宽度
	var zwidth=0;
	
	//子集数量
	var slide=that.find(obj.slide);
	var zleng=slide.length;
	
	//滑动距离
	var zdistance=obj.distance||100;
	
	//边缘阻力
	var resistance=obj.resistance||0.3;
	
	//强制横屏
	var transverse=obj.transverse;
	//横竖屏状态，false=竖屏，true=横屏
	var state=false;
	
	var local={
		//开始X/Y值
		sX:0,
		sY:0,
		//结束X/Y值
		eX:0,
		eY:0
	}
	
	//手指触摸或鼠标按下
	slide.on(ztrigger.start,function(e){
		if(sunscreen){
			var touch = e.originalEvent.targetTouches[0];
			local.sX=touch.pageX;
			local.sY=touch.pageY;
		}else{
			local.sX=e.pageX;
			local.sY=e.pageY;
		};
	});
	
	//手指滑动或鼠标移动
	slide.on(ztrigger.move,function(e){
		 e.preventDefault();
		 console.log(resistance)
		if(sunscreen){
			var touch = e.originalEvent.targetTouches[0];
			local.eX=touch.pageX-local.sX;
			local.eY=touch.pageY-local.sY;
		}else{
			if(local.sX==0&&local.sY==0)return;
			local.eX=e.pageX-local.sX;
			local.eY=e.pageY-local.sY;
		};
		if(state){
			var move=(-zwidth*zindex)+local.eX;
		}else{
			var move=(-zwidth*zindex)+local.eY;
		};
		if(zindex==0&&move>0){
			move=move*resistance;
		};
		if(zindex==zleng-1&&move<(-zwidth*zindex)){
			if(state){
				move=(-zwidth*zindex)+local.eX*resistance;
			}else{
				move=(-zwidth*zindex)+local.eY*resistance;
			}
		};
		//拖动效果
		that.css({
			'transition-duration': '0ms',
			'transform':'translate3d('+move+'px, 0px, 0px)'
		});
	});
	
	//手指离开或鼠标松开
	slide.on(ztrigger.end,function(){
		
		if(state){
			var dis=local.eX;
		}else{
			var dis=local.eY;
		}
		if(dis<(-zdistance)){
			if(zindex!=zleng-1){
				zindex+=1;
			}
		}else if(dis>zdistance){
			if(zindex!=0){
				zindex--;
			}
		};
		local.sX=0;local.sY=0;local.eX=0;local.eY=0;
		that.css({
			'transition-duration': '300ms',
			'transform':'translate3d('+(-zwidth*zindex)+'px, 0px, 0px)'
		});
	});
	
	
	//初始化啦
	
	//添加个外框
	that.wrap('<div class="Sliding-wrap"></div>');
	//初始化全屏设置
	fullScreen();
	//浏览器大小绑定fullScreen
	$(window).resize(fullScreen);
	//初始化样式
	that.css({
		'position':'relative',
		'display':'flex',
		width:'100%',
		height:'100%',
		'transition-duration': '0ms',
		'transform':'translate3d(0px, 0px, 0px)'
	});
	slide.css({
		width:'100%',
		height:'100%',
		'flex-shrink':0
	});
};


//api 参数

//子元素class        slide            必填   例如 slide:'.slide'

//触发翻页的滑动距离   distance         默认100

//是否强制横屏             transverse       默认为false

//首尾边缘阻力系数      resistance       '0'为不可拖动，1为没有阻力，默认0.3