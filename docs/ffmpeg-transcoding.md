# FFmpeg Video Transcoding with Forensic Watermarks

## HLS Transcoding with Burned-in Watermarks

### Basic HLS Generation with Text Watermark

```bash
# Basic HLS transcoding with forensic watermark
ffmpeg -i input_video.mp4 \
  -filter_complex "[0:v]drawtext=fontfile=/path/to/arial.ttf:text='TripleAcademy {USER_ID} {SESSION_ID} {TIMESTAMP}':fontcolor=white@0.8:fontsize=16:x=10:y=h-th-10:enable='between(t,0,99999)'" \
  -c:v libx264 \
  -preset medium \
  -crf 23 \
  -sc_threshold 0 \
  -g 48 \
  -keyint_min 48 \
  -hls_time 6 \
  -hls_playlist_type vod \
  -hls_segment_filename "segment_%03d.ts" \
  -f hls playlist.m3u8
```

### Multi-bitrate HLS with Logo and Text Watermarks

```bash
#!/bin/bash

# Input variables (replace with actual values)
INPUT_VIDEO="{INPUT_VIDEO_PATH}"
USER_ID="{USER_ID}"
SESSION_ID="{SESSION_ID}"
TIMESTAMP="{TIMESTAMP}"
LOGO_PATH="/path/to/tripleacademy-logo.png"
OUTPUT_DIR="./output"

# Create output directory
mkdir -p "$OUTPUT_DIR"

# Multi-bitrate HLS transcoding with forensic watermarks
ffmpeg -i "$INPUT_VIDEO" \
  -filter_complex "
    [0:v]scale=1920:1080[v1080p];
    [0:v]scale=1280:720[v720p];
    [0:v]scale=854:480[v480p];
    [0:v]scale=640:360[v360p];
    
    movie=$LOGO_PATH,scale=60:60[logo];
    
    [v1080p][logo]overlay=W-w-10:10[v1080p_logo];
    [v720p][logo]overlay=W-w-10:10[v720p_logo];
    [v480p][logo]overlay=W-w-10:10[v480p_logo];
    [v360p][logo]overlay=W-w-10:10[v360p_logo];
    
    [v1080p_logo]drawtext=fontfile=/path/to/arial.ttf:text='TripleAcademy ${USER_ID} ${SESSION_ID} ${TIMESTAMP}':fontcolor=white@0.7:fontsize=14:x=10:y=h-th-10[v1080p_final];
    [v720p_logo]drawtext=fontfile=/path/to/arial.ttf:text='TripleAcademy ${USER_ID} ${SESSION_ID} ${TIMESTAMP}':fontcolor=white@0.7:fontsize=12:x=10:y=h-th-10[v720p_final];
    [v480p_logo]drawtext=fontfile=/path/to/arial.ttf:text='TripleAcademy ${USER_ID} ${SESSION_ID} ${TIMESTAMP}':fontcolor=white@0.7:fontsize=10:x=10:y=h-th-10[v480p_final];
    [v360p_logo]drawtext=fontfile=/path/to/arial.ttf:text='TripleAcademy ${USER_ID} ${SESSION_ID} ${TIMESTAMP}':fontcolor=white@0.7:fontsize=8:x=10:y=h-th-10[v360p_final]
  " \
  -map "[v1080p_final]" -c:v:0 libx264 -b:v:0 5000k -maxrate:v:0 5350k -bufsize:v:0 7500k -preset medium -g 48 -keyint_min 48 \
  -map "[v720p_final]" -c:v:1 libx264 -b:v:1 2800k -maxrate:v:1 2996k -bufsize:v:1 4200k -preset medium -g 48 -keyint_min 48 \
  -map "[v480p_final]" -c:v:2 libx264 -b:v:2 1400k -maxrate:v:2 1498k -bufsize:v:2 2100k -preset medium -g 48 -keyint_min 48 \
  -map "[v360p_final]" -c:v:3 libx264 -b:v:3 800k -maxrate:v:3 856k -bufsize:v:3 1200k -preset medium -g 48 -keyint_min 48 \
  -map a:0 -c:a:0 aac -b:a:0 128k \
  -map a:0 -c:a:1 aac -b:a:1 128k \
  -map a:0 -c:a:2 aac -b:a:2 96k \
  -map a:0 -c:a:3 aac -b:a:3 96k \
  -f hls \
  -hls_time 6 \
  -hls_playlist_type vod \
  -hls_flags independent_segments \
  -hls_segment_type mpegts \
  -hls_segment_filename "$OUTPUT_DIR/stream_%v/segment_%03d.ts" \
  -master_pl_name master.m3u8 \
  -var_stream_map "v:0,a:0 v:1,a:1 v:2,a:2 v:3,a:3" \
  -hls_base_url "../" \
  "$OUTPUT_DIR/stream_%v/playlist.m3u8"
```

