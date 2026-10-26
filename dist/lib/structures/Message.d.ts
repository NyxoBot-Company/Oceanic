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
import type PrivateChannel from "./PrivateChannel";
import Poll from "./Poll";
import type * as Types from "../types/namespaced";
import type Client from "../Client";
import TypedCollection from "../util/TypedCollection";
import { type MessageTypes } from "../Constants";
/** Represents a message. */
export default class Message<T extends Types.Channels.AnyTextableChannel | Types.Shared.Uncached = Types.Channels.AnyTextableChannel | Types.Shared.Uncached> extends Base {
    private _cachedChannel;
    private _cachedGuild?;
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
    /**
     * The interaction info, if this message was the result of an interaction.
     * @deprecated Use {@link Message#interactionMetadata | Message#interactionMetadata } instead.
     */
    interaction?: Types.Channels.MessageInteraction;
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
    constructor(data: Types.Channels.RawMessage, client: Client);
    protected update(data: Partial<Types.Channels.RawMessage>): void;
    /** The channel this message was created in. */
    get channel(): T extends Types.Channels.AnyTextableChannel ? T : undefined;
    /** The guild this message is in. This will throw an error if the guild is not cached. */
    get guild(): T extends Types.Channels.AnyTextableGuildChannel ? Guild : Guild | null;
    /** A link to this message. */
    get jumpLink(): string;
    /**
     * Add a reaction to this message.
     * @param emoji The reaction to add to the message. `name:id` for custom emojis, and the unicode codepoint for default emojis.
     */
    createReaction(emoji: string): Promise<void>;
    /**
     * Crosspost this message in an announcement channel.
     */
    crosspost(): Promise<Message<T>>;
    /**
     * Delete this message.
     * @param reason The reason for deleting the message.
     */
    delete(reason?: string): Promise<void>;
    /**
     * Remove a reaction from this message.
     * @param emoji The reaction to remove from the message. `name:id` for custom emojis, and the unicode codepoint for default emojis.
     * @param user The user to remove the reaction from, `@me` for the current user (default).
     */
    deleteReaction(emoji: string, user?: string): Promise<void>;
    /**
     * Remove all, or a specific emoji's reactions from this message.
     * @param emoji The reaction to remove from the message. `name:id` for custom emojis, and the unicode codepoint for default emojis. Omit to remove all reactions.
     */
    deleteReactions(emoji?: string): Promise<void>;
    /**
     * Edit this message.
     * @param options The options for editing the message.
     */
    edit(options: Types.Channels.EditMessageOptions): Promise<Message<T>>;
    /**
     * Edit this message.
     * @param content The content for editing the message
     * @param options The options for editing the message.
     */
    edit(content: string, options?: Types.Channels.EditMessageOptions): Promise<Message<T>>;
    /** End the poll on this message now. */
    expire(): Promise<void>;
    /**
     * Forward this message.
     * @param channelID The ID of the channel to forward the message to.
     * @param options The options for the message.
     */
    forward(channelID: string, options?: Types.Channels.CreateMessageOptions): Promise<Message<T>>;
    /**
     * Forward this message.
     * @param channelID The ID of the channel to forward the message to.
     * @param content The content for the message.
     * @param options The options for the message.
     */
    forward(channelID: string, content: string, options?: Types.Channels.CreateMessageOptions): Promise<Message<T>>;
    /**
     * Get the users that voted on a poll answer.
     * @param answerID The ID of the poll answer to get voters for.
     * @param options The options for getting the voters.
     */
    getPollAnswerUsers(answerID: number, options?: Types.Channels.GetPollAnswerUsersOptions): Promise<Array<User>>;
    /**
     * Get the users who reacted with a specific emoji on this message.
     * @param emoji The reaction to remove from the message. `name:id` for custom emojis, and the unicode codepoint for default emojis.
     * @param options The options for getting the reactions.
     */
    getReactions(emoji: string, options?: Types.Channels.GetReactionsOptions): Promise<Array<User>>;
    /** Whether this message belongs to a cached guild channel. The only difference on using this method over a simple if statement is to easily update all the message properties typing definitions based on the channel it belongs to. */
    inCachedGuildChannel(): this is Message<Types.Channels.AnyTextableGuildChannel>;
    /** Whether this message belongs to a direct message channel (PrivateChannel or uncached). The only difference on using this method over a simple if statement is to easily update all the message properties typing definitions based on the channel it belongs to. */
    inDirectMessageChannel(): this is Message<PrivateChannel | Types.Shared.Uncached>;
    /**
     * Pin this message.
     * @param reason The reason for pinning the message.
     */
    pin(reason?: string): Promise<void>;
    /**
     * Reply to this message
     * @param options The options for the message.
     */
    reply(options: Types.Channels.CreateMessageOptions): Promise<Message<T>>;
    /**
     * Reply to this message
     * @param content The content for the message.
     * @param options The options for the message.
     */
    reply(content: string, options?: Types.Channels.CreateMessageOptions): Promise<Message<T>>;
    /**
     * Create a thread from this message.
     * @param options The options for creating the thread.
     */
    startThread(options: Types.Channels.StartThreadFromMessageOptions): Promise<T extends AnnouncementChannel ? AnnouncementThreadChannel : T extends TextChannel ? PublicThreadChannel : never>;
    toJSON(): Types.JSON.JSONMessage;
    /**
     * Unpin this message.
     * @param reason The reason for unpinning the message.
     */
    unpin(reason?: string): Promise<void>;
}
