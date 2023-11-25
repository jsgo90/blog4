import { IComment, NewComment } from './comment.model';

export const sampleWithRequiredData: IComment = {
  id: 78899,
  content: '../fake-data/blob/hipster.txt',
};

export const sampleWithPartialData: IComment = {
  id: 26463,
  content: '../fake-data/blob/hipster.txt',
};

export const sampleWithFullData: IComment = {
  id: 98477,
  content: '../fake-data/blob/hipster.txt',
};

export const sampleWithNewData: NewComment = {
  content: '../fake-data/blob/hipster.txt',
  id: null,
};

Object.freeze(sampleWithNewData);
Object.freeze(sampleWithRequiredData);
Object.freeze(sampleWithPartialData);
Object.freeze(sampleWithFullData);
