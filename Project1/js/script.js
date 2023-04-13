let map, markerCapitalGroup, markerNeighbourGroup, markerEarthquakeGroup, position, marker, geojsonFeature, border = null, covidCountry, activeCases, confirmCases, deaths;
let geonameid, currentTemp, weatherIcon, humidity, windspeed, tempMin, tempMax;
let population, areainsqkm, countryCodeISO2, countryCodeISO3, countryDomain, capital, countryName, countryCode, countryFlag, northPoint, southPoint, eastPoint, westPoint, continentName, currencyName, currencySymbol, currencyCode, wikipediaInfo, allLanguages = [], allHolidays = [], allHolidaysDate = [];
let newsTitle, newsDescription, newsLink, newsKeyword, newsCategory, newsPublishDate;
let unescoLayerGroup = L.markerClusterGroup();
let iconCapitalOptions = {
	iconUrl: 'images/capital.png',
	iconSize: [40,40]
}
let customCapitalIcon = L.icon(iconCapitalOptions);
let markerCapitalOptions = {
	title: "CapitalLocation",
	clickable: true,
	icon: customCapitalIcon
}

let iconAirportsOptions = {
	iconUrl: 'images/airport.png',
	iconSize: [40,40]
}
let customAirportsIcon = L.icon(iconAirportsOptions);
let markerAirportsOptions = {
	title: "AirportLocation",
	clickable: true,
	icon: customAirportsIcon
}

let iconNeighboursOptions = {
	iconUrl: 'images/neighbours.png',
	iconSize: [40,40]
}
let customNeighboursIcon = L.icon(iconNeighboursOptions);
let markerNeighboursOptions = {
	title: "NeighbourLocation",
	clickable: true,
	icon: customNeighboursIcon
}

let iconEarthquakeOptions = {
	iconUrl: 'images/earthquake.png',
	iconSize: [40,40]
}
let customEarthquakeIcon = L.icon(iconEarthquakeOptions);
let markerEarthquakeOptions = {
	title: "EarthquakeLocation",
	clickable: true,
	icon: customEarthquakeIcon
}
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
function polystyle(feature) {
    return {
        fillColor: 'green',
        weight: 2,
        opacity: 1,
        color: 'orange',
        fillOpacity: 0.2
    };
}

