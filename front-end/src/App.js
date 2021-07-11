import logo from './logo.svg';
import './App.css';
import {BrowserRouter as Router, Switch, Route, NavLink} from 'react-router-dom';
import Patient from './components/Patient/Patient';
import HealthDataProvider from './components/HealthDataProvider/HealthDataProvider';

function App() {
  return (
    <div>
        <Router>
            <div>
                <nav id='mainNav'>
                    <NavLink activeClassName="currentTab" to="/patient">Patient</NavLink>
                    <NavLink activeClassName="currentTab" to="/health-data-provider">Health Data Provider</NavLink>
                </nav>

                <Switch>
                    <Route path="/patient"><Patient/></Route>
                    <Route path="/health-data-provider"><HealthDataProvider/></Route>
                </Switch>
            </div>
        </Router>
    </div>
  );
}

export default App;
