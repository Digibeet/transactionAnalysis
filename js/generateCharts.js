var data = {};

function allowDrop(ev) {
    ev.preventDefault();
}

function drop(ev) {
    ev.preventDefault();
    console.log("File landed")
    var element = document.getElementById("fileInput");
    element.parentNode.removeChild(element);
    var files = ev.dataTransfer.files
    var textFile = files[0];
    var reader = new FileReader();
    var processInput = function(){
    	var result = reader.result;
    	var rows = result.split("\n")
    	var currentYear = rows[1].split(",")[0].substring(0,4);
    	var firstYear = rows[rows.length - 2].split(",")[0].substring(0,4);
    	var subtitle = firstYear + " - " + currentYear;
    	var sourcesOfIncomeByYear = {};
    	sourcesOfIncomeByYear[currentYear] = {};
    	console.log(sourcesOfIncomeByYear)
    	for(var rowIndex = 1; rowIndex < rows.length - 1; rowIndex++){
    		/*indexes:
    			0:Datum	1:Naam/Omschrijving 2:Rekening 3:Tegenrekening 4:Code 5:Af Bij 6:Bedrag (EUR) 7:bedrags(cents) 8:MutatieSoort 9:Mededelingen
    			*/
    		var cells = rows[rowIndex].split(",")
    		
    		if(cells[5] == "Bij"){
        		var year = cells[0].substring(0,4);
    			if(year != currentYear) {
    				sourcesOfIncomeByYear[year]= {};
    				currentYear = year;
    			}
    			var source = cells[1];
    			var amount = parseInt(cells[6].replace("\"", ""));
    			if(sourcesOfIncomeByYear[year][source])
    				sourcesOfIncomeByYear[year][source] += amount;
    			else
    				sourcesOfIncomeByYear[year][source] = amount;
    		}
    	}
    	data = sourcesOfIncomeByYear;
    	generateCharts(subtitle);
    }
	reader.onloadend = processInput;
	reader.readAsText(textFile)	
}

function generateIncomeChart(id, labels) {
	var series = [];
	for(year in data) {
		var incomeData = [];
    	for(source in data[year]) {
    		var amount = data[year][source];
    		incomeData.push([source, amount])
    	}
    	var serie = {
            name: 'Sources of income' + year,
            data: incomeData,
            dataLabels: {
                enabled: false,
                rotation: -90,
                color: '#FFFFFF',
                align: 'right',
                x: 4,
                y: 10,
                style: {
                    fontSize: '6px',
                    fontFamily: 'Verdana, sans-serif',
                    textShadow: '0 0 3px black'
                }
            }
        };
    	series.push(serie)
	}
	$(function () {
	    $("#"+id).highcharts({
	        chart: {
	            type: 'column',
	            zoomType: 'x',
	            events: {
	            	click: function(ev) {
	            		var chartId = this.container.id;
	            		var chartContainer = document.getElementById(chartId).parentNode;
	            		var chartContainerId = chartContainer.id
	            		if(chartContainerId == "zoomed") {
	            			console.log("Zoom removed")
	            			chartContainer.parentNode.removeChild(chartContainer);
	            		}
	            		else {
		            		var node = document.createElement("div");
		            		document.body.appendChild(node)
		            		var id = "zoomed";
		            		node.setAttribute("id", id)
		            		generateIncomeChart(id, true);
	            		}
	            	}
	            }
	        },
	        title: {
	            text: 'Sources of income'
	        },
	        credits: {
	            enabled: false
	        },
	        xAxis: {
	            type: 'category',
	            labels: {
	            	enabled: labels,
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
	        series: series
	    });
	});
}

function generateCharts(subtitle){
	var chartsNode = document.getElementById("charts"); 
	var node = document.createElement("div"); 
	node.setAttribute("class", "col-md-3")
	var id = "sourcesOfIncome"
	node.setAttribute("id", id);
	chartsNode.appendChild(node);
	generateIncomeChart(id, false)
}