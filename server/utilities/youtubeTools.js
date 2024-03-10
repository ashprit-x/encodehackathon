const { google } = require('googleapis');
const axios = require("axios");
const mongoose = require("mongoose");

const Channel = require("../models/Channel");

// retrieve a list of channel objects, given an accessToken
async function getChannels(accessToken) {
    const oauth2Client = new google.auth.OAuth2();
    oauth2Client.setCredentials({ access_token: accessToken });

    const youtube = google.youtube({
        version: "v3",
        auth: oauth2Client,
    });

    const response = await youtube.channels.list({
        part: 'id',
        mine: true,
    });

    return response.data?.items;
}

// retrieve recent live streams as a list, given a channelID which has been authorized
async function getRecentLiveStreams(channelID) {
    try {
        try {
            const response = await axios.get('https://www.googleapis.com/youtube/v3/search', {
                params: {
                    part: 'snippet',
                    channelId: `${channelID}`,
                    key: process.env.GOOGLE_API_KEY,
                },
            });
            return response.data.items;
        } catch (error) {
            console.error('Error fetching live streams:', error.message);
            return [];
        }
    } catch (err) {
        console.error(err);
        return [];
    }
}

// insert any non-yet existing user-channel ID records into the database
async function insertUserChannelsIntoDB(userID, accessToken) {
    const channels = await getChannels(accessToken);
    for (c of channels) {
        let channel = await Channel.findOne({
            userID: userID,
            channelID: c.id
        });
        if (!channel) {
            let newChannel = new Channel({
                userID: userID,
                channelID: c.id
            });
            await newChannel.save().catch((err) => {
                console.error(err);
                return false;
            });
        };
    };
    return true;
}

async function getLiveChatId(liveStreamId, accessToken) {
    try {
        const response = await axios.get('https://www.googleapis.com/youtube/v3/videos', {
            params: {
                part: "liveStreamingDetails",
                id: liveStreamId,
                access_token: accessToken,
                key: process.env.GOOGLE_API_KEY
            },
        });
        return response.data.items[0].liveStreamingDetails.activeLiveChatId;
    } catch (error) {
        console.error('Error fetching live streams:', error.message);
        return [];
    }
}

async function getLiveChatMessages(liveChatId) {
    try {
        const response = await axios.get('https://www.googleapis.com/youtube/v3/search', {
            params: {
                liveChatId: liveChatId,
                part: ["snippet"],
                pageToken: nextPageToken,
                key: process.env.GOOGLE_API_KEY
            },
        });
        console.log(response.data);
        return response.data;
    } catch (error) {
        console.error('Error fetching live streams:', error.message);
        return [];
    }
}

async function getLiveStreams(accessToken) {
    try {
        const response = await axios.get('https://www.googleapis.com/youtube/v3/liveBroadcasts', {
            params: {
                part: ["snippet"],
                mine: true,
                access_token: accessToken,
                key: process.env.GOOGLE_API_KEY
            },
        });
        return response.data;
    } catch (error) {
        console.error('Error fetching live streams:', error.message);
        return [];
    }
}

// async function startSentimentAnalyser(streamID, )

module.exports = { getChannels, getRecentLiveStreams, insertUserChannelsIntoDB, getLiveChatId, getLiveStreams, getLiveChatMessages };