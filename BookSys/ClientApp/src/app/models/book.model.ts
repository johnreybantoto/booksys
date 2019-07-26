import { Genre } from './genre.model';
import { Author } from './author.model';

export interface Book {
    id: number;
    myGuid: string;
    title: string;
    copyright: number;
    genreID: number;
    genre: Genre;
    authors: Author[];
    authorIdList: number[];
}