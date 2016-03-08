var Prediction = React.createClass({
  render: function() {
    return (<h5>{this.props.value}</h5>);
  }
});

var Race = React.createClass({
  handleChange: function(event) {
    if(event.target.value.match(event.target.pattern) !== null) {
      let t = moment(event.target.value, event.target.placeholder);
      if(t.isValid()) {
        let pace = moment.duration({hour: t.hours(), minutes: t.minutes(), seconds: t.seconds()}).asSeconds() / this.props.distance;
        let prediction = pace * this.props.coefs[1] + this.props.coefs[0];
        this.props.handleChange(this.props.id, prediction);
      }
    } else {
        this.props.handleChange(this.props.id, null);
    }
  },
  render: function() {
    var identifier = "race-" + this.props.id;
    return (
      <div className="row">
        <div className="input-field col s12">
          <input id={identifier} required="true" pattern="([0-9]|0[0-9]|1[0-9]|2[0-3])(:[0-5][0-9]){2}" type="text" className="validate"
              placeholder="HH:mm:ss" onChange={this.handleChange} />
          <label htmlFor={identifier} className="active">{this.props.name}</label>
        </div>
      </div>
    );
  }
});

var RaceList = React.createClass({
  getInitialState: function() {
    return {prediction: "", values: []};
  },
  raceChange: function(race_id, value) {
    this.setState(function(prev) {
      let values = prev.values;
      values[race_id]= value;

      let s = values.filter(function(v) { return v !== null;});
      let avg = s.reduce(function(a, b) { return a + b; }) / s.length;

      console.log("--> raceChange(", race_id, ",", value,") => ", prev, " ++ ", s);

      let prediction = moment.duration(avg * 42.195, "seconds").format("HH:mm:ss");
      return {values: values, prediction: prediction};
    });
  },
  render: function() {
    var raceNodes = this.props.data.map(function(race) {
      return (
        <li key={race.id} className="collection-item">
          <form className="row">
            <Race distance={race.distance} name={race.name} coefs={race.coefs} id={race.id} handleChange={this.raceChange} />
          </form>
        </li>
      );
    }, this);
    return (
      <div className="row">
        <div className="col s6">
          <h4>Tus carreras</h4>
          <ul className="collection">
            {raceNodes}
          </ul>
        </div>
        <div className="col s6">
          <h4>Predicción</h4>
          <Prediction value={this.state.prediction} />
        </div>
      </div>
    );
  }
});

var RacesBox = React.createClass({
  loadRaces: function() {
    this.setState({data: [{ "id": 1, "name": "Mitja marató de Barcelona", "distance": 21.097,
        "coefs": [17.46392252375881, 1.0652642511197428] }, {
        "id": 2, "name": "Maratest 30KM", "distance": 30.000,
        "coefs": [-20.78259570397131, 1.1152896431124333] } ] })},
  getInitialState: function() {
    return {data: []};
  },
  componentDidMount: function() {
    this.loadRaces();
  },
  render: function() {
    return (<RaceList data={this.state.data} />);
  }
});

ReactDOM.render(
  <RacesBox/>,
  document.getElementById('app')
);
