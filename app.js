const express = require('express');
const graphqlHTTP = require('express-graphql');
const schema = require('./schema/schema');
const cors = require('cors');
const app = express();
const path = require('path');
require('dotenv').config()

app.use(cors());

// bind express with graphql
app.use('/graphql', graphqlHTTP({
    schema,
    graphiql: true
}));

app.use(express.static('public'));
app.get('*', (req, res) => {
    res.sendFile(path.resolve(__dirname, 'public', 'index.html'))
});

const PORT = process.env.PORT || 4000;

app.listen(PORT, () => {
    console.log('Now listening on port 4000');
});
