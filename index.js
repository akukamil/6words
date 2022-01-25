var M_WIDTH=450, M_HEIGHT=800;
var app, game_res, objects={}, state="", game_tick=0, git_src;
var h_state=0, game_platform="", hidden_state_start = 0;
var rus_let = 'ЙЦУКЕНГШЩЗХФЫВАПРОЛДЖЭЯЧСМИТЬБЮ';

var my_data={opp_id : ''};

var some_process = {};

irnd = function (min,max) {	
	//мин и макс включительно
    return Math.floor(Math.random() * (max - min + 1)) + min;
}

class lb_player_card_class extends PIXI.Container{

	constructor(x,y,place) {
		super();

		this.bcg=new PIXI.Sprite(game_res.resources.lb_player_card_bcg.texture);
		this.bcg.interactive=true;
		this.bcg.pointerover=function(){this.tint=0x55ffff};
		this.bcg.pointerout=function(){this.tint=0xffffff};


		this.place=new PIXI.BitmapText("", {fontName: 'mfont',fontSize: 25});
		this.place.tint=0xffff00;
		this.place.x=20;
		this.place.y=22;

		this.avatar=new PIXI.Sprite();
		this.avatar.x=43;
		this.avatar.y=10;
		this.avatar.width=this.avatar.height=48;


		this.name=new PIXI.BitmapText('', {fontName: 'mfont',fontSize: 25});
		this.name.tint=0xdddddd;
		this.name.x=105;
		this.name.y=22;


		this.rating=new PIXI.BitmapText('', {fontName: 'mfont',fontSize: 25});
		this.rating.x=298;
		this.rating.tint=0xffffff;
		this.rating.y=22;

		this.addChild(this.bcg,this.place, this.avatar, this.name, this.rating);
	}


}

class cell_class extends PIXI.Container {
	
	constructor(x,y) {
		super();
		
		this.x=x;
		this.y=y;
		
		this.bcg = new PIXI.Sprite(gres.cell_bcg.texture);
		this.bcg2 = new PIXI.Sprite(gres.cell_bcg.texture);
		this.bcg2.visible=false;
	
		this.letter = new PIXI.BitmapText('', {fontName: 'muffin',fontSize: 60});
		this.letter.anchor.set(0.5,0.5);
		this.letter.x = 37;
		this.letter.y = 37;
		
		
		this.addChild(this.bcg, this.bcg2, this.letter);	
		
	}
	
	add_to_stage() {

	}
	
}

class keyboard_class extends PIXI.Container {
	
	constructor(x,y) {
		super();
		this.visible=false;
		
		this.sx=this.x=x;
		this.sy=this.y=y;
		
		this.keys = [];
		this.letters = [];
				
		this.bcg = new PIXI.Sprite(gres.keyboard_bcg.texture);
		this.bcg.x=-10;
		this.bcg.y=-10;
		this.addChild(this.bcg);
		
		this.back_button =  new PIXI.Sprite(gres.back_button_image.texture);
		this.back_button.x=0;
		this.back_button.y=0;
		this.back_button.interactive=true;
		this.back_button.buttonMode=true;
		this.back_button.pointerdown = function(){this.back_button.tint=0x999999}.bind(this);
		this.back_button.pointerup = function(){game.delete();this.back_button.tint=0xffffff}.bind(this);
		this.addChild(this.back_button);
		
		this.enter_button =  new PIXI.Sprite(gres.enter_button_image.texture);
		this.enter_button.x = 320;
		this.enter_button.interactive=true;
		this.enter_button.buttonMode=true;
		this.enter_button.pointerdown = function(){this.enter_button.tint=0x999999}.bind(this);
		this.enter_button.pointerup = function(){game.check();this.enter_button.tint=0xffffff}.bind(this);
		this.addChild(this.enter_button);
		
		for (let i = 0 ; i < 11 ; i++) {
			let key = new PIXI.Sprite(gres.key_image.texture);
			key.interactive=true;
			key.buttonMode=true;
			key.x = 5 + i*40;
			key.y = 60;		
			key.pointerup = function(){game.key_down(rus_let[i]);key.tint=key.base_tint};
			this.keys.push(key);			
			let letter = new PIXI.BitmapText(rus_let[i], {fontName: 'mfont',fontSize: 35});
			letter.anchor.set(0.5,0.5);
			letter.x=key.x+20;
			letter.y=key.y+25;
						
			this.addChild(key, letter);
		}		
		
		for (let i = 0 ; i < 11 ; i++) {
			let key = new PIXI.Sprite(gres.key_image.texture);
			key.interactive=true;
			key.buttonMode=true;
			key.x = 5 + i*40;
			key.y = 110;		
			key.pointerup = function(){game.key_down(rus_let[i+11]);key.tint=key.base_tint};
			this.keys.push(key);
			let letter = new PIXI.BitmapText(rus_let[i+11], {fontName: 'mfont',fontSize: 35});
			letter.anchor.set(0.5,0.5);
			letter.x=key.x+20;
			letter.y=key.y+25;
			
			this.addChild(key, letter);
		}	
		
		for (let i = 0 ; i < 9 ; i++) {
			let key = new PIXI.Sprite(gres.key_image.texture);
			key.interactive=true;
			key.buttonMode=true;
			key.x = 5 + (i+1)*40;
			key.y = 160;		
			key.pointerup = function(){game.key_down(rus_let[i+22]);key.tint=key.base_tint};
			this.keys.push(key);
			let letter = new PIXI.BitmapText(rus_let[i+22], {fontName: 'mfont',fontSize: 35});
			letter.anchor.set(0.5,0.5);
			letter.x=key.x+20;
			letter.y=key.y+25;
			this.addChild(key, letter);
		}
		
		
		
		this.keys.forEach(k=>{
			k.base_tint = 0x7f7f7f;
			k.pointerover = function(){k.tint=0x8f8f8f};
			k.pointerdown = function(){k.tint=0x9f9f9f};
			k.pointerout = function(){k.tint=k.base_tint};
		})
		
		this.clear();
		
	}
	
