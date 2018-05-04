import * as request from 'superagent'
import config from '../config'

import Fire from '../Classes/Fire'

export function pullAttendee(companyID, listID, attendeeID) {
    return (dispatch, getState) => {
        dispatch(setAttendeeInfoLoading(true))
        if (companyID === "" || listID === "" || attendeeID === "") {
            return;
        }

        request
            .get(config.api + "/attendee/load")
            .query({compID: companyID, listID: listID, attID: attendeeID})
            .then(function(res) {
                console.log(res)
                if (!res) {
                    dispatch(setIncorrectKeyStatus(true))
                    dispatch(setAttendeeInfoLoading(false))
                } else {
                    dispatch(setSingleAttendee(res.body, companyID, listID, attendeeID))
                    dispatch(setAttendeeLoadedStatus(true))
                    dispatch(setIncorrectKeyStatus(false))
                    dispatch(setAttendeeInfoLoading(false))
                }

            })

    }
}

export function setSingleAttendee(attendeeData, companyKey, listKey, attendeeKey, audioSrc=null) {
    return {type: "LOAD_IN_ATTENDEE", attendeeData, companyKey, listKey, attendeeKey, audioSrc}
}

export function setAttendeeLoadedStatus(bool) {
    return {type: "SET_ATTENDEE_LOADED_STATUS", bool}
}

export function setIncorrectKeyStatus(bool) {
    return {type: "SET_INCORRECT_KEY_STATUS", bool}
}

export function setAttendeeInfoLoading(bool) {
    return {type: "SET_ATTENDEE_INFO_LOADING", bool}
}

export function setAudioIsUploading(bool) {
    return {type: "SET_AUDIO_IS_UPLOADING", bool}
}

export function setUploadSuccessMessage(bool) {
    return {type: "SET_UPLOAD_SUCCESS_MESSAGE", bool}
}

export function uploadAudioBlobToFirebase(blob) {
    return (dispatch, getState) => {
        dispatch(setAudioIsUploading(true))
        let state = getState()
        let companyKey = state.singleAttendee.keys.companyKey
        let listKey = state.singleAttendee.keys.listKey
        let attendeeKey = state.singleAttendee.keys.attendeeKey

        // console.log(blob)


        Fire
            .storage()
            .ref(companyKey + "/" + listKey + "/" + attendeeKey + ".mp3")
            .put(blob)
            .then(function (snapshot) {

                dispatch(pullAttendee(companyKey, listKey, attendeeKey))
                dispatch(setAudioIsUploading(false))


                request
                    .post(config.api + "/attendee/uploadaudio")
                    .send({compID: companyKey, listID: listKey, attID: attendeeKey})
                    .then(
                        function(res) {
                            if (res.text === "success") {
                                dispatch(setAttendeeLoadedStatus(false))
                                dispatch(setAudioIsUploading(false))
                            }
                        }
                    )

            })

    }
}
