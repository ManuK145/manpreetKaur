let map, markerCapitalGroup, markerNeighbourGroup, markerEarthquakeGroup, position, marker, geojsonFeature, border = null, covidCountry, activeCases, confirmCases, deaths;
let geonameid, currentTemp, weatherIcon, humidity, windspeed, tempMin, tempMax;
let population, areainsqkm, countryCodeISO2, countryCodeISO3, countryDomain, capital, countryName, countryCode, countryFlag, northPoint, southPoint, eastPoint, westPoint, continentName, currencyName, currencySymbol, currencyCode, wikipediaInfo, allLanguages = [];
let airportMarkers;
let newsTitle, newsDescription, newsLink, newsKeyword, newsCategory, newsPublishDate;

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
        fillColor: 'purple',
        weight: 2,
        opacity: 1,
        color: 'black',
        fillOpacity: 0.2
    };
}

function displayMap(lat,lng){
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
			if (result['status']['name'] == 'error') {
				alert(result['status']['description']);
				return;
			}
			countryCode = result["data"]["sys"]["country"];
			
			$.ajax({
				url: "php/getAirports.php",
				type: 'GET',
				dataType: 'json',
				data: {
					countryCode: countryCode
				},
				success: function(result) {
					if (result['status']['name'] == 'error') {
						alert(result['status']['description']);
						return;
					}
					
					let airports = {
                        "type": "FeatureCollection",
                        "features": []
                    };

					// Check if response data exists and has a length greater than 0
                    if (result['data'] && result['data']['response'] && result['data']['response'].length > 0) {
                        for (let i = 0; i < 10; i++) {
                            if (result['data']['response'][i] && result['data']['response'][i]['lng'] && result['data']['response'][i]['lat'] && result['data']['response'][i]['name'] && result['data']['response'][i]['iata_code']) {
                                let airport = {
                                    "type": "Feature",
                                    "geometry": {
                                        "type": "Point",
                                        "coordinates": [result['data']['response'][i]['lng'], result['data']['response'][i]['lat']]
                                    },
                                    "properties": {
                                        "name": result['data']['response'][i]['name'],
                                        "iata_code": result['data']['response'][i]['iata_code']
                                    }
                                };
                                airports.features.push(airport);
                            }
                        }
            
                        for (let i = 0; i < result['data']['response'].length; i++) {
                            if (result['data']['response'][i] && result['data']['response'][i]['name'] && result['data']['response'][i]['iata_code']) {
                                document.getElementById("airportsList").innerHTML += "<div class='airports'>" + result['data']['response'][i]['name'] + " - " + result['data']['response'][i]['iata_code'] + "</div>";
                            }
                        }
            
                        airportMarkers = L.markerClusterGroup();
                        let marker = L.geoJSON(airports, {
                            pointToLayer: function (feature, latlng) {
                                return L.marker(latlng, {
                                    icon: L.icon(iconAirportsOptions),
                                    title: "AirportLocation",
                                    clickable: true
                                });
                            },
                            onEachFeature: function (feature, layer) {
                                layer.bindPopup(feature.properties.name + " - " + feature.properties.iata_code);
                            }
                        });
            
                        airportMarkers.addLayer(marker);
                        map.addLayer(airportMarkers);
                    }
                },
                error: function (jqXHR, textStatus, errorThrown) {
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
					if (result['status']['name'] == 'error') {
						alert(result['status']['description']);
						return;
					}
					let newsTBody = $('#newsTBody');
              		for (let i = 0; i < 3; i++) {
                    let newsData = result['data']['results'][i];
                    let newsTitle = newsData['title'];
                    let newsLink = newsData['link'];
                    let newsDescription = newsData['description'];
                    let newsCategory = newsData['category'][0];
                    let newsPublishDate = newsData['pubDate'];
              
                    let row = "<tr class='success newsRow'>" +
                      "<td>Title:</td>" +
                      "<td class='txtTitle'><a style='text-decoration: none;' target='_blank' href='" + newsLink + "'>" + newsTitle + "</a></td>" +
                      "</tr>" +
                      "<tr class='success newsRow'>" +
                      "<td>Description:</td>" +
                      "<td class='txtDescription'>" + newsDescription + "</td>" +
                      "</tr>" +
                      "<tr class='success newsRow'>" +
                      "<td>Category:</td>" +
                      "<td class='txtCategory'>" + newsCategory + "</td>" +
                      "</tr>" +
                      "<tr class='success newsRow'>" +
                      "<td>Publish Date:</td>" +
                      "<td class='txtPublishDate'>" + newsPublishDate + "</td>" +
                      "</tr>";
              
                    newsTBody.append(row);
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
							if (result['status']['name'] == 'error') {
								alert(result['status']['description']);
								return;
							}
							geonameid = countryData['geonameId'] !== undefined ? countryData['geonameId'] : '';
							capital = countryData['capital'] !== undefined ? countryData['capital'] : '';
							population = countryData['population'] !== undefined ? countryData['population'] : '';
							areainsqkm = countryData['areaInSqKm'] !== undefined ? countryData['areaInSqKm'] : '';
							countryName = countryData['countryName'] !== undefined ? countryData['countryName'] : '';
							getTopSites(countryName);
                            getHotels(countryName);
							continentName = countryData['continentName'] !== undefined ? countryData['continentName'] : '';
							currencyCode = countryData['currencyCode'] !== undefined ? countryData['currencyCode'] : '';
							northPoint = countryData['north'] !== undefined ? countryData['north'] : '';
							southPoint = countryData['south'] !== undefined ? countryData['south'] : '';
							eastPoint = countryData['east'] !== undefined ? countryData['east'] : '';
							westPoint = countryData['west'] !== undefined ? countryData['west'] : '';
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
									if (result['status']['name'] == 'error') {
										alert(result['status']['description']);
										return;
									}
									let neighboursData = {
                                        "type": "FeatureCollection",
                                        "features": []
                                    }

                                    for (let m = 0; m < result['data']['geonames'].length; m++) {
                                        let neighbour = {
                                            "type": "Feature",
                                            "geometry": {
                                                "type": "Point",
                                                "coordinates": [result['data']['geonames'][m]['lng'], result['data']['geonames'][m]['lat']]
                                            },
                                            "properties": {
                                                "name": result['data']['geonames'][m]['name'],
                                                "countryName": result['data']['geonames'][m]['countryName'],
                                                "lat": result['data']['geonames'][m]['lat'],
                                                "lon": result['data']['geonames'][m]['lng'],
                                            }
                                        }
                                        neighboursData.features.push(neighbour);
                                    }

                                    markerNeighbourGroup = L.markerClusterGroup();

                                    let marker = L.geoJSON(neighboursData, {
                                        pointToLayer: function (feature, latlng) {
                                            return L.marker(latlng, {
                                                icon: L.icon(iconNeighboursOptions),
                                                title: "NeighbourLocation",
                                                clickable: true
                                            });
                                        },
                                        onEachFeature: function (feature, layer) {
                                            layer.bindPopup("Name : " + feature.properties.name + "<br>Country Name : " + feature.properties.countryName + "<br>Latitude : " + feature.properties.lat + "<br>Longitude : " + feature.properties.lon);
                                        }
                                    });

                                    markerNeighbourGroup.addLayer(marker);
                                    map.addLayer(markerNeighbourGroup);
                                },
                                error: function (jqXHR, textStatus, errorThrown) {
                                    console.log('Unesco Data Error', textStatus, errorThrown);
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
									if (result['status']['name'] == 'error') {
										alert(result['status']['description']);
										return;
									}
									let earthquakePlaces = {
                                        "type": "FeatureCollection",
                                        "features": []
                                    }

                                    for (let m = 0; m < result['data']['earthquakes'].length; m++) {
                                        let earthquakePlace = {
                                            "type": "Feature",
                                            "geometry": {
                                                "type": "Point",
                                                "coordinates": [result['data']['earthquakes'][m]['lng'], result['data']['earthquakes'][m]['lat']] // San Francisco International Airport
                                            },
                                            "properties": {
                                                "depth": result['data']['earthquakes'][m]['depth'],
                                                "lat": result['data']['earthquakes'][m]['lat'],
                                                "lon": result['data']['earthquakes'][m]['lng'],
                                            }
                                        }
                                        earthquakePlaces.features.push(earthquakePlace);
                                    }

                                    markerEarthquakeGroup = L.markerClusterGroup();


                                    let marker = L.geoJSON(earthquakePlaces, {
                                        pointToLayer: function (feature, latlng) {
                                            return L.marker(latlng, {
                                                icon: L.icon(iconEarthquakeOptions),
                                                title: "EarthquakeLocation",
                                                clickable: true
                                            });
                                        },
                                        onEachFeature: function (feature, layer) {
                                            layer.bindPopup("Earthquake Depth : " + feature.properties.depth + "<br>Latitude : " + feature.properties.lat + "<br>Longitude : " + feature.properties.lon);
                                        }
                                    });

                                    markerEarthquakeGroup.addLayer(marker);
                                    map.addLayer(markerEarthquakeGroup);

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
									if (result['status']['name'] == 'error') {
										alert(result['status']['description']);
										return;
									}
									weatherIcon = result['data']['weather'][0]['icon'];
									currentTemp = result['data']['main']['temp'];
									currentWeather = result['data']['weather'][0]['main'];
									windspeed = result['data']['wind']['speed'];
									humidity = result['data']['main']['humidity'];
									tempMin = result['data']['main']['temp_min'];
									tempMax = result['data']['main']['temp_max'];
									
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
									if (result['status']['name'] == 'error') {
										alert(result['status']['description']);
										return;
									}
									wikipediaInfo = result['data']['extract_html'];
									wikipediaLink = result['data']['content_urls']['desktop']['page'];
									$('#txtWiki').html('<b>Wikipedia: <a target="_blank" href="'+wikipediaLink+'">'+countryName+'</a></b>'+wikipediaInfo);
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
									if (result['error']) {
										alert(result['error-message']);
										return;
									}
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
									if (result['status']['name'] == 'error') {
										alert(result['status']['description']);
										return;
									}

									// Check if the properties exist and assign them to variables
                                    if (result['data'][0]['currencies'] && result['data'][0]['currencies'][currencyCode]) {
                                        currencyName = result['data'][0]['currencies'][currencyCode]["name"];
                                        currencySymbol = result['data'][0]['currencies'][currencyCode]["symbol"];
                                    }
                                    if (result['data'][0]['tld']) {
                                        countryDomain = result['data'][0]['tld'];
                                    }
                                    if (result['data'][0]['cca2']) {
                                        countryCodeISO2 = result['data'][0]['cca2'];
                                    }
                                    if (result['data'][0]['cca3']) {
                                        countryCodeISO3 = result['data'][0]['cca3'];
                                    }
                                    if (result['data'][0]['languages']) {
                                        languages = result['data'][0]['languages'];
                                        allLanguages = Object.values(languages);
                                    }
                                    if (result['data'][0]['flags']['png']) {
                                        countryFlag = result['data'][0]['flags']['png'];
                                        $('#txtWikiImg').html("<img id='flag' src='" + countryFlag + "'><br>");
                                    }

									$('#txtCurrency').html(currencyName);
									$('#txtLanguages').html(allLanguages? allLanguages.toString():"");
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
		if (markerCapitalGroup) {
            map.removeLayer(markerCapitalGroup);
          }
        if (airportMarkers) {
            map.removeLayer(airportMarkers);
          }
          if (markerNeighbourGroup) {
            map.removeLayer(markerNeighbourGroup);
          }
          if (markerEarthquakeGroup) {
            map.removeLayer(markerEarthquakeGroup);
          }
          $('#newsTBody').empty();
          $('#txtWiki').empty();
       
		
		$.ajax({
			url: "php/getAirports.php",
			type: 'GET',
			dataType: 'json',
			data: {
				countryCode: countryCode
			},
			success: function(result) {
				console.log(countryCode)
				if (result['status'] && result['status']['name'] == 'error') {
					alert(result['status']['description']);
					return;
				}
				document.getElementById("airportsList").innerHTML = "";
				let airports = {
                    "type": "FeatureCollection",
                    "features": []
                }
        
                if (result['data'] && result['data']['response']) {
                    for (let i = 0; i < Math.min(result['data']['response'].length, 10); i++) {
                        let airport = {
                            "type": "Feature",
                            "geometry": {
                                "type": "Point",
                                "coordinates": [result['data']['response'][i]['lng'], result['data']['response'][i]['lat']] // San Francisco International Airport
                            },
                            "properties": {
                                "name": result['data']['response'][i]['name'],
                                "iata_code": result['data']['response'][i]['iata_code']
                            }
                        }
                        airports.features.push(airport);
                    }
        
                    for (let i = 0; i < result['data']['response'].length; i++) {
                        document.getElementById("airportsList").innerHTML += "<div class='airports'>" + result['data']['response'][i]['name'] + " - " + result['data']['response'][i]['iata_code'] + "</div>";
                    }
        
                    airportMarkers = L.markerClusterGroup();
        
                    let marker = L.geoJSON(airports, {
                        pointToLayer: function (feature, latlng) {
                            return L.marker(latlng, {
                                icon: L.icon(iconAirportsOptions),
                                title: "AirportLocation",
                                clickable: true
                            });
                        },
                        onEachFeature: function (feature, layer) {
                            layer.bindPopup(feature.properties.name + " - " + feature.properties.iata_code);
                        }
                    });
        
                    airportMarkers.addLayer(marker);
                    map.addLayer(airportMarkers);
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
						if (result['status']['name'] == 'error') {
							alert(result['status']['description']);
							return;
						}
						geonameid = result['data'][0]['geonameId'];
						capital = result['data'][0]['capital'];
						population = result['data'][0]['population'];
						areainsqkm = result['data'][0]['areaInSqKm'];
						countryName = result['data'][0]['countryName'];
						getTopSites(countryName);
                        getHotels(countryName);
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
								if (result['status']['name'] == 'error') {
									alert(result['status']['description']);
									return;
								}
								let neighboursData = {
                                    "type": "FeatureCollection",
                                    "features": []
                                }

                                for (let m = 0; m < result['data']['geonames'].length; m++) {
                                    let neighbour = {
                                        "type": "Feature",
                                        "geometry": {
                                            "type": "Point",
                                            "coordinates": [result['data']['geonames'][m]['lng'], result['data']['geonames'][m]['lat']]
                                        },
                                        "properties": {
                                            "name": result['data']['geonames'][m]['name'],
                                            "countryName": result['data']['geonames'][m]['countryName'],
                                            "lat": result['data']['geonames'][m]['lat'],
                                            "lon": result['data']['geonames'][m]['lng'],
                                        }
                                    }
                                    neighboursData.features.push(neighbour);
                                }

                                markerNeighbourGroup = L.markerClusterGroup();

                                let marker = L.geoJSON(neighboursData, {
                                    pointToLayer: function (feature, latlng) {
                                        return L.marker(latlng, {
                                            icon: L.icon(iconNeighboursOptions),
                                            title: "NeighbourLocation",
                                            clickable: true
                                        });
                                    },
                                    onEachFeature: function (feature, layer) {
                                        layer.bindPopup("Name : " + feature.properties.name + "<br>Country Name : " + feature.properties.countryName + "<br>Latitude : " + feature.properties.lat + "<br>Longitude : " + feature.properties.lon);
                                    }
                                });

                                markerNeighbourGroup.addLayer(marker);
                                map.addLayer(markerNeighbourGroup);
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
								if (result['status']['name'] == 'error') {
									alert(result['status']['description']);
									return;
								}
								let earthquakePlaces = {
                                    "type": "FeatureCollection",
                                    "features": []
                                }

                                for (let m = 0; m < result['data']['earthquakes'].length; m++) {
                                    let earthquakePlace = {
                                        "type": "Feature",
                                        "geometry": {
                                            "type": "Point",
                                            "coordinates": [result['data']['earthquakes'][m]['lng'], result['data']['earthquakes'][m]['lat']] // San Francisco International Airport
                                        },
                                        "properties": {
                                            "depth": result['data']['earthquakes'][m]['depth'],
                                            "lat": result['data']['earthquakes'][m]['lat'],
                                            "lon": result['data']['earthquakes'][m]['lng'],
                                        }
                                    }
                                    earthquakePlaces.features.push(earthquakePlace);
                                }

                                markerEarthquakeGroup = L.markerClusterGroup();


                                let marker = L.geoJSON(earthquakePlaces, {
                                    pointToLayer: function (feature, latlng) {
                                        return L.marker(latlng, {
                                            icon: L.icon(iconEarthquakeOptions),
                                            title: "EarthquakeLocation",
                                            clickable: true
                                        });
                                    },
                                    onEachFeature: function (feature, layer) {
                                        layer.bindPopup("Earthquake Depth : " + feature.properties.depth + "<br>Latitude : " + feature.properties.lat + "<br>Longitude : " + feature.properties.lon);
                                    }
                                });

                                markerEarthquakeGroup.addLayer(marker);
                                map.addLayer(markerEarthquakeGroup);
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
								if (result['status']['name'] == 'error') {
									alert(result['status']['description']);
									return;
								}
								weatherIcon = result1['data']['weather'][0]['icon'];
								currentTemp = result1['data']['main']['temp'];
								currentWeather = result1['data']['weather'][0]['main'];
								windspeed = result1['data']['wind']['speed'];
								humidity = result1['data']['main']['humidity'];
								tempMin = result1['data']['main']['temp_min'];
								tempMax = result1['data']['main']['temp_max'];
								
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
								if (result['status']['name'] == 'error') {
									alert(result['status']['description']);
									return;
								}
								wikipediaInfo = result['data']['extract_html'];
								wikipediaLink = result['data']['content_urls']['desktop']['page'];
								$('#txtWiki').html('<b>Wikipedia: <a target="_blank" href="'+wikipediaLink+'">'+countryName+'</a></b>'+wikipediaInfo);
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
								countryCode: countryCode,
								countryName: countryName
							},
							success: function(result) {
								if (result['status']['name'] == 'error') {
									alert(result['status']['description']);
									return;
								}
								let newsTBody = $('#newsTBody');
                          
                              for (let i = 0; i < 3; i++) {
                                let newsData = result['data']['results'][i];
                                let newsTitle = newsData['title'];
                                let newsLink = newsData['link'];
                                let newsDescription = newsData['description'];
                                let newsCategory = newsData['category'][0];
                                let newsPublishDate = newsData['pubDate'];
                          
                                let row = "<tr class='success newsRow'>" +
                                  "<td>Title:</td>" +
                                  "<td class='txtTitle'><a style='text-decoration: none;' target='_blank' href='" + newsLink + "'>" + newsTitle + "</a></td>" +
                                  "</tr>" +
                                  "<tr class='success newsRow'>" +
                                  "<td>Description:</td>" +
                                  "<td class='txtDescription'>" + newsDescription + "</td>" +
                                  "</tr>" +
                                  "<tr class='success newsRow'>" +
                                  "<td>Category:</td>" +
                                  "<td class='txtCategory'>" + newsCategory + "</td>" +
                                  "</tr>" +
                                  "<tr class='success newsRow'>" +
                                  "<td>Publish Date:</td>" +
                                  "<td class='txtPublishDate'>" + newsPublishDate + "</td>" +
                                  "</tr>";
                          
                                newsTBody.append(row);
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
								if (result['error']) {
									alert(result['error-message']);
									return;
								}
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
								if (result['status']['name'] == 'error') {
									alert(result['status']['description']);
									return;
								}
								if (result['data'][0]['currencies'] && result['data'][0]['currencies'][currencyCode]) {
                                    currencyName = result['data'][0]['currencies'][currencyCode]["name"];
                                    currencySymbol = result['data'][0]['currencies'][currencyCode]["symbol"];
                                  }
                                  
                                  if (result['data'][0]['tld']) {
                                    countryDomain = result['data'][0]['tld'];
                                  }
                                  
                                  if (result['data'][0]['cca2']) {
                                    countryCodeISO2 = result['data'][0]['cca2'];
                                  }
                                  
                                  if (result['data'][0]['cca3']) {
                                    countryCodeISO3 = result['data'][0]['cca3'];
                                  }
                                  
                                  if (result['data'][0]['languages']) {
                                    languages = result['data'][0]['languages'];
                                  }
                                  
                                allLanguages = [];
                                for (let l in languages)
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
								markerCapitalGroup = L.layerGroup().addTo(map);
								marker = L.marker([result['data'][0]['latlng'][0],result['data'][0]['latlng'][1]], markerCapitalOptions).addTo(markerCapitalGroup);
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

	function getTopSites(countryName) {
        $.ajax({
            url: "php/getTop5.php",
            type: 'GET',
            dataType: 'json',
            data: {
                country: countryName
            },
            success: function (result) {
                if (result['status']['name'] == 'error') {
                    alert(result['status']['description']);
                    return;
                }

                let tBody = document.getElementById('top5sites');
                let html = "";

                let data = result['data']['results'];
                for (let i = 0; i < 5; i++) {
                    let place = data[i];
                    html += `
                    <tr class="success currencyRow">
                    <td>
                    <a target="_blank" href="https://www.google.com/maps?q=${place['geometry']['location']['lat']},${place['geometry']['location']['lng']}">${place['name']}</a>
                    </td>
                  </tr>
                    `;
                }
                tBody.innerHTML = html;
            }
        })
    }

        // function for getting Hotels Data
        function getHotels(countryName) {
            $.ajax({
                url: "php/getHotels.php",
                type: 'GET',
                dataType: 'json',
                data: {
                    country: countryName
                },
                success: function (result) {
                    if (result['status']['name'] == 'error') {
                        alert(result['status']['description']);
                        return;
                    }
    
                    let tBody = document.getElementById('hotels');
                    let html = "";
    
                    let data = result['data']['results'];
                    for (let i = 0; i < 15; i++) {
                        let place = data[i];
                        html += `
                        <tr class="success currencyRow">
                        <td>
                        <a target="_blank" href="https://www.google.com/maps?q=${place['geometry']['location']['lat']},${place['geometry']['location']['lng']}">${place['name']}</a>
                        </td>
                      </tr>
                        `;
                    }
                    tBody.innerHTML = html;
                }
            })
        }

		// easy buttons
		var infoButton = L.easyButton('fa fa-info', function () {
			$('#infoModal').modal('show');
		}, 'Info');
	
		var wikiButton = L.easyButton('fab fa-wikipedia-w', function () {
			$('#wikiModal').modal('show');
		}, 'Wiki');
	
		var weatherButton = L.easyButton('fas fa-cloud-sun', function () {
			$('#weatherModal').modal('show');
		}, 'Weather');
	
		var currencyButton = L.easyButton('fas fa-money-bill-wave', function () {
			$('#currencyModal').modal('show');
		}, 'Currency');
	
		var newsButton = L.easyButton('far fa-newspaper', function () {
			$('#newsModal').modal('show');
		}, 'News');
	
		var top5Button = L.easyButton('fa fa-suitcase-rolling', function () {
			$('#top5Modal').modal('show');
		}, 'Top 5 Places to Visit');
	
		var hotelsButton = L.easyButton('fas fa-bed', function () {
			$('#hotelsModal').modal('show');
		}, 'Hotels');
	
		infoButton.addTo(map);
		wikiButton.addTo(map);
		weatherButton.addTo(map);
		currencyButton.addTo(map);
		newsButton.addTo(map);
		top5Button.addTo(map);
		hotelsButton.addTo(map);
		
		var buttonContainer = document.getElementById('modal-buttons');

		buttonContainer.appendChild(infoButton.getContainer());
		buttonContainer.appendChild(wikiButton.getContainer());
		buttonContainer.appendChild(weatherButton.getContainer());
		buttonContainer.appendChild(currencyButton.getContainer());
		buttonContainer.appendChild(newsButton.getContainer());
		buttonContainer.appendChild(top5Button.getContainer());
		buttonContainer.appendChild(hotelsButton.getContainer());
	
	
	
}
	
	