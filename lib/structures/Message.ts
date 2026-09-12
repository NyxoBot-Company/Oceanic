/** @module Message */
import Base from "./Base";
import Attachment from "./Attachment";
import User from "./User";
import type Guild from "./Guild";
import type Member from "./Member";
import type AnnouncementChannel from "./AnnouncementChannel";
import type AnnouncementThreadChannel from "./AnnouncementThreadChannel";
import type PublicThreadChannel from "./PublicThreadChannel";
import type TextChannel from "./TextChannel";
import GuildChannel from "./GuildChannel";
import type PrivateChannel from "./PrivateChannel";
import Poll from "./Poll";
import type * as Types from "../types/namespaced";
import type Client from "../Client";
import TypedCollection from "../util/TypedCollection";
import { BASE_URL, type MessageTypes } from "../Constants";
import * as Routes from "../util/Routes";
import { UncachedError } from "../util/Errors";

/** Represents a message. */
export default class Message<T extends Types.Channels.AnyTextableChannel | Types.Shared.Uncached = Types.Channels.AnyTextableChannel | Types.Shared.Uncached> extends Base {
    private _cachedChannel!: T extends Types.Channels.AnyTextableChannel ? T : undefined;
    private _cachedGuild?: T extends Types.Channels.AnyTextableGuildChannel ? Guild : Guild | null;
    /** The attachments on this message. */
    attachments: TypedCollection<Types.Channels.RawAttachment, Attachment>;
    /** The author of this message. */
    author: User;
    /** The ID of the channel this message was created in. */
    channelID: string;
    /** The components on this message. */
    components: Array<Types.Channels.MessageComponent>;
    /** The content of this message. */
    content: string;
    /** The embeds on this message. */
    embeds: Array<Types.Channels.Embed>;
    /** The [flags](https://discord.com/developers/docs/resources/channel#message-object-message-flags) on this message. */
    flags: number;
    /** The ID of the guild this message is in. */
    guildID: T extends Types.Channels.AnyTextableGuildChannel ? string : string | null;
    /** The interaction info, if this message was the result of an interaction. */
    interactionMetadata?: Types.Channels.AnyMessageInteractionMetadata;
    /** The member that created this message, if this message is in a guild. */
    member: T extends Types.Channels.AnyTextableGuildChannel ? Member : Member | undefined;
    /** The mentions in this message. */
    mentions: Types.Channels.MessageMentions;
    /** If this message is a forwarded message, the partial contents of that message. */
    messageSnapshots?: Array<Types.Channels.MessageSnapshot>;
    /** The poll on this message, if any. */
    poll?: Poll;
    /** The reactions on this message. */
    reactions: Array<Types.Channels.MessageReaction>;
    /** The timestamp at which this message was sent. */
    timestamp: Date;
    /** The [type](https://discord.com/developers/docs/resources/channel#message-object-message-types) of this message. */
    type: MessageTypes;
    constructor(data: Types.Channels.RawMessage, client: Client) {
        super(data.id, client);
        this.attachments = new TypedCollection(Attachment, client);
        this.channelID = data.channel_id;
        this.components = [];
        this.content = data.content ?? "";
        this.embeds = [];
        this.flags = 0;
        this.guildID = (data.guild_id === undefined ? null : data.guild_id) as T extends Types.Channels.AnyTextableGuildChannel ? string : string | null;
        this.member = (data.member === undefined ? undefined : this.client.util.updateMember(data.guild_id!, data.author.id, { ...data.member, user: data.author })) as T extends Types.Channels.AnyTextableGuildChannel ? Member : Member | undefined;
        this.mentions = {
            channels: [],
            everyone: false,
            members: [],
            roles: [],
            users: []
        };
        this.poll = data.poll ? new Poll(data.poll, client, this) : undefined;
        this.reactions = [];
        // message updates can be missing a timestamp
        this.timestamp = data.timestamp === undefined ? Base.getCreatedAt(this.id) : new Date(data.timestamp);
        this.type = data.type;
        this.update(data);
        // don't add webhook users to the cache
        this.author = data.webhook_id === undefined ? client.users.update(data.author) : new User(data.author, client);
    }

