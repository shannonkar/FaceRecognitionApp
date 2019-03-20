import React, { Component } from 'react';
import Navigation from './components/Navigation/Navigation';
import ImageLinkForm from './components/ImageLinkForm/ImageLinkForm';
import FaceRecognition from './components/FaceRecognition/FaceRecognition';
import Particles from 'react-particles-js';
import Clarifai from 'clarifai';
import Rank from './components/Rank/Rank';
import './App.css';


const app = new Clarifai.App({
 apiKey: 'c7414b906002457fac9635ce32fbec27'
});

const particlesOptions ={
               particles: {
                number: {
                  value: 30,
                  density: {
                    enable: true,
                    value_area: 300
                }
             },
              interactivity: {
          events: {
              onhover: {
                  enable: true,
                  mode: "grab",
                  
              },
              onclick: {
                  enable: true,

                  
              }
          },
          }
              
}
}
class App extends Component {
  constructor(){
    super();
    this.state = {
      input: '',
      imageUrl: ''

    }
  }
  onInputChange = (event) => {
    this.setState({input: event.target.value});
  }
  onButtonSubmit = () => {
    this.setState({imageUrl: this.state.input})
    console.log('click');
    app.models.predict(
      Clarifai.FACE_DETECT_MODEL, 
      this.state.input)
    .then(
    function(response) {
      console.log(response.outputs[0].data.regions[0].region_info.bounding_box);
      // do something with response
    },
    function(err) {
      // there was an error
    }
  );
  }
  render() {
    return (
      <div className="App">
       <Particles className ='particles'
              params={ particlesOptions } />
        <Navigation />
       <Rank />
        <ImageLinkForm 
        onInputChange ={this.onInputChange}
        onButtonSubmit ={this.onButtonSubmit}
        />
        <FaceRecognition imageUrl ={this.state.imageUrl}/>
       {/*<Logo />*/}
      </div>
     
    );
  }
}

export default App;
