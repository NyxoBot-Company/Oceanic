"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const tslib_1 = require("tslib");
/** @module Member */
const Base_1 = tslib_1.__importDefault(require("./Base"));
const Routes = tslib_1.__importStar(require("../util/Routes"));
const Errors_1 = require("../util/Errors");
/** Represents a member of a guild. */
class Member extends Base_1.default {
    _cachedGuild;
    /** The member's avatar hash, if they have set a guild avatar. */
    avatar;
    /** When the member's [timeout](https://support.discord.com/hc/en-us/articles/4413305239191-Time-Out-FAQ) will expire, if active. */
    communicationDisabledUntil;
    /** The id of the guild this member is for. */
    guildID;
    /** The date at which this member joined the guild. */
    joinedAt;
    /** The timestamp (`Date.now()`) at which this member was last created or updated in the cache. Not included in {@link Member#toJSON | toJSON}, as that would break the change detection of events that compare JSON. */
    lastSeen;
    /** This member's nickname, if any. */
    nick;
    /** The roles this member has. */
    roles;
    /** The user associated with this member. */
    user;
    constructor(data, client, guildID) {
        let user;
        let id;
        if (!data.user && data.id) {
            user = client.users.get((id = data.id));
        }
        else if (data.user) {
            id = (user = client.users.update(data.user)).id;
        }
        if (!user) {
            throw new TypeError(`Member received without a user${id === undefined ? " or id." : `: ${id}`}`);
        }
        super(user.id, client);
        this.avatar = null;
        this.communicationDisabledUntil = null;
        this.guildID = guildID;
        this.joinedAt = null;
        this.lastSeen = Date.now();
        this.nick = null;
        this.roles = [];
        this.user = user;
        this.update(data);
    }
    update(data) {
        this.lastSeen = Date.now();
        if (data.avatar !== undefined) {
            this.avatar = data.avatar;
        }
        if (data.communication_disabled_until !== undefined) {
            this.communicationDisabledUntil =
                data.communication_disabled_until === null
                    ? null
                    : new Date(data.communication_disabled_until);
        }
        if (data.joined_at !== undefined) {
            this.joinedAt = data.joined_at === null ? null : new Date(data.joined_at);
        }
        if (data.nick !== undefined) {
            this.nick = data.nick;
        }
        if (data.roles !== undefined) {
            this.roles = data.roles;
        }
        if (data.user !== undefined) {
            this.user = this.client.users.update(data.user);
        }
    }
    /** If the user associated with this member is a bot. */
    get bot() {
        return this.user.bot;
    }
    /** The discriminator of the user associated with this member. Discriminators are no longer cached, so this is always "0". */
    get discriminator() {
        return "0";
    }
    /** The nick of this member if set, the display name of this member's user if set, or their username. */
    get displayName() {
        return this.nick ?? this.user.globalName ?? this.username;
    }
    /** The guild this member is for. This will throw an error if the guild is not cached. */
    get guild() {
        this._cachedGuild ??= this.client.guilds.get(this.guildID);
        if (!this._cachedGuild) {
            if (this.client.options.restMode) {
                throw new Errors_1.UncachedError(`${this.constructor.name}#guild is not present when rest mode is enabled.`);
            }
            if (!this.client.shards.connected) {
                throw new Errors_1.UncachedError(`${this.constructor.name}#guild is not present without a gateway connection.`);
            }
            throw new Errors_1.UncachedError(`${this.constructor.name}#guild is not present.`);
        }
        return this._cachedGuild;
    }
    /** A string that will mention this member. */
    get mention() {
        return this.user.mention;
    }
    /** The permissions of this member. */
    get permissions() {
        return this.guild.permissionsOf(this);
    }
    /** The user associated with this member's public [flags](https://discord.com/developers/docs/resources/user#user-object-user-flags). */
    get publicFlags() {
        return this.user.publicFlags;
    }
    /** If this user associated with this member is an official discord system user. System users are no longer cached, so this is always false. */
    get system() {
        return false;
    }
    /** The 4 digits after this user's username, if they have not been migrated. If migrated, this will be a single "0". */
    get tag() {
        return this.user.tag;
    }
    /** The username associated with this member's user. */
    get username() {
        return this.user.username;
    }
    /** The voice state of this member. */
    get voiceState() {
        return this.guild.voiceStates.get(this.id) ?? null;
    }
    /**
     * Add a role to this member.
     * @param roleID The ID of the role to add.
     */
    async addRole(roleID, reason) {
        await this.client.rest.guilds.addMemberRole(this.guildID, this.id, roleID, reason);
    }
    /**
     * The url of this member's avatar decoration (or their user avatar decoration). This will always be a png.
     * Discord does not combine the decoration and their current avatar for you. This is ONLY the decoration.
     * @param size The dimensions of the image.
     */
    avatarDecorationURL(size) {
        return this.user.avatarDecorationURL(size);
    }
    /**
     * The url of this user's guild avatar (or their user avatar if no guild avatar is set, or their default avatar if none apply).
     * @param format The format the url should be.
     * @param size The dimensions of the image.
     */
    avatarURL(format, size) {
        return this.avatar === null
            ? this.user.avatarURL(format, size)
            : this.client.util.formatImage(Routes.GUILD_AVATAR(this.guildID, this.id, this.avatar), format, size);
    }
    /**
     * Create a ban for this member.
     * @param options The options for the ban.
     */
    async ban(options) {
        await this.client.rest.guilds.createBan(this.guildID, this.id, options);
    }
    /**
     * The url of this user's banner. Guild banners are no longer cached.
     * @param format The format the url should be.
     * @param size The dimensions of the image.
     */
    bannerURL(format, size) {
        return this.user.bannerURL(format, size);
    }
    /**
     * Edit this member. Use {@link Guild#editCurrentMember | Guild#editCurrentMember} if you wish to update the nick of this client using the `CHANGE_NICKNAME` permission.
     * @param options The options for editing the member.
     */
    async edit(options) {
        return this.client.rest.guilds.editMember(this.guildID, this.id, options);
    }
    /**
     * Edit this guild member's voice state. `channelID` is required, and the user must already be in that channel. See [Discord's docs](https://discord.com/developers/docs/resources/guild#modify-user-voice-state) for more information.
     * @param options The options for editing the voice state.
     */
    async editVoiceState(options) {
        return this.client.rest.guilds.editUserVoiceState(this.guildID, this.id, options);
    }
    /**
     * Remove a member from the guild.
     * @param reason The reason for the kick.
     */
    async kick(reason) {
        await this.client.rest.guilds.removeMember(this.guildID, this.id, reason);
    }
    /**
     * Remove a role from this member.
     * @param roleID The ID of the role to remove.
     * @param reason The reason for removing the role.
     */
    async removeRole(roleID, reason) {
        await this.client.rest.guilds.removeMemberRole(this.guildID, this.id, roleID, reason);
    }
    toJSON() {
        return {
            ...super.toJSON(),
            avatar: this.avatar,
            communicationDisabledUntil: this.communicationDisabledUntil?.getTime() ?? null,
            guildID: this.guildID,
            joinedAt: this.joinedAt?.getTime() ?? null,
            nick: this.nick,
            roles: this.roles,
            user: this.user.toJSON(),
        };
    }
    /**
     * Remove a ban for this member.
     * @param reason The reason for removing the ban.
     */
    async unban(reason) {
        await this.client.rest.guilds.removeBan(this.guildID, this.id, reason);
    }
}
exports.default = Member;
//# sourceMappingURL=data:application/json;base64,eyJ2ZXJzaW9uIjozLCJmaWxlIjoiTWVtYmVyLmpzIiwic291cmNlUm9vdCI6IiIsInNvdXJjZXMiOlsiLi4vLi4vLi4vbGliL3N0cnVjdHVyZXMvTWVtYmVyLnRzIl0sIm5hbWVzIjpbXSwibWFwcGluZ3MiOiI7OztBQUFBLHFCQUFxQjtBQUNyQiwwREFBMEI7QUFPMUIsK0RBQXlDO0FBRXpDLDJDQUErQztBQUUvQyxzQ0FBc0M7QUFDdEMsTUFBcUIsTUFBTyxTQUFRLGNBQUk7SUFDOUIsWUFBWSxDQUFTO0lBQzdCLGlFQUFpRTtJQUNqRSxNQUFNLENBQWdCO0lBQ3RCLG9JQUFvSTtJQUNwSSwwQkFBMEIsQ0FBYztJQUN4Qyw4Q0FBOEM7SUFDOUMsT0FBTyxDQUFTO0lBQ2hCLHNEQUFzRDtJQUN0RCxRQUFRLENBQWM7SUFDdEIsd05BQXdOO0lBQ3hOLFFBQVEsQ0FBUztJQUNqQixzQ0FBc0M7SUFDdEMsSUFBSSxDQUFnQjtJQUNwQixpQ0FBaUM7SUFDakMsS0FBSyxDQUFnQjtJQUNyQiw0Q0FBNEM7SUFDNUMsSUFBSSxDQUFPO0lBQ1gsWUFDRSxJQUEwRSxFQUMxRSxNQUFjLEVBQ2QsT0FBZTtRQUVmLElBQUksSUFBc0IsQ0FBQztRQUMzQixJQUFJLEVBQXNCLENBQUM7UUFDM0IsSUFBSSxDQUFDLElBQUksQ0FBQyxJQUFJLElBQUksSUFBSSxDQUFDLEVBQUUsRUFBRSxDQUFDO1lBQzFCLElBQUksR0FBRyxNQUFNLENBQUMsS0FBSyxDQUFDLEdBQUcsQ0FBQyxDQUFDLEVBQUUsR0FBRyxJQUFJLENBQUMsRUFBRSxDQUFDLENBQUMsQ0FBQztRQUMxQyxDQUFDO2FBQU0sSUFBSSxJQUFJLENBQUMsSUFBSSxFQUFFLENBQUM7WUFDckIsRUFBRSxHQUFHLENBQUMsSUFBSSxHQUFHLE1BQU0sQ0FBQyxLQUFLLENBQUMsTUFBTSxDQUFDLElBQUksQ0FBQyxJQUFJLENBQUMsQ0FBQyxDQUFDLEVBQUUsQ0FBQztRQUNsRCxDQUFDO1FBQ0QsSUFBSSxDQUFDLElBQUksRUFBRSxDQUFDO1lBQ1YsTUFBTSxJQUFJ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