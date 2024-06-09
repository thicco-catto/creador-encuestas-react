import { Profile } from "../models/Profile";
import { Question } from "../models/Question";
import { QuestionVersion } from "../models/QuestionVersion";
import { Survey } from "../models/Survey";

export enum StorageVariable {
    SURVEY_INFO = "SurveyInfo",
    QUESTIONS = "Questions",
    PROFILES = "Profiles",
    QUESTION_VERSIONS = "QuestionVersions"

}

type StorageVariableTypes = {
    [StorageVariable.SURVEY_INFO]: Survey;
    [StorageVariable.QUESTIONS]: Question[];
    [StorageVariable.PROFILES]: Profile[];
    [StorageVariable.QUESTION_VERSIONS]: {[key: string]: QuestionVersion[]}
};


/**
 * Returns a varible from local storage. Automatically parses it from a JSON string.
 * 
 * Keep in mind that this returns a copy of the variable. To mutate its value use `SetVariable`.
 * @param variable 
 * @returns 
 */
export function GetVariable<T extends keyof StorageVariableTypes>(variable: T): StorageVariableTypes[T] | null {
    const fromLocalStorage = window.localStorage.getItem(variable);

    if(!fromLocalStorage) {
        return null;
    }

    return JSON.parse(fromLocalStorage);
}

/**
 * Sets a variable from local storage. Automatically parses it to a JSON string.
 * @param variable 
 * @param value 
 */
export function SetVariable<T extends keyof StorageVariableTypes>(variable: T, value: StorageVariableTypes[T]) {
    window.localStorage.setItem(variable, JSON.stringify(value));
}

/**
 * Removes a variable from local storage.
 * @param variable 
 */
export function RemoveVariable(variable: StorageVariable) {
    window.localStorage.removeItem(variable);
}