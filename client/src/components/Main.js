import React from 'react';
import { Switch, Route } from 'react-router-dom';
import Colors from './Colors';
import Modes from './Modes';
import RGBMode from './RGBMode';
import AddColor from './AddColor';
import EditColor from './EditColor';
import Schemes from './Schemes';
import EditScheme from './EditScheme';
import AddScheme from './AddScheme';

const Main = () => (
  <main>
    <Switch>
        <Route exact path='/' component={Modes} />
        <Route exact path='/colors' component={Colors} />
        <Route exact path='/colors/edit/:id' component={EditColor} />
        <Route exact path='/colors/add' component={AddColor} />
        {/* <Route exact path='/schemes' component={Schemes} /> */}
        {/* <Route exact path='/schemes/add' component={AddScheme} /> */}
        {/* <Route exact path='/schemes/edit/:name/:id' component={EditScheme} /> */}
        <Route exact path='/mode/rgb' component={RGBMode} />

        {/* <Route exact path='/mode/:id' component= {Mode} /> */}
      {/* 
          <Route exact path='/schemes/add' component={AddScheme} />
          <Route exact path='/schemes/:id' component={SchemeDetails} />
          
          
          <Route exact path='/colors/edit/:id' component={EditColor} />
          <Route exact path='/allColors' component={AllColors} /> 
      */}
      {/* <Route exact path='/meetups/:id' component={MeetupDetails} /> */}
      {/* <Route exact path='/meetups/edit/:id' component={EditMeetup} /> */}
    </Switch>
  </main>
)

export default Main;
  