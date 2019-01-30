import React, { Component } from 'react';
import './App.css';
import axios from 'axios';
import ListMenu from './Components/ListVenues';
import Header from './Components/Header'
import SearchBar from './Components/SearchBar';
import escapeRegExp from 'escape-string-regexp';


class App extends Component {
  
  constructor(props) {
    super(props)
    this.state = {
      venues: [],
      markers: [],
      showVenues: [],
      filteredMarkers: [],
      query: '',
      venuePhoto: '',
      
  }}


  componentDidMount() {
    this.getVenues()
  }
  
  // load script and render the map
  renderMap = () => {
    loadScript("https://maps.googleapis.com/maps/api/js?key=AIzaSyBYi5z3xdE31FtV_NUvm7FOMmP2Cvvla3w&callback=initMap")
    window.initMap = this.initMap;
  }

  
  // load Foursquare API

  getVenues = () => {
    const apiEndpoint = "https://api.foursquare.com/v2/venues/explore?"
    const parameters = {
      client_id: "Q5GIYFO2PMJ5YXFLM1SNHOAFEHEOP2N14GGQ5J5TGSHD4Q4W",
      client_secret: "WATK25XI42NC31VRTVYC03ETAPXM40ZZBSCXALMHEUXX45YS",
      categoryId : '4bf58dd8d48988d10e941735',
      ll: "50.8503,4.3517",
      v: "20190101"
    }

    //source : https://github.com/axios/axios
    axios.get(apiEndpoint + new URLSearchParams(parameters))
    .then(response => {
      this.setState({
        venues: response.data.response.groups[0].items,
        showVenues: response.data.response.groups[0].items
      }, this.renderMap())
    })
    .catch(error => {
      alert(`Sorry, Foursquare fetch failed !`)
    })
  }



  initMap = () => {

    // Create the map. center on brussels

    var map = new window.google.maps.Map(document.getElementById('map'), {
      center: {lat: 50.8503, lng: 4.3517},
      zoom: 14
    })

    // Set infowindow settings
    const infowindow = new window.google.maps.InfoWindow({ 
      maxWidth: 200
    })

    this.infowindow = infowindow

    this.state.venues.map(current => {
    
      //map over the Markers and render them
      const marker = new window.google.maps.Marker({
        position: {lat: current.venue.location.lat , lng: current.venue.location.lng},
        map: map,
        title: current.venue.name,
        animation: window.google.maps.Animation.DROP
        })
      
        this.state.markers.push(marker)

      //Animate the marker
      function applyEffect() {
        marker.setAnimation(window.google.maps.Animation.BOUNCE)
        setTimeout(function(){ marker.setAnimation(null) }, 1000)
      }

      // Click on a marker open the infowindow
      marker.addListener('click', function() {
        infowindow.setContent(`Name : <b>${current.venue.name}</b> <br>Address : ${current.venue.location.address} 
        <br>`)
        applyEffect()
        infowindow.open(map, marker)
      })
    }
  )
  }

  // user filters the list items
  updateQuery = query => {
    this.setState({ query })
    this.state.markers.map(marker => marker.setVisible(true))
    let hiddenMarkers
    let filterVenues

    if (query) {
      const match = new RegExp(escapeRegExp(query), "i")
      filterVenues = this.state.venues.filter(current =>
        match.test(current.venue.name)
      )
      this.setState({ venues: filterVenues })
      hiddenMarkers = this.state.markers.filter(marker =>
        filterVenues.every(current => current.venue.name !== marker.title)
      )

      hiddenMarkers.forEach(marker => marker.setVisible(false))
      this.setState({ hiddenMarkers })
    } else {
      this.setState({ venues: this.state.showVenues })
      this.state.markers.forEach(marker => marker.setVisible(true))
    }
  }


  render() {
    if (this.state.hasError) {
      return <div id="Error-message" aria-label="Error message">Sorry, this didnt work.</div>
    } else {
      return (
      <main>
        
        <div id="header" aria-label="Header">
          <Header/>
          <div id='searchBarContainer'>Remember the name ? Search it !!! 
            <div id="SearchBar" aria-label="Search Bar">
              <SearchBar
                venues={ this.state.showVenues } 
                markers={ this.state.markers } 
                filteredVenues={ this.filteredVenues }
  	      	    query={this.state.query}
                clearQuery={this.clearQuery}	      	
	        	    updateQuery={b => this.updateQuery(b)}
	        	    clickLocation={this.clickLocation}
              /> <p></p>
            </div>
          </div>
        </div>
        
        <div id="container" aria-label="Menu Container">
          <ListMenu
            venues={ this.state.venues }
            markers={ this.state.markers }
          />
        </div>

        <div id="map" aria-label="Map" role="application">
        </div>
      </main>
    );
  }
  }
}

// script loader source : https://www.klaasnotfound.com/2016/11/06/making-google-maps-work-with-react/

function loadScript(url) {
  let index  = window.document.getElementsByTagName("script")[0]
  let script = window.document.createElement("script")
  script.src = url
  script.async = true
  script.defer = true
  index.parentNode.insertBefore(script, index)
  script.onerror = function() {
    alert("Error loading map!");
  };
}


export default App;