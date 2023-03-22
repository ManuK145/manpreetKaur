let countryBorders = 'countryBorders.geo.json';
let countries = document.getElementById("countries");
countries.innerHTML = "<option value=''>Select Country</option>";
fetch(countryBorders).then(
	function(response){
		if(response.status !== 200) {
			console.log('Looks like there was a problem. Status Code: ' + response.status);
			return;
		}
		response.json().then(function(data){
			for(let c = 0; c < data[0]['features'].length; c++)
			{
				countries.innerHTML += "<option value='"+data[0]['features'][c]['properties']['iso_a2']+"'>"+data[0]['features'][c]['properties']['name']+"</option>";
			}
		});
	}
).catch(function(err) {
	console.log('Fetch Error -', err);
});