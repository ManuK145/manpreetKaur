let position;
function getLocation() {
  if (navigator.geolocation) {
    navigator.geolocation.getCurrentPosition(showPosition);
  } else { 
    x.innerHTML = "Geolocation is not supported by this browser.";
  }
}
function showPosition(position) {
	displayMap(position.coords.latitude,position.coords.longitude);
}
getLocation();
let marker, geojsonFeature, border=null;
function displayMap(lat,lng)
{
	var map = L.map('map').setView([lat,lng],5);
	L.tileLayer('https://tile.openstreetmap.org/{z}/{x}/{y}.png', {
		attribution: '&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a> contributors'
	}).addTo(map);
	marker = L.marker([lat,lng]).addTo(map);
	map.addLayer(marker);
	$.ajax({
		url: "php/getCurrentWeather.php",
		type: 'GET',
		dataType: 'json',
		data: {
			lat: lat,
			lng: lng
		},
		success: function(result) {
			$('#weather').html(result['data']["weather"][0]["main"]);							
			$('#weatherIcon').html('<img src="https://openweathermap.org/img/wn/'+result['data']["weather"][0]["icon"]+'@2x.png" width="30" style="vertical-align: middle;" />');
			$('#temperature').html(result['data']["main"]["temp"]+"&deg;");
			$('#windSpeed').html(result['data']["wind"]["speed"]+"/km");
			$('#humidity').html(result['data']["main"]["humidity"]+"%");
			$.ajax({
				url: "php/getCountryInfo.php",
				type: 'GET',
				dataType: 'json',
				data: {
					country: result["data"]["sys"]["country"]
				},
				success: function(result) {
					$('#countryName').html(result['data'][0]['countryName']);
					$('#countryCode').html(result['data'][0]['countryCode']);
					$('#population').html(result['data'][0]['population']);
					$('#capital').html(result['data'][0]['capital']);
					$('#continentName').html(result['data'][0]['continentName']);
					$.ajax({
						url: "php/getCountryBorder.php",
						type: 'GET',
						dataType: 'json',
						data: {
							iso: result['data'][0]['countryCode']
						},
						success: function(result) {
							if(border)
							border.clearLayers();
							geojsonFeature=result['data'];
							border= L.geoJSON(geojsonFeature).addTo(map);
						},
						error: function(jqXHR, textStatus, errorThrown) {
							console.log(textStatus, errorThrown);
						}
					});
					$.ajax({
						url: "php/getCurrencyData.php",
						type: 'GET',
						dataType: 'json',
						data: {
							countryCode: result['data'][0]['countryCode']
						},
						success: function(result2) {
							$('#currencyName').html(result2['data'][0]['currencies'][result['data'][0]['currencyCode']]["name"]);
							$('#currencyCode').html(result['data'][0]['currencyCode']);
							$('#countryFlag').html(result2['data'][0]['flag']);
							$('#currencySymbol').html(result2['data'][0]['currencies'][result['data'][0]['currencyCode']]["symbol"]);
						},
						error: function(jqXHR, textStatus, errorThrown) {
							console.log(textStatus, errorThrown);
						}
					});
				},
				error: function(jqXHR, textStatus, errorThrown) {
					console.log(textStatus, errorThrown);
				}
			});
		},
		error: function(jqXHR, textStatus, errorThrown) {
			console.log(textStatus, errorThrown);
		}
	});	
	$("#countries").change(function() {
		$.ajax({
			url: "php/getCountryInfo.php",
			type: 'GET',
			dataType: 'json',
			data: {
				country: this.value
			},
			success: function(result) {
				map.removeLayer(marker);
				$('#countryName').html(result['data'][0]['countryName']);
				$('#countryCode').html(result['data'][0]['countryCode']);
				$('#population').html(result['data'][0]['population']);
				$('#capital').html(result['data'][0]['capital']);
				$('#continentName').html(result['data'][0]['continentName']);
				$.ajax({
					url: "php/getCountryBorder.php",
					type: 'GET',
					dataType: 'json',
					data: {
						iso: result['data'][0]['countryCode']
					},
					success: function(result) {
						if(border)
						border.clearLayers();
						geojsonFeature=result['data'];
						border=L.geoJSON(geojsonFeature).addTo(map);
					},
					error: function(jqXHR, textStatus, errorThrown) {
						console.log(textStatus, errorThrown);
					}
				});
				$.ajax({
					url: "php/getCurrencyData.php",
					type: 'GET',
					dataType: 'json',
					data: {
						countryCode: result['data'][0]['countryCode']
					},
					success: function(result1) {
						$('#currencyName').html(result1['data'][0]['currencies'][result['data'][0]['currencyCode']]["name"]);
						$('#currencyCode').html(result['data'][0]['currencyCode']);
						$('#countryFlag').html(result1['data'][0]['flag']);
						$('#currencySymbol').html(result1['data'][0]['currencies'][result['data'][0]['currencyCode']]["symbol"]);
						map.setView([result1['data'][0]['latlng'][0],result1['data'][0]['latlng'][1]],5);
						marker = L.marker([result1['data'][0]['latlng'][0],result1['data'][0]['latlng'][1]]).addTo(map);
						map.addLayer(marker);
						var requestOptions = {
						  method: 'GET',
						  redirect: 'follow',
						  dataType: 'JSON'
						};
						$.ajax({
							url: "php/getCapitalCurrentWeather.php",
							type: 'GET',
							dataType: 'json',
							data: {
								countryCapital: result['data'][0]['capital']
							},
							success: function(result2) {
								$('#weather').html(result2['data']["weather"][0]["main"]);						
								$('#weatherIcon').html('<img src="https://openweathermap.org/img/wn/'+result2['data']["weather"][0]["icon"]+'@2x.png" width="30" style="vertical-align: middle;" />');
								$('#temperature').html(result2['data']["main"]["temp"]+"&deg;");
								$('#windSpeed').html(result2['data']["wind"]["speed"]+"/km");
								$('#humidity').html(result2['data']["main"]["humidity"]+"%");
							},
							error: function(jqXHR, textStatus, errorThrown) {
								console.log(textStatus, errorThrown);
							}
						});
					},
					error: function(jqXHR, textStatus, errorThrown) {
						console.log(textStatus, errorThrown);
					}
				});
			},
			error: function(jqXHR, textStatus, errorThrown) {
				console.log(textStatus, errorThrown);
			}
		});
	});
}