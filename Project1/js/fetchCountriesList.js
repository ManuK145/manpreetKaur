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
				allCountriesCodeName.push(data[0]['features'][c]['properties']['name']+"-"+data[0]['features'][c]['properties']['iso_a2']);
			}
			allCountriesCodeName.sort();
			for(let c = 0; c < allCountriesCodeName.length; c++)
			{
				let country = allCountriesCodeName[c].split("-");
				countries.innerHTML += "<option value='"+country[1]+"'>"+country[0]+"</option>";
			}
		});
	}
).catch(function(err) {
	console.log('Fetch Error -', err);
});