	clear() {
		
		this.keys.forEach(k=>{
			k.tint=k.base_tint=0x615d7d;
		})
		
	}
	
	add_to_stage() {		
		app.stage.addChild(this);		
	}
		

}

class keys_class extends PIXI.Container {
		
	constructor(x,y, id) {
		super();

		this.key_id = id;
		this.x=x;
		this.y=y;

		this.bcg=new PIXI.Sprite(gres.key_image.texture);
		this.bcg.width=40;
		this.bcg.height=40;
		this.bcg.interactive=true;
		this.bcg.buttonMode = true;
		//this.bcg.pointerover=function(){this.tint=0x55ffff};
		//this.bcg.pointerout=function(){this.tint=0xffffff};
		

		this.letter=new PIXI.BitmapText("", {fontName: 'mfont',fontSize: 30});
		this.letter.tint=0xFFFFFF;
		this.letter.x=20;
		this.letter.y=20;
		this.letter.anchor.set(0.5,0.5);
		
		this.bcg.pointerdown = this.pointer_down.bind(this);

		this.addChild(this.bcg,this.letter);
	}	
	
	pointer_down () {		
		let key = this.letter.text;
		game.key_down.bind(game,key)();
	}
	
}

var anim2= {
		
	c1: 1.70158,
	c2: 1.70158 * 1.525,
	c3: 1.70158 + 1,
	c4: (2 * Math.PI) / 3,
	c5: (2 * Math.PI) / 4.5,
		
	slot: [null, null, null, null, null, null, null, null, null, null, null, null, null, null, null, null, null, null, null, null, null, null, null],
	
	linear: function(x) {
		return x
	},
	
	kill_anim: function(obj) {
		
		for (var i=0;i<this.slot.length;i++)
			if (this.slot[i]!==null)
				if (this.slot[i].obj===obj)
					this.slot[i]=null;		
	},
	
	easeOutBack: function(x) {
		return 1 + this.c3 * Math.pow(x - 1, 3) + this.c1 * Math.pow(x - 1, 2);
	},
	
	easeOutElastic: function(x) {
		return x === 0
			? 0
			: x === 1
			? 1
			: Math.pow(2, -10 * x) * Math.sin((x * 10 - 0.75) * this.c4) + 1;
	},
	
	easeOutBounce: function(x) {
		const n1 = 7.5625;
		const d1 = 2.75;

		if (x < 1 / d1) {
			return n1 * x * x;
		} else if (x < 2 / d1) {
			return n1 * (x -= 1.5 / d1) * x + 0.75;
		} else if (x < 2.5 / d1) {
			return n1 * (x -= 2.25 / d1) * x + 0.9375;
		} else {
			return n1 * (x -= 2.625 / d1) * x + 0.984375;
		}
	},
	
	easeOutSine: function(x) {
		return Math.sin( x * Math.PI * 0.5);
	},
	
	easeOutCubic: function(x) {
		return 1 - Math.pow(1 - x, 3);
	},
	
	easeOutQuad: function(x) {
		return 1 - (1 - x) * (1 - x);
	},
	
	easeInBack: function(x) {
		return this.c3 * x * x * x - this.c1 * x * x;
	},
	
	easeInQuad: function(x) {
		return x * x;
	},
	
	ease2back : function(x) {
		return Math.sin(x*Math.PI);
	},
	
	easeInOutCubic: function(x) {
		return x < 0.5 ? 4 * x * x * x : 1 - Math.pow(-2 * x + 2, 3) / 2;
	},
	
	add : function(obj, params, vis_on_end, time, func, anim3_origin) {
				
		//если уже идет анимация данного спрайта то отменяем ее
		anim2.kill_anim(obj);
		if (anim3_origin === undefined)
			anim3.kill_anim(obj);


		let f=0;
		//ищем свободный слот для анимации
		for (var i = 0; i < this.slot.length; i++) {

			if (this.slot[i] === null) {

				obj.visible = true;
				obj.ready = false;

				//добавляем дельту к параметрам и устанавливаем начальное положение
				for (let key in params) {
					params[key][2]=params[key][1]-params[key][0];					
					obj[key]=params[key][0];
				}
				
				//для возвратных функцие конечное значение равно начальному
				if (func === 'ease2back')
					for (let key in params)
						params[key][1]=params[key][0];					

					

				this.slot[i] = {
					obj: obj,
					params: params,
					vis_on_end: vis_on_end,
					func: this[func].bind(anim2),
					speed: 0.01818 / time,
					progress: 0
				};
				f = 1;
				break;
			}
		}
		
		if (f===0) {
			console.log("Кончились слоты анимации");	
			
			
			//сразу записываем конечные параметры анимации
			for (let key in params)				
				obj[key]=params[key][1];			
			obj.visible=vis_on_end;
			obj.alpha = 1;
			obj.ready=true;
			
			
			return new Promise(function(resolve, reject){					
			  resolve();	  		  
			});	
		}
		else {
			return new Promise(function(resolve, reject){					
			  anim2.slot[i].p_resolve = resolve;	  		  
			});			
			
		}

		
		

	},	
	
	process: function () {
		
		for (var i = 0; i < this.slot.length; i++)
		{
			if (this.slot[i] !== null) {
				
				let s=this.slot[i];
				
				s.progress+=s.speed;				
				for (let key in s.params)				
					s.obj[key]=s.params[key][0]+s.params[key][2]*s.func(s.progress);		

				
				//если анимация завершилась то удаляем слот
				if (s.progress>=0.999) {
					for (let key in s.params)				
						s.obj[key]=s.params[key][1];
					
					s.obj.visible=s.vis_on_end;
					s.obj.alpha = 1;
					s.obj.ready=true;					
					s.p_resolve('finished');
					this.slot[i] = null;
				}
			}			
		}
		
	}
	
}

