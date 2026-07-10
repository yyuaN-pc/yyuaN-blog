export interface Photo {
  url: string;
  title: string;
  date: string;
  location: string;
  photographer: string;
  description: string;
}

export interface SubAlbum {
  id: string;
  title: string;
  description: string;
  cover: string;
  count: number;
}

export interface AlbumInfo {
  id: string;
  title: string;
  description: string;
  photos: Photo[];
}

export interface GridPhoto {
  url: string;
  title: string;
  width: number;
  index: number;
}

export interface GridRow {
  photos: GridPhoto[];
}