"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const tslib_1 = require("tslib");
/** @module Message */
const Base_1 = tslib_1.__importDefault(require("./Base"));
const Attachment_1 = tslib_1.__importDefault(require("./Attachment"));
const User_1 = tslib_1.__importDefault(require("./User"));
const GuildChannel_1 = tslib_1.__importDefault(require("./GuildChannel"));
const Poll_1 = tslib_1.__importDefault(require("./Poll"));
const TypedCollection_1 = tslib_1.__importDefault(require("../util/TypedCollection"));
const Constants_1 = require("../Constants");
const Routes = tslib_1.__importStar(require("../util/Routes"));
const Errors_1 = require("../util/Errors");
/** Represents a message. */
class Message extends Base_1.default {
    _cachedChannel;
    _cachedGuild;
    /** The attachments on this message. */
    attachments;
    /** The author of this message. */
    author;
    /** The ID of the channel this message was created in. */
    channelID;
    /** The components on this message. */
    components;
    /** The content of this message. */
    content;
    /** The embeds on this message. */
    embeds;
    /** The [flags](https://discord.com/developers/docs/resources/channel#message-object-message-flags) on this message. */
    flags;
    /** The ID of the guild this message is in. */
    guildID;
    /**
     * The interaction info, if this message was the result of an interaction.
     * @deprecated Use {@link Message#interactionMetadata | Message#interactionMetadata } instead.
     */
    interaction;
    /** The interaction info, if this message was the result of an interaction. */
    interactionMetadata;
    /** The member that created this message, if this message is in a guild. */
    member;
    /** The mentions in this message. */
    mentions;
    /** If this message is a forwarded message, the partial contents of that message. */
    messageSnapshots;
    /** The poll on this message, if any. */
    poll;
    /** The reactions on this message. */
    reactions;
    /** The timestamp at which this message was sent. */
    timestamp;
    /** The [type](https://discord.com/developers/docs/resources/channel#message-object-message-types) of this message. */
    type;
    constructor(data, client) {
        super(data.id, client);
        this.attachments = new TypedCollection_1.default(Attachment_1.default, client);
        this.channelID = data.channel_id;
        this.components = [];
        this.content = data.content ?? "";
        this.embeds = [];
        this.flags = 0;
        this.guildID = (data.guild_id === undefined ? null : data.guild_id);
        this.member = (data.member === undefined ? undefined : this.client.util.updateMember(data.guild_id, data.author.id, { ...data.member, user: data.author }));
        this.mentions = {
            channels: [],
            everyone: false,
            members: [],
            roles: [],
            users: []
        };
        this.poll = data.poll ? new Poll_1.default(data.poll, client, this) : undefined;
        this.reactions = [];
        // message updates can be missing a timestamp
        this.timestamp = data.timestamp === undefined ? Base_1.default.getCreatedAt(this.id) : new Date(data.timestamp);
        this.type = data.type;
        this.update(data);
        // don't add webhook users to the cache
        this.author = data.webhook_id === undefined ? client.users.update(data.author) : new User_1.default(data.author, client);
    }
    update(data) {
        if (data.mention_everyone !== undefined) {
            this.mentions.everyone = data.mention_everyone;
        }
        if (data.mention_roles !== undefined) {
            this.mentions.roles = data.mention_roles;
        }
        if (data.mentions !== undefined) {
            const members = [];
            this.mentions.users = data.mentions.map(user => {
                if (this.channel && "guildID" in this.channel && user.member) {
                    members.push(this.client.util.updateMember(this.channel.guildID, user.id, { ...user.member, user }));
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
        if (data.interaction !== undefined) {
            let member;
            if (data.interaction.member) {
                member = {
                    ...data.interaction.member,
                    user: data.interaction.user
                };
            }
            this.interaction = {
                id: data.interaction.id,
                member: member ? this.client.util.updateMember(data.guild_id, member.user.id, member) : undefined,
                name: data.interaction.name,
                type: data.interaction.type,
                user: this.client.users.update(data.interaction.user)
            };
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
            };
        }
        if (data.message_snapshots) {
            this.messageSnapshots = data.message_snapshots.map(s => ({
                message: {
                    attachments: s.message.attachments.map(a => new Attachment_1.default(a, this.client)),
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
    get channel() {
        return this._cachedChannel ??= this.client.getChannel(this.channelID);
    }
    /** The guild this message is in. This will throw an error if the guild is not cached. */
    get guild() {
        if (this.guildID !== null && this._cachedGuild !== null) {
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
        return this._cachedGuild === null ? this._cachedGuild : (this._cachedGuild = null);
    }
    /** A link to this message. */
    get jumpLink() {
        return `${Constants_1.BASE_URL}${Routes.MESSAGE_LINK(this.guildID ?? "@me", this.channelID, this.id)}`;
    }
    /**
     * Add a reaction to this message.
     * @param emoji The reaction to add to the message. `name:id` for custom emojis, and the unicode codepoint for default emojis.
     */
    async createReaction(emoji) {
        return this.client.rest.channels.createReaction(this.channelID, this.id, emoji);
    }
    /**
     * Crosspost this message in an announcement channel.
     */
    async crosspost() {
        return this.client.rest.channels.crosspostMessage(this.channelID, this.id);
    }
    /**
     * Delete this message.
     * @param reason The reason for deleting the message.
     */
    async delete(reason) {
        return this.client.rest.channels.deleteMessage(this.channelID, this.id, reason);
    }
    /**
     * Remove a reaction from this message.
     * @param emoji The reaction to remove from the message. `name:id` for custom emojis, and the unicode codepoint for default emojis.
     * @param user The user to remove the reaction from, `@me` for the current user (default).
     */
    async deleteReaction(emoji, user = "@me") {
        return this.client.rest.channels.deleteReaction(this.channelID, this.id, emoji, user);
    }
    /**
     * Remove all, or a specific emoji's reactions from this message.
     * @param emoji The reaction to remove from the message. `name:id` for custom emojis, and the unicode codepoint for default emojis. Omit to remove all reactions.
     */
    async deleteReactions(emoji) {
        return this.client.rest.channels.deleteReactions(this.channelID, this.id, emoji);
    }
    async edit(content, options) {
        if (typeof content === "string") {
            options = {
                ...options,
                content
            };
        }
        else
            options = content;
        return this.client.rest.channels.editMessage(this.channelID, this.id, options);
    }
    /** End the poll on this message now. */
    async expire() {
        if (this.poll === undefined) {
            throw new TypeError("Message does not have a poll.");
        }
        await this.poll.expire();
    }
    async forward(channelID, content, options) {
        if (typeof content === "string") {
            options = {
                ...options,
                content
            };
        }
        else
            options = content;
        return this.client.rest.channels.createMessage(channelID, {
            ...options,
            messageReference: {
                channelID: this.channelID,
                messageID: this.id,
                type: Constants_1.MessageReferenceType.FORWARD
            }
        });
    }
    /**
     * Get the users that voted on a poll answer.
     * @param answerID The ID of the poll answer to get voters for.
     * @param options The options for getting the voters.
     */
    async getPollAnswerUsers(answerID, options) {
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
    async getReactions(emoji, options) {
        return this.client.rest.channels.getReactions(this.channelID, this.id, emoji, options);
    }
    /** Whether this message belongs to a cached guild channel. The only difference on using this method over a simple if statement is to easily update all the message properties typing definitions based on the channel it belongs to. */
    inCachedGuildChannel() {
        return this.channel instanceof GuildChannel_1.default;
    }
    /** Whether this message belongs to a direct message channel (PrivateChannel or uncached). The only difference on using this method over a simple if statement is to easily update all the message properties typing definitions based on the channel it belongs to. */
    inDirectMessageChannel() {
        return this.guildID === null;
    }
    /**
     * Pin this message.
     * @param reason The reason for pinning the message.
     */
    async pin(reason) {
        return this.client.rest.channels.pinMessage(this.channelID, this.id, reason);
    }
    async reply(content, options) {
        if (typeof content === "string") {
            options = {
                ...options,
                content
            };
        }
        else
            options = content;
        return this.client.rest.channels.createMessage(this.channelID, {
            ...options,
            messageReference: {
                messageID: this.id,
                type: Constants_1.MessageReferenceType.DEFAULT
            }
        });
    }
    /**
     * Create a thread from this message.
     * @param options The options for creating the thread.
     */
    async startThread(options) {
        return this.client.rest.channels.startThreadFromMessage(this.channelID, this.id, options);
    }
    toJSON() {
        const im = this.interactionMetadata;
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
            interaction: this.interaction === undefined ? undefined : {
                id: this.interaction.id,
                member: this.interaction.member?.toJSON(),
                name: this.interaction.name,
                type: this.interaction.type,
                user: this.interaction.user.toJSON()
            },
            interactionMetadata: im === undefined ? undefined : {
                authorizingIntegrationOwners: im.authorizingIntegrationOwners,
                id: im.id,
                interactedMessageID: im.interactedMessageID,
                name: im.name,
                originalResponseMessageID: im.originalResponseMessageID,
                targetMessageID: im.targetMessageID,
                targetUser: im.targetUser instanceof User_1.default ? im.targetUser.toJSON() : im.targetUser,
                type: im.type,
                user: im.user instanceof User_1.default ? im.user.toJSON() : im.user,
                triggeringInteractionMetadata: im.triggeringInteractionMetadata === undefined ? undefined : {
                    authorizingIntegrationOwners: im.triggeringInteractionMetadata.authorizingIntegrationOwners,
                    id: im.triggeringInteractionMetadata.id,
                    interactedMessageID: im.triggeringInteractionMetadata.interactedMessageID,
                    originalResponseMessageID: im.triggeringInteractionMetadata.originalResponseMessageID,
                    targetMessageID: im.triggeringInteractionMetadata.targetMessageID,
                    targetUser: im.triggeringInteractionMetadata.targetUser instanceof User_1.default ? im.triggeringInteractionMetadata.targetUser.toJSON() : im.triggeringInteractionMetadata.targetUser,
                    type: im.triggeringInteractionMetadata.type,
                    user: im.triggeringInteractionMetadata.user instanceof User_1.default ? im.triggeringInteractionMetadata.user.toJSON() : im.triggeringInteractionMetadata.user
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
        };
    }
    /**
     * Unpin this message.
     * @param reason The reason for unpinning the message.
     */
    async unpin(reason) {
        return this.client.rest.channels.unpinMessage(this.channelID, this.id, reason);
    }
}
exports.default = Message;
//# sourceMappingURL=data:application/json;base64,eyJ2ZXJzaW9uIjozLCJmaWxlIjoiTWVzc2FnZS5qcyIsInNvdXJjZVJvb3QiOiIiLCJzb3VyY2VzIjpbIi4uLy4uLy4uL2xpYi9zdHJ1Y3R1cmVzL01lc3NhZ2UudHMiXSwibmFtZXMiOltdLCJtYXBwaW5ncyI6Ijs7O0FBQUEsc0JBQXNCO0FBQ3RCLDBEQUEwQjtBQUMxQixzRUFBc0M7QUFDdEMsMERBQTBCO0FBTzFCLDBFQUEwQztBQUUxQywwREFBMEI7QUFHMUIsc0ZBQXNEO0FBQ3RELDRDQUFpRjtBQUNqRiwrREFBeUM7QUFDekMsMkNBQStDO0FBRS9DLDRCQUE0QjtBQUM1QixNQUFxQixPQUF5SSxTQUFRLGNBQUk7SUFDOUosY0FBYyxDQUErRDtJQUM3RSxZQUFZLENBQTJFO0lBQy9GLHVDQUF1QztJQUN2QyxXQUFXLENBQTREO0lBQ3ZFLGtDQUFrQztJQUNsQyxNQUFNLENBQU87SUFDYix5REFBeUQ7SUFDekQsU0FBUyxDQUFTO0lBQ2xCLHNDQUFzQztJQUN0QyxVQUFVLENBQXlDO0lBQ25ELG1DQUFtQztJQUNuQyxPQUFPLENBQVM7SUFDaEIsa0NBQWtDO0lBQ2xDLE1BQU0sQ0FBOEI7SUFDcEMsdUhBQXVIO0lBQ3ZILEtBQUssQ0FBUztJQUNkLDhDQUE4QztJQUM5QyxPQUFPLENBQTRFO0lBQ25GOzs7T0FHRztJQUNILFdBQVcsQ0FBcUM7SUFDaEQsOEVBQThFO0lBQzlFLG1CQUFtQixDQUFnRDtJQUNuRSwyRUFBMkU7SUFDM0UsTUFBTSxDQUFpRjtJQUN2RixvQ0FBb0M7SUFDcEMsUUFBUSxDQUFpQztJQUN6QyxvRkFBb0Y7SUFDcEYsZ0JBQWdCLENBQXlDO0lBQ3pELHdDQUF3QztJQUN4QyxJQUFJLENBQVE7SUFDWixxQ0FBcUM7SUFDckMsU0FBUyxDQUF3QztJQUNqRCxvREFBb0Q7SUFDcEQsU0FBUyxDQUFPO0lBQ2hCLHNIQUFzSDtJQUN0SCxJQUFJLENBQWU7SUFDbkIsWUFBWSxJQUErQixFQUFFLE1BQWM7UUFDdkQsS0FBSyxDQUFDLElBQUksQ0FBQyxFQUFFLEVBQUUsTUFBTSxD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