## DASH Transcoding with Watermarks

```bash
#!/bin/bash

# Input variables
INPUT_VIDEO="{INPUT_VIDEO_PATH}"
USER_ID="{USER_ID}"
SESSION_ID="{SESSION_ID}"
TIMESTAMP="{TIMESTAMP}"
LOGO_PATH="/path/to/tripleacademy-logo.png"
OUTPUT_DIR="./dash_output"

# Create output directory
mkdir -p "$OUTPUT_DIR"

# DASH transcoding with forensic watermarks
ffmpeg -i "$INPUT_VIDEO" \
  -filter_complex "
    [0:v]scale=1920:1080[v1080p];
    [0:v]scale=1280:720[v720p];
    [0:v]scale=854:480[v480p];
    
    movie=$LOGO_PATH,scale=60:60[logo];
    
    [v1080p][logo]overlay=W-w-10:10[v1080p_logo];
    [v720p][logo]overlay=W-w-10:10[v720p_logo];
    [v480p][logo]overlay=W-w-10:10[v480p_logo];
    
    [v1080p_logo]drawtext=fontfile=/path/to/arial.ttf:text='TripleAcademy ${USER_ID} ${SESSION_ID} ${TIMESTAMP}':fontcolor=white@0.7:fontsize=14:x=10:y=h-th-10[v1080p_final];
    [v720p_logo]drawtext=fontfile=/path/to/arial.ttf:text='TripleAcademy ${USER_ID} ${SESSION_ID} ${TIMESTAMP}':fontcolor=white@0.7:fontsize=12:x=10:y=h-th-10[v720p_final];
    [v480p_logo]drawtext=fontfile=/path/to/arial.ttf:text='TripleAcademy ${USER_ID} ${SESSION_ID} ${TIMESTAMP}':fontcolor=white@0.7:fontsize=10:x=10:y=h-th-10[v480p_final]
  " \
  -map "[v1080p_final]" -c:v:0 libx264 -b:v:0 5000k -preset medium -g 48 -keyint_min 48 \
  -map "[v720p_final]" -c:v:1 libx264 -b:v:1 2800k -preset medium -g 48 -keyint_min 48 \
  -map "[v480p_final]" -c:v:2 libx264 -b:v:2 1400k -preset medium -g 48 -keyint_min 48 \
  -map a:0 -c:a aac -b:a 128k \
  -f dash \
  -seg_duration 4 \
  -use_template 1 \
  -use_timeline 1 \
  -init_seg_name 'init-$RepresentationID$.m4s' \
  -media_seg_name 'chunk-$RepresentationID$-$Number%05d$.m4s' \
  "$OUTPUT_DIR/manifest.mpd"
```

## Advanced Watermarking with Dynamic Positioning

```bash
#!/bin/bash

# Advanced watermarking with time-based position changes
INPUT_VIDEO="{INPUT_VIDEO_PATH}"
USER_ID="{USER_ID}"
SESSION_ID="{SESSION_ID}"
TIMESTAMP="{TIMESTAMP}"
LOGO_PATH="/path/to/tripleacademy-logo.png"
OUTPUT_DIR="./output_advanced"

mkdir -p "$OUTPUT_DIR"

# Create watermark that moves position every 30 seconds
ffmpeg -i "$INPUT_VIDEO" \
  -filter_complex "
    [0:v]scale=1280:720[v720p];
    
    movie=$LOGO_PATH,scale=40:40[logo];
    
    [v720p][logo]overlay=
      'if(between(mod(t,120),0,30), 10, 
        if(between(mod(t,120),30,60), W-w-10,
          if(between(mod(t,120),60,90), 10, W-w-10)))':
      'if(between(mod(t,120),0,30), 10,
        if(between(mod(t,120),30,60), 10,
          if(between(mod(t,120),60,90), H-h-10, H-h-10)))'[v720p_logo];
    
    [v720p_logo]drawtext=fontfile=/path/to/arial.ttf:
      text='TripleAcademy ${USER_ID} ${SESSION_ID} ${TIMESTAMP}':
      fontcolor=white@0.6:fontsize=12:
      x='if(between(mod(t,120),0,30), 10, 
        if(between(mod(t,120),30,60), W-tw-10,
          if(between(mod(t,120),60,90), 10, W-tw-10)))':
      y='if(between(mod(t,120),0,30), h-th-50,
        if(between(mod(t,120),30,60), h-th-50,
          if(between(mod(t,120),60,90), 50, 50)))'[v720p_final]
  " \
  -map "[v720p_final]" \
  -c:v libx264 -preset medium -crf 23 \
  -map a:0 -c:a aac -b:a 128k \
  -f hls \
  -hls_time 6 \
  -hls_playlist_type vod \
  -hls_segment_filename "$OUTPUT_DIR/segment_%03d.ts" \
  "$OUTPUT_DIR/playlist.m3u8"
```

