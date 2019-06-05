import { ITrack } from './Track.d';
import { IAlbum } from './Album.d';
import uniqid from 'uniqid';

export class Album implements IAlbum{
  id: string;
  name: string;
  year: number;
  artistName: string;
  tracks: ITrack[];

  constructor(newName: string, newYear: number, newArtistName: string) {
    this.name = newName;
    this.year = newYear;
    this.tracks = [];
    this.artistName = newArtistName;
    this.id = uniqid();
  }
  getId(): string {
    return this.id;
  }
  getName() : string {
    return this.name;
  }
  getYear() : number {
    return this.year;
  }
  getTracks() : ITrack[] {
    return this.tracks;
  }
  getArtistName(): string {
    return this.artistName;
  }
  addTrack(newTrack: ITrack): void {
    if (this.alreadyHaveTheTrack(newTrack)) {
      throw new Error('That Track already exists');
    }else {
      this.tracks.push(newTrack);
    }
  }
  alreadyHaveTheTrack(trackToCheckName: ITrack) : boolean {
    return this.getTracks().some((tracksInAlbum: ITrack) => tracksInAlbum.getName() === trackToCheckName.getName());
  }
  deleteTrack(track: ITrack): void {
    const index = this.tracks.indexOf(track);
    this.tracks.splice(index, 1);
  }
}
