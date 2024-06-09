import { Question } from "../models/Question";
import { GetVariable, SetVariable, StorageVariable } from "../utils/localStorage";
import { Delete, Get, Post, Put } from "./dbContext";

/**
 * Fetches all of the questions for the given survey.
 * @param surveyId
 * @returns An array containing every question, or undefined if there was an error.
 */
export async function GetAllQuestions(surveyId: string): Promise<Question[]|undefined> {
    return await Get(`survey/${surveyId}/question`);
}

/**
 * Fetches a single question for the given survey.
 * @param surveyId 
 * @param questionId 
 * @returns The question with the corresponding ID, or undefined if it doesn't exist.
 */
export async function GetQuestion(surveyId: string, questionId: string): Promise<Question|undefined> {
    return await Get(`survey/${surveyId}/question/${questionId}`);
}

/**
 * Adds a new question for the given survey.
 * @param surveyId 
 * @param question The ID field will be ignored
 * @returns The added question, with the updated ID, or undefined if there was an error.
 */
export async function AddQuestion(surveyId: string, question: Question): Promise<Question | undefined> {
    const newQuestion = await Post(`survey/${surveyId}/question`, question);

    if(newQuestion) {
        const survey = GetVariable(StorageVariable.SURVEY_INFO);
        const questions = GetVariable(StorageVariable.QUESTIONS);

        if(survey && questions) {
            survey.QuestionOrder.push(newQuestion.ID);
            SetVariable(StorageVariable.SURVEY_INFO, survey);

            questions.push(newQuestion);
            SetVariable(StorageVariable.QUESTIONS, questions);
        }
    }

    return newQuestion;
}

/**
 * Updates an existing question in the given survey.
 * @param surveyId 
 * @param questionId 
 * @param question The ID field will be ignored
 */
export async function UpdateQuestion(surveyId: string, questionId: string, question: Question) {
    return await Put(`survey/${surveyId}/question/${questionId}`, question);
}

/**
 * Removes an existing question from the given survey.
 * @param surveyId 
 * @param questionId 
 * @returns 
 */
export async function DeleteQuestion(surveyId: string, questionId: string) {
    const result = await Delete(`survey/${surveyId}/question/${questionId}`);

    const survey = GetVariable(StorageVariable.SURVEY_INFO);
    const questions = GetVariable(StorageVariable.QUESTIONS);
    if(survey && questions) {
        survey.QuestionOrder = survey.QuestionOrder.filter(x => x !== questionId);
        SetVariable(StorageVariable.SURVEY_INFO, survey);

        const filteredQuestions = questions.filter(x => x.ID !== questionId);
        SetVariable(StorageVariable.QUESTIONS, filteredQuestions);
    }

    return result;
}