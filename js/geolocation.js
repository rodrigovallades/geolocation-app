// ================================================
// Note to candidate:
//	This code has bad practices
//	feel free to replace it with a better solution
// ================================================

var API_HOST = "freegeoip.net";

function updateLocationDetails(data){
	var now = new Date();

	$("#location_query").html(data.ip);
	$("#location_country").html(data.country_name);
	$("#location_regionName").html(data.region_name);
	$("#location_city").html(data.city);
	$("#location_zip_code").html( data.zip_code);
	$("#location_lat").html(data.latitude);
	$("#location_lon").html(data.longitude);

	$("table").removeClass("empty");
	$(".help").click(function(e){
		var fieldName = $(e.currentTarget).closest('tr').find('.field_name').text();
		alert( "This is your " + fieldName + " according to " + API_HOST + " at " + now );
	});
}

function getMyLocation() {
	$.ajax({
		type : 'GET',
		url : 'http://' + API_HOST + '/json/',
		success : function(response){
			updateLocationDetails(response);
		}
	});
}

function resetLocationDetails() {
	updateLocationDetails({
		ip: "0.0.0.0",
		country_name: "",
		region_name: "",
		city: "",
		zip_code: "",
		latitude: "",
		longitude: ""
	});
	$("table").addClass("empty");
}

function initializePage(){
	window.indexTemplate = $('#index').html();
	window.locationTemplate = $('#locationInfo').html();

	window.indexTemplate = Handlebars.compile(window.indexTemplate);
	window.locationTemplate = Handlebars.compile(window.locationTemplate);

	$("#mainContent").html(window.indexTemplate());
	$("#geoLocationContainer").html(window.locationTemplate({
		id: 0,
		ip: "0.0.0.0",
		country_name: "",
		region_name: "",
		city: "",
		zip_code: "",
		latitude: "",
		longitude: ""
	}));
}

$(document).ready(function(){
	initializePage();
});
