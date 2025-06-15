// generate-songs.js
const fs = require('fs');
const path = require('path');

const MUSIC_DIR = path.join(__dirname, 'public', 'music');
const OUTPUT_FILE = path.join(__dirname, 'public', 'songs.json');

function toTitleCase(str) {
  return str
    .replace(/_/g, ' ')
    .replace(/-/g, ' ')
    .replace(/\.[^/.]+$/, '') // remove extension
    .replace(/\b\w/g, c => c.toUpperCase());
}

function parseFilename(filename) {
  // Example: Artist-Title.mp3 or just Title.mp3
  const name = filename.replace(/\.[^/.]+$/, '');
  const parts = name.split('-');
  if (parts.length >= 2) {
    return {
      artist: toTitleCase(parts[0].trim()),
      title: toTitleCase(parts.slice(1).join('-').trim()),
      filename,
      url: `/music/${filename}`,
    };
  }
  return {
    artist: 'Unknown',
    title: toTitleCase(name),
    filename,
    url: `/music/${filename}`,
  };
}

function main() {
  if (!fs.existsSync(MUSIC_DIR)) {
    console.error('Music directory not found:', MUSIC_DIR);
    process.exit(1);
  }
  const files = fs.readdirSync(MUSIC_DIR).filter(f => f.endsWith('.mp3'));
  const songs = files.map(parseFilename);
  fs.writeFileSync(OUTPUT_FILE, JSON.stringify(songs, null, 2));
  console.log(`Generated ${OUTPUT_FILE} with ${songs.length} songs.`);
}

main();
