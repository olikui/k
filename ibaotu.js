var http = require('http');
var cheerio = require('cheerio');
var request = require('request');
var fs = require('fs');

//获取过的页码 i = 1 ; i<=2 	一页40个目标一天只能抓一页		
for(var i=6;i<=7;i++){		//获取目标网站1000页
	var url = 'http://ibaotu.com/guanggao/1-100-0-0-0-'+i+'.html';
	http.get(url,function(res,req){
		var html = '';
		res.on('data',function(data){
			html +=data;
		})
		
		res.on('end',function(){	
			var index = filterChapters(html);
			lond(index)
			console.log('完成')
		})
	})
}

function filterChapters(html){		//获取下载链接 标题
	var $ = cheerio.load(html)
	var box = $('.pop-tit');
	var Storage = [];
	box.each(function(itme){
		var boxw = $(this);
		var boxahref = boxw.find('a').attr('href');
		var boxatext = boxw.find('a').text();
		var id = boxahref.substr(24/*, boxahref.indexOf('.')*/)
		var id2 = id.split('.')
		var dow = 'http://ibaotu.com/?m=downloadopen&a=open&id='+id2[0]+'&down_type=1';
		Storage.push({
			href:dow,
			title:boxatext
		})
	})
	return Storage;
}

function lond(html){		//解析链接 标题 执行下载
	html.forEach(function(itme){         
			var options = {
				url: itme.href,
				headers: {
				'Cookie':'auth_id=28420%7C%E6%85%95%E6%89%A7%7C1518166316%7Cc88ed0445c09283d5cfc162a62df6da3'
				}
			};
			downloadFile(options,'./img/'+itme.title+'.zip',function(){
				console.log(itme.title+'下载中');
			})
	});
}

function downloadFile(url,filename,callback){	//下载存储文件
	var stream = fs.createWriteStream(filename);
	request(url).pipe(stream).on('close', callback);
}
