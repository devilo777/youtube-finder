const express = require("express");
const axios = require("axios");
const cors = require("cors");

const app = express();
app.use(cors());
app.use(express.static("public"));

const API_KEY = process.env.API_KEY;

app.get("/channels", async (req, res) => {
    const { keyword, minSubs, maxSubs, pageToken } = req.query;

    try {
        const searchRes = await axios.get(
            "https://www.googleapis.com/youtube/v3/search",
            {
                params: {
                    part: "snippet",
                    q: keyword,
                    type: "video",
                    maxResults: 25,
                    pageToken: pageToken || "",
                    key: API_KEY
                }
            }
        );

        const nextPageToken = searchRes.data.nextPageToken;

        const channelIds = [
            ...new Set(searchRes.data.items.map(i => i.snippet.channelId))
        ];

        const channelRes = await axios.get(
            "https://www.googleapis.com/youtube/v3/channels",
            {
                params: {
                    part: "snippet,statistics",
                    id: channelIds.join(","),
                    key: API_KEY
                }
            }
        );

        const filtered = channelRes.data.items.filter(ch => {
            const subs = parseInt(ch.statistics.subscriberCount);
            return subs >= minSubs && subs <= maxSubs;
        });

        res.json({
            channels: filtered,
            nextPageToken
        });

    } catch (err) {
        res.status(500).json({ error: err.message });
    }
});

const PORT = process.env.PORT || 3000;

app.listen(PORT, () => {
    console.log(`🚀 Server running on port ${PORT}`);
});