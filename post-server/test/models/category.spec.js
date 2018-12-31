/* eslint-disable no-undef */
/* eslint-disable no-unused-vars */
import chai from 'chai';

let should = chai.should();
let expect = chai.expect;

import Category from '../../src/models/category';

describe('category', () => {
  it('should be invalid if name is empty', done => {
    const c = new Category();

    c.validate(err => {
      err.errors.name.should.exist;
      done();
    });
  });

  it('should create a category', done => {
    const c = new Category({ name: 'Test' });

    c.validate(err => {
      expect(err).be.null;
      done();
    });
  });
});
