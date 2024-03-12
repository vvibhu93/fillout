function validateConditions(conditions) {
    if (!Array.isArray(conditions)) {
      return 'Expected an array of conditions';
    }
    for (const condition of conditions) {
      if (typeof condition !== 'object' || !condition.id || !condition.condition || typeof condition.value === 'undefined') {
        return 'Each condition must be an object with id, condition, and value fields';
      }
    }
    return null; // Indicates valid conditions
}


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


  module.exports = {validateConditions,evaluateSubmission}