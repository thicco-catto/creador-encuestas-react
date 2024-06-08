import { Survey } from "../models/Survey";
import { Delete, Get, Post, Put } from "./dbContext";

const SurveyBackendPath = "survey";

/**
 * Fetches all the existing surveys in the application.
 * @returns An array containing every Survey, or undefined if there was an error.
 */
export async function GetAllSurveys(): Promise<Survey[]> {
    return await Get(SurveyBackendPath);
}

/**
 * Fetches a single survey.
 * @param id 
 * @returns The survey with the corresponding id, or undefined if it doesn't exist.
 */
export async function GetSurvey(id: string): Promise<Survey|undefined> {
    return await Get(`${SurveyBackendPath}/${id}`);
}

/**
 * Updates an existing survey.
 * @param id 
 * @param survey The ID field is ignored.
 */
export async function UpdateSurvey(id: string, survey: Survey) {
    return await Put(`${SurveyBackendPath}/${id}`, survey);
}

/**
 * Adds a new survey.
 * @param survey The ID field is ignored.
 * @returns The added survey, with the updated ID, or undefined if there was an error.
 */
export async function AddSurvey(survey: Survey) {
    return await Post(SurveyBackendPath, survey);
}

/**
 * Removes an existing survey.
 * @param id 
 */
export async function DeleteSurvey(id: string) {
    return await Delete(`${SurveyBackendPath}/${id}`);
}