## Encrypted HLS with AES-128

```bash
#!/bin/bash

# Generate encryption key and IV
openssl rand 16 > enc.key
openssl rand -hex 16 > enc.iv

# Create key info file
echo "enc.key" > enc.keyinfo
echo "enc.key" >> enc.keyinfo
cat enc.iv >> enc.keyinfo

# Transcoding with encryption and watermarks
INPUT_VIDEO="{INPUT_VIDEO_PATH}"
USER_ID="{USER_ID}"
SESSION_ID="{SESSION_ID}"
TIMESTAMP="{TIMESTAMP}"
LOGO_PATH="/path/to/tripleacademy-logo.png"

ffmpeg -i "$INPUT_VIDEO" \
  -filter_complex "
    [0:v]scale=1280:720[v720p];
    movie=$LOGO_PATH,scale=50:50[logo];
    [v720p][logo]overlay=W-w-10:10[v720p_logo];
    [v720p_logo]drawtext=fontfile=/path/to/arial.ttf:text='TripleAcademy ${USER_ID} ${SESSION_ID} ${TIMESTAMP}':fontcolor=white@0.7:fontsize=12:x=10:y=h-th-10[v720p_final]
  " \
  -map "[v720p_final]" -c:v libx264 -preset medium -crf 23 \
  -map a:0 -c:a aac -b:a 128k \
  -f hls \
  -hls_time 6 \
  -hls_key_info_file enc.keyinfo \
  -hls_playlist_type vod \
  -hls_segment_filename "encrypted_segment_%03d.ts" \
  encrypted_playlist.m3u8
```

## Node.js Transcoding Pipeline Integration

