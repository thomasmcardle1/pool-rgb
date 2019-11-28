import React, { Component } from 'react';
import { Link } from 'react-router-dom';

import Navbar from 'react-bootstrap/Navbar'
import Nav from 'react-bootstrap/Nav'

class CustomNav extends Component {
  constructor(props){
    super(props);
    this.state = {
      navExpanded: false
    }
    this.setNavExpanded = this.setNavExpanded.bind(this);
    this.close = this.close.bind(this);
  }

  setNavExpanded() {
    this.setState({navExpanded: !this.state.navExpanded})
  }

  close(e) {
    e.preventDefault();
    console.log('close');
    this.setState({navExpanded: false});
  }

  render() {
    return (
      <Navbar  collapseOnSelect variant="dark" bg="dark" expand="" onSelect={this.close} onToggle={this.setNavExpanded} expanded={this.state.navExpanded}>
        <Navbar.Brand><Link style={{textDecoration: 'none'}}to="/">Pool Lights </Link></Navbar.Brand>
        <Navbar.Toggle aria-controls="basic-navbar-nav" />
        <Navbar.Collapse id="basic-navbar-nav">
          <Nav className="mr-auto" onSelect={this.close}>
            <Link to="/" className="pb-2"> <i className="fa fa-exchange-alt"></i> Modes </Link>
            <Link to="/schemes" className="pb-2"> <i className="fa fa-spinner"></i> Schemes </Link>
            <Link to="/colors/add" className="pb-2"> <i className="fa fa-plus"></i> Add Color </Link>
            <Link to="/colors" className="pb-2"> <i className="fa fa-swatchbook"></i> All Colors </Link>
          </Nav>
        </Navbar.Collapse>
      </Navbar>

      // <nav className="navbar navbar-inverse">
        // <ul className="nav navbar-nav">
        //   <li>
        //     <Link to="/"> <i className="fa fa-exchange-alt"></i> Modes </Link>
        //   </li>
        //   <li>
        //     <Link to="/schemes"> <i className="fa fa-spinner"></i> Schemes </Link>
        //   </li>
        //   <li>
        //     <Link to="/colors/add"> <i className="fa fa-plus"></i> Add Color </Link>
        //   </li>
        //   <li>
        //     <Link to="/allColors"> <i className="fa fa-swatchbook"></i> All Colors </Link>
        //   </li>
        //   <li>
        //     <Link to="/about"> <i className="fa fa-question-circle"></i> About</Link>
        //   </li>
        // </ul>
      // </nav>
    )
  }
}

export default CustomNav;
