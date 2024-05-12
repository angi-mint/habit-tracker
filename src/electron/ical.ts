import db from "../database/database";

async function connectToICal() {
    const { net } = require('electron');
    const creds = await db.getICalCredentials();
    if (!creds) return;

    const request = net.request(creds.url);
    request.setHeader('Authorization', 'Basic ' + Buffer.from(creds.username + ':' + creds.password).toString('base64'));
    return request;
}

async function fetchHabits() {
    const request = await connectToICal();
    if (!request) return;

    request.on('response', (response) => {
        console.log(`STATUS: ${response.statusCode}`)
        console.log(`HEADERS: ${JSON.stringify(response.headers)}`)
        response.on('data', (chunk) => {
            console.log(`BODY: ${chunk}`)
        });
    });
    request.end()
}

export { fetchHabits }