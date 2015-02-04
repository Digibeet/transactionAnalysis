function allowDrop(ev) {
    ev.preventDefault();
}

function drop(ev) {
    ev.preventDefault();
    var data = ev.dataTransfer.getData("csv");
    var files = ev.dataTransfer.files
    console.log(files)
    var textFile = files[0];
    var reader = new FileReader();
    var processInput = function(){
    	console.log("Load ready")
    	var result = reader.result;
    	var rows = result.split("\n")
    	var sourcesOfIncome = {};
    	console.log(rows[rows.length -1].split(","))
    	for(var rowIndex = 1; rowIndex < rows.length - 1; rowIndex++){
    		/*indexes:
    			0:Datum	1:Naam / Omschrijving	2:Rekening	3:Tegenrekening	4:Code	5:Af Bij	6:Bedrag (EUR) 7:bedrags (cents) 8:MutatieSoort	9:Mededelingen
    			*/
    		var cells = rows[rowIndex].split(",")
    		if(cells[5] == "Bij")
    			var source = cells[1];
    			var amount = parseInt(cells[6].replace("\"", ""));
    			if(sourcesOfIncome[source])
    				sourcesOfIncome[source] += amount;
    			else
    				sourcesOfIncome[source] = amount;
    	}
    	console.log(sourcesOfIncome)
    	var incomeData = [];
    	for(source in sourcesOfIncome) {
    		var amount = sourcesOfIncome[source];
    		incomeData.push([source, amount])
    	}
    	console.log(incomeData)
    	generateCharts(incomeData);
    }
	reader.onloadend = processInput;
	reader.readAsText(textFile)	
}

function generateCharts(data, subtitle){
	$(function () {
	    $('#container').highcharts({
	        chart: {
	            type: 'column'
	        },
	        title: {
	            text: 'Sources of income'
	        },
	        subtitle: {
	            text: 'Source: <a href="http://en.wikipedia.org/wiki/List_of_cities_proper_by_population">Wikipedia</a>'
	        },
	        xAxis: {
	            type: 'category',
	            labels: {
	                rotation: -45,
	                style: {
	                    fontSize: '13px',
	                    fontFamily: 'Verdana, sans-serif'
	                }
	            }
	        },
	        yAxis: {
	            min: 0,
	            title: {
	                text: 'Total income in euros'
	            }
	        },
	        legend: {
	            enabled: false
	        },
	        tooltip: {
	            pointFormat: 'Total income: <b>{point.y:.1f}</b>'
	        },
	        series: [{
	            name: 'Population',
	            data: data,
	            dataLabels: {
	                enabled: true,
	                rotation: -90,
	                color: '#FFFFFF',
	                align: 'right',
	                x: 4,
	                y: 10,
	                style: {
	                    fontSize: '13px',
	                    fontFamily: 'Verdana, sans-serif',
	                    textShadow: '0 0 3px black'
	                }
	            }
	        }]
	    });
	});
}