var anim3 = {
			
	slot: [null, null, null, null, null, null, null, null, null, null, null, null, null, null, null, null, null, null, null, null, null, null, null],
	
	kill_anim: function(obj) {
		
		for (var i=0;i<this.slot.length;i++)
			if (this.slot[i]!==null)
				if (this.slot[i].obj===obj)
					this.slot[i]=null;		
	},
	
	add : function (obj, params, schedule, func = 0, repeat = 0) {
		
		//anim3.add(objects.header0,['x','y'],[{time:0,val:[0,0]},{time:1,val:[110,110]},{time:2,val:[0,0]}],'easeInOutCubic');	
		
		
		//если уже идет анимация данного спрайта то отменяем ее
		anim3.kill_anim(obj);
		
		
		//ищем свободный слот для анимации
		let f=0;
		for (var i = 0; i < this.slot.length; i++) {

			if (this.slot[i] === null) {
				
				obj.ready = true;
				
				//если это точечная анимация то сразу устанавливаем первую точку
				if (func === 0)
					for (let i=0;i<params.length;i++)
						obj[params[i]]=schedule[0].val[i]
				
				this.slot[i] = {
					obj: obj,
					params: params,
					schedule: schedule,
					func: func,
					start_time : game_tick,
					cur_point: 0,
					next_point: 1,
					repeat: repeat
				};
				f = 1;				
				break;
			}
		}		
		
		if (f===1) {			
			return new Promise(function(resolve, reject){					
			  anim3.slot[i].p_resolve = resolve;	  		  
			});				
		} else {
			
			return new Promise(function(resolve, reject){					
			  resolve();	  		  
			});	
		}
	},
	
	process: function () {
		
		for (var i = 0; i < this.slot.length; i++)
		{
			if (this.slot[i] !== null) {
				
				let s=this.slot[i];
				
				//это точечная анимация
				if (s.func === 0) {
					
					let time_passed = game_tick - s.start_time;
					let next_point_time = s.schedule[s.next_point].time;
					
					//если пришло время следующей точки
					if (time_passed > next_point_time) {
						
						//устанавливаем параметры точки
						for (let i=0;i<s.params.length;i++)
							s.obj[s.params[i]]=s.schedule[s.next_point].val[i];
												
						s.next_point++;		
						
						//начинаем опять отчет времени
						s.start_time = game_tick;	
						
						//если следующая точка - не существует
						if (s.next_point === s.schedule.length) {							

							if (s.repeat === 1) {
								s.start_time = game_tick
								s.next_point = 1;
							}
							else {								
								s.p_resolve('finished');
								this.slot[i]=null;									
							}
						
						}
					}					
				}
				else
				{
					//это вариант с твинами между контрольными точками
					
					m_lable : if (s.obj.ready === true) {						
						
						//если больше нет контрольных точек то убираем слот или начинаем сначала
						if (s.next_point === s.schedule.length) {
							
							if (s.repeat === 1) {
								s.cur_point = 0;
								s.next_point = 1;
							}
							else {
								s.p_resolve('finished');
								this.slot[i]=null;	
								break m_lable;
							}			
						}					

							
						let p0 = s.schedule[s.cur_point];
						let p1 = s.schedule[s.next_point];
						let time = p1.time;
						
						//заполняем расписание для анимации №2
						let cur_schedule={};							
						for (let i = 0 ; i < s.params.length ; i++) {						
							let p = s.params[i];
							cur_schedule[p]=[p0.val[i],p1.val[i]]						
						}					
						
						//активируем анимацию
						anim2.add(s.obj,cur_schedule,true,time,s.func,1);	
						
						s.cur_point++;
						s.next_point++;							
							
					
					}		
				}
			}			
		}		
	}
	

}

var mm ={
	
	promise_resolve :0,
	
	 add : async function(text) {
		
		if (this.promise_resolve!==0)
			this.promise_resolve("forced");

		objects.mm_text.text = text;
		await anim2.add(objects.mm_cont,{alpha:[0,1]}, true, 0.5,'linear');
		
		let res = await new Promise((resolve, reject) => {
				mm.promise_resolve = resolve;
				setTimeout(resolve, 3000)
			}
		);
		
		if (res === "forced")
			return;
		
		
		await anim2.add(objects.mm_cont,{alpha:[1,0]}, false, 0.5,'linear');
		
	}	
		
	
}

var bm = {
	
	p_resolve : 0,
	
	add: function(text) {
				
		objects.bm_text.text=text;

		anim2.add(objects.bm_cont,{y:[-180,objects.bm_cont.sy]}, true, 0.6,'easeOutBack');		
				
		return new Promise(function(resolve, reject){					
			bm.p_resolve = resolve;	  		  
		});
	},

	exit : function() {
		
		if (objects.bm_cont.ready===false)
			return;

		anim2.add(objects.bm_cont,{y:[objects.bm_cont.sy,450]}, false, 0.4,'easeInBack');		
		this.p_resolve("exit");			
	},
	
	ok : function() {
		
		if (objects.bm_cont.ready===false)
			return;

		anim2.add(objects.bm_cont,{y:[objects.bm_cont.sy,450]}, false, 0.4,'easeInBack');		
		this.p_resolve("ok");			
	}

}

