var Prediction = React.createClass({
  render: function() {
    return (<div className="rox"><h3>Predicción</h3><h5 class="blue-text">{this.props.value}</h5></div>);
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
        <div className="input-field col s12">
          <input id={identifier} required="true" pattern="([0-9]|0[0-9]|1[0-9]|2[0-3])(:[0-5][0-9]){2}" type="text" className="validate"
              placeholder="HH:mm:ss" onChange={this.handleChange} />
          <label htmlFor={identifier} className="active">{this.props.name}</label>
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
            <Race key={race.id} distance={race.distance} name={race.name} coefs={race.coefs} id={race.id} handleChange={this.raceChange} />
      );
    }, this);
    return (
      <div>
        <div className="col m12 l6">
            <div className="rox">
              <h3>Tus carreras</h3>
              {raceNodes}
            </div>
        </div>
        <div className="col m12 l6">
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
