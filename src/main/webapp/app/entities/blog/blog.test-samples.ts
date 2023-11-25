import { IBlog, NewBlog } from './blog.model';

export const sampleWithRequiredData: IBlog = {
  id: 53708,
  name: 'THX compressing object-oriented',
  description: 'base Balboa',
};

export const sampleWithPartialData: IBlog = {
  id: 82182,
  name: 'Rustic',
  description: 'blue and Borders',
};

export const sampleWithFullData: IBlog = {
  id: 6686,
  name: 'Utah Shirt end-to-end',
  description: 'payment Account',
};

export const sampleWithNewData: NewBlog = {
  name: 'Centralized bluetooth',
  description: 'blue withdrawal Cambridgeshire',
  id: null,
};

Object.freeze(sampleWithNewData);
Object.freeze(sampleWithRequiredData);
Object.freeze(sampleWithPartialData);
Object.freeze(sampleWithFullData);
