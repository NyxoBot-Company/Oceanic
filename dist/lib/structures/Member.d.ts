/** @module Member */
import Base from "./Base";
import type User from "./User";
import type Guild from "./Guild";
import type Permission from "./Permission";
import type VoiceState from "./VoiceState";
import type * as Types from "../types/namespaced";
import type { ImageFormat } from "../Constants";
import type Client from "../Client";
/** Represents a member of a guild. */
export default class Member extends Base {
    private _cachedGuild?;
    /** The member's avatar hash, if they have set a guild avatar. */
    avatar: string | null;
    /** When the member's [timeout](https://support.discord.com/hc/en-us/articles/4413305239191-Time-Out-FAQ) will expire, if active. */
    communicationDisabledUntil: Date | null;
    /** The id of the guild this member is for. */
    guildID: string;
    /** The date at which this member joined the guild. */
    joinedAt: Date | null;
    /** The timestamp (`Date.now()`) at which this member was last created or updated in the cache. Not included in {@link Member#toJSON | toJSON}, as that would break the change detection of events that compare JSON. */
    lastSeen: number;
    /** This member's nickname, if any. */
    nick: string | null;
    /** The roles this member has. */
    roles: Array<string>;
    /** The user associated with this member. */
    user: User;
    constructor(data: (Types.Guilds.RawMember | Types.Guilds.RESTMember) & {
        id?: string;
    }, client: Client, guildID: string);
    protected update(data: Partial<Types.Guilds.RawMember | Types.Guilds.RESTMember>): void;
    /** If the user associated with this member is a bot. */
    get bot(): boolean;
    /** The discriminator of the user associated with this member. Discriminators are no longer cached, so this is always "0". */
    get discriminator(): string;
    /** The nick of this member if set, the display name of this member's user if set, or their username. */
    get displayName(): string;
    /** The guild this member is for. This will throw an error if the guild is not cached. */
    get guild(): Guild;
    /** A string that will mention this member. */
    get mention(): string;
    /** The permissions of this member. */
    get permissions(): Permission;
    /** The user associated with this member's public [flags](https://discord.com/developers/docs/resources/user#user-object-user-flags). */
    get publicFlags(): number;
    /** If this user associated with this member is an official discord system user. System users are no longer cached, so this is always false. */
    get system(): boolean;
    /** The 4 digits after this user's username, if they have not been migrated. If migrated, this will be a single "0". */
    get tag(): string;
    /** The username associated with this member's user. */
    get username(): string;
    /** The voice state of this member. */
    get voiceState(): VoiceState | null;
    /**
     * Add a role to this member.
     * @param roleID The ID of the role to add.
     */
    addRole(roleID: string, reason?: string): Promise<void>;
    /**
     * The url of this member's avatar decoration (or their user avatar decoration). This will always be a png.
     * Discord does not combine the decoration and their current avatar for you. This is ONLY the decoration.
     * @param size The dimensions of the image.
     */
    avatarDecorationURL(size?: number): string | null;
    /**
     * The url of this user's guild avatar (or their user avatar if no guild avatar is set, or their default avatar if none apply).
     * @param format The format the url should be.
     * @param size The dimensions of the image.
     */
    avatarURL(format?: ImageFormat, size?: number): string;
    /**
     * Create a ban for this member.
     * @param options The options for the ban.
     */
    ban(options?: Types.Guilds.CreateBanOptions): Promise<void>;
    /**
     * The url of this user's banner. Guild banners are no longer cached.
     * @param format The format the url should be.
     * @param size The dimensions of the image.
     */
    bannerURL(format?: ImageFormat, size?: number): string | null;
    /**
     * Edit this member. Use {@link Guild#editCurrentMember | Guild#editCurrentMember} if you wish to update the nick of this client using the `CHANGE_NICKNAME` permission.
     * @param options The options for editing the member.
     */
    edit(options: Types.Guilds.EditMemberOptions): Promise<Member>;
    /**
     * Edit this guild member's voice state. `channelID` is required, and the user must already be in that channel. See [Discord's docs](https://discord.com/developers/docs/resources/guild#modify-user-voice-state) for more information.
     * @param options The options for editing the voice state.
     */
    editVoiceState(options: Types.Guilds.EditUserVoiceStateOptions): Promise<void>;
    /**
     * Remove a member from the guild.
     * @param reason The reason for the kick.
     */
    kick(reason?: string): Promise<void>;
    /**
     * Remove a role from this member.
     * @param roleID The ID of the role to remove.
     * @param reason The reason for removing the role.
     */
    removeRole(roleID: string, reason?: string): Promise<void>;
    toJSON(): Types.JSON.JSONMember;
    /**
     * Remove a ban for this member.
     * @param reason The reason for removing the ban.
     */
    unban(reason?: string): Promise<void>;
}
