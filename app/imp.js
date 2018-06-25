var os = require('os');
SysMon = new Mongo.Collection('sysmon');

function buildLineChart(){
   
   Highcharts.setOptions({          
                global : {
                    useUTC : false
                }
            }); 
  
   return new Highcharts.Chart({
    chart: {
        renderTo: 'lineChart1',
        type: 'spline'
    },
    title: {
        text: 'Cpu Load Average Chart'
    },
   
    xAxis: {
        type: 'datetime',
        dateTimeLabelFormats: { // don't display the dummy year
            //month: '%e. %b',
            //year: '%b'
	    //hour: '%H:%M',
	    second: '%H:%M:%S',
        },
        title: {
            text: 'Timestamp'
        }
    },
    yAxis: {
        title: {
            text: 'Load Avg'
        },
        min: 0
    },
    tooltip: {
        headerFormat: '<b>{series.name}</b><br>',
        //pointFormat: '{point.x:%e. %b}: {point.y:.2f} m'
        pointFormat: '{point.x:%H:%M}: {point.y:.2f}'
    },
    plotOptions: {
        spline: {
            marker: {
                enabled: true
            }
        }
    },
    colors: ['#6CF', '#39F', '#06C', '#036', '#000'],
    series: [{
        name: "CPU 1 min load average",
        data: []
    }]
});
}

if (Meteor.isServer) {
  SyncedCron.add({
  name: 'Store System parameters in mongo db',
  schedule: function(parser) {
    // parser is a later.parse object
    return parser.text('every 1 min');
   },
  job: function() {
    console.log(os.loadavg());
    SysMon.insert({'timestamp':new Date().getTime(),'cpu_load_avg':os.loadavg()});
   }
  });

  SyncedCron.start();
}

if(Meteor.isClient){
    /*Template.home.rendered = function () {
        var chart = buildPie();
        this.autorun(function () {
            chart.series[0].setData(SysMon.find({}).fetch());
        });
    };*/
    Template.line1.rendered = function () {
        var chart = buildLineChart();
        this.autorun(function () {
	    var maxData=60;
	    var loadData = SysMon.find({}).fetch();
	    var arrayLength = loadData.length;
	    var myData=[];
            for (var i = 0; i < arrayLength; i++) {
	      if (i > maxData)
		break;
	      var dataElement = []
	      dataElement.push(loadData[i].timestamp);
             
	
	      dataElement.push(loadData[i].cpu_load_avg[0]);
	   
		
	      myData.push(dataElement);
            }
            chart.series[0].setData(myData);
        });
    };
}
function cpu{

var eID = document.getElementById("cpuLoad")
  
var cpuVal = eID.options[eID.selectedIndex].value;
 var cputxt = eID.options[eID.selectedIndex].text;
document.getElementById('lineChart1')
}