```javascript
// transcode.js - Node.js script for automated transcoding
const { spawn } = require('child_process');
const path = require('path');
const fs = require('fs').promises;

class VideoTranscoder {
  constructor(options = {}) {
    this.ffmpegPath = options.ffmpegPath || 'ffmpeg';
    this.logoPath = options.logoPath || '/path/to/tripleacademy-logo.png';
    this.fontPath = options.fontPath || '/path/to/arial.ttf';
  }

  async transcodeWithWatermark({
    inputPath,
    outputDir,
    userId,
    sessionId,
    timestamp = new Date().toISOString(),
    format = 'hls' // 'hls' or 'dash'
  }) {
    try {
      // Ensure output directory exists
      await fs.mkdir(outputDir, { recursive: true });

      const watermarkText = `TripleAcademy ${userId} ${sessionId} ${timestamp}`;
      
      const args = this.buildFFmpegArgs({
        inputPath,
        outputDir,
        watermarkText,
        format
      });

      return new Promise((resolve, reject) => {
        const ffmpeg = spawn(this.ffmpegPath, args);
        
        let stderr = '';
        
        ffmpeg.stderr.on('data', (data) => {
          stderr += data.toString();
          // Parse progress from stderr if needed
          console.log('FFmpeg:', data.toString());
        });

        ffmpeg.on('close', (code) => {
          if (code === 0) {
            resolve({
              success: true,
              outputDir,
              manifest: format === 'hls' ? 'master.m3u8' : 'manifest.mpd'
            });
          } else {
            reject(new Error(`FFmpeg failed with code ${code}: ${stderr}`));
          }
        });

        ffmpeg.on('error', (err) => {
          reject(new Error(`Failed to start FFmpeg: ${err.message}`));
        });
      });

    } catch (error) {
      throw new Error(`Transcoding failed: ${error.message}`);
    }
  }

  buildFFmpegArgs({ inputPath, outputDir, watermarkText, format }) {
    const baseArgs = [
      '-i', inputPath,
      '-filter_complex', this.buildFilterComplex(watermarkText),
      '-map', '[v1080p_final]', '-c:v:0', 'libx264', '-b:v:0', '5000k', '-preset', 'medium',
      '-map', '[v720p_final]', '-c:v:1', 'libx264', '-b:v:1', '2800k', '-preset', 'medium',
      '-map', '[v480p_final]', '-c:v:2', 'libx264', '-b:v:2', '1400k', '-preset', 'medium',
      '-map', 'a:0', '-c:a:0', 'aac', '-b:a:0', '128k',
      '-map', 'a:0', '-c:a:1', 'aac', '-b:a:1', '128k',
      '-map', 'a:0', '-c:a:2', 'aac', '-b:a:2', '96k',
      '-g', '48', '-keyint_min', '48'
    ];

    if (format === 'hls') {
      return baseArgs.concat([
        '-f', 'hls',
        '-hls_time', '6',
        '-hls_playlist_type', 'vod',
        '-hls_flags', 'independent_segments',
        '-hls_segment_type', 'mpegts',
        '-hls_segment_filename', `${outputDir}/stream_%v/segment_%03d.ts`,
        '-master_pl_name', 'master.m3u8',
        '-var_stream_map', 'v:0,a:0 v:1,a:1 v:2,a:2',
        `${outputDir}/stream_%v/playlist.m3u8`
      ]);
    } else {
      return baseArgs.concat([
        '-f', 'dash',
        '-seg_duration', '4',
        '-use_template', '1',
        '-use_timeline', '1',
        '-init_seg_name', 'init-$RepresentationID$.m4s',
        '-media_seg_name', 'chunk-$RepresentationID$-$Number%05d$.m4s',
        `${outputDir}/manifest.mpd`
      ]);
    }
  }

  buildFilterComplex(watermarkText) {
    return `
      [0:v]scale=1920:1080[v1080p];
      [0:v]scale=1280:720[v720p];
      [0:v]scale=854:480[v480p];
      
      movie=${this.logoPath},scale=60:60[logo];
      
      [v1080p][logo]overlay=W-w-10:10[v1080p_logo];
      [v720p][logo]overlay=W-w-10:10[v720p_logo];
      [v480p][logo]overlay=W-w-10:10[v480p_logo];
      
      [v1080p_logo]drawtext=fontfile=${this.fontPath}:text='${watermarkText}':fontcolor=white@0.7:fontsize=14:x=10:y=h-th-10[v1080p_final];
      [v720p_logo]drawtext=fontfile=${this.fontPath}:text='${watermarkText}':fontcolor=white@0.7:fontsize=12:x=10:y=h-th-10[v720p_final];
      [v480p_logo]drawtext=fontfile=${this.fontPath}:text='${watermarkText}':fontcolor=white@0.7:fontsize=10:x=10:y=h-th-10[v480p_final]
    `.replace(/\s+/g, ' ').trim();
  }
}

// Usage example
async function transcodeVideo() {
  const transcoder = new VideoTranscoder({
    logoPath: '/path/to/tripleacademy-logo.png',
    fontPath: '/path/to/arial.ttf'
  });

  try {
    const result = await transcoder.transcodeWithWatermark({
      inputPath: './input/video.mp4',
      outputDir: './output/course123',
      userId: 'user456',
      sessionId: 'session789',
      format: 'hls'
    });

    console.log('Transcoding completed:', result);
  } catch (error) {
    console.error('Transcoding failed:', error);
  }
}

module.exports = VideoTranscoder;
```

## Usage Notes

1. **Placeholder Variables**: Replace `{USER_ID}`, `{SESSION_ID}`, `{TIMESTAMP}`, `{INPUT_VIDEO_PATH}`, and `{LOGO_PATH}` with actual values.

2. **Font Requirements**: Ensure the font file path is correct. Use system fonts or upload custom fonts.

3. **Performance**: Use hardware acceleration with `-hwaccel` if available (e.g., `-hwaccel nvenc` for NVIDIA GPUs).

4. **Security**: Store generated files in protected directories with proper access controls.

5. **Cleanup**: Implement automated cleanup of old transcoded files to manage storage.

6. **Monitoring**: Add progress tracking and error handling for production use.

7. **Quality Settings**: Adjust CRF values and bitrates based on your quality requirements.

8. **DRM Integration**: For enterprise DRM, use specialized encoders that support CENC encryption.