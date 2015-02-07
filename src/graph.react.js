// TODO imparare browserify per includere tutti i js via npm

var Graph = React.createClass({
  getInitialState: function() {
    return {data: []};
  },
  componentDidMount: function() {
    this.setState({data: [4, 8, 15, 16, 23, 42]});
    console.log(this.props)
    var data = [4, 8, 15, 16, 23, 42];

    var width = 420,
        barHeight = 20;

    var x = d3.scale.linear()
        .domain([0, d3.max(data)])
        .range([0, width]);

    var chart = d3.select(".chart")
        .attr("width", width)
        .attr("height", barHeight * data.length);

    var bar = chart.selectAll("g")
        .data(data)
      .enter().append("g")
        .attr("transform", function(d, i) { return "translate(0," + i * barHeight + ")"; });

    bar.append("rect")
        .attr("width", x)
        .attr("height", barHeight - 1);

    bar.append("text")
        .attr("x", function(d) { return x(d) - 3; })
        .attr("y", barHeight / 2)
        .attr("dy", ".35em")
        .text(function(d) { return d; });
    /*$.ajax({
      url: this.props.url,
      dataType: 'json',
      success: function(data) {
        this.setState({data: data});
      }.bind(this),
      error: function(xhr, status, err) {
        console.error(this.props.url, status, err.toString());
      }.bind(this)
    });*/
  },
  animate: function() {
    console.log('Pretend %s is animating', this.props.title);
  },
  render: function() {
    var graphStyle = {
      backgroundColor:"red"
    };
    return (
      <div onClick={this.props.onClick}>{this.props.title}
        <svg  style={graphStyle} className="chart"></svg>
      </div>
    );
  }
});
