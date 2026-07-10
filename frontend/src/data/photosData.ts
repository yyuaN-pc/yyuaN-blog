import type { AlbumInfo, SubAlbum } from "../types/album";
import { API_ALBUMS } from '../config/api';

// 缓存
let _albums: AlbumInfo[] | undefined;
let _subAlbums: SubAlbum[] | undefined;

async function fetchAlbums(): Promise<{ albums: AlbumInfo[]; subAlbums: SubAlbum[] }> {
  if (_albums && _subAlbums) return { albums: _albums, subAlbums: _subAlbums };
  const res = await fetch(API_ALBUMS);
  const data = await res.json();
  _albums = data.albums;
  _subAlbums = data.subAlbums;
  return { albums: data.albums as AlbumInfo[], subAlbums: data.subAlbums as SubAlbum[] };
}

export async function getAlbumById(id: string): Promise<AlbumInfo | undefined> {
  const { albums } = await fetchAlbums();
  return albums.find((a) => a.id === id);
}

export async function getSubAlbums(): Promise<SubAlbum[]> {
  const { subAlbums } = await fetchAlbums();
  return subAlbums;
}
