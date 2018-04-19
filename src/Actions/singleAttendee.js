import Fire from '../Classes/Fire'
import {actions as audioActions} from 'redux-audio-fixed'

// ?_attKey=testCompany~-L98RvfDywenSp7GHgLQ~-L98_omkkBK2wuyWFNj5
// ?_attKey=testCompany~-L98RvfDywenSp7GHgLQ~-L99phpKLgK3IMvF8b46

export function pullAttendee(companyID, listID, attendeeID) {
    return (dispatch, getState) => {
        dispatch(setAttendeeInfoLoading(true))
        if (companyID === "" || listID === "" || attendeeID === "") {
            return;
        }
        let directory = "_COMPANIES/" + companyID + "/_LISTS/" + listID + "/_ATTENDEES/" + attendeeID
        console.log(directory)

        Fire
            .database()
            .ref(directory)
            .once("value", function (snapshot) {
                if (!snapshot.val()) {
                    // alert("The provided key is incorrect!")
                    dispatch(setIncorrectKeyStatus(true))
                    dispatch(setAttendeeInfoLoading(false))
                    return;
                }

                console.log(snapshot.val())

                Fire
                    .storage()
                    .ref(companyID + "/" + listID)
                    .child(attendeeID + ".mp3")
                    .getDownloadURL()
                    .then(function (url) {
                        dispatch(setSingleAttendee(snapshot.val(), companyID, listID, attendeeID, url))

                        dispatch(setAttendeeLoadedStatus(true))
                        dispatch(setIncorrectKeyStatus(false))
                        dispatch(setAttendeeInfoLoading(false))
                        dispatch(audioActions.audioSrc(`audio-${attendeeID}`, url))
                    })
                    .catch(function (error) {
                        dispatch(setSingleAttendee(snapshot.val(), companyID, listID, attendeeID, null))

                        dispatch(setAttendeeLoadedStatus(true))
                        dispatch(setIncorrectKeyStatus(false))
                        dispatch(setAttendeeInfoLoading(false))
                    })
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


        Fire
            .storage()
            .ref(companyKey + "/" + listKey + "/" + attendeeKey + ".mp3")
            .put(blob)
            .then(function (snapshot) {
                // dispatch(setAttendeeLoadedStatus(false))

                dispatch(pullAttendee(companyKey, listKey, attendeeKey))
                dispatch(setAudioIsUploading(false))

                Fire
                    .database()
                    .ref("_COMPANIES/" + companyKey + "/_LISTS/" + listKey + "/_ATTENDEES/" + attendeeKey)
                    .update({audioStatus: "Unverified"})
            })

    }
}
