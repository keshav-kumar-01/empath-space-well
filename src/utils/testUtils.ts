
export const validateTestResponses = (responses: any[], totalQuestions: number): { isValid: boolean; unanswered: number } => {
  const unanswered = responses.filter(r => r === -1 || r === null || r === undefined).length;
  return {
    isValid: unanswered === 0,
    unanswered
  };
};

export const getCorrectNavigationPath = () => '/test-results';

export const generateUniqueId = (questionIndex: number, optionValue: any) => {
  return `option-${questionIndex}-${optionValue}`;
};
