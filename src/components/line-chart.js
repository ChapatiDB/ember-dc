EmberDC.LineChartComponent = Ember.Component.extend( EmberDC.StackMixin, EmberDC.CoordinateGridMixin, {
  classNames: ['line-chart'],

  startDate: new Date(new Date()-86400000*29),
  endDate:   new Date(),

  createChart: function() {
    var self = this;

    if(this.get('group') == null){
        return false;
    }

    this.chart = dc.compositeChart('#'+this.$().context.id);

    var charts = [];

    this.get('metrics').forEach(function(metric, i) {
      charts.push(
        dc.lineChart(self.chart)
        .group(self.get('group'), metric.label)
        .valueAccessor(function (d) {
          return d.value[metric.value];
        })
        .dotRadius(10)
        .renderArea(true)
        .renderDataPoints({radius: 2})
        .brushOn(self.brushOn)
      )

    });

    this.chart
      .x(d3.time.scale().domain([this.startDate, this.endDate]))
      .xUnits(d3.time.days)
      //.renderArea(this.renderArea)
      .elasticY(this.elasticY)
      .brushOn(this.brushOn)
      .renderHorizontalGridLines(true)
      //.renderDataPoints({radius: 4})
      .ordinalColors(["#56B2EA","#E064CD","#F8B700","#78CC00","#7B71C5"])
      .shareColors(true)
      .compose(charts)
      .legend(dc.legend().horizontal(1).itemWidth(70).x(10).y(this.height-20).gap(5))
      .yAxisPadding(this.yAxisPadding)
      .title(function (p) {
          return [p.key,
                 "Spend: " + p.spend]
                 .join("\n");
      })
      .yAxis().ticks(5).tickFormat(d3.format("d"));

    this.renderChart();

  }.on('didInsertElement').observes('group')

});
