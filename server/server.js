const express = require('express')
const app = express()
const cors = require('cors')
const querystring = require('querystring');

const cookieParser = require('cookie-parser');

require('dotenv').config()
require('./configs/mongoose.config')

app.use(cors({ credentials: true, origin: 'http://localhost:3000' }))
app.use(express.json())
app.use(express.urlencoded({ extended: true }))
app.use(cookieParser());

const client_id = '33bccc55613d450fa0989687179fff2d'
const client_secret = 'dabd12c2812a4ff692c6b298c73d78bc'
const redirect_uri = 'http://localhost:3000/'

app.get('/login', (req, res) => {
    const scope = 'user-read-private user-read-email'; // Add required scopes
    res.redirect('https://accounts.spotify.com/authorize?' +
        querystring.stringify({
            response_type: 'code',
            client_id,
            scope,
            redirect_uri,
        }));
});

// Step 2: Handle Callback and Obtain Access Token
app.get('/', async (req, res) => {
    const code = req.query.code || null;

    const authOptions = {
        url: 'https://accounts.spotify.com/api/token',
        form: {
            code,
            redirect_uri,
            grant_type: 'authorization_code',
        },
        headers: {
            'Authorization': 'Basic ' + (new Buffer.from(client_id + ':' + client_secret).toString('base64')),
        },
        json: true,
    };

    try {
        const response = await axios.post(authOptions.url, querystring.stringify(authOptions.form));
        // You can save the access token and refresh token in your database here
        const access_token = response.data.access_token;
        const refresh_token = response.data.refresh_token;
        // Send the tokens to the client-side
        res.redirect(`http://localhost:3000/#/dashboard?access_token=${access_token}&refresh_token=${refresh_token}`);
    } catch (error) {
        console.error(error);
        res.redirect('/#/error');
    }
});


require('./routes/user.routes')(app)
// require('./routes/show.routes') (app)



app.listen(8000, () => console.log('Listening to port 8000'))