var make_text = function (obj, text, max_width) {

	let sum_v=0;
	let f_size=obj.fontSize;

	for (let i=0;i<text.length;i++) {

		let code_id=text.charCodeAt(i);
		let char_obj=game_res.resources.m2_font.bitmapFont.chars[code_id];
		if (char_obj===undefined) {
			char_obj=game_res.resources.m2_font.bitmapFont.chars[83];
			text = text.substring(0, i) + 'S' + text.substring(i + 1);
		}

		sum_v+=char_obj.xAdvance*f_size/64;
		if (sum_v>max_width) {
			obj.text =  text.substring(0,i-1);
			return;
		}
	}

	obj.text =  text;
}

var game = {
	
	cur_word: '',
	cur_level:0,
	cur_pos : -1,
	word:'',	
	checking:0,
	
	activate: function() {
				
		anim2.add(objects.cells_cont,{y:[-500,objects.cells_cont.sy],alpha:[0,1]}, true, 1,'easeOutQuad');
		anim2.add(objects.keyboard,{y:[800,objects.keyboard.sy],alpha:[0,1]}, true, 0.5,'easeOutQuad');
		anim2.add(objects.header_cont,{y:[-50,objects.header_cont.sy],alpha:[0,1]}, true, 0.5,'linear');
		
		
		//устанавливаем пока рейтинг при проигрыше
		let punish_rating = my_data.rating - 1;
		if (punish_rating<0) punish_rating = 0;		
		firebase.database().ref("players/"+my_data.uid+"/rating").set(punish_rating);
		
		objects.header_text.text='Баланс: '+my_data.rating;
		
		objects.keyboard.visible = true;
		objects.keyboard.clear();
		
		//придумаем слово
		let word_id = irnd(0,rus_dict.length-1);
		this.word = rus_dict[word_id];		
		
		//убираем все буквы
		this.cur_pos = -1;
		this.cur_word="";
		this.cur_level=0;
		this.checking=0;
				
		
		objects.cells.forEach(c=>{
			c.bcg.visible = true;
			c.bcg2.visible = false;
			c.letter.text='';
		})	
	},	

	key_down : function(key) {
		
		
		if (objects.bm_cont.visible===true)
			return;
		
		
		
		if (this.cur_word.length===5) {
			mm.add("Вы уже составили слово, нажмите ввод")
			return;
		}
		
		this.cur_word += key;
		
		this.cur_pos++;		
		let _letter = objects.cells[this.cur_level*5+this.cur_pos].letter;
		_letter.text = key;
		anim2.add(_letter,{alpha:[0,1]}, true, 0.25,'linear');

		
	},
	
	check : async function () {
		
		
		if (this.checking === 1 || objects.bm_cont.visible===true)
			return;
		
		if (this.cur_word.length!==5) {
			mm.add("Составте слово из 5 букв");
			return;
		}		
		
		if (rus_dict.includes(this.cur_word) === false) {
			
			mm.add("Такого слова нет в словаре");			
			for (let i = 0 ; i < 5 ; i++)
				objects.cells[this.cur_level*5+i].letter.text = '';
			this.cur_pos=-1;
			this.cur_word='';
			return;			
		}
		
		if (this.word === this.cur_word) {
			my_data.rating++;
			my_data.games++;
			firebase.database().ref("players/"+my_data.uid+"/rating").set(my_data.rating);
			firebase.database().ref("players/"+my_data.uid+"/games").set(my_data.games);
			objects.header_text.text='Баланс: '+my_data.rating;
			
			let res = await bm.add('Отгадали!\nВам начислен 1$\nСыграем еще?');
			if (res === 'exit') {
				this.close();
				main_menu.activate();
				return;			
			}
			
			this.activate();
			return;
		}
		
		this.checking = 1;
		
		for (let i = 0 ; i < 5 ; i++) {
			
			let cur_let = this.cur_word[i];
			let _bcg = objects.cells[this.cur_level*5+i].bcg;
			let _bcg2 = objects.cells[this.cur_level*5+i].bcg2;
			let _key = objects.keyboard.keys[rus_let.indexOf(cur_let)];
			
			//определяем совпадение
			let cell_state="none";			
			if (this.word.includes(cur_let) === true)
				cell_state="in_word"			
			if (cur_let === this.word[i])
				cell_state="match"
			
			if (cell_state === 'none') {				
				anim2.add(_bcg,{alpha:[1,0]}, false, 0.75,'linear');				
				_bcg2.texture = gres.cell_bcg1.texture;
				anim2.add(_bcg2,{alpha:[0,1]}, true, 0.75,'linear');	
				_key.tint = _key.base_tint = 0x212833;
			}
			
			if (cell_state === 'in_word') {				
				anim2.add(_bcg,{alpha:[1,0]}, false, 0.75,'linear');				
				_bcg2.texture = gres.cell_bcg2.texture;
				anim2.add(_bcg2,{alpha:[0,1]}, true, 0.75,'linear');	
				_key.tint = _key.base_tint = 0xbf9000;
			}
			
			if (cell_state === 'match') {				
				anim2.add(_bcg,{alpha:[1,0]}, false, 0.75,'linear');				
				_bcg2.texture = gres.cell_bcg3.texture;
				anim2.add(_bcg2,{alpha:[0,1]}, true, 0.75,'linear');	
				_key.tint = _key.base_tint = 0x548235;
			}	

		}
		
		//это ожидание завершение всех анимаций
		await anim2.add(objects.id_loup,{alpha:[0.5,1]}, true, 1,'linear');
		
		if (this.cur_level===5) {
			
			my_data.games++;
			firebase.database().ref("players/"+my_data.uid+"/games").set(my_data.games);
			
			let res = await bm.add("Вы так и не угадали слово "+this.word + "\nзабрали у вас 1$\nМожет еще разок?")
			if (res === 'exit') {
				this.close();
				main_menu.activate();
				return;			
			}
			
			this.activate();
			return;			
		}
		
		this.checking = 0;		
		this.cur_pos=-1;
		this.cur_word='';
		this.cur_level++;

		
	},	
	
	delete : function () {
		
		if (this.cur_pos === -1 || this.checking === 1 || objects.bm_cont.visible===true)
			return;
		
		this.cur_word = this.cur_word.substring(0, this.cur_word.length - 1);
				
		let _letter = objects.cells[this.cur_level*5+this.cur_pos].letter;
		
		
		anim2.add(_letter,{alpha:[1,0]}, false, 0.25,'linear');
		this.cur_pos--;
		
		
	},

	close : function() {
		
		anim2.add(objects.cells_cont,{y:[objects.cells_cont.sy,-500],alpha:[1,0]}, false, 1,'linear');
		anim2.add(objects.keyboard,{y:[objects.keyboard.sy,800],alpha:[1,0]}, false, 0.5,'linear');
		anim2.add(objects.header_cont,{y:[objects.header_cont.sy,-50],alpha:[1,0]}, false, 0.5,'linear');
		
	},
	
	process : function() {		
		
		
	}
}

