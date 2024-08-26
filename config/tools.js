const seniorAiTestEvaluator = require('./tools/senior_ai_test_evaluator.json');
const seniorAiDiagnosisEvaluator = require('./tools/senior_ai_diagnosis_evaluator.json');
const queryContextAnalyzer = require('./tools/query_context_analyzer.json');
const generalUserAssistant = require('./tools/general_user_assistant.json');


const TOOLS = {
    SENIOR_AI_TEST_ADVISOR: "senior_ai_test_advisor",
    SENIOR_AI_DIAGNOSIS_ADVISOR: "senior_ai_diagnosis_advisor",
    QUERY_CONTEXT_ANALYZER: "query_context_analyzer",
    PATIENT_DETAIL_INQUIRER: "patient_detail_inquirer",
    GENERAL_USER_ASSISTANT: "general_user_assistant"
  };

module.exports = {
  seniorAiTestEvaluator,
  seniorAiDiagnosisEvaluator,
  queryContextAnalyzer,
  generalUserAssistant,
  TOOLS
};
