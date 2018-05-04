import React, {Component} from 'react';
import './App.css';
import AttendeeView from '../AttendeeView/AttendeeView';
import { MuiThemeProvider } from 'material-ui/styles';
import { Paper } from 'material-ui';

class App extends Component {

    appDivStyle = {
        width:"95%",
        maxWidth:"600px",
        margin:"10px auto",
    }

    paperStyle = {
        width:"100%",
        marignTop: "10px",
        paddingBottom:"15px"
    }

    render() {
        return (
            <div className="App" style={this.appDivStyle}>
                <MuiThemeProvider>
                    <div>
                        <h1 style={{textAlign:"right", fontWeight:"normal"}}>Vocalist Recorder</h1>
                        <div style={{height:"5px"}}/>
                        <Paper style={this.paperStyle} zDepth={3}>
                            <AttendeeView/>
                        </Paper>
                    </div>
                </MuiThemeProvider>
            </div>
        );
    }
}

export default App;

//testkey:  ?k=wsffRb4MTyMk1RPIYrzVMdcQfP22~-LA6GDl_iT69zNGwX-9K~-LA6Gpvl_OHDXPJQyhPD