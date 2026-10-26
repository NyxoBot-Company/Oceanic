/** @module User */
import Base from "./Base";
import type PrivateChannel from "./PrivateChannel";
import type Entitlement from "./Entitlement";
import type TestEntitlement from "./TestEntitlement";
import PrimaryGuild from "./PrimaryGuild";
import type * as Types from "../types/namespaced";
import {
  EntitlementOwnerTypes,
  type ImageFormat,
  type PremiumTypes,
} from "../Constants";
import * as Routes from "../util/Routes";
import type Client from "../Client";
import { UncachedError } from "../util/Errors";

/** Represents a user. */
export default class User extends Base {
  /** The user's avatar hash. */
  avatar: string | null;
  /** The user's banner hash. If this member was received via the gateway, this will never be present. */
  banner?: string | null;
  /** If this user is a bot. */
  bot: boolean;
  /** The user's display name, if set. */
  globalName: string | null;
  /** The user's Nitro subscription type. A value of {@link Constants~PremiumTypes.NONE | NONE} can also mean the OAuth request did not include the approved `identify.premium` scope. */
  premiumType?: PremiumTypes;
  /** The primary guild this user is in. */
  primaryGuild: PrimaryGuild | null;
  /** The user's public [flags](https://discord.com/developers/docs/resources/user#user-object-user-flags). */
  publicFlags: number;
  /** The user's username. */
  username: string;
  constructor(data: Types.Users.RawUser, client: Client) {
    super(data.id, client);
    this.avatar = null;
    this.bot = !!data.bot;
    this.globalName = data.global_name;
    this.primaryGuild = null;
    this.publicFlags = 0;
    this.username = data.username;
    this.update(data);
  }

  protected override update(data: Partial<Types.Users.RawUser>): void {
    if (data.avatar !== undefined) {
      this.avatar = data.avatar;
    }
    if (data.banner !== undefined) {
      this.banner = data.banner;
    }
    if (data.global_name !== undefined) {
      this.globalName = data.global_name;
    }
    if (data.username !== undefined) {
      this.username = data.username;
    }
    if (data.primary_guild !== undefined) {
      this.primaryGuild = data.primary_guild
        ? new PrimaryGuild(data.primary_guild, this.client)
        : null;
    }
    if (data.premium_type !== undefined) {
      this.premiumType = data.premium_type;
    }
  }

  /**
   * The primary guild this user is in.
   * @deprecated Use {@link primaryGuild}
   */
  get clan(): PrimaryGuild | null {
    return this.primaryGuild;
  }

  /** The default avatar value of this user. */
  get defaultAvatar(): number {
    return Number(BigInt(this.id) >> 22n) % 6;
  }

  /** If this user has migrated to the new username system. */
  get isMigrated(): boolean {
    return true;
  }

  /** A string that will mention this user. */
  get mention(): string {
    return `<@${this.id}>`;
  }

  /** This user's unique username, if migrated, else a combination of the user's username and discriminator. */
  get tag(): string {
    return this.username;
  }

  /**
   * The url of this user's avatar decoration. This will always be a png.
   * Discord does not combine the decoration and their current avatar for you. This is ONLY the decoration.
   * @param size The dimensions of the image.
   */
  // eslint-disable-next-line @typescript-eslint/no-unused-vars
  avatarDecorationURL(_size?: number): string | null {
    return null;
  }

  /**
   * The url of this user's avatar (or default avatar, if they have not set an avatar).
   * @param format The format the url should be.
   * @param size The dimensions of the image.
   */
  avatarURL(format?: ImageFormat, size?: number): string {
    return this.avatar === null
      ? this.defaultAvatarURL()
      : this.client.util.formatImage(
          Routes.USER_AVATAR(this.id, this.avatar),
          format,
          size,
        );
  }

  /**
   * The url of this user's banner.
   * @param format The format the url should be.
   * @param size The dimensions of the image.
   */
  bannerURL(format?: ImageFormat, size?: number): string | null {
    return this.banner
      ? this.client.util.formatImage(
          Routes.BANNER(this.id, this.banner),
          format,
          size,
        )
      : null;
  }

  /**
   * Create a direct message with this user.
   */
  async createDM(): Promise<PrivateChannel> {
    return this.client.rest.channels.createDM(this.id);
  }

  /**
   * Create a test entitlement for this user.
   * @param skuID The ID of the SKU to create an entitlement for.
   * @param applicationID The ID of the application to create the entitlement for. If present, defaults to the logged in client's application id.
   */
  async createTestEntitlement(
    skuID: string,
    applicationID?: string,
  ): Promise<TestEntitlement> {
    if (
      applicationID === undefined &&
      this.client["_application"] === undefined
    ) {
      throw new UncachedError(
        "Client#application is not present, you must provide an applicationID as a second argument. To not need to provide an ID, only call this after at least one shard is READY, or restMode is enabled.",
      );
    }
    return this.client.rest.applications.createTestEntitlement(
      applicationID ?? this.client.application.id,
      {
        ownerID: this.id,
        ownerType: EntitlementOwnerTypes.USER,
        skuID,
      },
    );
  }

  /**
   * The url of this user's default avatar.
   */
  defaultAvatarURL(): string {
    return this.client.util.formatImage(
      Routes.EMBED_AVATAR(this.defaultAvatar),
      "png",
    );
  }

  /**
   * Get the entitlements for this guild.
   * @param options The options for getting the entitlements.
   */
  async getEntitlements(
    options?: Omit<Types.Applications.SearchEntitlementsOptions, "userID">,
    applicationID?: string,
  ): Promise<Array<Entitlement | TestEntitlement>> {
    if (
      applicationID === undefined &&
      this.client["_application"] === undefined
    ) {
      throw new UncachedError(
        "Client#application is not present, you must provide an applicationID as a second argument. To not need to provide an ID, only call this after at least one shard is READY, or restMode is enabled.",
      );
    }
    return this.client.rest.applications.getEntitlements(
      applicationID ?? this.client.application.id,
      { userID: this.id, ...options },
    );
  }

  override toJSON(): Types.JSON.JSONUser {
    return {
      ...super.toJSON(),
      avatar: this.avatar,
      banner: this.banner,
      bot: this.bot,
      globalName: this.globalName,
      premiumType: this.premiumType,
      publicFlags: this.publicFlags,
      username: this.username,
    };
  }
}