function displayMap(lat,lng)
{
	var map = L.map('map').setView([lat,lng],5);
	markerCapitalGroup = L.layerGroup().addTo(map);
	L.tileLayer('https://tile.openstreetmap.org/{z}/{x}/{y}.png', {
		attribution: '&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a> contributors'
	}).addTo(map);
	marker = L.marker([lat,lng],markerCapitalOptions).addTo(markerCapitalGroup);
	map.addLayer(marker);
	
	$.ajax({
		url: "php/getCurrentCapital.php",
		type: 'GET',
		dataType: 'json',
		data: {
			lat: lat,
			lng: lng
		},
		success: function(result) {
			countryCode = result["data"]["sys"]["country"];
			$.ajax({
				url: "php/getHolidays.php",
				type: 'GET',
				dataType: 'json',
				data: {
					countryCode: countryCode
				},
				success: function(result) {
					for(let h = 0; h < result['data']['response']['holidays'].length; h++)
					{
						allHolidays.push(result['data']['response']['holidays'][h]['name']);
						allHolidaysDate.push(result['data']['response']['holidays'][h]['date']['iso']);
					}
					for(let i = 0; i < allHolidays.length; i++)
					{
						document.getElementById("holidaysList").innerHTML += "<div class='holiday'>"+allHolidays[i]+" - "+allHolidaysDate[i]+"</div>";						
					}
				},
				error: function(jqXHR, textStatus, errorThrown) {
					console.log(textStatus, errorThrown);
				}
			});
			$.ajax({
				url: "php/getAirports.php",
				type: 'GET',
				dataType: 'json',
				data: {
					countryCode: countryCode
				},
				success: function(result) {
					markerAirportGroup = L.layerGroup().addTo(map);
					for(let i = 0; i < 10; i++)
					{						
						marker = L.marker([result['data']['response'][i]['lat'],result['data']['response'][i]['lng']],markerAirportsOptions).addTo(markerAirportGroup);
						map.addLayer(marker);
						marker.bindPopup(result['data']['response'][i]['name']+" - "+result['data']['response'][i]['iata_code']);		
					}
					for(let i = 0; i < result['data']['response'].length; i++)
					{
						document.getElementById("airportsList").innerHTML += "<div class='airports'>"+result['data']['response'][i]['name']+" - "+result['data']['response'][i]['iata_code']+"</div>";
					}
				},
				error: function(jqXHR, textStatus, errorThrown) {
					console.log(textStatus, errorThrown);
				}
			});
			$.ajax({
				url: "php/getNews.php",
				type: 'GET',
				dataType: 'json',
				data: {
					countryCode: countryCode
				},
				success: function(result) {
					newsTitle = result['data']['results'][0]['title'];
					newsLink = result['data']['results'][0]['link'];
					newsDescription = result['data']['results'][0]['description'];
					newsCategory = result['data']['results'][0]['category'][0];
					newsPublishDate = result['data']['results'][0]['pubDate'];
					$('#txtTitle1').html("<a style='text-decoration: none;' target='_blank' href='"+newsLink+"'>"+newsTitle+"</a>");
					$('#txtDescription1').html(newsDescription);
					$('#txtCategory1').html(newsCategory);
					$('#txtPublishDate1').html(newsPublishDate);
					newsTitle = result['data']['results'][1]['title'];
					newsLink = result['data']['results'][1]['link'];
					newsDescription = result['data']['results'][1]['description'];
					newsCategory = result['data']['results'][1]['category'][0];
					newsPublishDate = result['data']['results'][1]['pubDate'];
					$('#txtTitle2').html("<a style='text-decoration: none;' target='_blank' href='"+newsLink+"'>"+newsTitle+"</a>");
					$('#txtDescription2').html(newsDescription);
					$('#txtCategory2').html(newsCategory);
					$('#txtPublishDate2').html(newsPublishDate);
					newsTitle = result['data']['results'][2]['title'];
					newsLink = result['data']['results'][2]['link'];
					newsDescription = result['data']['results'][2]['description'];
					newsCategory = result['data']['results'][2]['category'][0];
					newsPublishDate = result['data']['results'][2]['pubDate'];
					$('#txtTitle3').html("<a style='text-decoration: none;' target='_blank' href='"+newsLink+"'>"+newsTitle+"</a>");
					$('#txtDescription3').html(newsDescription);
					$('#txtCategory3').html(newsCategory);
					$('#txtPublishDate3').html(newsPublishDate);
				},
				error: function(jqXHR, textStatus, errorThrown) {
					console.log(textStatus, errorThrown);
				}
			});
			$.ajax({
				url: "php/getCountryBorder.php",
				type: 'GET',
				dataType: 'json',
				data: {
					iso: countryCode
				},
				success: function(result) {
					if(border)
						border.clearLayers();
					geojsonFeature = result['data'];
					border = L.geoJSON(geojsonFeature,{style: polystyle}).addTo(map);
					$.ajax({
						url: "php/getCountryInfo.php",
						type: 'GET',
						dataType: 'json',
						data: {
							country: countryCode
						},
						success: function(result) {
							geonameid = result['data'][0]['geonameId'];
							capital = result['data'][0]['capital'];
							population = result['data'][0]['population'];
							areainsqkm = result['data'][0]['areaInSqKm'];
							countryName = result['data'][0]['countryName'];
							continentName = result['data'][0]['continentName'];
							currencyCode = result['data'][0]['currencyCode'];
							northPoint = result['data'][0]['north'];
							southPoint = result['data'][0]['south'];
							eastPoint = result['data'][0]['east'];
							westPoint = result['data'][0]['west'];
							$('#infoModalLabel').html(countryName);
							$('.txtCapitalName').html(capital);
							$('#txtAreaInSqKm').html(areainsqkm);
							$('#txtCapital').html(capital);
							$('#txtPopulation').html(population);
							$('#txtCurrencyCode').html(currencyCode);
							$.ajax({
								url: "php/getNeighbours.php",
								type: 'GET',
								dataType: "json",
								data: {
									geonameId: geonameid
								},
								success: function(result) {
									markerNeighbourGroup = L.layerGroup().addTo(map);
									for(let m = 0; m < result['data']['geonames'].length; m++)
									{
										marker = L.marker([result['data']['geonames'][m]['lat'],result['data']['geonames'][m]['lng']],markerNeighboursOptions).addTo(markerNeighbourGroup);
										map.addLayer(marker);
										marker.bindPopup("Name : "+result['data']['geonames'][m]['name']+"<br>Country Name : "+result['data']['geonames'][m]['countryName']+"<br>Latitude : "+result['data']['geonames'][m]['lat']+"<br>Longitude : "+result['data']['geonames'][m]['lng']);
									}
								},
								error: function(jqXHR, textStatus, errorThrown) {
									console.log('Unesco Data Error',textStatus, errorThrown);
								}
							});
							$.ajax({
								url: "php/getUnesco.php",
								type: 'GET',
								dataType: "json",
								data: {
									countryName: countryName
								},
								success: function(result) {
									unescoNumber = result.data.unescoSites.nhits;
									map.addLayer(unescoLayerGroup);
									if (unescoNumber < 1)
									{
										$('#unescoModal').modal('show');
										map.addLayer(largeCityCluster);
										map.addLayer(cityMarkersCluster);
									}
									else if (unescoNumber > 0)
									{
										for (let i = 0; i < result.data.unescoSites.records.length; i++)
										{
											unescoIcon = L.icon({
												iconUrl: 'images/unesco.svg',
												iconSize: [50, 50],
												popupAnchor: [0,-15]
											});
											unescoSite = result.data.unescoSites.records[i].fields.site;
											unescoLat = result.data.unescoSites.records[i].fields.coordinates[0];
											unescoLng = result.data.unescoSites.records[i].fields.coordinates[1];
											unescoThumbnail = result.data.unescoSites.records[i].fields.image_url.filename;
											unsescoDescription = result.data.unescoSites.records[i].fields.short_description;
											unescoUrl = `https://whc.unesco.org/en/list/${result.data.unescoSites.records[i].fields.id_number}`;
											unescoMarker = L.marker(new L.LatLng(unescoLat, unescoLng), ({icon: unescoIcon})).bindPopup(`<div class="markerContainer"><h3>${unescoSite}</h3><img class="markerThumbnail" src='https://whc.unesco.org/uploads/sites/${unescoThumbnail}'><p class="markerTxtDescription">${unsescoDescription}</p></div><div id="city-link"><a href="${unescoUrl}" target="_blank">Learn more</a></div>`, {
												maxWidth : 300
											});
											unescoLayerGroup.addLayer(unescoMarker);
										}
									};
								},
								error: function(jqXHR, textStatus, errorThrown) {
									console.log('Unesco Data Error',textStatus, errorThrown);
								}
							});

							$.ajax({
								url: "php/getEarthquakes.php",
								type: 'GET',
								dataType: 'json',
								data: {
									north: northPoint,
									south: southPoint,
									east: eastPoint,
									west: westPoint
								},
								success: function(result) {
									markerEarthquakeGroup = L.layerGroup().addTo(map);
									for(let m = 0; m < result['data']['earthquakes'].length; m++)
									{
										marker = L.marker([result['data']['earthquakes'][m]['lat'],result['data']['earthquakes'][m]['lng']],markerEarthquakeOptions).addTo(markerEarthquakeGroup);
										map.addLayer(marker);
										marker.bindPopup("Earthquake Depth : "+result['data']['earthquakes'][m]['depth']+"<br>Latitude : "+result['data']['earthquakes'][m]['lat']+"<br>Longitude : "+result['data']['earthquakes'][m]['lng']);
									}
								},
								error: function(jqXHR, textStatus, errorThrown) {
									console.log(textStatus, errorThrown);
								}
							});
										
							$.ajax({
								url: "php/getCapitalWeather.php",
								type: 'GET',
								dataType: 'json',
								data: {
									capital: capital
								},
								success: function(result) {
									weatherIcon = result['data']['weather'][0]['icon'];
									currentTemp = result['data']['main']['temp'];
									currentWeather = result['data']['weather'][0]['main'];
									windspeed = result['data']['wind']['speed'];
									humidity = result['data']['main']['humidity'];
									tempMin = result['data']['main']['temp_min'];
									tempMax = result['data']['main']['temp_max'];
									if(currentWeather == "Haze")
										document.querySelector("#weatherModal .modal-dialog .modal-content").style.background = "url('images/haze.jpg')";
									else if(currentWeather == "Mist")
										document.querySelector("#weatherModal .modal-dialog .modal-content").style.background = "url('images/mist.jpg')";
									else if(currentWeather == "Clear")
										document.querySelector("#weatherModal .modal-dialog .modal-content").style.background = "url('images/sky.jpg')";
									else if(currentWeather == "Rain")
										document.querySelector("#weatherModal .modal-dialog .modal-content").style.background = "url('images/rainy.jpg')";
									else if(currentWeather == "Snow")
										document.querySelector("#weatherModal .modal-dialog .modal-content").style.background = "url('images/snow.jpg')";
									else if(currentWeather == "Ash")
										document.querySelector("#weatherModal .modal-dialog .modal-content").style.background = "url('images/ash.jpg')";
									else if(currentWeather == "Tornado")
										document.querySelector("#weatherModal .modal-dialog .modal-content").style.background = "url('images/tornado.jpg')";
									else if(currentWeather == "Squall")
										document.querySelector("#weatherModal .modal-dialog .modal-content").style.background = "url('images/squall.jpg')";
									else if(currentWeather == "Sand")
										document.querySelector("#weatherModal .modal-dialog .modal-content").style.background = "url('images/sand.jpg')";
									else if(currentWeather == "Fog")
										document.querySelector("#weatherModal .modal-dialog .modal-content").style.background = "url('images/fog.jpg')";
									else if(currentWeather == "Dust")
										document.querySelector("#weatherModal .modal-dialog .modal-content").style.background = "url('images/dust.jpg')";
									else if(currentWeather == "Drizzle")
										document.querySelector("#weatherModal .modal-dialog .modal-content").style.background = "url('images/drizzle.jpg')";
									else if(currentWeather == "Thunderstorm")
										document.querySelector("#weatherModal .modal-dialog .modal-content").style.background = "url('images/thunderstorm.jpg')";
									else if(currentWeather == "Clouds")
										document.querySelector("#weatherModal .modal-dialog .modal-content").style.background = "url('images/clouds.jpg')";
										else if(currentWeather == "Smoke")
										document.querySelector("#weatherModal .modal-dialog .modal-content").style.background = "url('images/smoke.jpg')";
									$('#CapitalWeatherIcon').html('<img src="https://openweathermap.org/img/wn/'+weatherIcon+'@2x.png" width="24px">');
									$('#txtCapitalWeatherTemp').html(currentTemp+"&deg;");	
									$('#txtCapitalWeatherCurrent').html(currentTemp+"&deg;");			
									$('#txtCapitalWeatherWindspeed').html(windspeed+" km/h");
									$('#txtCapitalWeatherHumidity').html(humidity+"%");
									$('#txtCapitalWeatherMax').html(tempMax+"&deg;");
									$('#txtCapitalWeatherMin').html(tempMin+"&deg;");
									$('#CapitalHumidityIcon').html('<img src="images/humidity.svg" width="24px">');
									$('#CapitalWindIcon').html('<img src="images/007-windy.svg" width="24px">');
									$('.CapitalHiTempIcon').html('<img src="images/temperatureHi.svg" width="24px">');
									$('.CapitalLoTempIcon').html('<img src="images/temperatureLo.svg" width="24px">');
								},
								error: function(jqXHR, textStatus, errorThrown) {
									console.log(textStatus, errorThrown);
								}
							});
							$.ajax({
								url: "php/getWikipediaInfo.php",
								type: 'GET',
								dataType: 'json',
								data: {
									countryName: countryName
								},
								success: function(result) {
									wikipediaInfo = result['data']['extract_html'];
									wikipediaLink = result['data']['content_urls']['desktop']['page'];
									$('#txtWiki').html('<b>Wikipedia: <a target="_blank" href="'+wikipediaLink+'">'+countryName+'</a></b>'+wikipediaInfo);
								},
								error: function(jqXHR, textStatus, errorThrown) {
									console.log(textStatus, errorThrown);
								}
							});
							$.ajax({
								url: "php/getCovidCountryList.php",
								type: 'GET',
								dataType: 'json',
								data: { },
								success: function(result) {
									for(let c = 0; c < result['data'].length; c++)
									{
										if(result['data'][c]['Country'] == countryName)
										{
											covidCountry = result['data'][c]['Country'];
											$.ajax({
												url: "php/getCovidData.php",
												type: 'GET',
												dataType: 'json',
												data: {
													country: covidCountry
												},
												success: function(result) {
													activeCases = result['data'][result['data'].length-1]['Active'];
													confirmCases = result['data'][result['data'].length-1]['Confirmed'];
													deaths = result['data'][result['data'].length-1]['Deaths'];
													$('#txtConfirmedCases').html(confirmCases);
													$('#txtActiveCases').html(activeCases);
													$('#txtDeaths').html(deaths);
												},
												error: function(jqXHR, textStatus, errorThrown) {
													console.log(textStatus, errorThrown);
												}
											});
											break;
										}
									}
								},
								error: function(jqXHR, textStatus, errorThrown) {
									console.log(textStatus, errorThrown);
								}
							});

							$.ajax({
								url: "php/getCurrencyConvert.php",
								type: 'GET',
								dataType: 'json',
								data: {
									currencyCode: currencyCode
								},
								success: function(result) {
									currencyConversion = result['data'];
									$("#txtExchangeRate").html("1 USD = "+currencyConversion+" "+currencyCode);
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
									countryCode: countryCode
								},
								success: function(result) {
									currencyName = result['data'][0]['currencies'][currencyCode]["name"];
									currencySymbol = result['data'][0]['currencies'][currencyCode]["symbol"];
									countryDomain = result['data'][0]['tld'];
									countryCodeISO2 = result['data'][0]['cca2'];
									countryCodeISO3 = result['data'][0]['cca3'];
									languages = result['data'][0]['languages'];
									allLanguages = [];
									for(let l in languages)
										allLanguages.push(languages[l]);
									countryFlag = result['data'][0]['flags']['png'];
									$('#txtWikiImg').html("<img id='flag' src='"+countryFlag+"'><br>");
									$('#txtCurrency').html(currencyName);
									$('#txtLanguages').html(allLanguages.toString());
									$('#txtDomain').html(countryDomain);
									$('#txtIso2').html(countryCodeISO2);
									$('#txtIso3').html(countryCodeISO3);
									$('#txtCurrencySymbol').html(currencySymbol);
									
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
		},
		error: function(jqXHR, textStatus, errorThrown) {
			console.log(textStatus, errorThrown);
		}
	});
	
	$("#countries").change(function() {
		countryCode = this.value;
		map.removeLayer(markerCapitalGroup);
		map.removeLayer(markerAirportGroup);
		map.removeLayer(markerNeighbourGroup);
		map.removeLayer(markerEarthquakeGroup);		
		map.removeLayer(unescoLayerGroup);		
		allHolidays = [];
		allHolidaysDate = [];
		$.ajax({
			url: "php/getHolidays.php",
			type: 'GET',
			dataType: 'json',
			data: {
				countryCode: countryCode
			},
			success: function(result) {
				document.getElementById("holidaysList").innerHTML = "";
				for(let h = 0; h < result['data']['response']['holidays'].length; h++)
				{
					allHolidays.push(result['data']['response']['holidays'][h]['name']);
					allHolidaysDate.push(result['data']['response']['holidays'][h]['date']['iso']);
				}
				for(let i = 0; i < allHolidays.length; i++)
				{
					document.getElementById("holidaysList").innerHTML += "<div class='holiday'>"+allHolidays[i]+" - "+allHolidaysDate[i]+"</div>";						
				}
			},
			error: function(jqXHR, textStatus, errorThrown) {
				console.log(textStatus, errorThrown);
			}
		});
		$.ajax({
			url: "php/getAirports.php",
			type: 'GET',
			dataType: 'json',
			data: {
				countryCode: countryCode
			},
			success: function(result) {
				document.getElementById("airportsList").innerHTML = "";
				markerAirportGroup = L.layerGroup().addTo(map);
				for(let i = 0; i < 10; i++)
				{
					marker = L.marker([result['data']['response'][i]['lat'],result['data']['response'][i]['lng']],markerAirportsOptions).addTo(markerAirportGroup);
					map.addLayer(marker);
					marker.bindPopup(result['data']['response'][i]['name']+" - "+result['data']['response'][i]['iata_code']);
				}
				for(let i = 0; i < result['data']['response'].length; i++)
				{
					document.getElementById("airportsList").innerHTML += "<div class='airports'>"+result['data']['response'][i]['name']+" - "+result['data']['response'][i]['iata_code']+"</div>";
				}
			},
			error: function(jqXHR, textStatus, errorThrown) {
				console.log(textStatus, errorThrown);
			}
		});
		$.ajax({
			url: "php/getCountryBorder.php",
			type: 'GET',
			dataType: 'json',
			data: {
				iso: countryCode
			},
			success: function(result) {
				if(border)
					border.clearLayers();
				geojsonFeature = result['data'];
				border = L.geoJSON(geojsonFeature,{style: polystyle}).addTo(map);
				$.ajax({
					url: "php/getCountryInfo.php",
					type: 'GET',
					dataType: 'json',
					data: {
						country: countryCode
					},
					success: function(result) {
						geonameid = result['data'][0]['geonameId'];
						capital = result['data'][0]['capital'];
						population = result['data'][0]['population'];
						areainsqkm = result['data'][0]['areaInSqKm'];
						countryName = result['data'][0]['countryName'];
						continentName = result['data'][0]['continentName'];
						currencyCode = result['data'][0]['currencyCode'];
						northPoint = result['data'][0]['north'];
						southPoint = result['data'][0]['south'];
						eastPoint = result['data'][0]['east'];
						westPoint = result['data'][0]['west'];
						$('#infoModalLabel').html(countryName);
						$('.txtCapitalName').html(capital);
						$('#txtAreaInSqKm').html(areainsqkm);
						$('#txtCapital').html(capital);
						$('#txtPopulation').html(population);
						$('#txtCurrencyCode').html(currencyCode);
						$.ajax({
							url: "php/getNeighbours.php",
							type: 'GET',
							dataType: "json",
							data: {
								geonameId: geonameid
							},
							success: function(result) {
								markerNeighbourGroup = L.layerGroup().addTo(map);
								for(let m = 0; m < result['data']['geonames'].length; m++)
								{
									marker = L.marker([result['data']['geonames'][m]['lat'],result['data']['geonames'][m]['lng']],markerNeighboursOptions).addTo(markerNeighbourGroup);
									map.addLayer(marker);
									marker.bindPopup("Name : "+result['data']['geonames'][m]['name']+"<br>Country Name : "+result['data']['geonames'][m]['countryName']+"<br>Latitude : "+result['data']['geonames'][m]['lat']+"<br>Longitude : "+result['data']['geonames'][m]['lng']);
								}
							},
							error: function(jqXHR, textStatus, errorThrown) {
								console.log('Unesco Data Error',textStatus, errorThrown);
							}
						});
						$.ajax({
							url: "php/getUnesco.php",
							type: 'GET',
							dataType: "json",
							data: {
								countryName: countryName
							},
							success: function(result) {
								unescoNumber = result.data.unescoSites.nhits;
								map.addLayer(unescoLayerGroup);
								if (unescoNumber < 1)
								{
									$('#unescoModal').modal('show');
									map.addLayer(largeCityCluster);
									map.addLayer(cityMarkersCluster);
								}
								else if (unescoNumber > 0)
								{
									for (let i = 0; i < result.data.unescoSites.records.length; i++)
									{
										unescoIcon = L.icon({
											iconUrl: 'images/unesco.svg',
											iconSize: [50, 50],
											popupAnchor: [0,-15]
										});
										unescoSite = result.data.unescoSites.records[i].fields.site;
										unescoLat = result.data.unescoSites.records[i].fields.coordinates[0];
										unescoLng = result.data.unescoSites.records[i].fields.coordinates[1];
										unescoThumbnail = result.data.unescoSites.records[i].fields.image_url.filename;
										unsescoDescription = result.data.unescoSites.records[i].fields.short_description;
										unescoUrl = `https://whc.unesco.org/en/list/${result.data.unescoSites.records[i].fields.id_number}`;
										unescoMarker = L.marker(new L.LatLng(unescoLat, unescoLng), ({icon: unescoIcon})).bindPopup(`<div class="markerContainer"><h3>${unescoSite}</h3><img class="markerThumbnail" src='https://whc.unesco.org/uploads/sites/${unescoThumbnail}'><p class="markerTxtDescription">${unsescoDescription}</p></div><div id="city-link"><a href="${unescoUrl}" target="_blank">Learn more</a></div>`, {
											maxWidth : 300
										});
										unescoLayerGroup.addLayer(unescoMarker);
									}
								};
							},
							error: function(jqXHR, textStatus, errorThrown) {
								console.log('Unesco Data Error',textStatus, errorThrown);
							}
						});
						$.ajax({
							url: "php/getEarthquakes.php",
							type: 'GET',
							dataType: 'json',
							data: {
								north: northPoint,
								south: southPoint,
								east: eastPoint,
								west: westPoint
							},
							success: function(result) {
								markerEarthquakeGroup = L.layerGroup().addTo(map);
								for(let m = 0; m < result['data']['earthquakes'].length; m++)
								{
									marker = L.marker([result['data']['earthquakes'][m]['lat'],result['data']['earthquakes'][m]['lng']],markerEarthquakeOptions).addTo(markerEarthquakeGroup);
									map.addLayer(marker);
									marker.bindPopup("Earthquake Depth : "+result['data']['earthquakes'][m]['depth']+"<br>Latitude : "+result['data']['earthquakes'][m]['lat']+"<br>Longitude : "+result['data']['earthquakes'][m]['lng']);
								}
							},
							error: function(jqXHR, textStatus, errorThrown) {
								console.log(textStatus, errorThrown);
							}
						});
						$.ajax({
							url: "php/getCapitalWeather.php",
							type: 'GET',
							dataType: 'json',
							data: {
								capital: capital
							},
							success: function(result1) {
								weatherIcon = result1['data']['weather'][0]['icon'];
								currentTemp = result1['data']['main']['temp'];
								currentWeather = result1['data']['weather'][0]['main'];
								windspeed = result1['data']['wind']['speed'];
								humidity = result1['data']['main']['humidity'];
								tempMin = result1['data']['main']['temp_min'];
								tempMax = result1['data']['main']['temp_max'];
								if(currentWeather == "Haze")
									document.querySelector("#weatherModal .modal-dialog .modal-content").style.background = "url('images/haze.jpg')";
								else if(currentWeather == "Mist")
									document.querySelector("#weatherModal .modal-dialog .modal-content").style.background = "url('images/mist.jpg')";
								else if(currentWeather == "Clear")
									document.querySelector("#weatherModal .modal-dialog .modal-content").style.background = "url('images/sky.jpg')";
								else if(currentWeather == "Rain")
									document.querySelector("#weatherModal .modal-dialog .modal-content").style.background = "url('images/rainy.jpg')";
								else if(currentWeather == "Snow")
									document.querySelector("#weatherModal .modal-dialog .modal-content").style.background = "url('images/snow.jpg')";
								else if(currentWeather == "Ash")
									document.querySelector("#weatherModal .modal-dialog .modal-content").style.background = "url('images/ash.jpg')";
								else if(currentWeather == "Tornado")
									document.querySelector("#weatherModal .modal-dialog .modal-content").style.background = "url('images/tornado.jpg')";
								else if(currentWeather == "Squall")
									document.querySelector("#weatherModal .modal-dialog .modal-content").style.background = "url('images/squall.jpg')";
								else if(currentWeather == "Sand")
									document.querySelector("#weatherModal .modal-dialog .modal-content").style.background = "url('images/sand.jpg')";
								else if(currentWeather == "Fog")
									document.querySelector("#weatherModal .modal-dialog .modal-content").style.background = "url('images/fog.jpg')";
								else if(currentWeather == "Dust")
									document.querySelector("#weatherModal .modal-dialog .modal-content").style.background = "url('images/dust.jpg')";
								else if(currentWeather == "Drizzle")
									document.querySelector("#weatherModal .modal-dialog .modal-content").style.background = "url('images/drizzle.jpg')";
								else if(currentWeather == "Thunderstorm")
									document.querySelector("#weatherModal .modal-dialog .modal-content").style.background = "url('images/thunderstorm.jpg')";
								else if(currentWeather == "Clouds")
									document.querySelector("#weatherModal .modal-dialog .modal-content").style.background = "url('images/clouds.jpg')";
								else if(currentWeather == "Smoke")
									document.querySelector("#weatherModal .modal-dialog .modal-content").style.background = "url('images/smoke.jpg')";
								$('#CapitalWeatherIcon').html('<img src="https://openweathermap.org/img/wn/'+weatherIcon+'@2x.png" width="24px">');
								$('#txtCapitalWeatherTemp').html(currentTemp+"&deg;");
								$('#txtCapitalWeatherCurrent').html(currentTemp+"&deg;");			
								$('#txtCapitalWeatherWindspeed').html(windspeed+" km/h");
								$('#txtCapitalWeatherHumidity').html(humidity+"%");
								$('#txtCapitalWeatherMax').html(tempMax+"&deg;");
								$('#txtCapitalWeatherMin').html(tempMin+"&deg;");
								$('#CapitalHumidityIcon').html('<img src="images/humidity.svg" width="24px">');
								$('#CapitalWindIcon').html('<img src="images/007-windy.svg" width="24px">');
								$('.CapitalHiTempIcon').html('<img src="images/temperatureHi.svg" width="24px">');
								$('.CapitalLoTempIcon').html('<img src="images/temperatureLo.svg" width="24px">');
							},
							error: function(jqXHR, textStatus, errorThrown) {
								console.log(textStatus, errorThrown);
							}
						});
						$.ajax({
							url: "php/getWikipediaInfo.php",
							type: 'GET',
							dataType: 'json',
							data: {
								countryName: countryName
							},
							success: function(result) {
								wikipediaInfo = result['data']['extract_html'];
								wikipediaLink = result['data']['content_urls']['desktop']['page'];
								$('#txtWiki').html('<b>Wikipedia: <a target="_blank" href="'+wikipediaLink+'">'+countryName+'</a></b>'+wikipediaInfo);
							},
							error: function(jqXHR, textStatus, errorThrown) {
								console.log(textStatus, errorThrown);
							}
						});
						$.ajax({
							url: "php/getCovidCountryList.php",
							type: 'GET',
							dataType: 'json',
							data: { },
							success: function(result) {
								for(let c = 0; c < result['data'].length; c++)
								{
									if(result['data'][c]['Country'] == countryName)
									{
										covidCountry = result['data'][c]['Country'];
										$.ajax({
											url: "php/getCovidData.php",
											type: 'GET',
											dataType: 'json',
											data: {
												country: covidCountry
											},
											success: function(result) {
												activeCases = result['data'][result['data'].length-1]['Active'];
												confirmCases = result['data'][result['data'].length-1]['Confirmed'];
												deaths = result['data'][result['data'].length-1]['Deaths'];
												$('#txtConfirmedCases').html(confirmCases);
												$('#txtActiveCases').html(activeCases);
												$('#txtDeaths').html(deaths);
											},
											error: function(jqXHR, textStatus, errorThrown) {
												console.log(textStatus, errorThrown);
											}
										});
										break;
									}
								}
							},
							error: function(jqXHR, textStatus, errorThrown) {
								console.log(textStatus, errorThrown);
							}
						});
						$.ajax({
							url: "php/getNews.php",
							type: 'GET',
							dataType: 'json',
							data: {
								countryCode: countryCode
							},
							success: function(result) {
								newsTitle = result['data']['results'][0]['title'];
								newsLink = result['data']['results'][0]['link'];
								newsDescription = result['data']['results'][0]['description'];
								newsCategory = result['data']['results'][0]['category'][0];
								newsPublishDate = result['data']['results'][0]['pubDate'];
								$('#txtTitle').html("<a style='text-decoration: none;' target='_blank' href='"+newsLink+"'>"+newsTitle+"</a>");
								$('#txtKeywords').html(newsKeyword);
								$('#txtDescription').html(newsDescription);
								$('#txtCategory').html(newsCategory);
								$('#txtPublishDate').html(newsPublishDate);
								newsTitle = result['data']['results'][1]['title'];
								newsLink = result['data']['results'][1]['link'];
								newsDescription = result['data']['results'][1]['description'];
								newsCategory = result['data']['results'][1]['category'][0];
								newsPublishDate = result['data']['results'][1]['pubDate'];
								$('#txtTitle2').html("<a style='text-decoration: none;' target='_blank' href='"+newsLink+"'>"+newsTitle+"</a>");
								$('#txtDescription2').html(newsDescription);
								$('#txtCategory2').html(newsCategory);
								$('#txtPublishDate2').html(newsPublishDate);
								newsTitle = result['data']['results'][2]['title'];
								newsLink = result['data']['results'][2]['link'];
								newsDescription = result['data']['results'][2]['description'];
								newsCategory = result['data']['results'][2]['category'][0];
								newsPublishDate = result['data']['results'][2]['pubDate'];
								$('#txtTitle3').html("<a style='text-decoration: none;' target='_blank' href='"+newsLink+"'>"+newsTitle+"</a>");
								$('#txtDescription3').html(newsDescription);
								$('#txtCategory3').html(newsCategory);
								$('#txtPublishDate3').html(newsPublishDate);
							},
							error: function(jqXHR, textStatus, errorThrown) {
								console.log(textStatus, errorThrown);
							}
						});
						$.ajax({
							url: "php/getCurrencyConvert.php",
							type: 'GET',
							dataType: 'json',
							data: {
								currencyCode: currencyCode
							},
							success: function(result) {
								currencyConversion = result['data'];
								$("#txtExchangeRate").html("1 USD = "+currencyConversion+" "+currencyCode);
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
								countryCode: countryCode
							},
							success: function(result) {
								currencyName = result['data'][0]['currencies'][currencyCode]["name"];
								currencySymbol = result['data'][0]['currencies'][currencyCode]["symbol"];
								countryDomain = result['data'][0]['tld'];
								countryCodeISO2 = result['data'][0]['cca2'];
								countryCodeISO3 = result['data'][0]['cca3'];
								languages = result['data'][0]['languages'];
								allLanguages = [];
								for(let l in languages)
									allLanguages.push(languages[l]);
								countryFlag = result['data'][0]['flags']['png'];
								$('#txtWikiImg').html("<img src='"+countryFlag+"'>");
								$('#txtCurrency').html(currencyName);
								$('#txtLanguages').html(allLanguages.toString());
								$('#txtDomain').html(countryDomain);
								$('#txtIso2').html(countryCodeISO2);
								$('#txtIso3').html(countryCodeISO3);
								$('#txtCurrencySymbol').html(currencySymbol);
								
								map.setView([result['data'][0]['latlng'][0],result['data'][0]['latlng'][1]],5);
								marker = L.marker([result['data'][0]['latlng'][0],result['data'][0]['latlng'][1]]).addTo(map);
								map.addLayer(marker);
								
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
	
	L.easyButton('<i class="fas fa-info"></i>', function(){
		$('#infoModal').modal('show');
	}, 'Country Infomation').addTo(map);

	L.easyButton('<i class="fas fa-info"></i>', function(){
		$('#wikiModal').modal('show');
	}, 'Country Infomation').addTo(map);
	
	L.easyButton('<i class="fas fa-cloud-sun"></i>', function(){
		$('#weatherModal').modal('show');
	}, 'Weather Infomation').addTo(map);
	
	L.easyButton('<i class="fas fa-money-bill-wave"></i>', function(){
		$('#currencyModal').modal('show');
	}, 'Currency Information').addTo(map);
	
	L.easyButton('<i class="far fa-newspaper"></i>', function(){
		$('#newsModal').modal('show');
	}, 'News').addTo(map);
	
	L.easyButton('<i class="fas fa-virus"></i>', function(){
		$('#covidModal').modal('show');
	}, 'Covid Infomation').addTo(map);

	L.easyButton('<i class="fa fa-calendar-alt"></i>', function(){
		$('#holidaysModal').modal('show');
	}, 'Holiday List').addTo(map);
	
	L.easyButton('<i class="fa fa-plane"></i>', function(){
		$('#airportsModal').modal('show');
	}, 'Airports List').addTo(map);
}