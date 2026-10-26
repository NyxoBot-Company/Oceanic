/** @module Member */
import Base from "./Base";
import type User from "./User";
import type Guild from "./Guild";
import type Permission from "./Permission";
import type VoiceState from "./VoiceState";
import type * as Types from "../types/namespaced";
import type { ImageFormat } from "../Constants";
import * as Routes from "../util/Routes";
import type Client from "../Client";
import { UncachedError } from "../util/Errors";

/** Represents a member of a guild. */
export default class Member extends Base {
  private _cachedGuild?: Guild;
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
  constructor(
    data: (Types.Guilds.RawMember | Types.Guilds.RESTMember) & { id?: string },
    client: Client,
    guildID: string,
  ) {
    let user: User | undefined;
    let id: string | undefined;
    if (!data.user && data.id) {
      user = client.users.get((id = data.id));
    } else if (data.user) {
      id = (user = client.users.update(data.user)).id;
    }
    if (!user) {
      throw new TypeError(
        `Member received without a user${id === undefined ? " or id." : `: ${id}`}`,
      );
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

  protected override update(
    data: Partial<Types.Guilds.RawMember | Types.Guilds.RESTMember>,
  ): void {
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
  get bot(): boolean {
    return this.user.bot;
  }

  /** The discriminator of the user associated with this member. Discriminators are no longer cached, so this is always "0". */
  get discriminator(): string {
    return "0";
  }

  /** The nick of this member if set, the display name of this member's user if set, or their username. */
  get displayName(): string {
    return this.nick ?? this.user.globalName ?? this.username;
  }

  /** The guild this member is for. This will throw an error if the guild is not cached. */
  get guild(): Guild {
    this._cachedGuild ??= this.client.guilds.get(this.guildID);
    if (!this._cachedGuild) {
      if (this.client.options.restMode) {
        throw new UncachedError(
          `${this.constructor.name}#guild is not present when rest mode is enabled.`,
        );
      }

      if (!this.client.shards.connected) {
        throw new UncachedError(
          `${this.constructor.name}#guild is not present without a gateway connection.`,
        );
      }

      throw new UncachedError(`${this.constructor.name}#guild is not present.`);
    }

    return this._cachedGuild;
  }

  /** A string that will mention this member. */
  get mention(): string {
    return this.user.mention;
  }

  /** The permissions of this member. */
  get permissions(): Permission {
    return this.guild.permissionsOf(this);
  }

  /** The user associated with this member's public [flags](https://discord.com/developers/docs/resources/user#user-object-user-flags). */
  get publicFlags(): number {
    return this.user.publicFlags;
  }

  /** If this user associated with this member is an official discord system user. System users are no longer cached, so this is always false. */
  get system(): boolean {
    return false;
  }

  /** The 4 digits after this user's username, if they have not been migrated. If migrated, this will be a single "0". */
  get tag(): string {
    return this.user.tag;
  }

  /** The username associated with this member's user. */
  get username(): string {
    return this.user.username;
  }

  /** The voice state of this member. */
  get voiceState(): VoiceState | null {
    return this.guild.voiceStates.get(this.id) ?? null;
  }

  /**
   * Add a role to this member.
   * @param roleID The ID of the role to add.
   */
  async addRole(roleID: string, reason?: string): Promise<void> {
    await this.client.rest.guilds.addMemberRole(
      this.guildID,
      this.id,
      roleID,
      reason,
    );
  }

  /**
   * The url of this member's avatar decoration (or their user avatar decoration). This will always be a png.
   * Discord does not combine the decoration and their current avatar for you. This is ONLY the decoration.
   * @param size The dimensions of the image.
   */
  avatarDecorationURL(size?: number): string | null {
    return this.user.avatarDecorationURL(size);
  }

  /**
   * The url of this user's guild avatar (or their user avatar if no guild avatar is set, or their default avatar if none apply).
   * @param format The format the url should be.
   * @param size The dimensions of the image.
   */
  avatarURL(format?: ImageFormat, size?: number): string {
    return this.avatar === null
      ? this.user.avatarURL(format, size)
      : this.client.util.formatImage(
          Routes.GUILD_AVATAR(this.guildID, this.id, this.avatar),
          format,
          size,
        );
  }

  /**
   * Create a ban for this member.
   * @param options The options for the ban.
   */
  async ban(options?: Types.Guilds.CreateBanOptions): Promise<void> {
    await this.client.rest.guilds.createBan(this.guildID, this.id, options);
  }

  /**
   * The url of this user's banner. Guild banners are no longer cached.
   * @param format The format the url should be.
   * @param size The dimensions of the image.
   */
  bannerURL(format?: ImageFormat, size?: number): string | null {
    return this.user.bannerURL(format, size);
  }

  /**
   * Edit this member. Use {@link Guild#editCurrentMember | Guild#editCurrentMember} if you wish to update the nick of this client using the `CHANGE_NICKNAME` permission.
   * @param options The options for editing the member.
   */
  async edit(options: Types.Guilds.EditMemberOptions): Promise<Member> {
    return this.client.rest.guilds.editMember(this.guildID, this.id, options);
  }

  /**
   * Edit this guild member's voice state. `channelID` is required, and the user must already be in that channel. See [Discord's docs](https://discord.com/developers/docs/resources/guild#modify-user-voice-state) for more information.
   * @param options The options for editing the voice state.
   */
  async editVoiceState(
    options: Types.Guilds.EditUserVoiceStateOptions,
  ): Promise<void> {
    return this.client.rest.guilds.editUserVoiceState(
      this.guildID,
      this.id,
      options,
    );
  }

  /**
   * Remove a member from the guild.
   * @param reason The reason for the kick.
   */
  async kick(reason?: string): Promise<void> {
    await this.client.rest.guilds.removeMember(this.guildID, this.id, reason);
  }

  /**
   * Remove a role from this member.
   * @param roleID The ID of the role to remove.
   * @param reason The reason for removing the role.
   */
  async removeRole(roleID: string, reason?: string): Promise<void> {
    await this.client.rest.guilds.removeMemberRole(
      this.guildID,
      this.id,
      roleID,
      reason,
    );
  }

  override toJSON(): Types.JSON.JSONMember {
    return {
      ...super.toJSON(),
      avatar: this.avatar,
      communicationDisabledUntil:
        this.communicationDisabledUntil?.getTime() ?? null,
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
  async unban(reason?: string): Promise<void> {
    await this.client.rest.guilds.removeBan(this.guildID, this.id, reason);
  }
}
