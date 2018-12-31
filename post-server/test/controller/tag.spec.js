/* eslint-disable no-undef */
/* eslint-disable no-unused-vars */
// Ref: https://scotch.io/tutorials/test-a-node-restful-api-with-mocha-and-chai
import chai from 'chai';
import mongoose from 'mongoose';
import { Mockgoose } from 'mock-mongoose';
import Tag from '../../src/models/tag';
import Post from '../../src/models/post';
import app from '../../src/server';

let should = chai.should();
let log = require('why-is-node-running');

const mockgoose = new Mockgoose(mongoose);

describe('Tag', () => {

  before(async function () {
    this.timeout(120000);
    await mockgoose.prepareStorage();
    await mongoose.connect('mongodb://test', { useNewUrlParser: true });
  });

  after(async () => {
    try {
      const { connections } = mongoose;
      const { childProcess } = mockgoose.mongodHelper.mongoBin;
      childProcess.kill();
      await Promise.all(connections.map(c => c.close()));
      await mongoose.disconnect();
    } catch (err) {
      console.log('Error in after : ', err); // eslint-disable-line no-console
    }
  });

  describe('/GET/:id/posts tag', () => {
    it('it should GET all posts for a given tag id', async () => {
      const postsPromises = [
        Post.create({
          title: 'The Lord of the Rings',
          author: 'J.R.R. Tolkien',
          tags: [{
            name: 'Test'
          }],
        }),
        Post.create({
          title: 'The Chronicles of Narnia',
          author: 'C.S. Lewis',
          tags: [{
            name: 'Test'
          }],
        })
      ];

      const posts = await Promise.all(postsPromises);

      const res = await chai.request(app).get('/tag/test/posts');
      res.should.have.status(200);
      res.body.should.have.property('posts');
      res.body.posts.should.be.a('array');
      res.body.posts.length.should.be.eql(2);
    });
  });
});
