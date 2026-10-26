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
        this.member = (data.member === undefined
            ? undefined
            : this.client.util.updateMember(data.guild_id, data.author.id, {
                ...data.member,
                user: data.author,
            }));
        this.mentions = {
            channels: [],
            everyone: false,
            members: [],
            roles: [],
            users: [],
        };
        this.poll = data.poll ? new Poll_1.default(data.poll, client, this) : undefined;
        this.reactions = [];
        // message updates can be missing a timestamp
        this.timestamp =
            data.timestamp === undefined
                ? Base_1.default.getCreatedAt(this.id)
                : new Date(data.timestamp);
        this.type = data.type;
        this.update(data);
        // don't add webhook users to the cache
        this.author =
            data.webhook_id === undefined
                ? client.users.update(data.author)
                : new User_1.default(data.author, client);
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
            this.mentions.users = data.mentions.map((user) => {
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
                    if (!data.attachments.some((attachment) => attachment.id === id)) {
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
            this.mentions.channels = (data.content.match(/<#\d{17,21}>/g) ?? []).map((mention) => mention.slice(2, -1));
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
                    user: data.interaction.user,
                };
            }
            this.interaction = {
                id: data.interaction.id,
                member: member
                    ? this.client.util.updateMember(data.guild_id, member.user.id, member)
                    : undefined,
                name: data.interaction.name,
                type: data.interaction.type,
                user: this.client.users.update(data.interaction.user),
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
                targetUser: data.interaction_metadata.target_user
                    ? this.client.users.update(data.interaction_metadata.target_user)
                    : undefined,
                type: data.interaction_metadata.type,
                user: this.client.users.update(data.interaction_metadata.user),
                triggeringInteractionMetadata: data.interaction_metadata.triggering_interaction_metadata ===
                    undefined
                    ? undefined
                    : {
                        authorizingIntegrationOwners: data.interaction_metadata.triggering_interaction_metadata
                            .authorizing_integration_owners,
                        id: data.interaction_metadata.triggering_interaction_metadata
                            .id,
                        interactedMessageID: data.interaction_metadata.triggering_interaction_metadata
                            .interacted_message_id,
                        originalResponseMessageID: data.interaction_metadata.triggering_interaction_metadata
                            .original_response_message_id,
                        targetMessageID: data.interaction_metadata.triggering_interaction_metadata
                            .target_message_id,
                        targetUser: data.interaction_metadata
                            .triggering_interaction_metadata.target_user
                            ? this.client.users.update(data.interaction_metadata.triggering_interaction_metadata
                                .target_user)
                            : undefined,
                        type: data.interaction_metadata.triggering_interaction_metadata
                            .type,
                        user: this.client.users.update(data.interaction_metadata.triggering_interaction_metadata
                            .user),
                    },
            };
        }
        if (data.message_snapshots) {
            this.messageSnapshots = data.message_snapshots.map((s) => ({
                message: {
                    attachments: s.message.attachments.map((a) => new Attachment_1.default(a, this.client)),
                    components: s.message.components
                        ? this.client.util.componentsToParsed(s.message.components)
                        : [],
                    content: s.message.content,
                    editedTimestamp: s.message.edited_timestamp
                        ? new Date(s.message.edited_timestamp)
                        : null,
                    embeds: this.client.util.embedsToParsed(s.message.embeds),
                    flags: s.message.flags ?? 0,
                    mentions: {
                        channels: (s.message.content.match(/<#\d{17,21}>/g) ?? []).map((mention) => mention.slice(2, -1)),
                        roles: s.message.mention_roles,
                        users: s.message.mentions.map((u) => this.client.users.update(u)),
                    },
                    stickerItems: s.message.sticker_items ?? [],
                    timestamp: new Date(s.message.timestamp),
                    type: s.message.type,
                },
            }));
        }
        if (data.reactions) {
            this.reactions = data.reactions.map((r) => ({
                burstColors: r.burst_colors,
                count: r.count,
                countDetails: r.count_details,
                emoji: r.emoji,
                me: r.me,
                meBurst: r.me_burst,
            }));
        }
    }
    /** The channel this message was created in. */
    get channel() {
        return (this._cachedChannel ??= this.client.getChannel(this.channelID));
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
        return this._cachedGuild === null
            ? this._cachedGuild
            : (this._cachedGuild =
                null);
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
                content,
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
                content,
            };
        }
        else
            options = content;
        return this.client.rest.channels.createMessage(channelID, {
            ...options,
            messageReference: {
                channelID: this.channelID,
                messageID: this.id,
                type: Constants_1.MessageReferenceType.FORWARD,
            },
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
                content,
            };
        }
        else
            options = content;
        return this.client.rest.channels.createMessage(this.channelID, {
            ...options,
            messageReference: {
                messageID: this.id,
                type: Constants_1.MessageReferenceType.DEFAULT,
            },
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
        const im = this
            .interactionMetadata;
        return {
            ...super.toJSON(),
            attachments: this.attachments.map((attachment) => attachment.toJSON()),
            author: this.author.toJSON(),
            channelID: this.channelID,
            components: this.components,
            content: this.content,
            embeds: this.embeds,
            flags: this.flags,
            guildID: this.guildID ?? undefined,
            interaction: this.interaction === undefined
                ? undefined
                : {
                    id: this.interaction.id,
                    member: this.interaction.member?.toJSON(),
                    name: this.interaction.name,
                    type: this.interaction.type,
                    user: this.interaction.user.toJSON(),
                },
            interactionMetadata: im === undefined
                ? undefined
                : {
                    authorizingIntegrationOwners: im.authorizingIntegrationOwners,
                    id: im.id,
                    interactedMessageID: im.interactedMessageID,
                    name: im.name,
                    originalResponseMessageID: im.originalResponseMessageID,
                    targetMessageID: im.targetMessageID,
                    targetUser: im.targetUser instanceof User_1.default
                        ? im.targetUser.toJSON()
                        : im.targetUser,
                    type: im.type,
                    user: im.user instanceof User_1.default ? im.user.toJSON() : im.user,
                    triggeringInteractionMetadata: im.triggeringInteractionMetadata === undefined
                        ? undefined
                        : {
                            authorizingIntegrationOwners: im.triggeringInteractionMetadata
                                .authorizingIntegrationOwners,
                            id: im.triggeringInteractionMetadata.id,
                            interactedMessageID: im.triggeringInteractionMetadata.interactedMessageID,
                            originalResponseMessageID: im.triggeringInteractionMetadata
                                .originalResponseMessageID,
                            targetMessageID: im.triggeringInteractionMetadata.targetMessageID,
                            targetUser: im.triggeringInteractionMetadata.targetUser instanceof
                                User_1.default
                                ? im.triggeringInteractionMetadata.targetUser.toJSON()
                                : im.triggeringInteractionMetadata.targetUser,
                            type: im.triggeringInteractionMetadata.type,
                            user: im.triggeringInteractionMetadata.user instanceof User_1.default
                                ? im.triggeringInteractionMetadata.user.toJSON()
                                : im.triggeringInteractionMetadata.user,
                        },
                },
            mentions: {
                channels: this.mentions.channels,
                everyone: this.mentions.everyone,
                members: this.mentions.members.map((member) => member.toJSON()),
                roles: this.mentions.roles,
                users: this.mentions.users.map((user) => user.toJSON()),
            },
            messageSnapshots: this.messageSnapshots?.map((s) => ({
                message: {
                    attachments: s.message.attachments.map((a) => a.toJSON()),
                    content: s.message.content,
                    editedTimestamp: s.message.editedTimestamp?.getTime() ?? null,
                    embeds: s.message.embeds,
                    flags: s.message.flags,
                    mentions: {
                        channels: s.message.mentions.channels,
                        roles: s.message.mentions.roles,
                        users: s.message.mentions.users.map((u) => u.toJSON()),
                    },
                    timestamp: s.message.timestamp.getTime(),
                    type: s.message.type,
                },
            })),
            poll: this.poll?.toJSON(),
            reactions: this.reactions,
            timestamp: this.timestamp.getTime(),
            type: this.type,
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
//# sourceMappingURL=data:application/json;base64,eyJ2ZXJzaW9uIjozLCJmaWxlIjoiTWVzc2FnZS5qcyIsInNvdXJjZVJvb3QiOiIiLCJzb3VyY2VzIjpbIi4uLy4uLy4uL2xpYi9zdHJ1Y3R1cmVzL01lc3NhZ2UudHMiXSwibmFtZXMiOltdLCJtYXBwaW5ncyI6Ijs7O0FBQUEsc0JBQXNCO0FBQ3RCLDBEQUEwQjtBQUMxQixzRUFBc0M7QUFDdEMsMERBQTBCO0FBTzFCLDBFQUEwQztBQUUxQywwREFBMEI7QUFHMUIsc0ZBQXNEO0FBQ3RELDRDQUlzQjtBQUN0QiwrREFBeUM7QUFDekMsMkNBQStDO0FBRS9DLDRCQUE0QjtBQUM1QixNQUFxQixPQUluQixTQUFRLGNBQUk7SUFDSixjQUFjLENBRVI7SUFDTixZQUFZLENBRUg7SUFDakIsdUNBQXVDO0lBQ3ZDLFdBQVcsQ0FBNEQ7SUFDdkUsa0NBQWtDO0lBQ2xDLE1BQU0sQ0FBTztJQUNiLHlEQUF5RDtJQUN6RCxTQUFTLENBQVM7SUFDbEIsc0NBQXNDO0lBQ3RDLFVBQVUsQ0FBeUM7SUFDbkQsbUNBQW1DO0lBQ25DLE9BQU8sQ0FBUztJQUNoQixrQ0FBa0M7SUFDbEMsTUFBTSxDQUE4QjtJQUNwQyx1SEFBdUg7SUFDdkgsS0FBSyxDQUFTO0lBQ2QsOENBQThDO0lBQzlDLE9BQU8sQ0FFVztJQUNsQjs7O09BR0c7SUFDSCxXQUFXLENBQXFDO0lBQ2hELDhFQUE4RTtJQUM5RSxtQkFBbUIsQ0FBZ0Q7SUFDbkUsMkVBQTJFO0lBQzNFLE1BQU0sQ0FFaUI7SUFDdkIsb0NBQW9DO0lBQ3BDLFFBQVEsQ0FBaUM7SUFDekMsb0ZBQW9GO0lBQ3BGLGdCQUFnQixDQUF5QztJQUN6RCx3Q0FBd0M7SUFDeEMsSUFBSSxDQUFRO0lBQ1oscUNBQXFDO0lBQ3JDLFNBQVMsQ0FBd0M7SUFDakQsb0RBQW9EO0lBQ3BELFNBQVMsQ0FBTztJQUNoQixzSEFBc0g7SUFDdEgsSUFBSSxDQUFlO0lBQ25CLFlBQVksSUFBK0IsRUFBRSxNQUFjO1FBQ3pELEtBQUssQ0FBQyxJQUFJLENBQUMsRUFBRSxFQUFFLE1BQU0sQ0FBQyxD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