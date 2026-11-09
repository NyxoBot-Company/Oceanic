"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const tslib_1 = require("tslib");
/** @module ThreadChannel */
const GuildChannel_1 = tslib_1.__importDefault(require("./GuildChannel"));
const Message_1 = tslib_1.__importDefault(require("./Message"));
const Constants_1 = require("../Constants");
const TypedCollection_1 = tslib_1.__importDefault(require("../util/TypedCollection"));
const Errors_1 = require("../util/Errors");
/** Represents a guild thread channel. */
class ThreadChannel extends GuildChannel_1.default {
    _messages;
    /** The ID of last message sent in this channel. */
    lastMessageID;
    /** The approximate number of members in this thread. Stops counting after 50. */
    memberCount;
    /** The members of this thread. */
    members;
    /** The number of messages (not including the initial message or deleted messages) in the thread. Stops counting after 50. */
    messageCount;
    /** The owner of this thread. */
    owner;
    /** The ID of the owner of this thread. */
    ownerID;
    /** The amount of seconds between non-moderators sending messages. */
    rateLimitPerUser;
    /** The [thread metadata](https://discord.com/developers/docs/resources/channel#thread-metadata-object-thread-metadata-structure) associated with this thread. */
    threadMetadata;
    /** The total number of messages ever sent in the thread. Includes deleted messages. */
    totalMessageSent;
    constructor(data, client) {
        super(data, client);
        this.flags = data.flags;
        this.lastMessageID = data.last_message_id;
        this.memberCount = 0;
        this.members = [];
        this.messageCount = 0;
        this.ownerID = data.owner_id;
        this.rateLimitPerUser = data.rate_limit_per_user;
        this.threadMetadata = {
            archiveTimestamp: new Date(data.thread_metadata.archive_timestamp),
            archived: !!data.thread_metadata.archived,
            autoArchiveDuration: data.thread_metadata.auto_archive_duration,
            createTimestamp: data.thread_metadata.create_timestamp
                ? new Date(data.thread_metadata.create_timestamp)
                : null,
            locked: !!data.thread_metadata.locked,
            invitable: data.thread_metadata.invitable,
        };
        this.totalMessageSent = 0;
        if (data.type === Constants_1.ChannelTypes.PRIVATE_THREAD &&
            data.thread_metadata.invitable !== undefined) {
            this.threadMetadata.invitable =
                !!data.thread_metadata.invitable;
        }
        this.update(data);
    }
    update(data) {
        if (data.flags !== undefined) {
            this.flags = data.flags;
        }
        if (data.last_message_id !== undefined) {
            this.lastMessageID = data.last_message_id;
        }
        // @TODO look over this to see if we can make it "safer" (accessing Client#user)
        if (data.member) {
            const index = this.members.findIndex((m) => m.userID === this.client.user.id);
            if (index === -1) {
                this.members.push({
                    flags: data.member.flags,
                    id: this.id,
                    joinTimestamp: new Date(data.member.join_timestamp),
                    userID: this.client.user.id,
                });
            }
            else {
                this.members[index] = {
                    ...this.members[index],
                    flags: data.member.flags,
                    joinTimestamp: new Date(data.member.join_timestamp),
                };
            }
        }
        if (data.member_count !== undefined) {
            this.memberCount = data.member_count;
        }
        if (data.message_count !== undefined) {
            this.messageCount = data.message_count;
        }
        if (data.owner_id !== undefined) {
            this.owner = this.client.users.get(data.owner_id);
            this.ownerID = data.owner_id;
        }
        if (data.rate_limit_per_user !== undefined) {
            this.rateLimitPerUser = data.rate_limit_per_user;
        }
        if (data.thread_metadata !== undefined) {
            this.threadMetadata = {
                archiveTimestamp: new Date(data.thread_metadata.archive_timestamp),
                archived: !!data.thread_metadata.archived,
                autoArchiveDuration: data.thread_metadata.auto_archive_duration,
                createTimestamp: data.thread_metadata.create_timestamp
                    ? new Date(data.thread_metadata.create_timestamp)
                    : null,
                locked: !!data.thread_metadata.locked,
                invitable: data.thread_metadata.invitable,
            };
            if (data.type === Constants_1.ChannelTypes.PRIVATE_THREAD &&
                data.thread_metadata.invitable !== undefined) {
                this.threadMetadata.invitable = !!data.thread_metadata.invitable;
            }
        }
        if (data.total_message_sent !== undefined) {
            this.totalMessageSent = data.total_message_sent;
        }
    }
    /** The cached messages in this channel. Lazily allocated on first access. */
    get messages() {
        this._messages ??= new TypedCollection_1.default((Message_1.default), this.client, this.client.util._getLimit("messages", this.id));
        return this._messages;
    }
    /**
     * Add a member to this thread.
     * @param userID The ID of the user to add to the thread.
     */
    async addMember(userID) {
        return this.client.rest.channels.addThreadMember(this.id, userID);
    }
    async createMessage(content, options) {
        if (typeof content === "string") {
            options = {
                ...options,
                content,
            };
        }
        else
            options = content;
        return this.client.rest.channels.createMessage(this.id, options);
    }
    /**
     * Add a reaction to a message in this thread.
     * @param messageID The ID of the message to add a reaction to.
     * @param emoji The reaction to add to the message. `name:id` for custom emojis, and the unicode codepoint for default emojis.
     */
    async createReaction(messageID, emoji) {
        return this.client.rest.channels.createReaction(this.id, messageID, emoji);
    }
    /**
     * Delete a message in this thread.
     * @param messageID The ID of the message to delete.
     * @param reason The reason for deleting the message.
     */
    async deleteMessage(messageID, reason) {
        return this.client.rest.channels.deleteMessage(this.id, messageID, reason);
    }
    /**
     * Bulk delete messages in this thread.
     * @param messageIDs The IDs of the messages to delete. Any duplicates or messages older than two weeks will cause an error.
     * @param reason The reason for deleting the messages.
     */
    async deleteMessages(messageIDs, reason) {
        return this.client.rest.channels.deleteMessages(this.id, messageIDs, reason);
    }
    /**
     * Remove a reaction from a message in this thread.
     * @param messageID The ID of the message to remove a reaction from.
     * @param emoji The reaction to remove from the message. `name:id` for custom emojis, and the unicode codepoint for default emojis.
     * @param user The user to remove the reaction from, `@me` for the current user (default).
     */
    async deleteReaction(messageID, emoji, user = "@me") {
        return this.client.rest.channels.deleteReaction(this.id, messageID, emoji, user);
    }
    /**
     * Remove all, or a specific emoji's reactions from a message.
     * @param messageID The ID of the message to remove reactions from.
     * @param emoji The reaction to remove from the message. `name:id` for custom emojis, and the unicode codepoint for default emojis. Omit to remove all reactions.
     */
    async deleteReactions(messageID, emoji) {
        return this.client.rest.channels.deleteReactions(this.id, messageID, emoji);
    }
    async editMessage(messageID, content, options) {
        if (typeof content === "string") {
            options = {
                ...options,
                content,
            };
        }
        else
            options = content;
        return this.client.rest.channels.editMessage(this.id, messageID, options);
    }
    /**
     * Get a thread member in this thread.
     * @param userID The ID of the user to get the thread member of.
     */
    async getMember(userID) {
        return this.client.rest.channels.getThreadMember(this.id, userID);
    }
    /**
     * Get the members of this thread.
     */
    async getMembers() {
        return this.client.rest.channels.getThreadMembers(this.id);
    }
    /**
     * Get a message in this thread.
     * @param messageID The ID of the message to get.
     */
    async getMessage(messageID) {
        return this.client.rest.channels.getMessage(this.id, messageID);
    }
    /**
     * Get messages in this thread.
     * @param options The options for getting the messages. `before`, `after`, and `around `All are mutually exclusive.
     */
    async getMessages(options) {
        return this.client.rest.channels.getMessages(this.id, options);
    }
    /**
     * Get the pinned messages in this thread.
     * @deprecated Use {@link ThreadChannel#getPins | getPins} instead.
     */
    async getPinnedMessages() {
        return this.client.rest.channels.getPinnedMessages(this.id);
    }
    /**
     * Get the pins in this thread.
     * @param options The options for getting pins.
     */
    async getPins(options) {
        return this.client.rest.channels.getPins(this.id, options);
    }
    /**
     * Get an async iterator for getting pins in this thread.
     * @param options The options for getting pins.
     */
    getPinsIterator(options) {
        return this.client.rest.channels.getPinsIterator(this.id, options);
    }
    /**
     * Get the users who reacted with a specific emoji on a message.
     * @param messageID The ID of the message to get reactions from.
     * @param emoji The reaction to remove from the message. `name:id` for custom emojis, and the unicode codepoint for default emojis.
     * @param options The options for getting the reactions.
     */
    async getReactions(messageID, emoji, options) {
        return this.client.rest.channels.getReactions(this.id, messageID, emoji, options);
    }
    /**
     * Join this thread.
     */
    async join() {
        return this.client.rest.channels.joinThread(this.id);
    }
    /**
     * Leave this thread.
     */
    async leave() {
        return this.client.rest.channels.leaveThread(this.id);
    }
    /**
     * Get the permissions of a member. If providing an id, the member must be cached. The parent channel must be cached as threads themselves do not have permissions.
     * @param member The member to get the permissions of.
     */
    permissionsOf(member) {
        if (!this.parent) {
            throw new Errors_1.UncachedError(`${this.constructor.name}#permisionsOf cannot be used if the parent channel is not cached.`);
        }
        return this.parent.permissionsOf(member);
    }
    /**
     * Pin a message in this thread.
     * @param messageID The ID of the message to pin.
     * @param reason The reason for pinning the message.
     */
    async pinMessage(messageID, reason) {
        return this.client.rest.channels.pinMessage(this.id, messageID, reason);
    }
    /**
     * Purge an amount of messages from this channel.
     * @param options The options to purge. `before`, `after`, and `around `All are mutually exclusive.
     */
    async purge(options) {
        return this.client.rest.channels.purgeMessages(this.id, options);
    }
    /**
     * Remove a member from this thread.
     * @param userID The ID of the user to remove from the thread.
     */
    async removeMember(userID) {
        return this.client.rest.channels.removeThreadMember(this.id, userID);
    }
    /**
     * Show a typing indicator in this thread.
     */
    async sendTyping() {
        return this.client.rest.channels.sendTyping(this.id);
    }
    toJSON() {
        return {
            ...super.toJSON(),
            flags: this.flags,
            lastMessageID: this.lastMessageID,
            memberCount: this.memberCount,
            messageCount: this.messageCount,
            messages: this._messages?.map((m) => m.id) ?? [],
            ownerID: this.ownerID,
            rateLimitPerUser: this.rateLimitPerUser,
            threadMetadata: this.threadMetadata,
            totalMessageSent: this.totalMessageSent,
            type: this.type,
        };
    }
    /**
     * Unpin a message in this thread.
     * @param messageID The ID of the message to unpin.
     * @param reason The reason for unpinning the message.
     */
    async unpinMessage(messageID, reason) {
        return this.client.rest.channels.unpinMessage(this.id, messageID, reason);
    }
}
exports.default = ThreadChannel;
//# sourceMappingURL=data:application/json;base64,eyJ2ZXJzaW9uIjozLCJmaWxlIjoiVGhyZWFkQ2hhbm5lbC5qcyIsInNvdXJjZVJvb3QiOiIiLCJzb3VyY2VzIjpbIi4uLy4uLy4uL2xpYi9zdHJ1Y3R1cmVzL1RocmVhZENoYW5uZWwudHMiXSwibmFtZXMiOltdLCJtYXBwaW5ncyI6Ijs7O0FBQUEsNEJBQTRCO0FBQzVCLDBFQUEwQztBQUMxQyxnRUFBZ0M7QUFLaEMsNENBQTRDO0FBRTVDLHNGQUFzRDtBQUN0RCwyQ0FBK0M7QUFFL0MseUNBQXlDO0FBQ3pDLE1BQXFCLGFBRW5CLFNBQVEsc0JBQVk7SUFDWixTQUFTLENBQTJEO0lBQzVFLG1EQUFtRDtJQUNuRCxhQUFhLENBQWdCO0lBQzdCLGlGQUFpRjtJQUNqRixXQUFXLENBQVM7SUFDcEIsa0NBQWtDO0lBQ2xDLE9BQU8sQ0FBcUM7SUFDNUMsNkhBQTZIO0lBQzdILFlBQVksQ0FBUztJQUNyQixnQ0FBZ0M7SUFDaEMsS0FBSyxDQUFRO0lBQ2IsMENBQTBDO0lBQzFDLE9BQU8sQ0FBUztJQUVoQixxRUFBcUU7SUFDckUsZ0JBQWdCLENBQVM7SUFDekIsaUtBQWlLO0lBQ2pLLGNBQWMsQ0FFMkI7SUFDekMsdUZBQXVGO0lBQ3ZGLGdCQUFnQixDQUFTO0lBRXpCLFlBQVksSUFBcUMsRUFBRSxNQUFjO1FBQy9ELEtBQUssQ0FBQyxJQUFJLEVBQUUsTUFBTSxDQUFDLENBQUM7UUFDcEIsSUFBSSxDQUFDLEtBQUssR0FBRyxJQUFJLENBQUMsS0FBSyxDQUFDO1FBQ3hCLElBQUksQ0FBQyxhQUFhLEdBQUcsSUFBSSxDQUFDLGVBQWUsQ0FBQztRQUMxQyxJQUFJLENBQUMsV0FBVyxHQUFHLENBQUMsQ0FBQztRQUNyQixJQUFJLENBQUMsT0FBTyxHQUFHLEVBQUUsQ0FBQztRQUNsQixJQUFJLENBQUMsWUFBWSxHQUFHLENBQUMsQ0FBQztRQUN0QixJQUFJLENBQUMsT0FBTyxHQUFHLElBQUksQ0FBQyxRQUFRLENBQUM7UUFDN0IsSUFBSSxDQUFDLGdCQUFnQixHQUFHLElBQUksQ0FBQyxtQkFBbUIsQ0FB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