var keep_alive = function() {
	
	firebase.database().ref("players/"+my_data.uid+"/tm").set(firebase.database.ServerValue.TIMESTAMP);
}

var	show_ad = function(){
		
	if (game_platform==="YANDEX") {			
		//показываем рекламу
		window.ysdk.adv.showFullscreenAdv({
		  callbacks: {
			onClose: function() {}, 
			onError: function() {}
					}
		})
	}
	
	if (game_platform==="VK") {
				 
		vkBridge.send("VKWebAppShowNativeAds", {ad_format:"interstitial"})
		.then(data => console.log(data.result))
		.catch(error => console.log(error));	
	}		
}

var social_dialog = {
	
	show : function() {
		
		anim2.add(objects.social_cont,{x:[800,objects.social_cont.sx]}, true, 0.06,'linear');
		
		
	},
	
	invite_down : function() {
		
		if (objects.social_cont.ready !== true)
			return;
		
		gres.click.sound.play();
		vkBridge.send('VKWebAppShowInviteBox');
		social_dialog.close();
		
	},
	
	share_down: function() {
		
		if (objects.social_cont.ready !== true)
			return;
		
		gres.click.sound.play();
		vkBridge.send('VKWebAppShowWallPostBox', {"message": `Мой рейтинг в игре Балда ${my_data.rating}. Сможешь победить меня?`,
		"attachments": "https://vk.com/app8044184"});
		social_dialog.close();
	},
	
	close_down: function() {
		if (objects.social_cont.ready !== true)
			return;
		
		gres.click.sound.play();
		social_dialog.close();
	},
	
	close : function() {
		
		anim2.add(objects.social_cont,{x:[objects.social_cont.x,800]}, false, 0.06,'linear');
				
	}
	
}

var main_menu = {

	activate: function() {
		
		anim2.add(objects.main_buttons_cont,{y:[800,objects.main_buttons_cont.sy]}, true, 0.5,'easeOutBack');
		anim2.add(objects.logo,{y:[-300,objects.logo.sy]}, true, 1.5,'easeOutBounce');
		some_process.animate_logo = this.animate_logo;

	},
	
	animate_logo : function() {
		
		objects.logo.rotation = Math.sin(game_tick*2)*0.1;
		
	},

	close : async function() {

		some_process.animate_logo=function(){};
		anim2.add(objects.main_buttons_cont,{y:[objects.main_buttons_cont.y,800]}, true, 0.5,'easeInBack');
		await anim2.add(objects.logo,{y:[objects.logo.y,-500]}, true, 0.5,'easeInBack');	

	},

	play_button_down: async function () {

		if (objects.main_buttons_cont.ready === false)
			return;

		await this.close();
		game.activate();

	},

	lb_button_down: function () {


		this.close();
		lb.activate();

	},

	rules_button_down: function () {

		if (any_dialog_active===1) {
			gres.locked.sound.play();
			return
		};

		gres.click.sound.play();

	
		anim2.add(objects.rules_cont,{y:[-450, objects.rules_cont.sy]}, true, 1,'easeOutBack');

	},

	rules_ok_down: function () {
		any_dialog_active=0;		
		anim2.add(objects.rules_cont,{y:[objects.rules_cont.y,-450, ]}, false, 1,'easeInBack');
	}

}

