import { QuestionVersion } from "../models/QuestionVersion";
import { GetVariable, SetVariable, StorageVariable } from "../utils/localStorage";
import { Delete, Get, Post, Put } from "./dbContext";

/**
 * Fetches all existing versions for a given question.
 * @param surveyId 
 * @param questionId 
 * @returns An array of versions or undefined, if there was an error.
 */
export async function GetAllVersions(surveyId: string, questionId: string): Promise<QuestionVersion[]|undefined> {
    return await Get(`survey/${surveyId}/question/${questionId}/version`);
}

/**
 * Fetches a single version for a given question.
 * @param surveyId 
 * @param questionId 
 * @param versionId 
 * @returns The version with the corresponding ID or undefined if it doesn't exist.
 */
export async function GetVersion(surveyId: string, questionId: string, versionId: string): Promise<QuestionVersion|undefined> {
    return await Get(`survey/${surveyId}/question/${questionId}/version/${versionId}`);
}

/**
 * Adds a new version to the given question.
 * @param surveyId 
 * @param questionId 
 * @param version The ID field is ignored
 * @returns The added version, or undefined if there was an error.
 */
export async function AddVersion(surveyId: string, questionId: string, version: QuestionVersion): Promise<QuestionVersion|undefined> {
    const newVersion = await Post(`survey/${surveyId}/question/${questionId}/version`, version);

    const questions = GetVariable(StorageVariable.QUESTIONS);
    const versionsPerQuestion = GetVariable(StorageVariable.QUESTION_VERSIONS);
    if(questions && versionsPerQuestion) {
        const question = questions.find(x => x.ID === questionId);
        if(question) {
            question.HasVersions = true
        }

        const versions = versionsPerQuestion[questionId] ?? [];
        versions.push(newVersion);
        versionsPerQuestion[questionId] = versions;

        SetVariable(StorageVariable.QUESTIONS, questions);
        SetVariable(StorageVariable.QUESTION_VERSIONS, versionsPerQuestion);
    }

    return newVersion;
}

/**
 * Updates an existing version from the given question.
 * @param surveyId 
 * @param questionId 
 * @param versionId 
 * @param version The ID field is ignored
 */
export async function UpdateVersion(surveyId: string, questionId: string, versionId: string, version: QuestionVersion){
    const result = await Put(`survey/${surveyId}/question/${questionId}/version/${versionId}`, version);

    const versionsPerQuestion = GetVariable(StorageVariable.QUESTION_VERSIONS);
    if(versionsPerQuestion) {
        const versions = versionsPerQuestion[questionId] ?? [];

        versionsPerQuestion[questionId] = versions.map(x => {
            if(x.ID === versionId) {
                version.ID = versionId;
                return version;
            } else {
                return x;
            }
        });

        SetVariable(StorageVariable.QUESTION_VERSIONS, versionsPerQuestion);
    }

    return result;
}

/**
 * Removes an existing version from the given question.
 * @param surveyId 
 * @param questionId 
 * @param versionId
 */
export async function DeleteVersion(surveyId: string, questionId: string, versionId: string) {
    const result = await Delete(`survey/${surveyId}/question/${questionId}/version/${versionId}`);

    const questions = GetVariable(StorageVariable.QUESTIONS);
    const versionsPerQuestion = GetVariable(StorageVariable.QUESTION_VERSIONS);
    if(questions && versionsPerQuestion) {
        const versions = versionsPerQuestion[questionId] ?? [];
        versionsPerQuestion[questionId] = versions.filter(x => x.ID !== versionId);

        const question = questions.find(x => x.ID === questionId);
        if(question) {
            question.HasVersions = versionsPerQuestion[questionId].length > 0;
        }

        SetVariable(StorageVariable.QUESTIONS, questions);
        SetVariable(StorageVariable.QUESTION_VERSIONS, versionsPerQuestion);
    }

    return result;
}