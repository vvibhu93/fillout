const { request } = require('express');

const { BEARER_TOKEN } = require('./credentials.js')
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

const EXTERNAL_API_ENDPOINT = "https://api.fillout.com/v1/api/forms/cLZojxk94ous/submissions";

app.post('/call-api', async (req, res) => {

    const conditions = req.body;
    console.log(BEARER_TOKEN);

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
  
  function evaluateSubmission(submission,conditions) {
    console.log(submission);
    return conditions.every(({ id, condition, value }) => {
      const question = submission.questions.find(q => q.id === id);
      if (!question) return false;
  
      switch (condition) {
        case "equals":
          return question.value === value;
        case "greater_than":
            if(question.type === 'DatePicker')
                return new Date(question.value) > new Date(value);
            else if (question.type === 'NumberInput')
                return  Number(question.value) > value;
        case "less_than":
            if(question.type === 'DatePicker')
                return new Date(question.value) < new Date(value);
            else if (question.type === 'NumberInput')
                return  Number(question.value) < value; 
        case "does_not_equal":
            if(question.type === 'DatePicker')
                return new Date(question.value) > new Date(value);
            else if (question.type === 'NumberInput')
                return  Number(question.value) > value;
            else
                return question.value !== value;       
        default:
          return false;
      }
    });
  }
  
  
  app.listen(PORT, () => {
    console.log("server listening on PORT:", PORT);
})

  
  