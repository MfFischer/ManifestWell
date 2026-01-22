import { Filesystem, Directory } from '@capacitor/filesystem';
import { Capacitor } from '@capacitor/core';
import type { AudioTrack } from './types';

export interface DownloadProgress {
    trackId: string;
    progress: number; // 0-100
    status: 'downloading' | 'completed' | 'error';
    error?: string;
}

class OfflineMediaManagerService {
    private downloadListeners: Set<(progress: DownloadProgress) => void> = new Set();

    /**
     * Initialize file system structure for audio
     */
    async init(): Promise<void> {
        if (!this.isNative()) return;

        try {
            await Filesystem.mkdir({
                path: 'audio',
                directory: Directory.Data,
                recursive: true
            });
        } catch (e) {
            // Ignore if exists
        }
    }

    private isNative(): boolean {
        return Capacitor.isNativePlatform();
    }

    /**
     * Get the playable URL for a track
     * Returns local filesystem URI if downloaded, otherwise bundled path
     */
    async getTrackUrl(track: AudioTrack): Promise<string> {
        // If it's a bundled track, return the web asset path
        if (track.isBundled) {
            return track.src;
        }

        // Checking if downloaded
        if (this.isNative()) {
            try {
                const path = `audio/${track.id}.mp3`;
                const stat = await Filesystem.stat({
                    path,
                    directory: Directory.Data
                });

                if (stat) {
                    const uri = await Filesystem.getUri({
                        path,
                        directory: Directory.Data
                    });
                    return Capacitor.convertFileSrc(uri.uri);
                }
            } catch (e) {
                // Not found, return remote URL to stream (or handle error upstream)
            }
        }

        // Fallback to remote URL for streaming if available
        return track.remoteUrl || track.src;
    }

    /**
     * Check if a track is downloaded locally
     */
    async isTrackDownloaded(track: AudioTrack): Promise<boolean> {
        if (track.isBundled) return true;
        if (!this.isNative()) return false;

        try {
            await Filesystem.stat({
                path: `audio/${track.id}.mp3`,
                directory: Directory.Data
            });
            return true;
        } catch {
            return false;
        }
    }

    /**
     * Download a track to local storage
     */
    async downloadTrack(track: AudioTrack): Promise<void> {
        if (!track.remoteUrl) throw new Error('No remote URL for track');
        if (!this.isNative()) throw new Error('Downloads only available on mobile');

        this.notifyProgress({ trackId: track.id, progress: 0, status: 'downloading' });

        try {
            // Ensure directory exists
            await this.init();

            // Download file (using Http plugin or fetch + write, here using fetch for simplicity in example logic
            // In real prod, create a more robust downloader or use @capacitor-community/http for large files)
            const response = await fetch(track.remoteUrl);
            if (!response.ok) throw new Error('Download failed');

            const blob = await response.blob();
            const base64 = await this.blobToBase64(blob);

            await Filesystem.writeFile({
                path: `audio/${track.id}.mp3`,
                data: base64,
                directory: Directory.Data,
                recursive: true
            });

            this.notifyProgress({ trackId: track.id, progress: 100, status: 'completed' });
        } catch (error) {
            this.notifyProgress({
                trackId: track.id,
                progress: 0,
                status: 'error',
                error: error instanceof Error ? error.message : 'Unknown error'
            });
            throw error;
        }
    }

    /**
     * Delete a downloaded track
     */
    async deleteTrack(track: AudioTrack): Promise<void> {
        if (track.isBundled || !this.isNative()) return;

        try {
            await Filesystem.deleteFile({
                path: `audio/${track.id}.mp3`,
                directory: Directory.Data
            });
        } catch (e) {
            // Ignore
        }
    }

    private blobToBase64(blob: Blob): Promise<string> {
        return new Promise((resolve, reject) => {
            const reader = new FileReader();
            reader.onloadend = () => {
                const base64 = reader.result as string;
                // Remove data URL prefix (e.g., "data:audio/mp3;base64,")
                resolve(base64.split(',')[1]);
            };
            reader.onerror = reject;
            reader.readAsDataURL(blob);
        });
    }

    subscribe(callback: (progress: DownloadProgress) => void): () => void {
        this.downloadListeners.add(callback);
        return () => this.downloadListeners.delete(callback);
    }

    private notifyProgress(progress: DownloadProgress) {
        this.downloadListeners.forEach(cb => cb(progress));
    }
}

export const offlineMediaManager = new OfflineMediaManagerService();
