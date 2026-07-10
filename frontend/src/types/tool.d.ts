export interface Tool {
  id: string;
  name: string;
  icon: string;
}

export interface VideoInfo {
  title: string;
  cid: number;
  pic: string;
  author: string;
  bvid: string;
}

export interface UsefulLink {
  name: string;
  url: string;
  desc: string;
}

export interface LinkCategory {
  name: string;
  links: UsefulLink[];
}