var lb = {

	add_game_to_vk_menu_shown:0,
	cards_pos: [[20,300],[20,355],[20,410],[20,465],[20,520],[20,575],[20,630]],
	
	activate: function() {
			
		
		anim2.add(objects.lb_cards_cont,{x:[450, 0]}, true, 1,'linear');
		
		objects.lb_cards_cont.visible=true;
		objects.lb_back_button.visible=true;
		
		for (let i=0;i<7;i++) {			
			objects.lb_cards[i].x=this.cards_pos[i][0];
			objects.lb_cards[i].y=this.cards_pos[i][1];	
			objects.lb_cards[i].place.text=(i+4)+".";			
		}		
		
		this.update();		
	},
	
	close: function() {
							
			
				
		anim2.add(objects.lb_1_cont,{x:[objects.lb_1_cont.x, -450]}, false, 1,'linear');
		anim2.add(objects.lb_2_cont,{x:[objects.lb_2_cont.x, -450]}, false, 1,'linear');
		anim2.add(objects.lb_3_cont,{x:[objects.lb_3_cont.x, -450]}, false, 1,'linear');
		anim2.add(objects.lb_cards_cont,{x:[objects.lb_cards_cont.x, -450]}, false, 1,'linear');			

		//gres.close.sound.play();
		
		
		//показываем меню по выводу игры в меню
		if (this.add_game_to_vk_menu_shown===1)
			return;
		
		if (game_platform==='VK')
			vkBridge.send('VKWebAppAddToFavorites');
		
		this.add_game_to_vk_menu_shown=1;
		
	},
	
	back_button_down: function() {
		
		if (objects.lb_1_cont.ready===false) {
			game_res.resources.locked.sound.play();
			return
		};	
		
		
		game_res.resources.click.sound.play();
		
		this.close();
		main_menu.activate();
		
	},
	
	update: function () {
		
		
		firebase.database().ref("players").orderByChild('record').limitToLast(25).once('value').then((snapshot) => {

		if (snapshot.val()===null) {
			  //console.log("Что-то не получилось получить данные о рейтингах");
			}
			else {

				var players_array = [];
				snapshot.forEach(players_data=> {
					if (players_data.val().name!=="" && players_data.val().name!=='' && players_data.val().name!==undefined)
						players_array.push([players_data.val().name, players_data.val().record, players_data.val().pic_url]);
				});


				players_array.sort(function(a, b) {	return b[1] - a[1];});

				//создаем загрузчик топа
				var loader = new PIXI.Loader();

				var len=Math.min(10,players_array.length);
				
				objects.lb_1_cont.cacheAsBitmap=false;
				objects.lb_2_cont.cacheAsBitmap=false;
				objects.lb_3_cont.cacheAsBitmap=false;

				//загружаем тройку лучших
				for (let i=0;i<3;i++) {
					
					objects['lb_'+(i+1)+'_cont'].cacheAsBitmap=false;
					
					if (i >= len) break;		
					if (players_array[i][0] === undefined) break;	
					
					let fname = players_array[i][0];
					make_text(objects['lb_'+(i+1)+'_name'],fname,180);					
					objects['lb_'+(i+1)+'_balance'].text=players_array[i][1];
					loader.add('leaders_avatar_'+i, players_array[i][2],{loadType: PIXI.LoaderResource.LOAD_TYPE.IMAGE, timeout: 3000});
				};

				//загружаем остальных
				for (let i=3;i<10;i++) {
					
					if (i >= len) break;	
					if (players_array[i][0] === undefined) break;	
					
					let fname=players_array[i][0];

					make_text(objects.lb_cards[i-3].name,fname,180);

					objects.lb_cards[i-3].balance.text=players_array[i][1];
					loader.add('leaders_avatar_'+i, players_array[i][2],{loadType: PIXI.LoaderResource.LOAD_TYPE.IMAGE});
				};

				loader.load();

				//показываем аватар как только он загрузился
				loader.onProgress.add((loader, resource) => {
					let lb_num=Number(resource.name.slice(-1));
					if (lb_num<3) {
						let cont_num = lb_num + 1;
						objects['lb_'+cont_num+'_avatar'].texture=resource.texture;
						objects['lb_'+cont_num+'_cont'].cacheAsBitmap=true;	
						anim2.add(objects['lb_'+cont_num+'_cont'],{x:[-150,objects['lb_'+cont_num+'_cont'].sx]},true,1,'linear');
					}
					else {						
						objects.lb_cards[lb_num-3].avatar.texture=resource.texture;						
					}

				});

			}

		});
		
	}
}

