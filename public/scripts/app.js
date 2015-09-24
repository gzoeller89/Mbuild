_.templateSettings = {
  interpolate: /\{\{(.+?)\}\}/g
};

var app = {};
app.iconView = Backbone.View.extend({
	initialize: function(){
		this.buildView();
	},
	template: _.template("<div class='therapistIcon'></div><div class='therapistName'>{{name}}</div>"),
	buildView: function(){
		this.$el.html(this.template(this.model.attributes));
		$('.overview').append(this.$el);
	},
	events:{
		'click':'therapistClicked'
	},
	therapistClicked: function(){
		this.model.showTherapist();
	}

});

app.listView = Backbone.View.extend({
	initialize: function(){
		this.buildView();
	},
	events:{
		'click':'therapistClicked'
	},
	template: _.template("{{name}}"),
	buildView: function(){
		this.$el.html(this.template(this.model.attributes));
		$('.therapistList').append(this.$el);
	},
	therapistClicked: function(){
		this.model.showTherapist();
	}
});
app.model = Backbone.Model.extend({
	defaults:{
		time:[],
		pressure:[],
		area:[],
		type:[],
		gender:[]
	},
	initialize:function(){
		this.listView = new app.listView({model:this, className:'therapist'});
		this.iconView = new app.iconView({model:this, className:'therapistIconView'});
	},
	showTherapist: function(){
		this.collection.showTherapist(this);
	},
	match: function(matchIn){
		var self = this;
		var matchOut = {
			name:this.get('name')
		};
		_.each(matchIn, function(match, index){
			switch(index){
				case 'sex':	
					if (match === undefined || self.get('gender').length === 0){
						matchOut.sex = true;
					}else{
						if(self.get('gender').indexOf(match) > -1){
							matchOut.sex = true;
						}else{
							matchOut.sex = false;
						}
					}
					break;
				case 'time':
					if (match === undefined || self.get('time').length === 0){
						matchOut.time = true;
					}else{
						var matchTime = false;
						for(var t = 0; t < match.length; t++){
							if(self.get('time').indexOf(match[t]) > -1){
								matchTime = true;
							}
						}
						matchOut.time = matchTime;
					}
					break;
				case 'area':
					if (match === undefined || self.get('area').length === 0){
						matchOut.area = true;
					}else{
						var matchTime = false;
						for(var t = 0; t < match.length; t++){
							if(self.get('area').indexOf(match[t]) > -1){
								matchTime = true;
							}
						}
						matchOut.area = matchTime;
					}
					break;
				case 'pressure':
				
					if (match === undefined || self.get('pressure').length === 0){
						matchOut.pressure = true;
					}else{
						var matchTime = false;
						for(var t = 0; t < match.length; t++){
							if(self.get('pressure').indexOf(match[t]) > -1){
								matchTime = true;
							}
						}
						matchOut.pressure = matchTime;
					}
					break;
				case 'gender':
					if (match === undefined || self.get('sex').length === 0){
						matchOut.gender = true;
					}else{
						var matchTime = false;
						for(var t = 0; t < match.length; t++){
							if(self.get('sex').indexOf(match[t]) > -1){
								matchTime = true;
							}
						}
						matchOut.gender = matchTime;
					}
					break;
				case 'type':
					if (match === undefined || self.get('type').length === 0){
						matchOut.type = true;
					}else{
						var matchTime = false;
						for(var t = 0; t < match.length; t++){
							if(self.get('type').indexOf(match[t]) > -1){
								matchTime = true;
							}
						}
						matchOut.type = matchTime;
					}
					break;
			}
		});
		return matchOut;
	}
});

app.collection = Backbone.Collection.extend({
	initialize: function(){
		var self = this;
		$('.addTherapist').on('click', function(){
			self.addTherapist();
		});
		$('.submitTherapistQuestionnaire').on('click', function(){
			self.submitTherapist();
		});
		$('.matchClient').on('click',function(){
			self.enterClient();
		});
		$('.submitClientQuestionnaire').on('click',function(){
			self.matchClient();
		});
	},
	model:app.model,
	matchClient:function(){
		var client = {
			sex:_.pluck($('.CsexInput:checked'),'value')[0],
			time: _.pluck($('.CtimeInput:checked'),'value'),
			pressure:_.pluck($('.CpressureInput:checked'),'value'),
			type:_.pluck($('.CtypeInput:checked'),'value'),
			area:_.pluck($('.CareaInput:checked'),'value'),
			gender:_.pluck($('.CgenderInput:checked'),'value')
		};
		this.matchTherapist(client);
	},
	submitTherapist: function(){
		var self = this;
		var therapist = {
			name: $('.nameInput').val(),
			sex:_.pluck($('.sexInput:checked'),'value')[0],
			time: _.pluck($('.timeInput:checked'),'value'),
			pressure:_.pluck($('.pressureInput:checked'),'value'),
			type:_.pluck($('.typeInput:checked'),'value'),
			area:_.pluck($('.areaInput:checked'),'value'),
			gender:_.pluck($('.genderInput:checked'),'value')
		};

		this.add(therapist);

		$.post('therapist',therapist,function(){
			self.clearForm();
		});
	},
	matchTherapist:function(info){
		$('.mainDiv > div').addClass('hidden');
		$('.match').removeClass('hidden').html('<h2 class="tMatchLabel">Best Matches</h2>');

		var matches = [];
		this.each(function(model,index){
			matches.push(model.match(info));
		});	
		var results = [];
		_.each(matches, function(match){
			var total = 0;
			_.each(match, function(val, ind){
				if(ind !== 'name' && val ){
					total++;
				}
			});
			results.push({
				name:match.name,
				total:total
			});

		});
		_.each(_.sortBy(results,'total').reverse(), function(res, rind){
			$('.match').append('<div class = "matchElement"><label>' + res.name + '</label><div>'+ Math.round(res.total/6 * 100) +'/100</div></div');
		});


	},
	clearForm: function(){

	},
	showTherapist:function(model){
		$('.mainDiv > div').addClass('hidden');
		$('.profile').removeClass('hidden');
		$('.profileName').html(model.get('name'));

		var time = (model.get('time').length > 0)?model.get('time').join(','):"No Preference.";
		$('.timeAnswer').html(time);

		var pressure = (model.get('pressure').length > 0)?model.get('pressure').join(','):"No Preference.";
		$('.pressureAnswer').html(pressure);

		var type = (model.get('type').length > 0)?model.get('type').join(','):"No Preference.";
		$('.typeAnswer').html(type);

		var area = (model.get('area').length > 0)?model.get('area').join(','):"No Preference.";
		$('.areaAnswer').html(area);

		var gender = (model.get('gender').length > 0)?model.get('gender').join(','):"No Preference.";
		$('.genderAnswer').html(gender);

	},
	addTherapist: function(){
		$('.mainDiv > div').addClass('hidden');
		$('.therapistQuestionnaire').removeClass('hidden');
	},
	enterClient: function(){
		$('.mainDiv > div').addClass('hidden');
		$('.clientQuestionnaire').removeClass('hidden');
	},
	destroy: function(){

	}
})

app.Router = Backbone.Router.extend({
	routes:{
		'':'overview'
	},
	overview: function(){
		$.get('therapists', function(therapists){
			app.therapists = new app.collection(therapists);
		});
	},
	initialize: function(){
		Backbone.history.start();
	}
})

$(document).ready(function(){
	app.router = new app.Router();
});