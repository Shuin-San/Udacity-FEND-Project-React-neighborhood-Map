import React, { Component } from 'react';
import { stack as Menu } from 'react-burger-menu';

// react burger menu styling
var styles = {
  bmBurgerButton: {
    position: 'fixed',
    width: '36px',
    height: '30px',
    left: '36px',
    top: '36px'
  },
  bmBurgerBars: {
    background: '#373a47'
  },
  bmBurgerBarsHover: {
    background: '#ffffff'
  },
  bmCrossButton: {
    height: '24px',
    width: '24px',
    top: '36px',
    right: '36px'
  },
  bmCross: {
    background: '#bdc3c7'
  },
  bmMenuWrap: {
    position: 'fixed',
    height: '100%'
  },
  bmMenu: {
    background: '#373a47',
    padding: '2.5em 1.5em 0',
    fontSize: '1.15em'
  },
  bmMorphShape: {
    fill: '#373a47'
  },
  bmItemList: {
    color: '#b8b7ad',
    padding: '0.8em',
    
  },
  bmItem: {
    display: 'inline-block'
  },
  bmOverlay: {
    background: 'rgba(0, 0, 0, 0.3)'
  }
}


class ListMenu extends Component {

  
  openMarker = locationName => {
    this.props.markers.map(marker => {
      if (marker.title === locationName) {
        window.google.maps.event.trigger(marker, "click")
      }
    })
  }

  
  render () {
    return (
      <Menu styles={ styles } isOpen noOverlay >
        <div className="listOfVenues" aria-label="List of Venues"> 
        {this.props.venues.map(current => (
            <li role="menuitem"
              onClick={() => {
                this.openMarker(current.venue.name);
              }}
              aria-label={current.venue.name}
              tabIndex="0"
              id={current.venue.id}
              key={current.venue.id}
            >
              <br/>
              <b>{current.venue.name}</b>
              <br/> 
              <i>{current.venue.location.address}</i>
            </li>))}
          <p>
            <i>Data fetched from Foursquare</i>
          </p>
          </div>
      </Menu>
    );
  }
}

export default ListMenu