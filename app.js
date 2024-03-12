const { request } = require('express');

const { BEARER_TOKEN } = require('./credentials.js')
const {EXTERNAL_API_ENDPOINT} = require('./constants.js');

const {validateConditions,evaluateSubmission} = require('./validations.js')
const express = require('express')

const axios = require('axios');
const { json } = require('express/lib/response');

const app = express ();
app.use(express.json());

const PORT = process.env.PORT || 3000;

app.get("/status", (request,response) => {
    const status = {
        "Status": "Running"
    }

    response.send(status);
})

app.post('/call-api', async (req, res) => {

    const conditions = req.body;
    
    const validationError = validateConditions(conditions);
    if (validationError) {
      return res.status(400).json({ message: 'Invalid request body', error: validationError });
    }


    const {offset = 0, limit = 10} =req.query;

    try {
      const response = await axios.get(EXTERNAL_API_ENDPOINT, {
        params : {
            offset,
            limit
        },
        headers: {
          Authorization: 'Bearer'+' '+BEARER_TOKEN
        }
      });
      var obj = response.data.responses;
    
      const submissionsMeetingConditions = obj.filter((object)=> {
        return evaluateSubmission(object,conditions);
      });

      res.json(submissionsMeetingConditions);
    } catch (error) {
      res.status(500).json({ message: 'Error calling external API', error: error.message });
    }
  });
  
  app.listen(PORT, () => {
    console.log("server listening on PORT:", PORT);
})

  
  
