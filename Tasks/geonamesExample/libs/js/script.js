$('#btnCountryInfo').click(function() {
        $.ajax({
            url: "libs/php/getCountryInfo.php",
            type: 'POST',
            dataType: 'json',
            data: {
                country: $('#selCountry').val(),
                lang: $('#selLanguage').val()
            },
            success: function(result) {

                console.log(JSON.stringify(result));

                if (result.status.name == "ok") {

                    $('#txtContinent').html(result['data'][0]['continent']);
                    $('#txtCapital').html(result['data'][0]['capital']);
                    $('#txtLanguages').html(result['data'][0]['languages']);
                    $('#txtPopulation').html(result['data'][0]['population']);
                    $('#txtArea').html(result['data'][0]['areaInSqKm']);

                }
            
            },
            error: function(jqXHR, textStatus, errorThrown) {
                // your error code
            }
        }); 
    
    });
    
    $('#btnHierarchy').click(function() {
        $.ajax({
            url: "libs/php/getGeonameId.php",
            type: 'POST',
            dataType: 'json',
            data: {
                country: $('#selHierarchyCountry').val(),
                lang: 'en'
            },
            success: function(result) {
                if (result.status.name == "ok") {
                    console.log(result);
                    $.ajax({
                        url: "libs/php/getHierarchy.php",
                        type: 'POST',
                        dataType: 'json',
                        data: {
                            geonameId: result['data'][0]['geonameId']
                        },
                        success: function(result) {
                            if (result.status.name == "ok") {
                                let returnData = "<table border='1'>";
                                returnData += "<tr><th>Name</th><th>Population</th><th>geoname Id</th></tr>";
                                for(let i = 0; i < result['data'].length; i++)
                                {
                                    returnData += "<tr><td>"+result['data'][i]['name']+"</td><td>"+result['data'][i]['population']+"</td><td>"+result['data'][i]['geonameId']+"</td></tr>";
                                }
                                returnData += "</table>";
                                document.getElementById("hierarchyResults").innerHTML = returnData;
                            }
                        },
                        error: function(jqXHR, textStatus, errorThrown) {
                            // your error code
                        }
                    });
                }
            },
            error: function(jqXHR, textStatus, errorThrown) {
                // your error code
            }
        });
    });
    
    $('#btnSiblings').click(function() {
        $.ajax({
            url: "libs/php/getGeonameId.php",
            type: 'POST',
            dataType: 'json',
            data: {
                country: $('#selSiblingsCountry').val(),
                lang: 'en'
            },
            success: function(result) {
                console.log(result['data'][0]['geonameId']);
                if (result.status.name == "ok") {
                    $.ajax({
                        url: "libs/php/getSiblings.php",
                        type: 'POST',
                        dataType: 'json',
                        data: {
                            geonameId: result['data'][0]['geonameId']
                        },
                        success: function(result) {
                            if (result.status.name == "ok") {
                                let returnData = "<table border='1'>";
                                returnData += "<tr><th>Name</th><th>Country Name</th><th>geoname Id</th><th>Country Code</th></tr>";
                                for(let i = 0; i < result['data'].length; i++)
                                {
                                    returnData += "<tr><td>"+result['data'][i]['name']+"</td><td>"+result['data'][i]['countryName']+"</td><td>"+result['data'][i]['geonameId']+"</td><td>"+result['data'][i]['countryCode']+"</td></tr>";
                                }
                                returnData += "</table>";
                                document.getElementById("siblingsResults").innerHTML = returnData;
                            }
                        },
                        error: function(jqXHR, textStatus, errorThrown) {
                            // your error code
                        }
                    });
                }
            },
            error: function(jqXHR, textStatus, errorThrown) {
                // your error code
            }
        });
    });
    
    $('#btnChildren').click(function() {
        $.ajax({
            url: "libs/php/getGeonameId.php",
            type: 'POST',
            dataType: 'json',
            data: {
                country: $('#selChildrenCountry').val(),
                lang: 'en'
            },
            success: function(result) {
                console.log(result['data'][0]['geonameId']);
                if (result.status.name == "ok") {
                    $.ajax({
                        url: "libs/php/getChildren.php",
                        type: 'POST',
                        dataType: 'json',
                        data: {
                            geonameId: result['data'][0]['geonameId']
                        },
                        success: function(result) {
                            if (result.status.name == "ok") {
                                let returnData = "<table border='1'>";
                                returnData += "<tr><th>Name</th><th>Country Code</th><th>Country Name</th><th>Population</th><th>geoname Id</th></tr>";
                                for(let i = 0; i < result['data'].length; i++)
                                {
                                    returnData += "<tr><td>"+result['data'][i]['name']+"</td><td>"+result['data'][i]['countryCode']+"</td><td>"+result['data'][i]['countryName']+"</td><td>"+result['data'][i]['population']+"</td><td>"+result['data'][i]['geonameId']+"</td></tr>";
                                }
                                returnData += "</table>";
                                document.getElementById("childrenResults").innerHTML = returnData;
                            }
                        },
                        error: function(jqXHR, textStatus, errorThrown) {
                            // your error code
                        }
                    });
                }
            },
            error: function(jqXHR, textStatus, errorThrown) {
                // your error code
            }
        });
    });
    
    $(window).on('load', function () {
if ($('#preloader').length) {
$('#preloader').delay(1000).fadeOut('slow', function () {
$(this).remove();
});
}
});
