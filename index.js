const express = require('express');
const path = require('path');
const fetch = require('node-fetch');
const ytdl = require('ytdl-core');

const app = express();
const PORT = process.env.PORT || 3000;

app.use(express.static('public'));

app.get('/', (req, res) => {
    res.sendFile(path.join(__dirname, 'public', 'index.html'));
});

app.get('/video/stream/:videoId', async (req, res) => {
    const videoId = req.params.videoId;

    try {
        const response3 = await fetch(`https://watawatawata.glitch.me/api/login/${videoId}`);
        const data3 = await response3.json();

        if (data3 && data3.stream_url) {
            return res.json({ stream_url: data3.stream_url });
        }

        const response2 = await fetch(`https://amenable-charm-lute.glitch.me/api/login/${videoId}`);
        const data2 = await response2.json();

        if (data2 && data2.stream_url) {
            return res.json({ stream_url: data2.stream_url });
        }

        const response1 = await fetch(`https://api.cors.lol/?url=https://wakametube.swanndvr.net/w/${videoId}`);
        const data1 = await response1.text();

        const streamUrlMatch1 = data1.match(/<source src="(.*?)" type="video\/mp4">/);
        if (streamUrlMatch1 && streamUrlMatch1[1]) {
            return res.json({ stream_url: streamUrlMatch1[1] });
        }

        res.status(404).json({ error: 'Stream URL not found' });
    } catch (error) {
        console.error(error);
        res.status(500).json({ error: 'Internal Server Error' });
    }
});


app.get('/high-stream/:videoId', async (req, res) => {
    const videoId = req.params.videoId;

    try {
        const response3 = await fetch(`https://watawatawata.glitch.me/api/login/${videoId}`);
        const data3 = await response3.json();

        if (data3 && data3.highstreamUrl) {
            return res.json({ highstream_url: data3.highstreamUrl });
        }

        res.status(404).json({ error: 'High stream URL not found' });
    } catch (error) {
        console.error(error);
        res.status(500).json({ error: 'Internal Server Error' });
    }
});

// YouTube ストリーム URL を取得するための新しいルート
app.get('/stream/dl/:videoId', async (req, res) => {
    const videoId = req.params.videoId;

    try {
        const videoUrl = `https://www.youtube.com/watch?v=${videoId}`;
        const info = await ytdl.getInfo(videoUrl);
        const formats = info.formats.filter(format => format.hasAudio && format.hasVideo);
        
        if (formats.length > 0) {
            const streamUrl = formats[0].url; // 最初のフォーマットを取得
            return res.json({ stream_url: streamUrl });
        }

        res.status(404).json({ error: 'Stream URL not found' });
    } catch (error) {
        console.error(error);
        res.status(500).json({ error: 'Internal Server Error' });
    }
});

app.get('/stream/:videoId', (req, res) => {
    res.sendFile(path.join(__dirname, 'public', 'mp4.html'));
});

app.get('/os', (req, res) => {
    res.sendFile(path.join(__dirname, 'public', 'os.html'));
});

app.get('/about', (req, res) => {
    res.sendFile(path.join(__dirname, 'public', 'about.html'));
});


app.get('/comments/:videoId', async (req, res) => {
    const videoId = req.params.videoId;

    try {
        const response = await fetch(`https://api.allorigins.win/raw?url=https://inv.nadeko.net/api/v1/comments/${videoId}`);
        const commentsData = await response.json();

        if (commentsData) {
            return res.json(commentsData);
        }

        res.status(404).json({ error: 'Comments not found' });
    } catch (error) {
        console.error(error);
        res.status(500).json({ error: 'error' });
    }
});

app.listen(PORT, () => {
    console.log(`Server is running on http://localhost:${PORT}`);
});
