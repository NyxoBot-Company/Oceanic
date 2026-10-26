/** @module Role */
import Base from "./Base";
import type Guild from "./Guild";
import type * as Types from "../types/namespaced";
import type Client from "../Client";
/** Represents a role in a guild. */
export default class Role extends Base {
    private _cachedGuild?;
    /** The primary color of this role. */
    color: number;
    /** The id of the guild this role is in. */
    guildID: string;
    /** The icon has of this role. */
    icon: string | null;
    /** If this role is managed by an integration. */
    managed: boolean;
    /** The name of this role. */
    name: string;
    /** The allowed permissions of this role, as a bigint. */
    permissionsAllow: bigint;
    /** The position of this role. */
    position: number;
    /** The secondary color of this role, or 0 if it has none. */
    secondaryColor: number;
    constructor(data: Types.Guilds.RawRole, client: Client, guildID: string);
    protected update(data: Partial<Types.Guilds.RawRole>): void;
    /** The guild this role is in. This will throw an error if the guild is not cached. */
    get guild(): Guild;
    /** A string that will mention this role. */
    get mention(): string;
    /**
     * Delete this role.
     * @param reason The reason for deleting the role.
     */
    delete(reason?: string): Promise<void>;
    /**
     * Edit this role.
     * @param options The options for editing the role.
     */
    edit(options: Types.Guilds.EditRoleOptions): Promise<Role>;
    toJSON(): Types.JSON.JSONRole;
}
