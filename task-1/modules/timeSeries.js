/**
 * Created by xingyueli on 2/4/16.
 */

d3.timeSeries=function() {
//internal variables
    //will need some default values which can be overridden
    var width = 800,
        height = 600,
        margin = {t: 50, b: 50, l: 20, r: 20},
        chartWidth = width - margin.l - margin.r,
        chartHeight = height - margin.t - margin.b;

    var timeRange = [new Date(), new Date()];
    var binSize = d3.time.week;
    //var value;
    var valueAccessor = function (d) {return d;}

    var scaleX = d3.time.scale(),
        scaleY = d3.scale.linear();

    scaleX.range([0, chartWidth]);
    scaleY.range([chartHeight, 0]);
    scaleX.domain(timeRange);
    scaleY.domain([0,1000]);

    var layout=d3.layout.histogram()
//export
    function interFace(_selection){

//layout.histogram function
        layout
            .value(valueAccessor)
            .range(timeRange)
            .bins(binSize.range(timeRange[0],timeRange[1]))

//draw
       _selection.each(
           function(_d){

               //prepare data,which is "tripsByStation" parsed in the javascript
               var data = layout(_d)

               //create svg elements
               var svg =d3.select('this').selectAll('svg')
                   .data([_d])

               //create generator
               var lineGenerator=d3.svg.line()
                   .x(function(d){return scaleX(d.x.getTime()+ d.dx/2)})
                   .y(function(d){return scaleY(d.y)})
                   .interpolate('step')

               var areaGenerator=d3.svg.area()
                   .x(function(d){return scaleX(d.x.getTime()+ d.dx/2)})
                   .y0(function(d){return scaleY(d.y)})
                   .y1(chartHeight)
                   .interpolate('step')

               var axisGenerator=d3.svg.axis()
                   .scale(scaleX)
                   .orient("bottom")
                   .ticks(d3.time.month)

               var svgEnter=svg.enter().append('svg')
               svgEnter
                   .append('g').attr('class','area').append('path').attr('transform','translate('+margin.l+','+ margin.t+')')
               svgEnter
                   .append('g').attr('class','line').append('path').attr('transform','translate('+margin.l+','+ margin.t+')')
               //svgEnter
               //    .append('g').attr('class','axis').attr('transform','translate('+margin.l+','+ (margin.t+chartHeight) +')')

               svgEnter.select('.area').select('path')
                   .datum(data)
                   .attr('d',areaGenerator)
               svgEnter.select('.line').select('path')
                   .datum(data)
                   .attr('d',lineGenerator)
               //svgEnter.select('.axis')
               //    .attr('d',axisGenerator)
              // var svgExit=svg.exit().remove()
           }
       )
    }

//Getters and Setters
    //modifying and access internal variables
    interFace.width=function(_x){
        if(!arguments.length) return width;
        width=_x;
        return this;//return width;
    }
    interFace.height=function(_x){
        if(!arguments.length) return height;
        height=_x;
        return this;
    }
    interFace.timeRange=function(_r){
        if(!arguments.length) return timeRange;
        timeRange=_r;
        return this;
    }
    interFace.binSize=function(interval){
        if(!arguments.length) return binSize;
        binSize=interval;
        return this;
    }
    interFace.value=function(accessor){
        if(!arguments.length) return valueAccessor;
        valueAccessor=accessor;
        return this;

    }
    //return exports at last
    return interFace;
}