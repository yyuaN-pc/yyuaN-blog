import type { Track } from "../types/music";
import { API_MUSIC_TRACKS } from '../config/api';

let _tracks: Track[] | undefined;

export async function getDefaultTracks(): Promise<Track[]> {
  if (_tracks) return _tracks;
  const res = await fetch(API_MUSIC_TRACKS);
  _tracks = await res.json();
  return _tracks as Track[];
}
