import express from 'express'
import { initializeApp } from'firebase/app'
import { getFirestore, doc, setDoc, collection } from "firebase/firestore";
import axios from 'axios';

import cors from 'cors';
const app = express()
app.use(express.json())
app.use(cors())

const firebaseApp = initializeApp({
  "projectId": "juaksee",
  "appId": "1:323635964318:web:572042d9848901ce660e8f",
  "storageBucket": "juaksee.appspot.com",
  "locationId": "europe-west",
  "apiKey": "AIzaSyC0nOCRSOELzeb9i30NP9E8l_4c0YB71fg",
  "authDomain": "juaksee.firebaseapp.com",
  "messagingSenderId": "323635964318"
});

const database = getFirestore(firebaseApp);

//https://www.strava.com/oauth/authorize?client_id=76862&response_type=code&redirect_uri=http://localhost:8080/exchange_token&approval_prompt=force&scope=read
//urli jolla saa käyttäjän tiedon luvun

app.get("/exchange_token", (req, res) => {

      console.log('exhancge token')
      const userRef = doc(collection(database, '/users'))
      const code = req.query.code
      console.log("posting user")
      let access_token
      let refresh_token
      let id

      axios.post(`https://www.strava.com/oauth/token?client_id=76862&client_secret=67401766aa8757e4f2c742595091a8d3014137c6&code=${code}&grant_type=authorization_code`, {})
      .then(response => {
        console.log(response.data)

        access_token = response.data.access_token,
        refresh_token = response.data.refresh_token,
        id = response.data.athlete.id

        res.json(response.data)
        })
      .finally(() => setDoc( userRef, {access_token: access_token, refresh_token: refresh_token, strava_id: id}))
      .catch(err => console.error(err)) 
  })



app.listen(process.env.PORT || 3000, () => {
  console.log(`server is runnin on ${process.env.PORT}`)
})