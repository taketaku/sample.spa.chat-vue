import {
    GET_CHANNELS,
    SET_MESSAGES,
} from './mutation-types'

import { BaseURL } from '../constants/baseurl'

const get_message_path = cname => BaseURL + '/channels/' + cname + '/messages'

async function fetch_get_messages(cname) {
   const response = await fetch(get_message_path(cname)) 
   const json = await response.json()
   return json.messages
}

export default {
    [GET_CHANNELS] ({commit}) {
        async function fetch_api() {
            const response = await fetch(BaseURL + '/channels')
            const json = await response.json()
            commit(GET_CHANNELS, json.channels)
        }
        fetch_api()
    },
    async GET_MESSAGES ({commit}, cname) {
        const messages = await fetch_get_messages(cname)
        commit(SET_MESSAGES, messages)
    },
    async POST_MESSAGES ({commit}, {cname, message}) {
        const response = await fetch(get_message_path(cname), {
            method: 'POST',
            body: JSON.stringify({
                'body': message
            }),
            headers: {
                'Accept': 'application/json',
                'Content-Type': 'application/json'
            }
        })
        const json = await response.json()
        if(json.result === 'ok') {
            const messages = await fetch_get_messages(cname) 
            commit(SET_MESSAGES, messages)
        }
    }
}