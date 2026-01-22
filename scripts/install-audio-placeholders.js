const fs = require('fs');
const path = require('path');

// Target directory
const AUDIO_ROOT = path.join(__dirname, '../public/audio');

// Define the "Good Files" structure we want
const STRUCTURE = {
    'ambient': [
        'rain-gentle.mp3',
        'ocean-waves.mp3',
        'forest-birds.mp3',
        'thunderstorm.mp3',
        'fireplace.mp3'
    ],
    'meditation': [
        'peaceful-mind.mp3',
        'zen-garden.mp3',
        'tibetan-bowls.mp3'
    ],
    'breathing': [
        '4-7-8-guide.mp3',
        'box-breathing.mp3'
    ],
    'sleep': [
        'delta-waves.mp3',
        'lullaby.mp3'
    ],
    'focus': [
        'lofi-beats.mp3'
    ]
};

// Minimal valid MP3 frame (silence) to prevent player errors
// 1 second of silence, 128kbps 44.1kHz
const DUMMY_MP3_BUFFER = Buffer.from('FFFB9064000000000000000000000000', 'hex');

function createPlaceholders() {
    console.log('🎵 Setting up Audio Library (Placeholders)...\n');

    if (!fs.existsSync(AUDIO_ROOT)) {
        fs.mkdirSync(AUDIO_ROOT, { recursive: true });
    }

    let createdCount = 0;

    Object.entries(STRUCTURE).forEach(([category, files]) => {
        const dir = path.join(AUDIO_ROOT, category);

        if (!fs.existsSync(dir)) {
            fs.mkdirSync(dir, { recursive: true });
            console.log(`📁 Created directory: audio/${category}`);
        }

        files.forEach(file => {
            const filePath = path.join(dir, file);
            if (!fs.existsSync(filePath)) {
                // Write multiple frames to make it "playable" for a split second
                const content = Buffer.concat([DUMMY_MP3_BUFFER, DUMMY_MP3_BUFFER, DUMMY_MP3_BUFFER]);
                fs.writeFileSync(filePath, content);
                console.log(`   ✨ Created placeholder: ${category}/${file}`);
                createdCount++;
            } else {
                console.log(`   ✅ Exists: ${category}/${file}`);
            }
        });
    });

    console.log(`\n🎉 Audio setup complete! (${createdCount} files created)`);
    console.log('👉 IMPORTANT: Replace these placeholders with real audio files from the DOWNLOAD_LIST.md');
}

createPlaceholders();
