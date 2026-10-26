/** @module Role */
import Base from "./Base";
import type Guild from "./Guild";
import type * as Types from "../types/namespaced";
import type Client from "../Client";
import { UncachedError } from "../util/Errors";

/** Represents a role in a guild. */
export default class Role extends Base {
  private _cachedGuild?: Guild;
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
  constructor(data: Types.Guilds.RawRole, client: Client, guildID: string) {
    super(data.id, client);
    this.color = data.color;
    this.guildID = guildID;
    this.icon = null;
    this.managed = !!data.managed;
    this.name = data.name;
    this.permissionsAllow = BigInt(data.permissions);
    this.position = data.position;
    this.secondaryColor = data.colors.secondary_color ?? 0;
    this.update(data);
  }

  protected override update(data: Partial<Types.Guilds.RawRole>): void {
    if (data.color !== undefined) {
      this.color = data.color;
    }
    if (data.colors !== undefined) {
      this.secondaryColor = data.colors.secondary_color ?? 0;
    }
    if (data.icon !== undefined) {
      this.icon = data.icon ?? null;
    }
    if (data.name !== undefined) {
      this.name = data.name;
    }
    if (data.permissions !== undefined) {
      this.permissionsAllow = BigInt(data.permissions);
    }
    if (data.position !== undefined) {
      this.position = data.position;
    }
  }

  /** The guild this role is in. This will throw an error if the guild is not cached. */
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

  /** A string that will mention this role. */
  get mention(): string {
    return `<@&${this.id}>`;
  }

  /**
   * Delete this role.
   * @param reason The reason for deleting the role.
   */
  async delete(reason?: string): Promise<void> {
    return this.client.rest.guilds.deleteRole(this.guildID, this.id, reason);
  }

  /**
   * Edit this role.
   * @param options The options for editing the role.
   */
  async edit(options: Types.Guilds.EditRoleOptions): Promise<Role> {
    return this.client.rest.guilds.editRole(this.guildID, this.id, options);
  }

  override toJSON(): Types.JSON.JSONRole {
    return {
      ...super.toJSON(),
      color: this.color,
      guildID: this.guildID,
      icon: this.icon,
      managed: this.managed,
      name: this.name,
      permissions: { allow: this.permissionsAllow.toString(), deny: "0" },
      permissionsAllow: this.permissionsAllow.toString(),
      position: this.position,
      secondaryColor: this.secondaryColor,
    };
  }
}
