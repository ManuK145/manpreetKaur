let position, marker, geojsonFeature, border = null, covidCountry, activeCases, confirmCases, deaths;
let currentTemp, weatherIcon, humidity, windspeed, tempMin, tempMax, tempTomorrowMin, tempTomorrowMax;
let population, countryCodeISO2, countryCodeISO3, countryDomain, capital, countryName, countryCode, countryFlag, continentName, currencyName, currencySymbol, currencyCode, wikipediaInfo, allLanguages = [];
let newsTitle, newsDescription, newsLink, newsKeyword, newsCategory, newsPublishDate;
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

function displayMap(lat,lng)
{
	var map = L.map('map').setView([lat,lng],5);
	L.tileLayer('https://tile.openstreetmap.org/{z}/{x}/{y}.png', {
		attribution: '&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a> contributors'
	}).addTo(map);
	marker = L.marker([lat,lng]).addTo(map);
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
					border = L.geoJSON(geojsonFeature).addTo(map);
					$.ajax({
						url: "php/getCountryInfo.php",
						type: 'GET',
						dataType: 'json',
						data: {
							country: countryCode
						},
						success: function(result) {
							capital = result['data'][0]['capital'];
							population = result['data'][0]['population'];
							countryCode = result['data'][0]['countryCode'];
							countryName = result['data'][0]['countryName'];
							continentName = result['data'][0]['continentName'];
							currencyCode = result['data'][0]['currencyCode'];
							$('#wikiModalLabel').html(countryName);
							$('.txtCapitalName').html(capital);
							$('#txtCapital').html(capital);
							$('#txtPopulation').html(population);
							$('#txtCurrencyCode').html(currencyCode);
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
									newsKeyword = result['data']['results'][0]['keywords'][0];
									newsDescription = result['data']['results'][0]['description'];
									newsCategory = result['data']['results'][0]['category'][0];
									newsPublishDate = result['data']['results'][0]['pubDate'];
									$('#txtTitle').html("<a style='text-decoration: none;' target='_blank' href='"+newsLink+"'>"+newsTitle+"</a>");
									$('#txtKeywords').html(newsKeyword);
									$('#txtDescription').html(newsDescription);
									$('#txtCategory').html(newsCategory);
									$('#txtPublishDate').html(newsPublishDate);
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
											break;
										}
									}
									if(covidCountry)
									{
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
									}
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
									$.ajax({
										url: "php/getWikipediaInfo.php",
										type: 'GET',
										dataType: 'json',
										data: {
											countryName: countryName
										},
										success: function(result) {
											wikipediaInfo = result['data']['extract_html'];
											$('#txtWiki').html('<b>Wikipedia:</b>'+wikipediaInfo);
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
		},
		error: function(jqXHR, textStatus, errorThrown) {
			console.log(textStatus, errorThrown);
		}
	});
	$.ajax({
		url: "php/getCurrentWeather.php",
		type: 'GET',
		dataType: 'json',
		data: {
			lat: lat,
			lng: lng
		},
		success: function(result) {
			weatherIcon = result['data']['current']['weather'][0]['icon'];
			currentTemp = result['data']['current']['temp'];
			windspeed = result['data']['current']['wind_speed'];
			humidity = result['data']['current']['humidity'];
			tempMin = result['data']['daily'][0]['temp']['min'];
			tempMax = result['data']['daily'][0]['temp']['max'];
			tempTomorrowMin = result['data']['daily'][1]['temp']['min'];
			tempTomorrowMax = result['data']['daily'][1]['temp']['max'];
			$('#CapitalWeatherIcon').html('<img src="https://openweathermap.org/img/wn/'+weatherIcon+'@2x.png" width="24px">');
			$('#txtCapitalWeatherCurrent').html(currentTemp+"&deg;");			
			$('#txtCapitalWeatherWindspeed').html(windspeed+" km/h");
			$('#txtCapitalWeatherHumidity').html(humidity+"%");
			$('#txtCapitalWeatherMax').html(tempMax+"&deg;");
			$('#txtCapitalWeatherMin').html(tempMin+"&deg;");
			$('#txtCapitalTomorrowsWeatherMax').html(tempTomorrowMax+"&deg;");
			$('#txtCapitalTomorrowsWeatherMin').html(tempTomorrowMin+"&deg;");
			$('#txtCapitalWeatherCurrent').html(currentTemp+"&deg;");
			$('#CapitalHumidityIcon').html('<img src="images/humidity.svg" width="24px">');
			$('#CapitalWindIcon').html('<img src="images/007-windy.svg" width="24px">');
			$('.CapitalHiTempIcon').html('<img src="images/temperatureHi.svg" width="24px">');
			$('.CapitalLoTempIcon').html('<img src="images/temperatureLo.svg" width="24px">');
		},
		error: function(jqXHR, textStatus, errorThrown) {
			console.log(textStatus, errorThrown);
		}
	});
	
	$("#countries").change(function() {
		countryCode = this.value;
		map.removeLayer(marker);
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
				border = L.geoJSON(geojsonFeature).addTo(map);
				$.ajax({
					url: "php/getCountryInfo.php",
					type: 'GET',
					dataType: 'json',
					data: {
						country: countryCode
					},
					success: function(result) {
						capital = result['data'][0]['capital'];
						population = result['data'][0]['population'];
						countryCode = result['data'][0]['countryCode'];
						countryName = result['data'][0]['countryName'];
						continentName = result['data'][0]['continentName'];
						currencyCode = result['data'][0]['currencyCode'];
						$('#wikiModalLabel').html(countryName);
						$('.txtCapitalName').html(capital);
						$('#txtCapital').html(capital);
						$('#txtPopulation').html(population);
						$('#txtCurrencyCode').html(currencyCode);
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
										break;
									}
								}
								if(covidCountry)
								{
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
								newsKeyword = result['data']['results'][0]['keywords'][0];
								newsDescription = result['data']['results'][0]['description'];
								newsCategory = result['data']['results'][0]['category'][0];
								newsPublishDate = result['data']['results'][0]['pubDate'];
								$('#txtTitle').html("<a style='text-decoration: none;' target='_blank' href='"+newsLink+"'>"+newsTitle+"</a>");
								$('#txtKeywords').html(newsKeyword);
								$('#txtDescription').html(newsDescription);
								$('#txtCategory').html(newsCategory);
								$('#txtPublishDate').html(newsPublishDate);
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
								$.ajax({
									url: "php/getWikipediaInfo.php",
									type: 'GET',
									dataType: 'json',
									data: {
										countryName: countryName
									},
									success: function(result) {
										wikipediaInfo = result['data']['extract_html'];
										$('#txtWiki').html('<b>Wikipedia:</b>'+wikipediaInfo);
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
		$.ajax({
			url: "php/getCurrentWeather.php",
			type: 'GET',
			dataType: 'json',
			data: {
				lat: lat,
				lng: lng
			},
			success: function(result) {
				weatherIcon = result['data']['current']['weather'][0]['icon'];
				currentTemp = result['data']['current']['temp'];
				windspeed = result['data']['current']['wind_speed'];
				humidity = result['data']['current']['humidity'];
				tempMin = result['data']['daily'][0]['temp']['min'];
				tempMax = result['data']['daily'][0]['temp']['max'];
				tempTomorrowMin = result['data']['daily'][1]['temp']['min'];
				tempTomorrowMax = result['data']['daily'][1]['temp']['max'];
				$('#CapitalWeatherIcon').html('<img src="https://openweathermap.org/img/wn/'+weatherIcon+'@2x.png" width="24px">');
				$('#txtCapitalWeatherCurrent').html(currentTemp+"&deg;");			
				$('#txtCapitalWeatherWindspeed').html(windspeed+" km/h");
				$('#txtCapitalWeatherHumidity').html(humidity+"%");
				$('#txtCapitalWeatherMax').html(tempMax+"&deg;");
				$('#txtCapitalWeatherMin').html(tempMin+"&deg;");
				$('#txtCapitalTomorrowsWeatherMax').html(tempTomorrowMax+"&deg;");
				$('#txtCapitalTomorrowsWeatherMin').html(tempTomorrowMin+"&deg;");
				$('#txtCapitalWeatherCurrent').html(currentTemp+"&deg;");
				$('#CapitalHumidityIcon').html('<img src="images/humidity.svg" width="24px">');
				$('#CapitalWindIcon').html('<img src="images/007-windy.svg" width="24px">');
				$('.CapitalHiTempIcon').html('<img src="images/temperatureHi.svg" width="24px">');
				$('.CapitalLoTempIcon').html('<img src="images/temperatureLo.svg" width="24px">');
			},
			error: function(jqXHR, textStatus, errorThrown) {
				console.log(textStatus, errorThrown);
			}
		});
	});
	
	L.easyButton('<i class="fas fa-info"></i>', function(){
		$.ajax({
			url: "php/getCountryInfo.php",
			type: 'GET',
			dataType: 'json',
			data: {
				country: countryCode
			},
			success: function(result) {
				$.ajax({
					url: "php/getCountryBorder.php",
					type: 'GET',
					dataType: 'json',
					data: {
						iso: countryCode
					},
					success: function(result) {
						$('#wikiModal').modal('show');
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
	}, 'Country Infomation').addTo(map);
	
	L.easyButton('<i class="fas fa-cloud-sun"></i>', function(){
		$.ajax({
			url: "php/getCurrentWeather.php",
			type: 'GET',
			dataType: 'json',
			data: {
				lat: lat,
				lng: lng
			},
			success: function(result) {								
				$.ajax({
					url: "php/getCountryInfo.php",
					type: 'GET',
					dataType: 'json',
					data: {
						country: countryCode
					},
					success: function(result) {
						$.ajax({
							url: "php/getCurrencyData.php",
							type: 'GET',
							dataType: 'json',
							data: {
								countryCode: countryCode
							},
							success: function(result) {
								$('#weatherModal').modal('show');
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
	}, 'Weather Infomation').addTo(map);
	
	L.easyButton('<i class="fas fa-money-bill-wave"></i>', function(){
		$.ajax({
			url: "php/getCurrencyData.php",
			type: 'GET',
			dataType: "json",
			data: {
				countryCode: countryCode
			},
			success: function(result) {
				$('#currencyModal').modal('show');
			},
			error: function(jqXHR, textStatus, errorThrown) {
				console.log('ExchangeRate Data Error',textStatus, errorThrown);
			}
		});
	}, 'Currency Information').addTo(map);
	
	L.easyButton('<i class="far fa-newspaper"></i>', function(){
		$.ajax({
			url: "php/getNews.php",
			type: 'GET',
			dataType: "json",
			data: {
				countryCode: countryCode
			},
			success: function(result) {
				$('#newsModal').modal('show');
			},
			error: function(jqXHR, textStatus, errorThrown) {
				console.log('ExchangeRate Data Error',textStatus, errorThrown);
			}
		});
	}, 'News').addTo(map);
	
	L.easyButton('<i class="fas fa-virus"></i>', function(){
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
						break;
					}
				}
				if(covidCountry)
				{
					$.ajax({
						url: "php/getCovidData.php",
						type: 'GET',
						dataType: 'json',
						data: {
							country: covidCountry
						},
						success: function(result) {
							$('#covidModal').modal('show');
						},
						error: function(jqXHR, textStatus, errorThrown) {
							console.log(textStatus, errorThrown);
						}
					});
				}
			},
			error: function(jqXHR, textStatus, errorThrown) {
				console.log(textStatus, errorThrown);
			}
		});
	}, 'Covid Infomation').addTo(map);
}
			
			