// Code goes here

var app = angular.module('testapp', []);
app.controller('dummyCtrl', function($scope) {
  $scope.dummy = [{
      axisA: "11",
      axisB: "22"
    }, {
      axisA: "151",
      axisB: "2244"
    }, {
      axisA: "4411",
      axisB: "224"
    }, {
      axisA: "1a1",
      axisB: "224"
    }, {
      axisA: "76764r3",
      axisB: "22"
    }, {
      axisA: "788",
      axisB: "242"
    }, {
      axisA: "116",
      axisB: "22"
    }, {
      axisA: "47651",
      axisB: "223"
    }]
  /*$scope.dummy = [{
    axisA: 1,
    axisB: 1
  }, {
    axisA: 2,
    axisB: 2
  }, {
    axisA: 2,
    axisB: 2
  }, {
    axisA: 3,
    axisB: 3
  }, {
    axisA: 4,
    axisB: 4
  }, {
    axisA: 5,
    axisB: 5
  }, {
    axisA: 2.4,
    axisB: 3
  }, {
    axisA: 3,
    axisB: 3
  }, {
    axisA: 2.7,
    axisB: 4
  }, {
    axisA: 2.3,
    axisB: 3.3
  }];*/
});
app.directive('lineChart2d', function() {
  return {
    restrict: 'E',
    template: '<svg width="600" height="400"></svg>',
    scope: {
      'data': '=',
      'h': '=',
      'w': '='

    },
    link: function(scope, element, attrs) {
      /*------------------- INIT ---------------------*/
      var data = scope.data;
      var dataKeys = Object.keys(data[0]);
      var dataTypeX = typeof scope.data[0][dataKeys[0]];
      var dataTypeY = typeof scope.data[0][dataKeys[1]];
      var margin = {
          top: 30,
          right: 20,
          bottom: 50,
          left: 50
        },
        width = scope.w - margin.left - margin.right,
        height = scope.h - margin.top - margin.bottom;

      var svg = d3.select("svg");
      var g = svg.append("g").attr("transform", "translate(" + margin.left + "," + margin.top + ")");

      Array.prototype.contains = function(v) {
        for (var i = 0; i < this.length; i++) {
          if (this[i] === v) return true;
        }
        return false;
      };

      Array.prototype.unique = function() {
        var arr = [];
        for (var i = 0; i < this.length; i++) {
          if (!arr.contains(this[i])) {
            arr.push(this[i]);
          }
        }
        return arr;
      };
      /*---------------------SORT X axis-------------------------*/
      data.sort(function(x, y) {
        return d3.ascending(x[dataKeys[0]], y[dataKeys[0]]);
      });

      /*-------------------------------------------------------*/
      if (dataTypeX == 'string') {

        domX = data.map(function(d) {
          return (d[dataKeys[0]]);
        }).unique();
        console.log(domX);

      }


      if (dataTypeX == 'number') {
        var x = d3.scale.linear()
          .range([0, width]);

        x.domain(d3.extent(data, function(d) {
          return d[dataKeys[0]];
        }));
      }

      if (dataTypeX == 'string') {
        var x = d3.scale.ordinal()
          .rangePoints([0, width]);
        x.domain(domX);
      }
      if (dataTypeY == 'number') {
        var y = d3.scale.linear()
          .range([height, 0]);
        y.domain(d3.extent(data, function(d) {
          return d[dataKeys[1]];
        }));
      }

      if (dataTypeY == 'string') {
        var domY = data.map(function(d) {
          return (d[dataKeys[1]]);
        }).unique();
        console.log(domY);
        var y = d3.scale.ordinal()
          .rangePoints([height, 0]);
        y.domain(domY);
      }

      var xAxis = d3.svg.axis().scale(x)
        .orient("bottom");
      
      var yAxis = d3.svg.axis().scale(y)
        .orient("left");

      // Define the line
      var valueline = d3.svg.line()
        .x(function(d) {
          return x(d[dataKeys[0]]);
        })
        .y(function(d) {
          return y(d[dataKeys[1]]);
        });




      g.append("path")
        .attr("class", "line")
        .attr("data-legend", function(d) {
          return dataKeys[1]
        })
        .attr("d", valueline(data));

      // Add the X Axis
      g.append("g")
        .attr("class", "x axis")
        .attr("transform", "translate(0," + height + ")")
        .call(xAxis)
        .append("text")      
        .attr("x", scope.w/2)
        .attr("y",35)
        .style("text-anchor", "middle")
        .text(dataKeys[0])
        .style("fill","steelblue");

      // Add the Y Axis
      g.append("g")
        .attr("class", "y axis")
        .call(yAxis)
        .append("text")
        .attr("transform", "rotate(-90)")
        .attr("y",0-margin.left)
        .attr("x",0-(scope.h / 2))
        .attr("dy", "1em")
        .style("text-anchor", "middle")
        .text(dataKeys[1])
        .style("fill","steelblue");
      /*-------------LEGEND------------------------*/
      var legend = svg.append("g")
        .attr("class", "legend")
        //.attr("x", w - 65)
        //.attr("y", 50)
        .attr("height", 100)
        .attr("width", 200)
        .attr('border', "2px")
        .attr('transform', 'translate(-20,50)')

      var newd = [];
      var cnt=0;
      for (i = 1; i < dataKeys.length; i++) {
        newd[cnt] = dataKeys[i];
        cnt++;
      }
      var legdata = newd,
        legendH = scope.w - 60;
      legend.selectAll('rect')
        .data(legdata)
        .enter()
        .append("rect")
        .attr("x", legendH)
        .attr("y", function(d, i) {
          return scope.h - 120 - i;
        })
        .attr("width", 10)
        .attr("height", 10)
        .style("fill", "steelblue")

      legend.selectAll('text')
        .data(legdata)
        .enter()
        .append("text")
        .attr("x", legendH + 15)
        .attr("y", function(d, i) {
          return scope.h - 120 - i + 9;
        })
        .text(function(d, i) {

          return d;
        });
      /*--------------------TOOLTIP-------------------------*/
      var div = d3.select("body").append("div")
        .attr("class", "tooltip")
        .style("opacity", 0);
      g.selectAll("dot")
        .data(data)
        .enter().append("circle")
        .attr("r", 5)
        .attr("cx", function(d) {
          return x(d[dataKeys[0]]);
        })
        .attr("cy", function(d) {
          return y(d[dataKeys[1]]);
        })
        .style('cursor','pointer')
        .on("mouseover", function(d) {
          div.transition()
            .duration(200)
            .style("opacity", .9);
          div.html(dataKeys[0] + ": " + d[dataKeys[0]] + "<br/>" + dataKeys[1] + ": " + d[dataKeys[1]])
            .style("left", (d3.event.pageX) + "px")
            .style("top", (d3.event.pageY - 28) + "px");
        })
        .on("mouseout", function(d) {
          div.transition()
            .duration(500)
            .style("opacity", 0);
        });

    }
  };

});