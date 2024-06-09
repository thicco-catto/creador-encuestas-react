import { QuestionVersion } from "../models/QuestionVersion";
import { Delete, Get, Post, Put } from "./dbContext";

/**
 * Fetches all existing versions for a given question.
 * @param surveyId 
 * @param questionId 
 * @returns An array of versions or undefined, if there was an error.
 */
export async function GetAllVersions(surveyId: string, questionId: string): Promise<QuestionVersion[]|undefined> {
    await new Promise(f => setTimeout(f, 500));
    return [];
    // return await Get(`survey/${surveyId}/question/${questionId}/version`);
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
    return await Post(`survey/${surveyId}/question/${questionId}/version`, version);
}

/**
 * Updates an existing version from the given question.
 * @param surveyId 
 * @param questionId 
 * @param versionId 
 * @param version The ID field is ignored
 */
export async function UpdateVersion(surveyId: string, questionId: string, versionId: string, version: QuestionVersion){
    return await Put(`survey/${surveyId}/question/${questionId}/version/${versionId}`, version);
}

/**
 * Removes an existing version from the given question.
 * @param surveyId 
 * @param questionId 
 * @param versionId
 */
export async function DeleteVersion(surveyId: string, questionId: string, versionId: string) {
    return await Delete(`survey/${surveyId}/question/${questionId}/version/${versionId}`);
}