// 初始化
mui.init({
	keyEventBind : {
		backbutton : false
	}
});

// 所有的方法都放到这里
mui.plusReady(function(){
	initList();
	
	// 菜单
	mui.menu = function(){
		qiao.h.indexPage().evalJS("opMenu();");
	};
	window.addEventListener('swiperight', function(){
		qiao.h.indexPage().evalJS("opMenu();");
	});
	
	// 查看详情
	qiao.on('#todolist li', 'tap', function(){
		qiao.h.fire('detail', 'detailItem', {id:$(this).data('id')});
	});

	// 完成
	qiao.on('.doneBtn', 'tap', function(){
		var $li = $(this).parent().parent();
		var id = $li.data('id');
		$li.remove();
		showList($('#todolist'));
		
		qiao.h.fire('menu', 'delItem', {todoId:id});
		return false;
	});
	
	// 添加
	window.addEventListener('addItem', addItemHandler);
});

// 初始化待办事项
function initList(){
	var $ul = $('#todolist').empty();
	qiao.h.query(qiao.h.db(), 'select * from t_plan_day_todo order by id desc', function(res){
		for (i = 0; i < res.rows.length; i++) {
			$ul.append(genLi(res.rows.item(i)));
		}

		showList($ul);
	});
	
	qiao.h.indexPage().evalJS('qmask.hide();');
}
function genLi(data){
	var id = data.id;
	var title = data.plan_title;
	
	var li = 
		'<li class="mui-table-view-cell" id="todoli_' + id + '" data-id="' + id + '">' +
			'<div class="mui-slider-right mui-disabled">' + 
				'<a class="mui-btn mui-btn-red doneBtn">完成</a>' +
			'</div>' + 
			'<div class="mui-slider-handle">' + title  + '</div>' + 
		'</li>';
		
	return li;
}
function showList(ul){
	if(ul.find('li').size() > 0 &&  ul.is(':hidden')) ul.show();	
}

// 添加待办事项
function addItemHandler(event){
	// 主界面按钮修改
	qiao.h.indexPage().evalJS("hideBackBtn();");
	
	var db = qiao.h.db();
	var title = event.detail.title;
	var content = event.detail.content ? event.detail.content : '暂无内容！';
	
	qiao.h.query(db, 'select max(id) mid from t_plan_day_todo', function(res){
		var id = (res.rows.item(0).mid) ? res.rows.item(0).mid : 0;
		qiao.h.update(db, 'insert into t_plan_day_todo (id, plan_title, plan_content) values (' + (id+1) + ', "' + title + '", "' + content + '")');
		
		$('#todolist').prepend(genLi({id:id+1, 'plan_title':title})).show();
	});
}