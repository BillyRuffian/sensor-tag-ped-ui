import React from 'react';
import ReactDOM from 'react-dom';
import Io from 'socket.io-client';
import axios from 'axios';
import './bootstrap.min.css';
import './crossing.css';
import http from 'http';

// let socket = io( 'http://localhost:8000' )
// 
// socket.on('news', function (data) {
//   console.log(data);
//   socket.emit('my other event', { my: 'datax' });
// });

const halt="fas fa-hand-paper"
const wait="fas fa-male";
const walk="fas fa-walking";
const run="fas fa-running";
const disabled="fab fa-accessible-icon";
const wtf="fas fa-bomb";


class Display extends React.Component {
  getIcon() {
    switch( this.props.crossingState ) {
      case 'press':
        return halt;
      case 'wait':
        return wait;
      case 'cross':
        return walk;
      case 'dont-cross':
        return run;
      default: 
        return wtf;
    }
  }

  render( props ) {
    return (
      <div className="display-panel">
        <div className="row">
          <div className="col-sm text-center">
            <span className="person">
              <i className={this.getIcon()}></i>
            </span>
          </div>
        </div>
      </div>
    );
  }
}


class Control extends React.Component {
  getLabel() {
    switch( this.props.crossingState ) {
      case 'press':
        return 'Press';
      case 'wait':
        return 'Wait';
      case 'cross':
        return 'Walk';
      case 'dont-cross':
        return 'Hurry Up';
      default: 
        return wtf;
    }
  }

  render( props ) {
    return (
      <div className="control-panel">
        <div className="row">
          <div className="col-sm">
            <button type="button" className={"btn btn-light control-button control-button-"+this.props.crossingState} onClick={this.props.pressFn}>
              {this.getLabel()}
            </button>
          </div>
        </div>
      </div>
    );
  }
}


class Interface extends React.Component {
  constructor( props ) {
    super( props );
    this.buttonPressed = this.buttonPressed.bind( this );
    this.goCross = this.goCross.bind( this );
    this.goHurry = this.goHurry.bind( this );
    this.goStop = this.goStop.bind( this );
    this.state = {
      response: 'Waiting',
      endpoint: 'http://localhost:8000',
      crossing: 'press',
      humidity: 0.0,
      light: 0.0,
      irTemp: 0.0,
      ambientTemp: 0.0,
    }
  }
  
  componentDidMount() {
    
    setInterval( () => {
      axios.get( 'https://dweet.io:443/get/latest/dweet/for/adorable-street' )
      .then( response => response.data.with )
      .then( data => {
        if( data.length > 0 ) {
          this.setState( {
            humidity: data.humidity,
            light: data.light,
            irTemp: data.object_temp,
            ambientTemp: data.ambient_temp,
        } )}
      } );
    }, 50000 )
  }
  
  goStop() {
    this.setState( { crossing: 'press' } );
  }
  
  goHurry() {
    if( this.state.crossing === 'cross' ) {
      this.setState( { crossing: 'dont-cross' } );
      setTimeout( this.goStop, 3000 );
    }
  }
  
  goCross() {
    if( this.state.crossing === 'wait' ) {
      this.setState( { crossing: 'cross' } );
      setTimeout( this.goHurry, 3000 );
    }
  }
  
  buttonPressed() {
    if( this.state.crossing === 'press' ) {
      this.setState( { crossing: 'wait' } );
      setTimeout( this.goCross, 3000 );
    }
  }

  render() {
    return (
      // this.state.response
      <div>
        <Display crossingState={this.state.crossing} />
        <Control crossingState={this.state.crossing} pressFn={this.buttonPressed} />
      </div>
    );
  }
}


ReactDOM.render( 
  <Interface />,
  document.getElementById('root')
);