var auth = function() {
		
	return new Promise((resolve, reject)=>{

		let help_obj = {

			loadScript : function(src) {
			  return new Promise((resolve, reject) => {
				const script = document.createElement('script')
				script.type = 'text/javascript'
				script.onload = resolve
				script.onerror = reject
				script.src = src
				document.head.appendChild(script)
			  })
			},

			init: async function() {

				let s = window.location.href;

				//-----------ЯНДЕКС------------------------------------
				if (s.includes("yandex")) {
					await this.loadScript('https://yandex.ru/games/sdk/v2');
					help_obj.yandex();
					return;
				}

				//-----------ВКОНТАКТЕ------------------------------------
				if (s.includes("vk.com")) {
					await this.loadScript('https://unpkg.com/@vkontakte/vk-bridge/dist/browser.min.js');
					help_obj.vk()
					return;
				}


				//-----------ЛОКАЛЬНЫЙ СЕРВЕР--------------------------------
				if (s.includes("192.168")) {
					help_obj.debug();
					return;
				}


				//-----------НЕИЗВЕСТНОЕ ОКРУЖЕНИЕ---------------------------
				help_obj.unknown();

			},

			yandex: async function() {

				game_platform="YANDEX";
				if(typeof(YaGames)==='undefined')
				{
					help_obj.local();
				}
				else
				{
					//если sdk яндекса найден
					let ysdk = await YaGames.init({});

					//фиксируем SDK в глобальной переменной
					window.ysdk=ysdk;

					//запрашиваем данные игрока
					let _player = await ysdk.getPlayer();

					my_data.name 	= _player.getName();
					my_data.uid 	= _player.getUniqueID().replace(/\//g, "Z");
					my_data.pic_url = _player.getPhoto('medium');

					//console.log(`Получены данные игрока от яндекса:\nимя:${my_data.name}\nid:${my_data.uid}\npic_url:${my_data.pic_url}`);

					//если личные данные не получены то берем первые несколько букв айди
					if (my_data.name=="" || my_data.name=='')
						my_data.name=my_data.uid.substring(0,5);

					help_obj.process_results();


				}
			},

			vk: async function() {

				game_platform="VK";
								
				await vkBridge.send('VKWebAppInit');					
				let e = await vkBridge.send('VKWebAppGetUserInfo');
					
				my_data.name 	= e.first_name + ' ' + e.last_name;
				my_data.uid 	= "vk"+e.id;
				my_data.pic_url = e.photo_100;

				help_obj.process_results();		
			},

			debug: function() {

				game_platform = "debug";
				let uid = prompt('Отладка. Введите ID', 100);

				my_data.name = my_data.uid = "debug" + uid;
				my_data.pic_url = "https://sun9-73.userapi.com/impf/c622324/v622324558/3cb82/RDsdJ1yXscg.jpg?size=223x339&quality=96&sign=fa6f8247608c200161d482326aa4723c&type=album";

				help_obj.process_results();

			},

			local: function(repeat = 0) {

				game_platform="YANDEX";

				//ищем в локальном хранилище
				let local_uid = null;
				try {
					local_uid = localStorage.getItem('uid');
				} catch (e) {
					console.log(e);
				}

				//здесь создаем нового игрока в локальном хранилище
				if (local_uid===undefined || local_uid===null) {

					//console.log("Создаем нового локального пользователя");

					let rnd_names=["Бегемот","Жираф","Зебра","Тигр","Ослик","Мамонт","Волк","Лиса","Мышь","Сова","Слон","Енот","Кролик","Бизон","Пантера"];
					let rnd_num=Math.floor(Math.random()*rnd_names.length)
					let rand_uid=Math.floor(Math.random() * 9999999);

					my_data.name 		=	rnd_names[rnd_num]+rand_uid;
					my_data.record 		= 	0;
					my_data.uid			=	"ls"+rand_uid;
					my_data.pic_url		=	'https://avatars.dicebear.com/v2/male/'+irnd(10,10000)+'.svg';


					try {
						localStorage.setItem('uid',my_data.uid);
					} catch (e) {
						console.log(e);
					}
					
					help_obj.process_results();
				}
				else
				{
					//console.log(`Нашли айди в ЛХ (${local_uid}). Загружаем остальное из ФБ...`);
					
					my_data.uid = local_uid;	
					
					//запрашиваем мою информацию из бд или заносим в бд новые данные если игрока нет в бд
					firebase.database().ref("players/"+my_data.uid).once('value').then((snapshot) => {		
									
						var data=snapshot.val();
						
						//если на сервере нет таких данных
						if (data === null) {
													
							//если повтоно нету данных то выводим предупреждение
							if (repeat === 1)
								alert('Какая-то ошибка');
							
							//console.log(`Нашли данные в ЛХ но не нашли в ФБ, повторный локальный запрос...`);	

							
							//повторно запускаем локальный поиск						
							localStorage.clear();
							help_obj.local(1);	
								
							
						} else {						
							
							my_data.pic_url = data.pic_url;
							my_data.name = data.name;
							help_obj.process_results();
						}

					})	

				}


			},

			unknown: function () {

				game_platform="unknown";
				alert("Неизвестная платформа! Кто Вы?")

				//загружаем из локального хранилища
				help_obj.local();
			},

			process_results: function() {


				//отображаем итоговые данные
				//console.log(`Итоговые данные:\nПлатформа:${game_platform}\nимя:${my_data.name}\nid:${my_data.uid}\npic_url:${my_data.pic_url}`);

				//обновляем базовые данные в файербейс так могло что-то поменяться
				firebase.database().ref("players/"+my_data.uid+"/name").set(my_data.name);
				firebase.database().ref("players/"+my_data.uid+"/pic_url").set(my_data.pic_url);
				firebase.database().ref("players/"+my_data.uid+"/tm").set(firebase.database.ServerValue.TIMESTAMP);

				//вызываем коллбэк
				resolve("ok");
			}

		}

		help_obj.init();

	});	
	
}

function resize() {
    const vpw = window.innerWidth;  // Width of the viewport
    const vph = window.innerHeight; // Height of the viewport
    let nvw; // New game width
    let nvh; // New game height

    if (vph / vpw < M_HEIGHT / M_WIDTH) {
      nvh = vph;
      nvw = (nvh * M_WIDTH) / M_HEIGHT;
    } else {
      nvw = vpw;
      nvh = (nvw * M_HEIGHT) / M_WIDTH;
    }
    app.renderer.resize(nvw, nvh);
    app.stage.scale.set(nvw / M_WIDTH, nvh / M_HEIGHT);
}

function vis_change() {

	return;
	
	
		
}

async function load_user_data() {
	
	try {
		
		//анимация лупы
		some_process.loup_anim=function() {
			objects.id_loup.x=20*Math.sin(game_tick*8)+90;
			objects.id_loup.y=20*Math.cos(game_tick*8)+110;
		}
					
		//получаем данные об игроке из социальных сетей
		await auth();
			
		//устанавлием имя на карточки
		make_text(objects.id_name,my_data.name,150);
			
		//ждем пока загрузится аватар
		let loader=new PIXI.Loader();
		loader.add("my_avatar", my_data.pic_url,{loadType: PIXI.LoaderResource.LOAD_TYPE.IMAGE, timeout: 5000});			
		await new Promise((resolve, reject)=> loader.load(resolve))

		//устанаваем аватарку на попап
		objects.id_avatar.texture=loader.resources.my_avatar.texture;
		
		//получаем остальные данные об игроке
		let snapshot = await firebase.database().ref("players/"+my_data.uid).once('value');
		let data = snapshot.val();
		
		//делаем защиту от неопределенности
		data===null ?
			my_data.rating=0 :
			my_data.rating = data.rating || 0;
			
		data===null ?
			my_data.games = 0 :
			my_data.games = data.games || 0;

		//устанавливаем рейтинг в попап
		objects.id_rating.text=my_data.rating;

		//убираем лупу и ее анимацию
		objects.id_loup.visible=false;
		delete some_process.loup_anim;

		//обновляем данные в файербейс так как могли поменяться имя или фото
		firebase.database().ref("players/"+my_data.uid).set({name:my_data.name, pic_url: my_data.pic_url, rating : my_data.rating, games : my_data.games, tm:firebase.database.ServerValue.TIMESTAMP});

		//это событие когда меняется видимость приложения
		document.addEventListener("visibilitychange", vis_change);

		//keep-alive сервис
		setInterval(function()	{keep_alive()}, 40000);

		//указываем что актвиность загрузки завершена
		activity_on=0;
		
		//ждем и убираем попап
		await new Promise((resolve, reject) => setTimeout(resolve, 1000));
		
		anim2.add(objects.id_cont,{y:[objects.id_cont.y, -200]}, false, 1,'easeInBack');
	
	
	} catch (error) {		
		alert (error + ' ' +error.line);		
	}
	
}

async function init_game_env() {
	
	
	//ждем когда загрузятся ресурсы
	await load_resources();

	//убираем загрузочные данные
	document.getElementById("m_bar").outerHTML = "";
	document.getElementById("m_progress").outerHTML = "";

	//короткое обращение к ресурсам
	gres=game_res.resources;

	//инициируем файербейс
	if (firebase.apps.length===0) {
		firebase.initializeApp({
			apiKey: "AIzaSyBYCnloiKvYrEPjjFpRF6RijMSLpNkbTn4",
			authDomain: "words-5bc71.firebaseapp.com",
			databaseURL: "https://words-5bc71-default-rtdb.europe-west1.firebasedatabase.app",
			projectId: "words-5bc71",
			storageBucket: "words-5bc71.appspot.com",
			messagingSenderId: "212398998079",
			appId: "1:212398998079:web:bc647aced6626823d92e8a"
		});
	}

	
	app = new PIXI.Application({width:M_WIDTH, height:M_HEIGHT,antialias:false,backgroundColor : 0x56536D});
	let c = document.body.appendChild(app.view);
	c.style["boxShadow"] = "0 0 15px #000000";
	document.body.style.backgroundColor = 'rgb(' + 32 + ',' + 36 + ',' + 50 + ')';;



	resize();
	window.addEventListener("resize", resize);

    //создаем спрайты и массивы спрайтов и запускаем первую часть кода
    for (var i = 0; i < load_list.length; i++) {
        const obj_class = load_list[i].class;
        const obj_name = load_list[i].name;
		console.log('Processing: ' + obj_name)

        switch (obj_class) {
        case "sprite":
            objects[obj_name] = new PIXI.Sprite(game_res.resources[obj_name].texture);
            eval(load_list[i].code0);
            break;

        case "block":
            eval(load_list[i].code0);
            break;

        case "cont":
            eval(load_list[i].code0);
            break;

        case "array":
			var a_size=load_list[i].size;
			objects[obj_name]=[];
			for (var n=0;n<a_size;n++)
				eval(load_list[i].code0);
            break;
        }
    }

    //обрабатываем вторую часть кода в объектах
    for (var i = 0; i < load_list.length; i++) {
        const obj_class = load_list[i].class;
        const obj_name = load_list[i].name;
		console.log('Processing: ' + obj_name)
		
		
        switch (obj_class) {
        case "sprite":
            eval(load_list[i].code1);
            break;

        case "block":
            eval(load_list[i].code1);
            break;

        case "cont":	
			eval(load_list[i].code1);
            break;

        case "array":
			var a_size=load_list[i].size;
				for (var n=0;n<a_size;n++)
					eval(load_list[i].code1);	;
            break;
        }
    }
		
	//загружаем данные об игроке
	load_user_data();
		
	//показыаем основное меню
	main_menu.activate();
	
	//очищаем клавиатуру
	console.clear()

	//запускаем главный цикл
	main_loop();

}

async function load_resources() {
	
	//это нужно удалить потом
	/*document.body.innerHTML = "Привет!\nДобавляем в игру некоторые улучшения))\nЗайдите через 40 минут.";
	document.body.style.fontSize="24px";
	document.body.style.color = "red";
	return;*/

	git_src="https://akukamil.github.io/6words/"
	//git_src=""


	game_res=new PIXI.Loader();
	game_res.add("m2_font", git_src+"fonts/Neucha/font.fnt");
	game_res.add("m3_font", git_src+"fonts/Muffin/font.fnt");
	

	game_res.add('click',git_src+'/sounds/click.mp3');
	game_res.add('locked',git_src+'/sounds/locked.mp3');
	game_res.add('clock',git_src+'/sounds/clock.mp3');
	game_res.add('close_it',git_src+'/sounds/close_it.mp3');
	game_res.add('game_start',git_src+'/sounds/game_start.mp3');
	game_res.add('lose',git_src+'/sounds/lose.mp3');
	game_res.add('receive_move',git_src+'/sounds/receive_move.mp3');
	game_res.add('bad_word',git_src+'/sounds/bad_word.mp3');
	game_res.add('good_word',git_src+'/sounds/good_word.mp3');
	game_res.add('key_down',git_src+'/sounds/key_down.mp3');
	game_res.add('cell_down',git_src+'/sounds/cell_down.mp3');
	game_res.add('cell_move',git_src+'/sounds/cell_move.mp3');
	game_res.add('bad_move',git_src+'/sounds/bad_move.mp3');
	game_res.add('win',git_src+'/sounds/win.mp3');
	game_res.add('invite',git_src+'/sounds/invite.mp3');
	game_res.add('draw',git_src+'/sounds/draw.mp3');
	
	
    //добавляем из листа загрузки
    for (var i = 0; i < load_list.length; i++)
        if (load_list[i].class === "sprite" || load_list[i].class === "image" )
            game_res.add(load_list[i].name, git_src+"res/" + load_list[i].name + "." +  load_list[i].image_format);		
	
		

	game_res.onProgress.add(progress);
	function progress(loader, resource) {
		document.getElementById("m_bar").style.width =  Math.round(loader.progress)+"%";
	}
	

	
	await new Promise((resolve, reject)=> game_res.load(resolve))

}

function main_loop() {

	//обрабатываем время
	game_tick+=0.016666666;
	
	//обрабатываем анимации
	anim2.process();
	anim3.process();
	
	//обрабатываем минипроцессы
	for (let key in some_process)
		some_process[key]();

	//запрашиваем следующий фрейм
	requestAnimationFrame(main_loop);
}