    protected override update(data: Partial<Types.Channels.RawMessage>): void {
        if (data.mention_everyone !== undefined) {
            this.mentions.everyone = data.mention_everyone;
        }
        if (data.mention_roles !== undefined) {
            this.mentions.roles = data.mention_roles;
        }
        if (data.mentions !== undefined) {
            const members: Array<Member> = [];
            this.mentions.users = data.mentions.map(user => {
                if (this.channel && "guildID" in (this.channel as T) && user.member) {
                    members.push(this.client.util.updateMember((this.channel as Types.Channels.AnyTextableGuildChannel).guildID, user.id, { ...user.member, user }));
                }
                return this.client.users.update(user);
            });
            this.mentions.members = members;
        }
        if (data.attachments !== undefined) {
            if (this.attachments.size !== 0) {
                for (const id of this.attachments.keys()) {
                    if (!data.attachments.some(attachment => attachment.id === id)) {
                        this.attachments.delete(id);
                    }
                }
            }

            for (const attachment of data.attachments) {
                this.attachments.update(attachment);
            }
        }
        if (data.components !== undefined) {
            this.components = this.client.util.componentsToParsed(data.components);
        }
        if (data.content !== undefined) {
            this.content = data.content;
            this.mentions.channels = (data.content.match(/<#\d{17,21}>/g) ?? []).map(mention => mention.slice(2, -1));
        }
        if (data.embeds !== undefined) {
            this.embeds = this.client.util.embedsToParsed(data.embeds);
        }
        if (data.flags !== undefined) {
            this.flags = data.flags;
        }
        if (data.interaction_metadata !== undefined) {
            this.interactionMetadata = {
                authorizingIntegrationOwners: data.interaction_metadata.authorizing_integration_owners,
                id: data.interaction_metadata.id,
                interactedMessageID: data.interaction_metadata.interacted_message_id,
                name: data.interaction_metadata.name,
                originalResponseMessageID: data.interaction_metadata.original_response_message_id,
                targetMessageID: data.interaction_metadata.target_message_id,
                targetUser: data.interaction_metadata.target_user ? this.client.users.update(data.interaction_metadata.target_user) : undefined,
                type: data.interaction_metadata.type,
                user: this.client.users.update(data.interaction_metadata.user),
                triggeringInteractionMetadata: data.interaction_metadata.triggering_interaction_metadata === undefined ? undefined : {
                    authorizingIntegrationOwners: data.interaction_metadata.triggering_interaction_metadata.authorizing_integration_owners,
                    id: data.interaction_metadata.triggering_interaction_metadata.id,
                    interactedMessageID: data.interaction_metadata.triggering_interaction_metadata.interacted_message_id,
                    originalResponseMessageID: data.interaction_metadata.triggering_interaction_metadata.original_response_message_id,
                    targetMessageID: data.interaction_metadata.triggering_interaction_metadata.target_message_id,
                    targetUser: data.interaction_metadata.triggering_interaction_metadata.target_user ? this.client.users.update(data.interaction_metadata.triggering_interaction_metadata.target_user) : undefined,
                    type: data.interaction_metadata.triggering_interaction_metadata.type,
                    user: this.client.users.update(data.interaction_metadata.triggering_interaction_metadata.user)
                }
            } as Types.Channels.AnyMessageInteractionMetadata;
        }

        if (data.message_snapshots) {
            this.messageSnapshots = data.message_snapshots.map(s => ({
                message: {
                    attachments: s.message.attachments.map(a => new Attachment(a, this.client)),
                    components: s.message.components ? this.client.util.componentsToParsed(s.message.components) : [],
                    content: s.message.content,
                    editedTimestamp: s.message.edited_timestamp ? new Date(s.message.edited_timestamp) : null,
                    embeds: this.client.util.embedsToParsed(s.message.embeds),
                    flags: s.message.flags ?? 0,
                    mentions: {
                        channels: (s.message.content.match(/<#\d{17,21}>/g) ?? []).map(mention => mention.slice(2, -1)),
                        roles: s.message.mention_roles,
                        users: s.message.mentions.map(u => this.client.users.update(u))
                    },
                    stickerItems: s.message.sticker_items ?? [],
                    timestamp: new Date(s.message.timestamp),
                    type: s.message.type
                }
            }));
        }

        if (data.reactions) {
            this.reactions = data.reactions.map(r => ({
                burstColors: r.burst_colors,
                count: r.count,
                countDetails: r.count_details,
                emoji: r.emoji,
                me: r.me,
                meBurst: r.me_burst
            }));
        }
    }

    /** The channel this message was created in. */
    get channel(): T extends Types.Channels.AnyTextableChannel ? T : undefined {
        return this._cachedChannel ??= this.client.getChannel(this.channelID) as T extends Types.Channels.AnyTextableChannel ? T : undefined;
    }

    /** The guild this message is in. This will throw an error if the guild is not cached. */
    get guild(): T extends Types.Channels.AnyTextableGuildChannel ? Guild : Guild | null {
        if (this.guildID !== null && this._cachedGuild !== null) {
            this._cachedGuild ??= this.client.guilds.get(this.guildID);
            if (!this._cachedGuild) {
                if (this.client.options.restMode) {
                    throw new UncachedError(`${this.constructor.name}#guild is not present when rest mode is enabled.`);
                }

                if (!this.client.shards.connected) {
                    throw new UncachedError(`${this.constructor.name}#guild is not present without a gateway connection.`);
                }

                throw new UncachedError(`${this.constructor.name}#guild is not present.`);
            }

            return this._cachedGuild;
        }

        return this._cachedGuild === null ? this._cachedGuild : (this._cachedGuild = null as T extends Types.Channels.AnyTextableGuildChannel ? Guild : Guild | null);
    }

    /** A link to this message. */
    get jumpLink(): string {
        return `${BASE_URL}${Routes.MESSAGE_LINK(this.guildID ?? "@me", this.channelID, this.id)}`;
    }

    /**
     * Add a reaction to this message.
     * @param emoji The reaction to add to the message. `name:id` for custom emojis, and the unicode codepoint for default emojis.
     */
    async createReaction(emoji: string): Promise<void> {
        return this.client.rest.channels.createReaction(this.channelID, this.id, emoji);
    }

    /**
     * Crosspost this message in an announcement channel.
     */
    async crosspost(): Promise<Message<T>> {
        return this.client.rest.channels.crosspostMessage<T>(this.channelID, this.id);
    }

    /**
     * Delete this message.
     * @param reason The reason for deleting the message.
     */
    async delete(reason?: string): Promise<void> {
        return this.client.rest.channels.deleteMessage(this.channelID, this.id, reason);
    }

    /**
     * Remove a reaction from this message.
     * @param emoji The reaction to remove from the message. `name:id` for custom emojis, and the unicode codepoint for default emojis.
     * @param user The user to remove the reaction from, `@me` for the current user (default).
     */
    async deleteReaction(emoji: string, user = "@me"): Promise<void> {
        return this.client.rest.channels.deleteReaction(this.channelID, this.id, emoji, user);
    }

    /**
     * Remove all, or a specific emoji's reactions from this message.
     * @param emoji The reaction to remove from the message. `name:id` for custom emojis, and the unicode codepoint for default emojis. Omit to remove all reactions.
     */
    async deleteReactions(emoji?: string): Promise<void> {
        return this.client.rest.channels.deleteReactions(this.channelID, this.id, emoji);
    }

    /**
     * Edit this message.
     * @param options The options for editing the message.
     */
    async edit(options: Types.Channels.EditMessageOptions): Promise<Message<T>> {
        return this.client.rest.channels.editMessage<T>(this.channelID, this.id, options);
    }

    /** End this The poll on this message now. */
    async expire(): Promise<void> {
        if (this.poll === undefined) {
            throw new TypeError("Message does not have a poll.");
        }

        await this.poll.expire();
    }

    /**
     * Get the users that voted on a poll answer.
     * @param answerID The ID of the poll answer to get voters for.
     * @param options The options for getting the voters.
     */
    async getPollAnswerUsers(answerID: number, options?: Types.Channels.GetPollAnswerUsersOptions): Promise<Array<User>> {
        if (this.poll === undefined) {
            throw new TypeError("Message does not have a poll.");
        }

        return this.poll.getAnswerUsers(answerID, options);
    }

    /**
     * Get the users who reacted with a specific emoji on this message.
     * @param emoji The reaction to remove from the message. `name:id` for custom emojis, and the unicode codepoint for default emojis.
     * @param options The options for getting the reactions.
     */
    async getReactions(emoji: string, options?: Types.Channels.GetReactionsOptions): Promise<Array<User>> {
        return this.client.rest.channels.getReactions(this.channelID, this.id, emoji, options);
    }

    /** Whether this message belongs to a cached guild channel. The only difference on using this method over a simple if statement is to easily update all the message properties typing definitions based on the channel it belongs to. */
    inCachedGuildChannel(): this is Message<Types.Channels.AnyTextableGuildChannel> {
        return this.channel instanceof GuildChannel;
    }

    /** Whether this message belongs to a direct message channel (PrivateChannel or uncached). The only difference on using this method over a simple if statement is to easily update all the message properties typing definitions based on the channel it belongs to. */
    inDirectMessageChannel(): this is Message<PrivateChannel | Types.Shared.Uncached> {
        return this.guildID === null;
    }

    /**
     * Pin this message.
     * @param reason The reason for pinning the message.
     */
    async pin(reason?: string): Promise<void> {
        return this.client.rest.channels.pinMessage(this.channelID, this.id, reason);
    }


    /**
     * Create a thread from this message.
     * @param options The options for creating the thread.
     */
    async startThread(options: Types.Channels.StartThreadFromMessageOptions): Promise<T extends AnnouncementChannel ? AnnouncementThreadChannel : T extends TextChannel ? PublicThreadChannel : never> {
        return this.client.rest.channels.startThreadFromMessage<T extends AnnouncementChannel ? AnnouncementThreadChannel : T extends TextChannel ? PublicThreadChannel : never>(this.channelID, this.id, options);
    }
    override toJSON(): Types.JSON.JSONMessage {
        const im = this.interactionMetadata as Types.Channels.MessageInteractionMetadata;
        return {
            ...super.toJSON(),
            attachments: this.attachments.map(attachment => attachment.toJSON()),
            author: this.author.toJSON(),
            channelID: this.channelID,
            components: this.components,
            content: this.content,
            embeds: this.embeds,
            flags: this.flags,
            guildID: this.guildID ?? undefined,
            interactionMetadata: im === undefined ? undefined : {
                authorizingIntegrationOwners: im.authorizingIntegrationOwners,
                id: im.id,
                interactedMessageID: im.interactedMessageID,
                name: im.name,
                originalResponseMessageID: im.originalResponseMessageID,
                targetMessageID: im.targetMessageID,
                targetUser: im.targetUser instanceof User ? im.targetUser.toJSON() : im.targetUser,
                type: im.type,
                user: im.user instanceof User ? im.user.toJSON() : im.user,
                triggeringInteractionMetadata: im.triggeringInteractionMetadata === undefined ? undefined : {
                    authorizingIntegrationOwners: im.triggeringInteractionMetadata.authorizingIntegrationOwners,
                    id: im.triggeringInteractionMetadata.id,
                    interactedMessageID: im.triggeringInteractionMetadata.interactedMessageID,
                    originalResponseMessageID: im.triggeringInteractionMetadata.originalResponseMessageID,
                    targetMessageID: im.triggeringInteractionMetadata.targetMessageID,
                    targetUser: im.triggeringInteractionMetadata.targetUser instanceof User ? im.triggeringInteractionMetadata.targetUser.toJSON() : im.triggeringInteractionMetadata.targetUser,
                    type: im.triggeringInteractionMetadata.type,
                    user: im.triggeringInteractionMetadata.user instanceof User ? im.triggeringInteractionMetadata.user.toJSON() : im.triggeringInteractionMetadata.user
                }
            },
            mentions: {
                channels: this.mentions.channels,
                everyone: this.mentions.everyone,
                members: this.mentions.members.map(member => member.toJSON()),
                roles: this.mentions.roles,
                users: this.mentions.users.map(user => user.toJSON())
            },
            messageSnapshots: this.messageSnapshots?.map(s => ({
                message: {
                    attachments: s.message.attachments.map(a => a.toJSON()),
                    content: s.message.content,
                    editedTimestamp: s.message.editedTimestamp?.getTime() ?? null,
                    embeds: s.message.embeds,
                    flags: s.message.flags,
                    mentions: {
                        channels: s.message.mentions.channels,
                        roles: s.message.mentions.roles,
                        users: s.message.mentions.users.map(u => u.toJSON())
                    },
                    timestamp: s.message.timestamp.getTime(),
                    type: s.message.type
                }
            })),
            poll: this.poll?.toJSON(),
            reactions: this.reactions,
            timestamp: this.timestamp.getTime(),
            type: this.type
        } as unknown as Types.JSON.JSONMessage;
    }

    /**
     * Unpin this message.
     * @param reason The reason for unpinning the message.
     */
    async unpin(reason?: string): Promise<void> {
        return this.client.rest.channels.unpinMessage(this.channelID, this.id, reason);
    }
}
