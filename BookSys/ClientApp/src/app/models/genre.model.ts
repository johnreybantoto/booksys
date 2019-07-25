import { Author } from './author.model';

export interface Genre {
    id: number;
    myGuid: string;
    name: string;
    bookIdList: number[];
    authors: Author[];
}
