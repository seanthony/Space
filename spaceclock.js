
var now = d3.time.year.floor(new Date());
var space = d3.select('body');
var width = 890
    height = 800,
    radius = Math.min(width, height),
    spacing = 0.035;
var formatMinute = d3.time.format("%-M minutes"),
    formatHour = d3.time.format("%-H hours"),
    formatDay = d3.time.format("%A"),
    formatDate = function(d) { d = d.getDate(); switch (10 <= d && d <= 19 ? 10 : d % 10) { case 1: d += "st"; break; case 2: d += "nd"; break; case 3: d += "rd"; break; default: d += "th"; break; } return d; };
var color = d3.scale.linear()
    .range(["hsl(44, 100%, 50%, 1)", "hsl(16, 100%, 50%, 1)"])
    .interpolate(function(a, b) { var i = d3.interpolateString(a, b); return function(t) { return d3.hsl(i(t)); }; });
var arcBody = d3.svg.arc()
    .startAngle(0)
    .endAngle(function(d) { return d.value * 2 * Math.PI; })
    .innerRadius(function(d) { return d.index * radius; })
    .outerRadius(function(d) { return (d.index + spacing) * radius; })
    .cornerRadius(6);
var arcCenter = d3.svg.arc()
    .startAngle(0)
    .endAngle(function(d) { return d.value * 2 * Math.PI; })
    .innerRadius(function(d) { return (d.index + spacing / 2) * radius; })
    .outerRadius(function(d) { return (d.index + spacing / 2) * radius; });

var svg = space.append("svg")
    .attr("width", width)
    .attr("height", height)
    .append("g")
      .attr("transform", "translate(" + width / 2 + "," + height / 2 + ")");

array = [1, 2, 3, 4, 5, 6, 7, 8, 9, 10, 11, 12, 13, 14, 15, 16, 17, 18, 19];

svg.selectAll("circle")
	 .data(array)
   .enter()
   .append("circle")
   .attr("stroke-width", .5)
   .style("fill", "white")
   .each(pulse);

function pulse() {
	var circle = svg.selectAll("circle");
		(function repeat() {
      circle = circle
                .transition()
                .attr("cx", function(){return ((width/2) - (Math.random() * width));})
                .attr("cy", function(){return ((height/2) - (Math.random() * height));})
                .transition()
  					    .duration(2500)
      					.attr("stroke-width", 1)
      					.attr("r", 0)
      					.transition()
      					.duration(2500)
      					.attr('stroke-width', 1)
      					.attr("r", function(){return (1 + (Math.random() * 7));})
                .transition()
  					    .duration(2500)
      					.attr("stroke-width", 1)
      					.attr("r", 0)
      					.ease('sine')
      					.each("end", repeat);
      })();
  }

// Planetary Specifics
var radii = {
          "sun": radius / 4.5,
          "earthOrbit": radius / 2.8,
          "earth": radius / 20,
          "moonOrbit": radius / 11.5,
          "moon": radius / 44
          };

// Sun
svg.append("circle")
    .attr("class", "sun")
    .attr("r", radii.sun)
      .style("fill", "rgba(255, 204, 0, 1.0)");

// Earth's orbit
svg.append("circle")
    .attr("class", "earthOrbit")
    .attr("r", radii.earthOrbit)
      .style("fill", "none")
      .style("stroke", "rgba(255, 204, 0, 0.25)");

// Current position of Earth in its orbit
var earthOrbitPosition = d3.svg.arc()
      .outerRadius(radii.earthOrbit + 1)
      .innerRadius(radii.earthOrbit - 1)
      .startAngle(0)
      .endAngle(0);
      svg.append("path")
        .attr("class", "earthOrbitPosition")
        .attr("d", earthOrbitPosition)
        .style("fill", "rgba(255, 204, 0, 0.75)");

// Earth
svg.append("circle")
    .attr("class", "earth")
    .attr("r", radii.earth)
    .attr("transform", "translate(0," + -radii.earthOrbit + ")")
      .style("fill", "rgba(113, 170, 255, 1.0)");

// Time of day
var day = d3.svg.arc()
    .outerRadius(radii.earth)
    .innerRadius(0)
    .startAngle(0)
    .endAngle(0);
    svg.append("path")
        .attr("class", "day")
        .attr("d", day)
        .attr("transform", "translate(0," + -radii.earthOrbit + ")")
        .style("fill", "rgba(53, 110, 195, 1.0)");

// Moon's orbit
svg.append("circle")
    .attr("class", "moonOrbit")
    .attr("r", radii.moonOrbit)
    .attr("transform", "translate(0," + -radii.earthOrbit + ")")
      .style("fill", "none")
      .style("stroke", "rgba(113, 170, 255, 0.25)");

// Current position of the Moon in its orbit
var moonOrbitPosition = d3.svg.arc()
    .outerRadius(radii.moonOrbit + 1)
    .innerRadius(radii.moonOrbit - 1)
    .startAngle(0)
    .endAngle(0);
    svg.append("path")
      .attr("class", "moonOrbitPosition")
      .attr("d", moonOrbitPosition)
      .attr("transform", "translate(0," + -radii.earthOrbit + ")")
        .style("fill", "rgba(113, 170, 255, 0.75)");

// Moon
svg.append("circle")
    .attr("class", "moon")
    .attr("r", radii.moon)
    .attr("transform", "translate(0," + (-radii.earthOrbit + -radii.moonOrbit) + ")")
      .style("fill", "rgba(150, 150, 150, 1.0)");

var field = svg.selectAll("g")
    .data(fields)
  .enter().append("g");

field.append("path")
    .attr("class", "arc-body");

