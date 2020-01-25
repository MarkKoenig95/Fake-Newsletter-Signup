require("dotenv").config();
const express = require("express");
const bodyParser = require("body-parser");
const request = require("request");
const app = express();

var port = process.env.PORT || 3000;

var apiKey = process.env.API_KEY;
var userName = process.env.USERNAME;

app.use(bodyParser.urlencoded({extended: true}));

app.use(express.static("public"))

app.listen(port, () => {
    console.log("Listening on port", port);
});

app.get('/', (req, res) => {
    res.sendFile(__dirname + "/signup.html");
});

app.post('/', (req, res) => {

    let firstName = req.body.firstName;
    let lastName = req.body.lastName;
    let email = req.body.email;

    let url = 'https://us4.api.mailchimp.com/3.0/lists/959d1707df/members';
    let body = {
        email_address: email,
        status: "subscribed",
        merge_fields: {
            FNAME: firstName,
            LNAME: lastName
        }
    };

    body = JSON.stringify(body);    

    let options = {
        url: url,
        headers: {"Authorization": `${userName} ${apiKey}`},
        method: "post",
        body: body
    }

    request(options, (error, response, body) => {
        if(error){
            console.log("error processing new member", error);
            res.sendFile(__dirname + "/failure.html");
        } else {
            let code = response.statusCode;
            console.log("Process of new member returned with code", code);
            if (code > 199 && code < 300){
                res.sendFile(__dirname + "/success.html");
            }
            else
            {
                res.sendFile(__dirname + "/failure.html");
            }
        }       
    })
    

});

app.post('/failure.html', (req, res) => {
    res.redirect('/');
});