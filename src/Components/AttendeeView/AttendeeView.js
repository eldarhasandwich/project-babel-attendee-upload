import React, {Component} from 'react';
import {connect} from 'react-redux'
import {Audio} from 'redux-audio-fixed'
import AudioRecordingModal from './AudioRecordingModal'

import TextField from 'material-ui/TextField'
import RaisedButton from 'material-ui/RaisedButton'
import CircularProgress from 'material-ui/CircularProgress'
import Divider from 'material-ui/Divider'

import * as SingleAttendeeActions from '../../Actions/singleAttendee'
import {actions as audioActions} from 'redux-audio-fixed'
import { FlatButton } from 'material-ui';


class AttendeeView extends Component {

    constructor(props) {
        super(props)

        this.state = {
            attendeeKey: "",
            modalIsOpen: false
            // showIncorrectCodeMessage: false
        }

        this.playAttendeeAudio = this.playAttendeeAudio.bind(this)
        this.openModal = this.openModal.bind(this)
        this.closeModal = this.closeModal.bind(this)
    }


    accessParamKey() {
        let search = window.location.search
        let params = new URLSearchParams(search)
        let attKey = params.get('k')
        return (attKey === null) ? "" : attKey
    }   

    updateAttendeeKey (input) {
        this.setState({attendeeKey: input.target.value})
    }

    setAttendeeKey (newValue) {
        this.setState({attendeeKey: newValue})
    }

    submitAttendeeKey () {
        if (this.state.attendeeKey === null) {
            return;
        }
        let key = this.state.attendeeKey.split("~")
        if (key.length !== 3) {
            return;
        }
        this.props.pullAttendee(key[0], key[1], key[2])
        this.setAttendeeKey("")
    }

    unloadAttendee () {
        this.props.setLoadedStatus(false)
    }

    giveOrderPosString () {
        let orderInt = this.props.singleAttendee.singleAttendee.orderPos + 1
        let ordinalInidcator = 'th'
        switch(String(orderInt).slice(-1)[0]) {
            case '1': {
                ordinalInidcator = 'st'
                break
            }
            case '2': {
                ordinalInidcator = 'nd'
                break
            }
            case '3': {
                ordinalInidcator = 'rd'
                break
            }
            default : {}
        }
        return "Ceremony Order Position: " + orderInt + ordinalInidcator
    }

    getAttendeeAudio() {
        // console.log("generating audio")
        let url = this.props.singleAttendee.singleAttendee.audioSrc
        console.log(url)
        return <Audio
            src={url}
            autoPlay={false}
            controls={false}
            command='none'
            preload={"auto"}
            uniqueId={`attendeeView-Audio`}/>
    }

    playAttendeeAudio() {
        // console.log("playing audio")
        this.props.playAudio('attendeeView-Audio')
    }

    openModal() {
        this.setState({modalIsOpen: true})
    }

    closeModal() {
        this.setState({modalIsOpen: false})
    }

    componentWillMount () {
        let attendeeKey = this.accessParamKey()
        this.setAttendeeKey(attendeeKey)
    }

    componentDidMount () {
        window.history.replaceState(null, null, window.location.pathname);
        this.submitAttendeeKey()
    }

    viewStyle = {
        width: "95%",
        margin: "0 auto",
        maxWidth: "600px"
    }

    render () {
        if (!this.props.singleAttendee.attendeeLoaded) {
            return (
                <div style={this.viewStyle}>

                    {(this.props.singleAttendee.attendeeInfoIsLoading)
                        ?(<LoaderWithText
                            loaderType="Bars"
                            loadingText="Loading this Key..."/>)

                        :(<AttendeeKeyInputField
                            value={this.state.attendeeKey}
                            updateAttendeeKey={this.updateAttendeeKey.bind(this)}
                            submitAttendeeKey={this.submitAttendeeKey.bind(this)}
                            showIncorrectKeyMsg={this.props.singleAttendee.showIncorrectKeyMsg}/>)
                    }
                </div>
            )
        }

        if (this.props.singleAttendee.audioIsUploading) {
            return (
                <LoaderWithText
                    loaderType="Bars"
                    loadingText="Uploading Voiceclip..."/>
            )
        }

        if (!this.state.modalIsOpen) {
            return (
                <div style={this.viewStyle}>
                    {/* {this.getAttendeeAudio()} */}
    
                    <AttendeeInterface
                        thisAttendee={this.props.singleAttendee.singleAttendee}
                        unloadAttendee={this.unloadAttendee.bind(this)}
                        playAttendeeAudio={this.playAttendeeAudio}
                        giveOrderPosString={this.giveOrderPosString.call(this)}
                        openModal={this.openModal}
                    />
    
                </div>
            )
        }

        return (
            <AudioRecordingModal
                closeModal={this.closeModal}
                thisAttendeeName={this.props.singleAttendee.singleAttendee.name}
            />
        )
    }
}

class AttendeeInterface extends Component {

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
        return (
            <div>
                <div style={this.topDivStyle}>
                    <FlatButton
                        style={this.backBtnStyle}
                        onClick={this.props.unloadAttendee}
                        label={"Back"}/>
                </div>

                
                <h1>{this.props.thisAttendee.name}</h1>

                <Divider/>

                <h4 style={{marginBottom:"4px"}}>
                    {this.props.giveOrderPosString}
                </h4>
                <h4 style={{marginTop:"4px"}}>
                    {"Audio: " + this.props.thisAttendee.audioStatus}
                </h4>

                <div style={{overflow: "auto"}}>
                    <RaisedButton
                        style={{float:"right"}}
                        primary={true}
                        onClick={this.props.openModal}
                        label={"Upload Audio"}
                    />
                </div>
            </div>
        )
    }
}


class LoaderWithText extends Component {

    render() {
        return (
            <div style={{width:"100%"}}>
                <div style={{width:"100%", height: "10px"}}/>
                <div style={{display:"table",margin:"auto"}}>
                    <CircularProgress
                        size={120}
                        thickness={6}
                    />
                </div>
                <p style={{margin:"auto", textAlign:"center", marginTop:"5px"}}>{this.props.loadingText}</p>
            </div>)
    }
}

class AttendeeKeyInputField extends Component {

    gapStyle = {
        height: "10px"
    }

    render() {
        return (
            <div style={{overflow: "auto"}}>
                <TextField
                    fullWidth
                    value={this.props.value}
                    onChange={this.props.updateAttendeeKey}
                    floatingLabelText={"Provide your Unique Attendee Key"}
                    errorText={(this.props.showIncorrectKeyMsg)
                        ? "The Attendee-Key you entered was Incorrect, Please try again."
                        : ""}
                />

                <div
                    style={this.gapStyle}/>

                    <RaisedButton
                        style={{float:"right"}}
                        primary={true}
                        fullWidth={false}
                        label={"Enter"}
                        onClick={this.props.submitAttendeeKey}
                    />
                
            </div>
        )
    }
}

const mapStateToProps = state => {
    return {singleAttendee: state.singleAttendee}
}

const mapDispatchToProps = dispatch => {
    return {
        pullAttendee: (companyID, listID, attendeeID) => dispatch(SingleAttendeeActions.pullAttendee(companyID, listID, attendeeID)),
        setLoadedStatus: bool => dispatch(SingleAttendeeActions.setAttendeeLoadedStatus(bool)),
        playAudio: (audioId) => dispatch(audioActions.audioPlay(audioId))
    }
}

export default connect(mapStateToProps, mapDispatchToProps)(AttendeeView)