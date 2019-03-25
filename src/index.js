import React from 'react';
import ReactDOM from 'react-dom';
import Io from 'socket.io-client'
import './bootstrap.min.css';
import './crossing.css';

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
      default: 
        return wtf;
    }
  }

  render( props ) {
    return (
      <div className="display-panel">
        <div className="row">
          <div className="col-sm">
            Gerald was an angry man
            <i className={this.getIcon()}></i> 
          </div>
        </div>
      </div>
    );
  }
}


class Control extends React.Component {
  render( props ) {
    return (
      <div className="control-panel">
        <div className="row">
          <div className="col-sm">
            <button type="button" className="btn btn-light" onClick={this.props.pressFn}>
              {this.props.crossingState}
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
    this.state = {
      response: 'Waiting',
      endpoint: 'http://localhost:8000',
      crossing: 'press',
    }
  }
  
  componentDidMount() {
    const endpoint = this.state.endpoint;
    const socket = Io( endpoint )
    socket.on( 'news', data => { 
      console.log( data );
      this.setState( { response: data.hello } 
    ) });
  }
  
  buttonPressed() {
    if( this.state.crossing === 'press' ) {
      this.setState( { crossing: 'wait' } );
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