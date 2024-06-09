import { Profile } from "../models/Profile";
import { GetVariable, SetVariable, StorageVariable } from "../utils/localStorage";
import { Delete, Get, Post, Put } from "./dbContext";

/**
 * Fetches all of the profiles for the given survey.
 * @param surveyId
 * @returns An array containing every profile, or undefined if there was an error.
 */
export async function GetAllProfiles(surveyId: string): Promise<Profile[] | undefined> {
    return await Get(`survey/${surveyId}/profile`);
}

/**
 * Fetches a single profile for the given survey.
 * @param surveyId 
 * @param profileId 
 * @returns The profile with the corresponding ID, or undefined if it doesn't exist.
 */
export async function GetProfile(surveyId: string, profileId: string): Promise<Profile | undefined> {
    return await Get(`survey/${surveyId}/profile/${profileId}`);
}

/**
 * Adds a new profile to the given survey.
 * @param surveyId 
 * @param profile The ID field will be ignored
 * @returns The added profile, with the updated ID, or undefined if there was an error.
 */
export async function AddProfile(surveyId: string, profile: Profile): Promise<Profile | undefined> {
    const newProfile = await Post(`survey/${surveyId}/profile`, profile);

    if(newProfile) {
        const profiles = GetVariable(StorageVariable.PROFILES);
        if(profiles) {
            profiles.push(newProfile);
            SetVariable(StorageVariable.PROFILES, profiles);
        }
    }

    return newProfile;
}

/**
 * Updates an existing profile in the given survey.
 * @param surveyId 
 * @param profileId 
 * @param profile The ID field will be ignored
 */
export async function UpdateProfile(surveyId: string, profileId: string, profile: Profile) {
    const result = await Put(`survey/${surveyId}/profile/${profileId}`, profile);
 
    const profiles = GetVariable(StorageVariable.PROFILES);
    if(profiles) {
        const updatedProfiles = profiles.map(x => {
            if(x.ID === profileId) {
                profile.ID = profileId;
                return profile;
            } else {
                return x;
            }
        });
        SetVariable(StorageVariable.PROFILES, updatedProfiles);
    }

    return result;
}

/**
 * Removes an existing profile from the given survey.
 * @param surveyId 
 * @param profileId 
 * @returns 
 */
export async function DeleteProfile(surveyId: string, profileId: string) {
    const result = await Delete(`survey/${surveyId}/profile/${profileId}`);

    const profiles = GetVariable(StorageVariable.PROFILES);
    if(profiles) {
        const filteredProfiles = profiles.filter(x => x.ID !== profileId);
        SetVariable(StorageVariable.PROFILES, filteredProfiles);

        // TODO: Remove the profile from related versions
    }

    return result;
}