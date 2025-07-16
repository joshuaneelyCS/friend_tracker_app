import Group from "@/shared/classes/Group";

export interface GroupListDAO {
    /**
     * Loads the list of groups from storage.
     * @returns A promise resolving to an array of Group objects.
     */
    loadGroupList(): Promise<Group[]>;

    /**
     * Saves the list of groups to storage.
     * @param groups - The array of Group objects to save.
     */
    saveGroupList(groups: Group[]): Promise<void>;
}