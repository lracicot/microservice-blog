/* eslint-disable no-undef */
/* eslint-disable no-unused-vars */
import chai from 'chai';

let should = chai.should();

import Post from '../../src/models/post';

describe('post', () => {
  it('should be invalid if name or author are empty', done => {
    const p = new Post();

    p.validate(err => {
      err.errors.title.should.exist;
      err.errors.author.should.exist;
      Object.keys(err.errors).length.should.equal(2);
      done();
    });
  });
});
