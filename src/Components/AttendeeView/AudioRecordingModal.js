import React, {Component} from 'react';
import {connect} from 'react-redux'
// import Modal from 'react-modal'
import {ReactMic} from 'react-mic';
// import Loader from 'react-loader-spinner'

import { RaisedButton, FlatButton } from 'material-ui'
import { CircularProgress } from 'material-ui'
import { Divider } from 'material-ui'
// import { IconButton } from 'material-ui'
// import { FloatingActionButton } from 'material-ui';

import * as SingleAttendeeActions from '../../Actions/singleAttendee';


class AudioRecordingModal extends Component {

    constructor(props) {
        super(props)

        this.state = {
            audio: null,
            recording: false
        }
    }

    toggleRecording = () => {
        if (this.state.recording) {
            this.stopRecording()
        } else {
            this.startRecording()
        }
    }

    startRecording = () => {
        this.setState({recording: true})
    }

    stopRecording = () => {
        this.setState({recording: false})
    }

    previewRecording = () => {
        if (this.state.audio !== null) {
            let audio = document.getElementById("record-modal-audio-player")
            audio.src = this.state.audio.blobURL
            audio.play()
        }
    }

    submitRecording = () => {
        console.log("recording submitted!")
        this.props.uploadAudioBlobToFirebase(this.state.audio.blob)
        this.props.closeModal()
    }

    onData(recordedBlob) {
        // console.log('chunk of real-time data is: ', recordedBlob);
    }

    onStop = (recordedBlob) => {
        console.log('recordedBlob is: ', recordedBlob);
        
        


        this.setState({audio: recordedBlob})
    }

    
    viewStyle = {
        width: "95%",
        margin: "0 auto",
        maxWidth: "600px"
    }


    topDivStyle = {
        width: "100%",
        height: "40px",
        marginTop: "10px"
    }

    backBtnStyle = {
        float: "right",
        marginTop:"10px"
    }

    render() {

        if (this.props.singleAttendee.audioIsUploading) {
        return (
            <div style={this.viewStyle}>
                <div style={{marginTop: "10px"}}/>
                <CircularProgress
                    size={120}
                    thickness={6}
                />
                <p>Uploading your AudioClip</p>
            </div>)
        }

        return (
            <div style={this.viewStyle}>

                <audio id="record-modal-audio-player"/>

                <div style={this.topDivStyle}>
                    <FlatButton
                        style={this.backBtnStyle}
                        onClick={this.props.closeModal}
                        label={"Back"}/>
                </div>
    
                <h4 style={{marginBottom:"4px"}}>
                    Upload your AudioClip
                </h4>
                <h1 style={{marginTop:"4px"}}>
                    {this.props.thisAttendeeName}
                </h1>
    
                <Divider/>

                <div style={{margin: "5px 0"}}>
                    <ReactMic
                        style={{

                            margin:"auto"

                        }}
                        record={this.state.recording}
                        className="sound-wave"
                        onStop={this.onStop}
                        strokeColor="#999"
                    />
                </div>

                <Divider/>

                <div style={{marginBottom: "8px", marginTop: "10px"}}>
                    <RaisedButton
                        primary
                        onClick={this.toggleRecording}
                        label= {
                            (this.state.recording)
                                ? "Stop Recording"
                                : "Start Recording"
                        }
                    />
                </div>

                <div style={{marginBottom: "20px"}}>
                    <RaisedButton
                        primary
                        disabled={this.state.audio === null || this.state.recording}
                        onClick={this.previewRecording}
                        label={"Playback"}
                    />
                </div>

                <div>
                    <RaisedButton
                        secondary
                        disabled={this.state.audio === null || this.state.recording === true}
                        onClick={this.submitRecording} 
                        label={"Upload"}
                    />
                </div>


            </div>
        );
    }
}

const mapStateToProps = state => {
    return {singleAttendee: state.singleAttendee}
}

const mapDispatchToProps = dispatch => {
    return {
        uploadAudioBlobToFirebase: blob => dispatch(SingleAttendeeActions.uploadAudioBlobToFirebase(blob))
    }
}

export default connect(mapStateToProps, mapDispatchToProps)(AudioRecordingModal)