field.append("path")
    .attr("id", function(d, i) { return "arc-center-" + i; })
    .attr("class", "arc-center");

field.append("text")
    .attr("dy", ".35em")
    .attr("dx", ".75em")
    .style("text-anchor", "start")
  .append("textPath")
    .attr("startOffset", "50%")
    .attr("class", "arc-text")
    .attr("xlink:href", function(d, i) { return "#arc-center-" + i; });

tick();

d3.select(self.frameElement).style("height", height + "px");

function tick() {
  if (!document.hidden) field
      .each(function(d) { this._value = d.value; })
      .data(fields)
      .each(function(d) { d.previousValue = this._value; })
    .transition()
      .ease("elastic")
      .duration(500)
      .each(fieldTransition);

  if (!document.hidden) field
        .each(function(d) { this._value = d.value; })
        .data(fields)
        .each(function(d) { d.previousValue = this._value; })
      .transition()
        .ease("elastic")
        .duration(500)
        .each(fieldTransition);

  setTimeout(tick, 1000 - Date.now() % 1000);
}

function fieldTransition() {
  var field = d3.select(this).transition();

  field.select(".arc-body")
      .attrTween("d", arcTween(arcBody))
      .style("fill", function(d) { return color(d.value); });

  field.select(".arc-center")
      .attrTween("d", arcTween(arcCenter));

  field.select(".arc-text")
      .text(function(d) { return d.text; });
}

function arcTween(arc) {
  return function(d) {
    var i = d3.interpolateNumber(d.previousValue, d.value);
    return function(t) {
      d.value = i(t);
      return arc(d);
    };
  };
}

function fields() {
  var now = new Date;
  return [
    {index: .18, text: formatMinute(now), value: now.getMinutes() / 60},
    {index: .14, text: formatHour(now),   value: now.getHours() / 24},
    {index: .10, text: formatDay(now),    value: (now.getDay() + 1) / 7},
    {index: .06, text: formatDate(now),   value: (now.getDate() - 1) / (32 - new Date(now.getYear(), now.getMonth(), 32).getDate())},
  ];
}

// Update the clock every second
setInterval(function () {
  now = new Date();
  var interpolateEarthOrbitPosition = d3.interpolate(earthOrbitPosition.endAngle()(), (2 * Math.PI * d3.time.seconds(d3.time.day.floor(now), now).length / d3.time.seconds(d3.time.day.floor(now), d3.time.day.ceil(now)).length));
  var interpolateDay = d3.interpolate(day.endAngle()(), (2 * Math.PI * d3.time.seconds(d3.time.minute.floor(now), now).length / d3.time.seconds(d3.time.minute.floor(now), d3.time.minute.ceil(now)).length));
  var interpolateMoonOrbitPosition = d3.interpolate(moonOrbitPosition.endAngle()(), (2 * Math.PI * d3.time.seconds(d3.time.hour.floor(now), now).length / d3.time.seconds(d3.time.hour.floor(now), d3.time.hour.ceil(now)).length));

  d3.transition().tween("orbit", function () {
    return function (t) {
      // Animate Earth orbit position
      d3.select(".earthOrbitPosition")
        .attr("d", earthOrbitPosition.endAngle(interpolateEarthOrbitPosition(t)));

      // Transition Earth
      d3.select(".earth")
        .attr("transform", "translate(" + radii.earthOrbit * Math.sin(interpolateEarthOrbitPosition(t) - earthOrbitPosition.startAngle()()) + "," + -radii.earthOrbit * Math.cos(interpolateEarthOrbitPosition(t) - earthOrbitPosition.startAngle()()) + ")");

      // Animate day
      // Transition day
      d3.select(".day")
        .attr("d", day.endAngle(interpolateDay(t)))
        .attr("transform", "translate(" + radii.earthOrbit * Math.sin(interpolateEarthOrbitPosition(t) - earthOrbitPosition.startAngle()()) + "," + -radii.earthOrbit * Math.cos(interpolateEarthOrbitPosition(t) - earthOrbitPosition.startAngle()()) + ")");

      // Transition Moon orbit
      d3.select(".moonOrbit")
        .attr("transform", "translate(" + radii.earthOrbit * Math.sin(interpolateEarthOrbitPosition(t) - earthOrbitPosition.startAngle()()) + "," + -radii.earthOrbit * Math.cos(interpolateEarthOrbitPosition(t) - earthOrbitPosition.startAngle()()) + ")");

      // Animate Moon orbit position
      // Transition Moon orbit position
      d3.select(".moonOrbitPosition")
        .attr("d", moonOrbitPosition.endAngle(interpolateMoonOrbitPosition(t)))
        .attr("transform", "translate(" + radii.earthOrbit * Math.sin(interpolateEarthOrbitPosition(t) - earthOrbitPosition.startAngle()()) + "," + -radii.earthOrbit * Math.cos(interpolateEarthOrbitPosition(t) - earthOrbitPosition.startAngle()()) + ")");

      // Transition Moon
      d3.select(".moon")
        .attr("transform", "translate(" + (radii.earthOrbit * Math.sin(interpolateEarthOrbitPosition(t) - earthOrbitPosition.startAngle()()) + radii.moonOrbit * Math.sin(interpolateMoonOrbitPosition(t) - moonOrbitPosition.startAngle()())) + "," + (-radii.earthOrbit * Math.cos(interpolateEarthOrbitPosition(t) - earthOrbitPosition.startAngle()()) + -radii.moonOrbit * Math.cos(interpolateMoonOrbitPosition(t) - moonOrbitPosition.startAngle()())) + ")");
    };
  });
}, 1000);
