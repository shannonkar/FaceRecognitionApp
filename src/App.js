import React, { Component } from 'react';
import Navigation from './components/Navigation/Navigation';
import ImageLinkForm from './components/ImageLinkForm/ImageLinkForm';
import FaceRecognition from './components/FaceRecognition/FaceRecognition';
import Signin from './components/Signin/Signin';
import Register from './components/Register/Register';
import Particles from 'react-particles-js';
import Clarifai from 'clarifai';
import Rank from './components/Rank/Rank';
import Logo from './components/Logo/Logo';

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
      imageUrl: '',
      box: {},
      route: 'signin',
      isSignedIn: false,
      user: {
        id: '',
        name: '',
        email: '',
        entries: 0,
        joined: ''
      }
    }
  }

loadUser = (data)=>{
  this.setState({
        id: data.id,
        name: data.name,
        email: data.email,
        entries: data.entries,
        joined: data.joined


  })
}
//Lifecycle hook
  // componentDidMount(){
  //   fetch('http://localhost:3001')
  //     .then(response => response.json())
  //     .then(console.log)
  // }
  calculateFaceLocation = (data) =>{
    const clarifaiFace = data.outputs[0].data.regions[0].region_info.bounding_box;
    const image = document.getElementById('inputimage');
    const width = Number(image.width);
    const height = Number(image.height);
    return {
      leftCol: clarifaiFace.left_col * width,
      topRow: clarifaiFace.top_row * height,
      rightCol: width - (clarifaiFace.right_col * width),
      bottomRow: height - (clarifaiFace.bottom_row * height)
    }
  }
  displayFaceBox = (box) =>{
    console.log(box);
    this.setState({box : box});
  }
  onInputChange = (event) =>{
    this.setState({input: event.target.value});
  }
  onButtonSubmit = () => {
    this.setState({imageUrl: this.state.input})
    app.models
    .predict(
      Clarifai.FACE_DETECT_MODEL, 
      this.state.input)
    .then(response => {
      if(response){
        fetch('http://localhost:3001/image',{
             method: 'put',
             headers: {'Content-Type': 'application/json'},
             body: JSON.stringify({
             id: this.state.user.id
              })
        })
          .then(response => response.json())
          .then(count => {
            this.setState(Object.assign(this.state.user, {entries: count}))
          })
      }
      this.displayFaceBox(this.calculateFaceLocation(response))
    })
    .catch(err => console.log(err));

  }
  onRouteChange = (route) =>{
    if(route === 'signout'){
      this.setState({isSignedIn: false})
    } else if (route ==='home'){
      this.setState({isSignedIn: true})
    }
    this.setState({route: route});
  }
  render() {
   const { isSignedIn, imageUrl, route, box } = this.state;
    return (
      <div className="App">
       <Particles className ='particles'
              params={ particlesOptions } />
       
        <Navigation isSignedIn = {isSignedIn} onRouteChange = {this.onRouteChange} />
        {route === 'home' 
        ? 
         <div> 
            <Rank />
            <Logo />
            <ImageLinkForm 
            onInputChange ={this.onInputChange}
            onButtonSubmit ={this.onButtonSubmit}
            />
            <FaceRecognition box ={box} imageUrl ={imageUrl}/>
       </div>
        : (
            this.state.route ==='signin'
            ?<Signin onRouteChange ={this.onRouteChange} />
            : <Register loadUser = {this.loadUser} onRouteChange ={this.onRouteChange} />
           )
           }
      </div>
     
    );
  }
}

export default App;
