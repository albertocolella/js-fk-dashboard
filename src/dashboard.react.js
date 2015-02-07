// TODO imparare browserify per includere tutti i js via npm

var Dashboard = React.createClass({
  getInitialState: function() {
    return {items: []};
  },
  componentDidMount: function() {
    this.setState({items: [4, 8, 15, 16, 23, 42]});
    
  },
  // http://blog.vjeux.com/2013/javascript/scroll-position-with-react.html
  componentWillUpdate: function() {
    var node = this.getDOMNode();
    this.scrollHeight = node.scrollHeight;
    this.scrollTop = node.scrollTop;
  },
   
  componentDidUpdate: function() {
    var node = this.getDOMNode();
    node.scrollTop = this.scrollTop + (node.scrollHeight - this.scrollHeight);
  },

  handleClick: function(index) {
    var items = this.state.items.filter(function(item, i) {
      return index !== i;
    });
    this.setState({items: items}, function() {
      if (items.length === 1) {
        this.refs.item0.animate();
      }
    }.bind(this));
  },
  render: function() {
    return (
      <div>
        {this.state.items.map(function(item, i) {
          var boundClick = this.handleClick.bind(this, i);
          return (
            <Graph onClick={boundClick} key={i} title={item} ref={'item' + i} />
          );
        }, this)}
        <a href="#" onClick={this.handleClick}>next</a>
      </div>
    );
  }
});

React.render(
  <Dashboard />,
  document.getElementById('content')
);