"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const tslib_1 = require("tslib");
/** @module Guild */
const Role_1 = tslib_1.__importDefault(require("./Role"));
const Base_1 = tslib_1.__importDefault(require("./Base"));
const GuildChannel_1 = tslib_1.__importDefault(require("./GuildChannel"));
const Member_1 = tslib_1.__importDefault(require("./Member"));
const GuildScheduledEvent_1 = tslib_1.__importDefault(require("./GuildScheduledEvent"));
const ThreadChannel_1 = tslib_1.__importDefault(require("./ThreadChannel"));
const GuildJoinRequest_1 = tslib_1.__importDefault(require("./GuildJoinRequest"));
const Integration_1 = tslib_1.__importDefault(require("./Integration"));
const AutoModerationRule_1 = tslib_1.__importDefault(require("./AutoModerationRule"));
const Permission_1 = tslib_1.__importDefault(require("./Permission"));
const VoiceState_1 = tslib_1.__importDefault(require("./VoiceState"));
const StageInstance_1 = tslib_1.__importDefault(require("./StageInstance"));
const Channel_1 = tslib_1.__importDefault(require("./Channel"));
const Invite_1 = tslib_1.__importDefault(require("./Invite"));
const AuditLogEntry_1 = tslib_1.__importDefault(require("./AuditLogEntry"));
const Soundboard_1 = tslib_1.__importDefault(require("./Soundboard"));
const Constants_1 = require("../Constants");
const Routes = tslib_1.__importStar(require("../util/Routes"));
const TypedCollection_1 = tslib_1.__importDefault(require("../util/TypedCollection"));
// eslint-disable-next-line @typescript-eslint/ban-ts-comment
// @ts-ignore-line
const Errors_1 = require("../util/Errors");
const SimpleCollection_1 = tslib_1.__importDefault(require("../util/SimpleCollection"));
/** Represents a Discord server. */
class Guild extends Base_1.default {
    _clientMember;
    // if the guild was retrieved from rest
    _rest;
    _shard;
    /** This guild's afk voice channel. */
    afkChannel;
    /** The ID of this guild's afk voice channel. */
    afkChannelID;
    /** The seconds after which voice users will be moved to the afk channel. */
    afkTimeout;
    /** The application that created this guild, if applicable. */
    application;
    /** The ID of the application that created this guild, if applicable. */
    applicationID;
    /** The approximate number of members in this guild (if retrieved with counts). */
    approximateMemberCount;
    /** The approximate number of non-offline members in this guild (if retrieved with counts). */
    approximatePresenceCount;
    /** The cached audit log entries. This requires both the {@link Constants~Intents.GUILD_MODERATION | GUILD_MODERATION} intent, as well as the {@link Constants~Permissions | VIEW_AUDIT_LOG } permission. */
    auditLogEntries;
    /** The auto moderation rules in this guild. */
    autoModerationRules;
    /** The hash of this guild's banner. */
    banner;
    /** The channels in this guild. */
    channels;
    /** The default [message notifications level](https://discord.com/developers/docs/resources/guild#guild-object-default-message-notification-level) of this guild. */
    defaultMessageNotifications;
    /** The description of this guild. */
    description;
    /** The discovery splash of this guild. Only present if the guild has the `DISCOVERABLE` feature. */
    discoverySplash;
    /** The custom emojis of this guild. */
    emojis;
    /** The [explicit content filter](https://discord.com/developers/docs/resources/guild#guild-object-explicit-content-filter-level) of this guild. */
    explicitContentFilter;
    /** The [features](https://discord.com/developers/docs/resources/guild#guild-object-guild-features) this guild has. */
    features;
    /** The icon hash of this guild. */
    icon;
    incidentActions;
    /** The integrations in this guild. */
    integrations;
    /** The guild's inventory settings. */
    inventorySettings;
    /** The cached invites in this guild. This will only be populated by invites created while the client is active. */
    invites;
    /** The cached join requests in this guild. This will be empty unless join requests have been fetched. */
    joinRequests;
    /** The date at which this guild was joined. */
    joinedAt;
    /** If this guild is considered large. */
    large;
    latestOnboardingQuestionID;
    /** The maximum amount of members this guild can have. */
    maxMembers;
    /** The maximum amount of people that can be present at a time in this guild. Only present for very large guilds. */
    maxPresences;
    /** The maximum amount of users that can be present in a stage video channel. */
    maxStageVideoChannelUsers;
    /** The maximum amount of users that can be present in a video channel. */
    maxVideoChannelUsers;
    /** The number of members in this guild. */
    memberCount;
    /** The cached members in this guild. */
    members;
    /** The required [mfa level](https://discord.com/developers/docs/resources/guild#guild-object-mfa-level) for moderators of this guild. */
    mfaLevel;
    /** The name of this guild. */
    name;
    /** The [nsfw level](https://discord.com/developers/docs/resources/guild#guild-object-guild-nsfw-level) of this guild. */
    nsfwLevel;
    /** The owner of this guild. */
    owner;
    /** The ID of the owner of this guild. */
    ownerID;
    /** The [preferred locale](https://discord.com/developers/docs/reference#locales) of this guild. */
    preferredLocale;
    /** If this guild has the boost progress bar enabled. */
    premiumProgressBarEnabled;
    /** The number of nitro boosts this guild has. */
    premiumSubscriptionCount;
    /** The [boost level](https://discord.com/developers/docs/resources/guild#guild-object-premium-tier) of this guild. */
    premiumTier;
    /** The guild's server tag, only present for guilds received over the gateway. */
    profile;
    /** The channel where notices from Discord are received. Only present in guilds with the `COMMUNITY` feature. */
    publicUpdatesChannel;
    /** The id of the channel where notices from Discord are received. Only present in guilds with the `COMMUNITY` feature. */
    publicUpdatesChannelID;
    /** @deprecated The region of this guild. */
    region;
    /** The roles in this guild. */
    roles;
    /** The channel where rules/guidelines are displayed. Only present in guilds with the `COMMUNITY` feature. */
    rulesChannel;
    /** The id of the channel where rules/guidelines are displayed. Only present in guilds with the `COMMUNITY` feature. */
    rulesChannelID;
    /** The channel where safety related notices are posted. */
    safetyAlertsChannel;
    /** The ID if the channel where safety related notices are posted. */
    safetyAlertsChannelID;
    /** The scheduled events in this guild. */
    scheduledEvents;
    /** The soundboard sounds in this guild. */
    soundboardSounds;
    /** The invite splash hash of this guild. */
    splash;
    /** The stage instances in this guild. */
    stageInstances;
    /** The custom stickers of this guild. */
    stickers;
    /** The channel where welcome messages and boosts notices are posted. */
    systemChannel;
    /** The [flags](https://discord.com/developers/docs/resources/guild#guild-object-system-channel-flags) for the system channel. */
    systemChannelFlags;
    /** The ID of the channel where welcome messages and boosts notices are posted. */
    systemChannelID;
    /** The threads in this guild. */
    threads;
    /** If this guild is unavailable. */
    unavailable;
    /** The vanity url of this guild. Only present in guilds with the `VANITY_URL` feature. */
    vanityURLCode;
    /** The [verification level](https://discord.com/developers/docs/resources/guild#guild-object-verification-level) of this guild. */
    verificationLevel;
    /** The voice states of members in voice channels. */
    voiceStates;
    /** The welcome screen configuration. Only present in guilds with the `WELCOME_SCREEN_ENABLED` feature. */
    welcomeScreen;
    /** The channel the widget will generate an invite to, or `null` if set to no invite. */
    widgetChannel;
    /** The id of the channel the widget will generate an invite to, or `null` if set to no invite. */
    widgetChannelID;
    /** If the widget is enabled. */
    widgetEnabled;
    constructor(data, client, rest) {
        super(data.id, client);
        this.afkChannelID = null;
        this.afkTimeout = 0;
        this.applicationID = data.application_id;
        this.auditLogEntries = new TypedCollection_1.default(AuditLogEntry_1.default, client, client.util._getLimit("auditLogEntries", this.id));
        this.autoModerationRules = new TypedCollection_1.default(AutoModerationRule_1.default, client, client.util._getLimit("autoModerationRules", this.id));
        this.banner = null;
        this.channels = new TypedCollection_1.default(GuildChannel_1.default, client, client.util._getLimit("channels", this.id), {
            construct: (channel) => {
                client.channelGuildMap.set(channel.id, this.id);
                return Channel_1.default.from(channel, client);
            },
            delete: (id) => {
                client.channelGuildMap.delete(id);
            }
        });
        this.defaultMessageNotifications = data.default_message_notifications;
        this.description = null;
        this.discoverySplash = null;
        this.emojis = new SimpleCollection_1.default(rawEmoji => this.client.util.convertGuildEmoji(rawEmoji), client.util._getLimit("emojis", this.id), "merge");
        this.explicitContentFilter = data.explicit_content_filter;
        this.features = [];
        this.icon = null;
        this.incidentActions = null;
        this.integrations = new TypedCollection_1.default(Integration_1.default, client, client.util._getLimit("integrations", this.id));
        this.inventorySettings = null;
        this.invites = new SimpleCollection_1.default(rawInvite => Invite_1.default.withMetadata(rawInvite, client), client.util._getLimit("invites", this.id), "update", "code");
        this.joinRequests = new TypedCollection_1.default(GuildJoinRequest_1.default, client);
        this.joinedAt = null;
        this.large = (data.member_count ?? data.approximate_member_count ?? 0) >= client.shards.options.largeThreshold;
        this.latestOnboardingQuestionID = null;
        this.memberCount = data.member_count ?? data.approximate_member_count ?? 0;
        this.members = new TypedCollection_1.default(Member_1.default, client, client.util._getLimit("members", this.id));
        this.mfaLevel = data.mfa_level;
        this.name = data.name;
        this.nsfwLevel = data.nsfw_level;
        this.owner = data.owner_id === null ? null : client.users.get(data.owner_id);
        this.ownerID = data.owner_id;
        this.preferredLocale = data.preferred_locale;
        this.premiumProgressBarEnabled = data.premium_progress_bar_enabled;
        this.premiumTier = data.premium_tier;
        this.profile = null;
        this.publicUpdatesChannelID = null;
        this.roles = new TypedCollection_1.default(Role_1.default, client, client.util._getLimit("roles", this.id));
        this.rulesChannelID = null;
        this.safetyAlertsChannelID = null;
        this.scheduledEvents = new TypedCollection_1.default(GuildScheduledEvent_1.default, client, client.util._getLimit("scheduledEvents", this.id));
        this.soundboardSounds = new TypedCollection_1.default(Soundboard_1.default, client, client.util._getLimit("soundboardSounds", this.id));
        this.splash = null;
        this.stageInstances = new TypedCollection_1.default(StageInstance_1.default, client, client.util._getLimit("stageInstances", this.id));
        this.stickers = new SimpleCollection_1.default(rawSticker => client.util.convertSticker(rawSticker), client.util._getLimit("stickers", this.id), "merge");
        this.systemChannelID = null;
        this.systemChannelFlags = data.system_channel_flags;
        this.threads = new TypedCollection_1.default(ThreadChannel_1.default, client, client.util._getLimit("guildThreads", this.id), {
            construct: (thread) => {
                client.threadGuildMap.set(thread.id, this.id);
                return Channel_1.default.from(thread, client);
            },
            delete: (id) => {
                client.threadGuildMap.delete(id);
            }
        });
        this.unavailable = !!data.unavailable;
        this.vanityURLCode = data.vanity_url_code;
        this.verificationLevel = data.verification_level;
        this.voiceStates = new TypedCollection_1.default(VoiceState_1.default, client, client.util._getLimit("voiceStates", this.id));
        this.widgetChannelID = data.widget_channel_id ?? null;
        for (const role of data.roles) {
            this.roles.update(role, data.id);
        }
        this.update(data);
        this._rest = !!rest;
        if (data.channels) {
            for (const channelData of data.channels) {
                channelData.guild_id = this.id;
                this.channels.update(channelData);
            }
        }
        if (data.threads) {
            for (const threadData of data.threads) {
                threadData.guild_id = this.id;
                this.threads.update(threadData);
            }
        }
        if (data.members) {
            for (const rawMember of data.members) {
                const member = this.members.update({ ...rawMember, id: rawMember.user?.id }, this.id);
                if (this.client["_user"] && member.id === this.client.user.id) {
                    this._clientMember = member;
                }
            }
        }
        if (data.stage_instances) {
            for (const stageInstance of data.stage_instances) {
                stageInstance.guild_id = this.id;
                this.stageInstances.update(stageInstance);
            }
        }
        if (data.voice_states) {
            for (const voiceState of data.voice_states) {
                if (!this.members.has(voiceState.user_id) || !voiceState.channel_id) {
                    continue;
                }
                voiceState.guild_id = this.id;
                this.voiceStates.update({ ...voiceState, id: voiceState.user_id });
                const channel = this.channels.get(voiceState.channel_id);
                const member = this.members.update({ id: voiceState.user_id, deaf: voiceState.deaf, mute: voiceState.mute }, this.id);
                if (this._clientMember) {
                    this._clientMember["update"]({ deaf: voiceState.deaf, mute: voiceState.mute });
                }
                if (channel && "voiceMembers" in channel) {
                    channel.voiceMembers.add(member);
                }
                if (client.shards.options.seedVoiceConnections && voiceState.user_id === client.user.id && !this.client.getVoiceConnection(this.id)) {
                    this.client.joinVoiceChannel({
                        guildID: this.id,
                        channelID: voiceState.channel_id,
                        selfDeaf: voiceState.self_deaf,
                        selfMute: voiceState.self_mute,
                        // eslint-disable-next-line @typescript-eslint/no-unsafe-assignment
                        voiceAdapterCreator: this.voiceAdapterCreator
                    });
                }
            }
        }
    }
    toggleFeature(feature, enable, reason) {
        const newFeatures = enable ?
            (this.features.includes(feature) ? this.features : [...this.features, feature]) :
            this.features.filter(name => name !== feature);
        return this.edit({ features: newFeatures, reason });
    }
    // true = `memberCount`
    updateMemberLimit(toAdd) {
        if (this.members.limit === Infinity || this.client.options.disableMemberLimitScaling) {
            return;
        }
        const original = this.members.limit;
        const num = toAdd === true ? this.memberCount : this.members.limit + toAdd;
        const round = 10 ** (Math.floor(Math.log10(num)) - 1);
        if (toAdd === true) {
            const limit = Math.round(num / round) * round + round;
            if (this.members.limit >= limit) {
                return;
            }
            this.members.limit = limit;
        }
        else {
            const limit = Math.round((this.members.size + toAdd) / round) * round + round;
            if (this.members.limit >= limit) {
                return;
            }
            this.members.limit = limit;
        }
        this.client.emit("debug", `The limit of the members collection of guild ${this.id} has been updated from ${original} to ${this.members.limit} to accommodate at least ${toAdd === true ? this.memberCount : this.members.size + toAdd} members.`);
    }
    update(data) {
        if (data.afk_channel_id !== undefined) {
            this.afkChannel = data.afk_channel_id === null ? null : this.client.getChannel(data.afk_channel_id);
            this.afkChannelID = data.afk_channel_id;
        }
        if (data.afk_timeout !== undefined) {
            this.afkTimeout = data.afk_timeout;
        }
        if (data.application_id !== undefined) {
            this.application = this.client["_application"] && data.application_id === null ? null : (this.client.application.id === data.application_id ? this.client.application : undefined);
            this.applicationID = data.application_id;
        }
        if (data.approximate_member_count !== undefined) {
            this.approximateMemberCount = data.approximate_member_count;
        }
        if (data.approximate_presence_count !== undefined) {
            this.approximatePresenceCount = data.approximate_presence_count;
        }
        if (data.banner !== undefined) {
            this.banner = data.banner;
        }
        if (data.default_message_notifications !== undefined) {
            this.defaultMessageNotifications = data.default_message_notifications;
        }
        if (data.description !== undefined) {
            this.description = data.description;
        }
        if (data.discovery_splash !== undefined) {
            this.discoverySplash = data.discovery_splash;
        }
        if (data.emojis !== undefined) {
            this.emojis.clear();
            for (const emoji of data.emojis) {
                this.emojis.update(emoji);
            }
        }
        if (data.explicit_content_filter !== undefined) {
            this.explicitContentFilter = data.explicit_content_filter;
        }
        if (data.features !== undefined) {
            this.features = data.features;
        }
        if (data.icon !== undefined) {
            this.icon = data.icon;
        }
        if (data.incident_actions !== undefined) {
            this.incidentActions = data.incident_actions === null ? null : {
                dmsDisabledUntil: data.incident_actions.dms_disabled_until,
                invitesDisabledUntil: data.incident_actions.invites_disabled_until
            };
        }
        if (data.inventory_settings !== undefined) {
            this.inventorySettings = data.inventory_settings === null ? null : {
                isEmojiPackCollectible: data.inventory_settings.is_emoji_pack_collectible
            };
        }
        if (data.joined_at !== undefined) {
            this.joinedAt = data.joined_at === null ? null : new Date(data.joined_at);
        }
        if (data.large !== undefined) {
            this.large = data.large;
        }
        if (data.latest_onboarding_question_id !== undefined) {
            this.latestOnboardingQuestionID = data.latest_onboarding_question_id;
        }
        if (data.max_members !== undefined) {
            this.maxMembers = data.max_members;
        }
        if (data.max_presences !== undefined) {
            this.maxPresences = data.max_presences;
        }
        if (data.max_stage_video_channel_users !== undefined) {
            this.maxStageVideoChannelUsers = data.max_stage_video_channel_users;
        }
        if (data.max_video_channel_users !== undefined) {
            this.maxVideoChannelUsers = data.max_video_channel_users;
        }
        if (data.member_count !== undefined) {
            this.memberCount = data.member_count;
        }
        if (data.mfa_level !== undefined) {
            this.mfaLevel = data.mfa_level;
        }
        if (data.name !== undefined) {
            this.name = data.name;
        }
        if (data.nsfw_level !== undefined) {
            this.nsfwLevel = data.nsfw_level;
        }
        if (data.owner_id !== undefined) {
            this.ownerID = data.owner_id;
            this.owner = data.owner_id === null ? null : this.client.users.get(data.owner_id);
        }
        if (data.preferred_locale !== undefined) {
            this.preferredLocale = data.preferred_locale;
        }
        if (data.premium_progress_bar_enabled !== undefined) {
            this.premiumProgressBarEnabled = data.premium_progress_bar_enabled;
        }
        if (data.premium_subscription_count !== undefined) {
            this.premiumSubscriptionCount = data.premium_subscription_count;
        }
        if (data.premium_tier !== undefined) {
            this.premiumTier = data.premium_tier;
        }
        if (data.profile !== undefined) {
            this.profile = data.profile;
        }
        if (data.public_updates_channel_id !== undefined) {
            this.publicUpdatesChannel = data.public_updates_channel_id === null ? null : this.client.getChannel(data.public_updates_channel_id);
            this.publicUpdatesChannelID = data.public_updates_channel_id;
        }
        if (data.region !== undefined) {
            this.region = data.region;
        }
        if (data.rules_channel_id !== undefined) {
            this.rulesChannel = data.rules_channel_id === null ? null : this.client.getChannel(data.rules_channel_id);
            this.rulesChannelID = data.rules_channel_id;
        }
        if (data.safety_alerts_channel_id !== undefined) {
            this.safetyAlertsChannel = data.safety_alerts_channel_id === null ? null : this.client.getChannel(data.safety_alerts_channel_id);
            this.safetyAlertsChannelID = data.safety_alerts_channel_id;
        }
        if (data.splash !== undefined) {
            this.splash = data.splash;
        }
        if (data.stickers !== undefined) {
            this.stickers.clear();
            for (const sticker of data.stickers)
                this.stickers.update(sticker);
        }
        if (data.system_channel_flags !== undefined) {
            this.systemChannelFlags = data.system_channel_flags;
        }
        if (data.system_channel_id !== undefined) {
            this.systemChannel = data.system_channel_id === null ? null : this.client.getChannel(data.system_channel_id);
            this.systemChannelID = data.system_channel_id;
        }
        if (data.vanity_url_code !== undefined) {
            this.vanityURLCode = data.vanity_url_code;
        }
        if (data.verification_level !== undefined) {
            this.verificationLevel = data.verification_level;
        }
        if (data.welcome_screen !== undefined) {
            this.welcomeScreen = {
                description: data.welcome_screen.description,
                welcomeChannels: data.welcome_screen.welcome_channels.map(channel => ({
                    channelID: channel.channel_id,
                    description: channel.description,
                    emojiID: channel.emoji_id,
                    emojiName: channel.emoji_name
                }))
            };
        }
        if (data.widget_channel_id !== undefined) {
            this.widgetChannel = data.widget_channel_id === null ? null : this.client.getChannel(data.widget_channel_id);
            this.widgetChannelID = data.widget_channel_id;
        }
        if (data.widget_enabled !== undefined) {
            this.widgetEnabled = data.widget_enabled;
        }
    }
    /** The client's member for this guild. This will throw an error if the member is not cached. */
    get clientMember() {
        this._clientMember ??= this.client["_user"] === undefined ? undefined : this.members.get(this.client["_user"].id);
        if (!this._clientMember) {
            if (this._rest) {
                throw new Errors_1.UncachedError(`${this.constructor.name}#clientMember is not present when the guild is obtained via rest.`);
            }
            throw new Errors_1.UncachedError(`The client's member has not been cached for ${this.constructor.name}#clientMember.`);
        }
        return this._clientMember;
    }
    /** The shard this guild is on. Gateway only. */
    get shard() {
        this._shard ??= this.client.shards["_forGuild"](this.id);
        if (this.client.options.restMode) {
            throw new TypeError(`${this.constructor.name}#shard will not be present with rest mode enabled.`);
        }
        if (!this.client.shards.connected) {
            throw new TypeError(`${this.constructor.name}#shard will not be present without a gateway connection.`);
        }
        if (!this._shard) {
            throw new TypeError(`Failed to determine shard for ${this.constructor.name}#shard (guild: ${this.id})`);
        }
        return this._shard;
    }
    /** The voice adapter creator for this guild that can be used with [@discordjs/voice](https://discord.js.org/#/docs/voice/main/general/welcome) to play audio in voice and stage channels. */
    get voiceAdapterCreator() {
        this._shard ??= this.client.shards["_forGuild"](this.id);
        if (this.client.options.restMode) {
            throw new TypeError(`${this.constructor.name}#voiceAdapterCreator cannot be used with rest mode enabled.`);
        }
        if (!this.client.shards.connected) {
            throw new TypeError(`${this.constructor.name}#voiceAdapterCreator cannot be used without a gateway connection.`);
        }
        if (!this._shard) {
            throw new TypeError(`Failed to determine shard for ${this.constructor.name}#voiceAdapterCreator (guild: ${this.id})`);
        }
        return (methods) => {
            this.client.voiceAdapters.set(this.id, methods);
            // eslint-disable-next-line @typescript-eslint/no-unsafe-return
            return {
                sendPayload: (payload) => {
                    this.shard.send(payload.op, payload.d);
                    return true;
                },
                destroy: () => this.client.voiceAdapters.delete(this.id)
            };
        };
    }
    /**
     * Accept or deny a join request for this guild.
     * @param requestID The ID of the join request.
     * @param options The options for actioning the join request.
     * @caching This method **does** cache its result.
     * @caches {@link Guild#joinRequests | Guild#joinRequests}
     */
    async actionJoinRequest(requestID, options) {
        return this.client.rest.guilds.actionJoinRequest(this.id, requestID, options);
    }
    /**
     * Add a member to this guild. Requires an access token with the `guilds.join` scope.
     *
     * Returns the newly added member upon success, or void if the member is already in the guild.
     * @param userID The ID of the user to add.
     * @param options The options for adding the member.
     */
    async addMember(userID, options) {
        return this.client.rest.guilds.addMember(this.id, userID, options);
    }
    /**
     * Add a role to a member.
     * @param memberID The ID of the member.
     * @param roleID The ID of the role to add.
     * @param reason The reason for adding the role.
     */
    async addMemberRole(memberID, roleID, reason) {
        return this.client.rest.guilds.addMemberRole(this.id, memberID, roleID, reason);
    }
    /**
     * The url of this guild's banner.
     * @param format The format the url should be.
     * @param size The dimensions of the image.
     */
    bannerURL(format, size) {
        return this.banner === null ? null : this.client.util.formatImage(Routes.BANNER(this.id, this.banner), format, size);
    }
    /**
     * Begin a prune.
     * @param options The options for the prune.
     */
    async beginPrune(options) {
        return this.client.rest.guilds.beginPrune(this.id, options);
    }
    /**
     * Ban up to 200 members from this guild. This requires both the `BAN_MEMBERS` and `MANAGE_GUILD` permissions.
     * If no members were banned, a {@link Constants~JSONErrorCodes.FAILED_TO_BAN_USERS | FAILED_TO_BAN_USERS } will be returned.
     * The bot user is ignored.
     * @param options The options for banning.
     */
    async bulkBan(options) {
        return this.client.rest.guilds.bulkBan(this.id, options);
    }
    /**
     * Create an auto moderation rule for this guild.
     * @param options The options for the rule.
     */
    async createAutoModerationRule(options) {
        return this.client.rest.guilds.createAutoModerationRule(this.id, options);
    }
    /**
     * Create a ban for a user.
     * @param userID The ID of the user.
     * @param options The options for creating the ban.
     */
    async createBan(userID, options) {
        return this.client.rest.guilds.createBan(this.id, userID, options);
    }
    /**
     * Create a channel in this guild.
     * @param options The options for creating the channel.
     */
    async createChannel(type, options) {
        return this.client.rest.guilds.createChannel(this.id, type, options);
    }
    /**
     * Create an emoji in this guild.
     * @param options The options for creating the emoji.
     */
    async createEmoji(options) {
        return this.client.rest.guilds.createEmoji(this.id, options);
    }
    /**
     * Create a role.
     * @param options The options for creating the role.
     */
    async createRole(options) {
        return this.client.rest.guilds.createRole(this.id, options);
    }
    /**
     * Create a scheduled event in this guild.
     * @param options The options for creating the scheduled event.
     */
    async createScheduledEvent(options) {
        return this.client.rest.guilds.createScheduledEvent(this.id, options);
    }
    /**
     * Create an exception to the recurrence rule for a scheduled event.
     * @param eventID The ID of the scheduled event.
     * @param options The options for creating the scheduled event exception.
     * @caching This method **may** cache its result. The result will not be cached if the scheduled event is not cached.
     * @caches {@link GuildScheduledEvent#exceptions | GuildScheduledEvent#exceptions}
     */
    async createScheduledEventException(eventID, options) {
        return this.client.rest.guilds.createScheduledEventException(this.id, eventID, options);
    }
    /**
     * Create a soundboard sound.
     * @param options The options for creating the soundboard sound.
     */
    async createSoundboardSound(options) {
        return this.client.rest.guilds.createSoundboardSound(this.id, options);
    }
    /**
     * Create a sticker.
     * @param options The options for creating the sticker.
     */
    async createSticker(options) {
        return this.client.rest.guilds.createSticker(this.id, options);
    }
    /**
     * Create a guild template.
     * @param options The options for creating the template.
     */
    async createTemplate(options) {
        return this.client.rest.guilds.createTemplate(this.id, options);
    }
    /**
     * Create a test entitlement for this guild.
     * @param skuID The ID of the SKU to create an entitlement for.
     * @param applicationID The ID of the application to create the entitlement for. If present, defaults to the logged in client's application id.
     */
    async createTestEntitlement(skuID, applicationID) {
        if (applicationID === undefined && this.client["_application"] === undefined) {
            throw new Errors_1.UncachedError("Client#application is not present, you must provide an applicationID as a second argument. To not need to provide an ID, only call this after at least one shard is READY, or restMode is enabled.");
        }
        return this.client.rest.applications.createTestEntitlement(applicationID ?? this.client.application.id, {
            ownerID: this.id,
            ownerType: Constants_1.EntitlementOwnerTypes.GUILD,
            skuID
        });
    }
    /**
     * Delete an auto moderation rule in this guild.
     * @param ruleID The ID of the rule to delete.
     * @param reason The reason for deleting the rule.
     */
    async deleteAutoModerationRule(ruleID, reason) {
        return this.client.rest.guilds.deleteAutoModerationRule(this.id, ruleID, reason);
    }
    /**
     * Delete an emoji in this guild.
     * @param emojiID The ID of the emoji.
     * @param reason The reason for deleting the emoji.
     */
    async deleteEmoji(emojiID, reason) {
        return this.client.rest.guilds.deleteEmoji(this.id, emojiID, reason);
    }
    /**
     * Delete an integration.
     * @param integrationID The ID of the integration.
     * @param reason The reason for deleting the integration.
     */
    async deleteIntegration(integrationID, reason) {
        return this.client.rest.guilds.deleteIntegration(this.id, integrationID, reason);
    }
    /**
     * Delete a role.
     * @param roleID The ID of the role to delete.
     * @param reason The reason for deleting the role.
     */
    async deleteRole(roleID, reason) {
        return this.client.rest.guilds.deleteRole(this.id, roleID, reason);
    }
    /**
     * Delete a scheduled event.
     * @param eventID The ID of the scheduled event.
     * @param reason The reason for deleting the scheduled event. Discord's docs do not explicitly state a reason can be provided, so it may not be used.
     */
    async deleteScheduledEvent(eventID, reason) {
        return this.client.rest.guilds.deleteScheduledEvent(this.id, eventID, reason);
    }
    /**
     * Delete an exception to the recurrence rule for a scheduled event.
     * @param eventID The ID of the scheduled event.
     * @param exceptionID The ID of the scheduled event exception.
     * @param reason The reason for deleting the scheduled event exception.
     * @caching This method **may** remove the result from cache. The result will not be removed if the scheduled event is not cached.
     * @caches {@link GuildScheduledEvent#exceptions | GuildScheduledEvent#exceptions}
     */
    async deleteScheduledEventException(eventID, exceptionID, reason) {
        return this.client.rest.guilds.deleteScheduledEventException(this.id, eventID, exceptionID, reason);
    }
    /**
     * Delete a soundboard sound.
     * @param soundID The ID of the soundboard sound.
     * @param reason The reason for deleting the soundboard sound.
     */
    async deleteSoundboardSound(soundID, reason) {
        return this.client.rest.guilds.deleteSoundboardSound(this.id, soundID, reason);
    }
    /**
     * Delete a sticker.
     * @param stickerID The ID of the sticker to delete.
     * @param reason The reason for deleting the sticker.
     */
    async deleteSticker(stickerID, reason) {
        return this.client.rest.guilds.deleteSticker(this.id, stickerID, reason);
    }
    /**
     * Delete a template.
     * @param code The code of the template.
     */
    async deleteTemplate(code) {
        return this.client.rest.guilds.deleteTemplate(this.id, code);
    }
    /**
     * Disable the `COMMUNITY` feature for this guild. Requires the **Administrator** permission.
     * @param reason The reason for disable the feature.
     */
    async disableCommunity(reason) {
        return this.toggleFeature("COMMUNITY", false, reason);
    }
    /**
     * Disable the `DISCOVERABLE` feature for this guild. Requires the **Administrator** permission.
     * @param reason The reason for disabling the feature.
     */
    async disableDiscovery(reason) {
        return this.toggleFeature("DISCOVERABLE", false, reason);
    }
    /**
     * Disable the `INVITES_DISABLED` feature for this guild. Requires the **Manage Guild** permission.
     * @param reason The reason for disabling the feature.
     */
    async disableInvites(reason) {
        return this.toggleFeature("INVITES_DISABLED", false, reason);
    }
    /**
     * Disable the `RAID_ALERTS_ENABLED` feature for this guild. Requires the **Manage Guild** permission.
     * @param reason The reason for disabling the feature.
     */
    async disableRaidAlerts(reason) {
        return this.toggleFeature("RAID_ALERTS_ENABLED", false, reason);
    }
    /**
     * The url of this guild's discovery splash.
     * @param format The format the url should be.
     * @param size The dimensions of the image.
     */
    discoverySplashURL(format, size) {
        return this.discoverySplash === null ? null : this.client.util.formatImage(Routes.GUILD_DISCOVERY_SPLASH(this.id, this.discoverySplash), format, size);
    }
    /**
     * Edit this guild.
     * @param options The options for editing the guild.
     */
    async edit(options) {
        return this.client.rest.guilds.edit(this.id, options);
    }
    /**
     * Edit an existing auto moderation rule in this guild.
     * @param ruleID The ID of the rule to edit.
     * @param options The options for editing the rule.
     */
    async editAutoModerationRule(ruleID, options) {
        return this.client.rest.guilds.editAutoModerationRule(this.id, ruleID, options);
    }
    /**
     * Edit the positions of channels in this guild.
     * @param options The channels to move. Unedited channels do not need to be specified.
     */
    async editChannelPositions(options) {
        return this.client.rest.guilds.editChannelPositions(this.id, options);
    }
    /**
     * Modify the current member in this guild.
     * @param options The options for editing the member.
     */
    async editCurrentMember(options) {
        return this.client.rest.guilds.editCurrentMember(this.id, options);
    }
    /**
     * Edit the current member's voice state in this guild. `channelID` is required, and the current member must already be in that channel. See [Discord's docs](https://discord.com/developers/docs/resources/guild#modify-current-user-voice-state-caveats) for more information.
     * @param options The options for editing the voice state.
     */
    async editCurrentUserVoiceState(options) {
        return this.client.rest.guilds.editCurrentUserVoiceState(this.id, options);
    }
    /**
     * Edit an existing emoji in this guild.
     * @param options The options for editing the emoji.
     */
    async editEmoji(emojiID, options) {
        return this.client.rest.guilds.editEmoji(this.id, emojiID, options);
    }
    /**
     * Edit the incident actions for this guild.
     * @param options The options for editing the incident actions.
     */
    async editIncidentActions(options) {
        return this.client.rest.guilds.editIncidentActions(this.id, options);
    }
    /**
     * Edit a member of this guild. Use \<Guild\>.editCurrentMember if you wish to update the nick of this client using the CHANGE_NICKNAME permission.
     * @param memberID The ID of the member.
     * @param options The options for editing the member.
     */
    async editMember(memberID, options) {
        return this.client.rest.guilds.editMember(this.id, memberID, options);
    }
    /**
     * Edit this guild's onboarding configuration.
     * @param options The options for editing the onboarding configuration.
     */
    async editOnboarding(options) {
        return this.client.rest.guilds.editOnboarding(this.id, options);
    }
    /**
     * Edit an existing role.
     * @param options The options for editing the role.
     */
    async editRole(roleID, options) {
        return this.client.rest.guilds.editRole(this.id, roleID, options);
    }
    /**
     * Edit the position of roles in this guild.
     * @param options The roles to move.
     */
    async editRolePositions(options, reason) {
        return this.client.rest.guilds.editRolePositions(this.id, options, reason);
    }
    /**
     * Edit an existing scheduled event in this guild.
     * @param scheduledEventID The ID of the scheduled event.
     * @param options The options for editing the scheduled event.
     */
    async editScheduledEvent(scheduledEventID, options) {
        return this.client.rest.guilds.editScheduledEvent(this.id, scheduledEventID, options);
    }
    /**
     * Edit an exception to the recurrence rule for a scheduled event.
     * @param eventID The ID of the scheduled event.
     * @param exceptionID The ID of the scheduled event exception.
     * @param options The options for editing the scheduled event exception.
     * @caching This method **may** cache its result. The result will not be cached if the scheduled event is not cached.
     * @caches {@link GuildScheduledEvent#exceptions | GuildScheduledEvent#exceptions}
     */
    async editScheduledEventException(eventID, exceptionID, options) {
        return this.client.rest.guilds.editScheduledEventException(this.id, eventID, exceptionID, options);
    }
    /**
     * Edit a soundboard sound.
     * @param soundID The ID of the soundboard sound.
     * @param options The options for editing the soundboard sound.
     */
    async editSoundboardSound(soundID, options) {
        return this.client.rest.guilds.editSoundboardSound(this.id, soundID, options);
    }
    /**
     * Edit a sticker.
     * @param options The options for editing the sticker.
     */
    async editSticker(stickerID, options) {
        return this.client.rest.guilds.editSticker(this.id, stickerID, options);
    }
    /**
     * Edit a template.
     * @param code The code of the template.
     * @param options The options for editing the template.
     */
    async editTemplate(code, options) {
        return this.client.rest.guilds.editTemplate(this.id, code, options);
    }
    /**
     * Edit a guild member's voice state. `channelID` is required, and the user must already be in that channel. See [Discord's docs](https://discord.com/developers/docs/resources/guild#modify-user-voice-state) for more information.
     * @param memberID The ID of the member.
     * @param options The options for editing the voice state.
     */
    async editUserVoiceState(memberID, options) {
        return this.client.rest.guilds.editUserVoiceState(this.id, memberID, options);
    }
    /**
     * Edit the welcome screen in this guild.
     * @param options The options for editing the welcome screen.
     */
    async editWelcomeScreen(options) {
        return this.client.rest.guilds.editWelcomeScreen(this.id, options);
    }
    /**
     * Edit the widget of this guild.
     * @param options The options for editing the widget.
     */
    async editWidget(options) {
        return this.client.rest.guilds.editWidget(this.id, options);
    }
    /**
     * Enable the `COMMUNITY` feature for this guild. Requires the **Administrator** permission.
     * @param reason The reason for enabling the feature.
     */
    async enableCommunity(reason) {
        return this.toggleFeature("COMMUNITY", true, reason);
    }
    /**
     * Enable the `DISCOVERABLE` feature for this guild. Requires the **Administrator** permission. The server must also be passing all discovery requirements.
     * @param reason The reason for enabling the feature.
     */
    async enableDiscovery(reason) {
        return this.toggleFeature("DISCOVERABLE", true, reason);
    }
    /**
     * Enable the `INVITES_DISABLED` feature for this guild. Requires the **Manage Guild** permission.
     * @param reason The reason for enabling the feature.
     */
    async enableInvites(reason) {
        return this.toggleFeature("INVITES_DISABLED", true, reason);
    }
    /**
     * Enable the `RAID_ALERTS_ENABLED` feature for this guild. Requires the **Manage Guild** permission.
     * @param reason The reason for enabling the feature.
     */
    async enableRaidAlerts(reason) {
        return this.toggleFeature("RAID_ALERTS_ENABLED", true, reason);
    }
    /**
     * Request members from this guild.
     * @param options The options for fetching the members.
     * @deprecated Use {@link requestMembers}. This will be removed in `1.16.0`.
     */
    async fetchMembers(options) {
        return this.requestMembers(options);
    }
    /**
     * Get the active threads in this guild.
     */
    async getActiveThreads() {
        return this.client.rest.guilds.getActiveThreads(this.id);
    }
    /**
     * Get this guild's audit log.
     * @param options The options for the audit log.
     */
    async getAuditLog(options) {
        return this.client.rest.guilds.getAuditLog(this.id, options);
    }
    /**
     * Get an auto moderation rule for this guild.
     * @param ruleID The ID of the rule to get.
     */
    async getAutoModerationRule(ruleID) {
        return this.client.rest.guilds.getAutoModerationRule(this.id, ruleID);
    }
    /**
     * Get the auto moderation rules for this guild.
     */
    async getAutoModerationRules() {
        return this.client.rest.guilds.getAutoModerationRules(this.id);
    }
    /**
     * Get a ban in this guild.
     * @param userID The ID of the user to get the ban of.
     */
    async getBan(userID) {
        return this.client.rest.guilds.getBan(this.id, userID);
    }
    /**
     * Get the bans in this guild.
     * @param options The options for getting the bans.
     */
    async getBans(options) {
        return this.client.rest.guilds.getBans(this.id, options);
    }
    /**
     * Get the channels in a guild. Does not include threads. Only use this if you need to. See the `channels` collection.
     */
    async getChannels() {
        return this.client.rest.guilds.getChannels(this.id);
    }
    /**
     * Get an emoji in this guild.
     * @param emojiID The ID of the emoji to get.
     */
    async getEmoji(emojiID) {
        return this.client.rest.guilds.getEmoji(this.id, emojiID);
    }
    /**
     * Get the emojis in this guild.
     */
    async getEmojis() {
        return this.client.rest.guilds.getEmojis(this.id);
    }
    /**
     * Get the entitlements for this guild.
     * @param options The options for getting the entitlements.
     * @param applicationID The ID of the application to create the entitlement for. If present, defaults to the logged in client's application id.
     */
    async getEntitlements(options, applicationID) {
        if (applicationID === undefined && this.client["_application"] === undefined) {
            throw new Errors_1.UncachedError("Client#application is not present, you must provide an applicationID as a second argument. To not need to provide an ID, only call this after at least one shard is READY, or restMode is enabled.");
        }
        return this.client.rest.applications.getEntitlements(applicationID ?? this.client.application.id, { guildID: this.id, ...options });
    }
    /**
     * Get the integrations in this guild.
     */
    async getIntegrations() {
        return this.client.rest.guilds.getIntegrations(this.id);
    }
    /**
     * Get the invites of this guild.
     */
    async getInvites() {
        return this.client.rest.guilds.getInvites(this.id);
    }
    /**
     * Get this guild's join requests.
     * @param options The options for getting join requests.
     * @caching This method **does** cache its result.
     * @caches {@link Guild#joinRequests | Guild#joinRequests}
     */
    async getJoinRequests(options) {
        return this.client.rest.guilds.getJoinRequests(this.id, options);
    }
    /**
     * Get a member of this guild.
     * @param memberID The ID of the member.
     */
    async getMember(memberID) {
        return this.client.rest.guilds.getMember(this.id, memberID);
    }
    /**
     * Get this guild's members. This requires the `GUILD_MEMBERS` intent.
     * @param options The options for getting the members.
     */
    async getMembers(options) {
        return this.client.rest.guilds.getMembers(this.id, options);
    }
    /**
     * Get this guild's new member welcome info.
     */
    async getNewMemberWelcome() {
        return this.client.rest.guilds.getNewMemberWelcome(this.id);
    }
    /**
     * Get the onboarding information for this guild.
     */
    async getOnboarding() {
        return this.client.rest.guilds.getOnboarding(this.id);
    }
    /**
     * Get a preview of this guild.
     */
    async getPreview() {
        return this.client.rest.guilds.getPreview(this.id);
    }
    /**
     * Get the prune count of this guild.
     * @param options The options for getting the prune count.
     */
    async getPruneCount(options) {
        return this.client.rest.guilds.getPruneCount(this.id, options);
    }
    /**
     * Get a role in this guild. Only use this if you need to. See the `roles` collection.
     * @param roleID The ID of the role to get.
     */
    async getRole(roleID) {
        return this.client.rest.guilds.getRole(this.id, roleID);
    }
    /**
     * Get the member count of the roles in this guild. The result is a key-value map of role id to member count.
     */
    async getRoleMemberCounts() {
        return this.client.rest.guilds.getRoleMemberCounts(this.id);
    }
    /**
     * Get the roles in this guild. Only use this if you need to. See the `roles` collection.
     */
    async getRoles() {
        return this.client.rest.guilds.getRoles(this.id);
    }
    /**
     * Get a scheduled event.
     * @param eventID The ID of the scheduled event to get.
     * @param withUserCount If the number of users subscribed to the event should be included.
     */
    async getScheduledEvent(eventID, withUserCount) {
        return this.client.rest.guilds.getScheduledEvent(this.id, eventID, withUserCount);
    }
    /**
     * Get users subscribed to an exception for a scheduled event.
     * @param eventID The ID of the scheduled event.
     * @param exceptionID The ID of the scheduled event exception.
     * @param options The options for getting the users.
     * @caching This method **does** cache part of its result. Members will not be cached if the guild is not cached.
     * @caches {@link Client#users | Client#users}<br>{@link Guild#members | Guild#members}
     */
    async getScheduledEventExceptionUsers(eventID, exceptionID, options) {
        return this.client.rest.guilds.getScheduledEventExceptionUsers(this.id, eventID, exceptionID, options);
    }
    /**
     * Get user counts for a scheduled event and optionally specific exceptions.
     * @param eventID The ID of the scheduled event.
     * @param options The options for getting the user counts.
     * @caching This method **may** cache the event user count.
     * @caches {@link GuildScheduledEvent#userCount | GuildScheduledEvent#userCount}
     */
    async getScheduledEventUserCounts(eventID, options) {
        return this.client.rest.guilds.getScheduledEventUserCounts(this.id, eventID, options);
    }
    /**
     * Get the users subscribed to a scheduled event.
     * @param eventID The ID of the scheduled event to get the users of.
     * @param options The options for getting the users.
     * @caching This method **does** cache part of its result. Members will not be cached if the guild is not cached.
     * @caches {@link Client#users | Client#users}<br>{@link Guild#members | Guild#members}
     */
    async getScheduledEventUsers(eventID, options) {
        return this.client.rest.guilds.getScheduledEventUsers(this.id, eventID, options);
    }
    /**
     * Get this guild's scheduled events
     * @param withUserCount If the number of users subscribed to the event should be included.
     */
    async getScheduledEvents(withUserCount) {
        return this.client.rest.guilds.getScheduledEvents(this.id, withUserCount);
    }
    /**
     * Get a soundboard sound.
     * @param soundID The ID of the soundboard sound to get.
     */
    async getSoundboardSound(soundID) {
        return this.client.rest.guilds.getSoundboardSound(this.id, soundID);
    }
    /**
     * Get this guild's soundboard sounds.
     */
    async getSoundboardSounds() {
        return this.client.rest.guilds.getSoundboardSounds(this.id);
    }
    /**
     * Get a sticker. Response will include a user if the client has the `MANAGE_EMOJIS_AND_STICKERS` permissions.
     * @param stickerID The ID of the sticker to get.
     */
    async getSticker(stickerID) {
        return this.client.rest.guilds.getSticker(this.id, stickerID);
    }
    /**
     * Get this guild's stickers. Stickers will include a user if the client has the `MANAGE_EMOJIS_AND_STICKERS` permissions.
     */
    async getStickers() {
        return this.client.rest.guilds.getStickers(this.id);
    }
    /**
     * Get this guild's templates.
     */
    async getTemplates() {
        return this.client.rest.guilds.getTemplates(this.id);
    }
    /**
     * Get the vanity url of this guild.
     */
    async getVanityURL() {
        return this.client.rest.guilds.getVanityURL(this.id);
    }
    /**
     * Get the list of usable voice regions for this guild. This will return VIP servers when the guild is VIP-enabled.
     */
    async getVoiceRegions() {
        return this.client.rest.guilds.getVoiceRegions(this.id);
    }
    /**
     * Get the voice state of a member.
     * @param memberID The ID of the member. Use `@me` for the bot user.
     */
    async getVoiceState(memberID) {
        return this.client.rest.guilds.getVoiceState(this.id, memberID);
    }
    /**
     * Get the webhooks in this guild.
     */
    async getWebhooks() {
        return this.client.rest.webhooks.getForGuild(this.id);
    }
    /**
     * Get the welcome screen for this guild.
     */
    async getWelcomeScreen() {
        return this.client.rest.guilds.getWelcomeScreen(this.id);
    }
    /**
     * Get the widget of this guild.
     */
    async getWidget() {
        return this.client.rest.guilds.getWidget(this.id);
    }
    /**
     * Get the widget image of this guild.
     * @param style The style of the image.
     */
    async getWidgetImage(style) {
        return this.client.rest.guilds.getWidgetImage(this.id, style);
    }
    /**
     * Get the raw JSON widget of this guild.
     */
    async getWidgetJSON() {
        return this.client.rest.guilds.getWidgetJSON(this.id);
    }
    /**
     * Get this guild's widget settings.
     */
    async getWidgetSettings() {
        return this.client.rest.guilds.getWidgetSettings(this.id);
    }
    /**
     * The url of this guild's icon.
     * @param format The format the url should be.
     * @param size The dimensions of the image.
     */
    iconURL(format, size) {
        return this.icon === null ? null : this.client.util.formatImage(Routes.GUILD_ICON(this.id, this.icon), format, size);
    }
    /**
     * Join a voice or stage channel.
     * @param options The options to join the channel with.
     */
    joinChannel(options) {
        // eslint-disable-next-line @typescript-eslint/no-unsafe-return, @typescript-eslint/no-unsafe-argument
        return this.client.joinVoiceChannel({
            ...options,
            // eslint-disable-next-line @typescript-eslint/no-unsafe-assignment
            voiceAdapterCreator: this.voiceAdapterCreator,
            guildID: this.id
        });
    }
    /**
     * Leave this guild.
     */
    async leave() {
        return this.client.rest.users.leaveGuild(this.id);
    }
    /** Leave the connected voice or stage channel on this guild. */
    leaveChannel() {
        return this.client.leaveVoiceChannel(this.id);
    }
    /**
     * Search this guild's members.
     * @param options The options to search with.
     * @param retryOnIndexNotAvailable If the search should be retried if Discord replies with an index unavailable response. This will retry at most one time, waiting for `retry_after` or 15-45 seconds.
     */
    async memberSearch(options, retryOnIndexNotAvailable = true) {
        return this.client.rest.guilds.memberSearch(this.id, options, retryOnIndexNotAvailable);
    }
    /**
     * Get the permissions of a member. If providing an id, the member must be cached.
     * @param member The member to get the permissions of.
     */
    permissionsOf(member) {
        if (typeof member === "string") {
            member = this.members.get(member);
        }
        if (!member) {
            throw new Errors_1.UncachedError(`Cannot use ${this.constructor.name}#permissionsOf with an ID when the member is not cached.`);
        }
        if (member.id === this.ownerID) {
            return new Permission_1.default(Constants_1.AllPermissions);
        }
        else {
            let permissions = this.roles.get(this.id).permissionsAllow;
            if (permissions & Constants_1.Permissions.ADMINISTRATOR) {
                return new Permission_1.default(Constants_1.AllPermissions);
            }
            for (const id of member.roles) {
                const role = this.roles.get(id);
                if (!role) {
                    continue;
                }
                if (role.permissionsAllow & Constants_1.Permissions.ADMINISTRATOR) {
                    permissions = Constants_1.AllPermissions;
                    break;
                }
                else {
                    permissions |= role.permissionsAllow;
                }
            }
            return new Permission_1.default(permissions);
        }
    }
    /**
     * Remove a ban.
     * @param userID The ID of the user to remove the ban from.
     * @param reason The reason for removing the ban.
     */
    async removeBan(userID, reason) {
        return this.client.rest.guilds.removeBan(this.id, userID, reason);
    }
    /**
     * Remove a member from this guild.
     * @param memberID The ID of the user to remove.
     * @param reason The reason for the removal.
     */
    async removeMember(memberID, reason) {
        return this.client.rest.guilds.removeMember(this.id, memberID, reason);
    }
    /**
     * Remove a role from a member.
     * @param memberID The ID of the member.
     * @param roleID The ID of the role to remove.
     * @param reason The reason for removing the role.
     */
    async removeMemberRole(memberID, roleID, reason) {
        return this.client.rest.guilds.removeMemberRole(this.id, memberID, roleID, reason);
    }
    /**
     * Request extended channel info for this guild.
     * @param options The options.
     */
    async requestChannelInfo(options) {
        return this.shard.requestChannelInfo(this.id, options);
    }
    /**
     * Request members from this guild.
     * @param options The options for fetching the members.
     */
    async requestMembers(options) {
        return this.shard.requestGuildMembers(this.id, options);
    }
    /**
     * Request soundboard sounds for this guild.
     * @param options The options.
     */
    async requestSoundboardSounds(options) {
        return this.shard.requestSoundboardSounds(this.id, options);
    }
    /**
     * Search the username & nicknames of members in this guild. See {@link Guild#memberSearch | memberSearch} for a more detailed search.
     * @param options The options for the search.
     */
    async searchMembers(options) {
        return this.client.rest.guilds.searchMembers(this.id, options);
    }
    /**
     * Search messages in this guild.
     * @param options The options to search with.
     * @param retryOnIndexNotAvailable If the search should be retried if Discord replies with an index unavailable response. This will retry at most one time, waiting for `retry_after` or 15-45 seconds.
     */
    async searchMessages(options, retryOnIndexNotAvailable = true) {
        return this.client.rest.guilds.searchMessages(this.id, options, retryOnIndexNotAvailable);
    }
    /**
     * The url of this guild's invite splash.
     * @param format The format the url should be.
     * @param size The dimensions of the image.
     */
    splashURL(format, size) {
        return this.splash === null ? null : this.client.util.formatImage(Routes.GUILD_SPLASH(this.id, this.splash), format, size);
    }
    /**
     * Sync a guild template.
     * @param code The code of the template to sync.
     */
    async syncTemplate(code) {
        return this.client.rest.guilds.syncTemplate(this.id, code);
    }
    toJSON() {
        return {
            ...super.toJSON(),
            afkChannelID: this.afkChannelID,
            afkTimeout: this.afkTimeout,
            application: this.applicationID ?? undefined,
            approximateMemberCount: this.approximateMemberCount,
            approximatePresenceCount: this.approximatePresenceCount,
            autoModerationRules: this.autoModerationRules.map(rule => rule.toJSON()),
            banner: this.banner,
            channels: this.channels.map(channel => channel.id),
            defaultMessageNotifications: this.defaultMessageNotifications,
            description: this.description,
            discoverySplash: this.discoverySplash,
            emojis: this.emojis.toArray(),
            explicitContentFilter: this.explicitContentFilter,
            features: this.features,
            icon: this.icon,
            incidentActions: this.incidentActions,
            joinedAt: this.joinedAt?.getTime() ?? null,
            large: this.large,
            maxMembers: this.maxMembers,
            maxPresences: this.maxPresences,
            maxStageVideoChannelUsers: this.maxStageVideoChannelUsers,
            maxVideoChannelUsers: this.maxVideoChannelUsers,
            memberCount: this.memberCount,
            members: this.members.map(member => member.id),
            mfaLevel: this.mfaLevel,
            name: this.name,
            nsfwLevel: this.nsfwLevel,
            ownerID: this.ownerID,
            preferredLocale: this.preferredLocale,
            premiumProgressBarEnabled: this.premiumProgressBarEnabled,
            premiumSubscriptionCount: this.premiumSubscriptionCount,
            premiumTier: this.premiumTier,
            profile: this.profile,
            publicUpdatesChannelID: this.publicUpdatesChannelID,
            region: this.region,
            roles: this.roles.map(role => role.toJSON()),
            rulesChannelID: this.rulesChannelID,
            scheduledEvents: this.scheduledEvents.map(event => event.toJSON()),
            splash: this.splash,
            stageInstances: this.stageInstances.map(instance => instance.toJSON()),
            stickers: this.stickers.toArray(),
            systemChannelID: this.systemChannelID,
            systemChannelFlags: this.systemChannelFlags,
            threads: this.threads.map(thread => thread.id),
            unavailable: this.unavailable,
            vanityURLCode: this.vanityURLCode,
            verificationLevel: this.verificationLevel,
            voiceStates: this.voiceStates.map(state => state.toJSON()),
            welcomeScreen: this.welcomeScreen,
            widgetChannelID: this.widgetChannelID,
            widgetEnabled: this.widgetEnabled
        };
    }
}
exports.default = Guild;
//# sourceMappingURL=data:application/json;base64,eyJ2ZXJzaW9uIjozLCJmaWxlIjoiR3VpbGQuanMiLCJzb3VyY2VSb290IjoiIiwic291cmNlcyI6WyIuLi8uLi8uLi9saWIvc3RydWN0dXJlcy9HdWlsZC50cyJdLCJuYW1lcyI6W10sIm1hcHBpbmdzIjoiOzs7QUFBQSxvQkFBb0I7QUFDcEIsMERBQTBCO0FBQzFCLDBEQUEwQjtBQUMxQiwwRUFBMEM7QUFDMUMsOERBQThCO0FBQzlCLHdGQUF3RDtBQUN4RCw0RUFBNEM7QUFDNUMsa0ZBQWtEO0FBTWxELHdFQUF3QztBQUN4QyxzRkFBc0Q7QUFDdEQsc0VBQXNDO0FBQ3RDLHNFQUFzQztBQUN0Qyw0RUFBNEM7QUFDNUMsZ0VBQWdDO0FBSWhDLDhEQUEyRDtBQUUzRCw0RUFBNEM7QUFHNUMsc0VBQXNDO0FBRXRDLDRDQWVzQjtBQUN0QiwrREFBeUM7QUFFekMsc0ZBQXNEO0FBRXRELDZEQUE2RDtBQUM3RCxrQkFBa0I7QUFDbEIsMkNBQStDO0FBQy9DLHdGQUF3RDtBQUt4RCxtQ0FBbUM7QUFDbkMsTUFBcUIsS0FBTSxTQUFRLGNBQUk7SUFDM0IsYUFBYSxDQUFVO0lBQy9CLHVDQUF1QztJQUMvQixLQUFLLENBQUM7SUFDTixNQUFNLENBQVM7SUFDdkIsc0NBQXNDO0lBQ3RDLFVBQVUsQ0FBdUI7SUFDakMsZ0RBQWdEO0lBQ2hELFlBQVksQ0FBZ0I7SUFDNUIsNEVBQTRFO0lBQzVFLFVBQVUsQ0FBUztJQUNuQiw4REFBOEQ7SUFDOUQsV0FBVyxDQUE0QjtJQUN2Qyx3RUFBd0U7SUFDeEUsYUFBYSxDQUFnQjtJQUM3QixrRkFBa0Y7SUFDbEYsc0JBQXNCLENBQVU7SUFDaEMsOEZBQThGO0lBQzlGLHdCQUF3QixDQUFVO0lBQ2xDLDRNQUE0TTtJQUM1TSxlQUFlLENBQWtFO0lBQ2pGLCtDQUErQztJQUMvQyxtQkFBbUIsQ0FBa0Y7SUFDckcsdUNBQXVDO0lBQ3ZDLE1BQU0sQ0FBZ0I7SUFDdEIsa0NBQWtDO0lBQ2xDLFFBQVEsQ0FBZ0c7SUFDeEcsb0tBQW9LO0lBQ3BLLDJCQUEyQixDQUFtQztJQUM5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