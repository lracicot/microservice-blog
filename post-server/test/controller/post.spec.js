/* eslint-disable no-undef */
/* eslint-disable no-unused-vars */
// Ref: https://scotch.io/tutorials/test-a-node-restful-api-with-mocha-and-chai
import chai from 'chai';
import mongoose from 'mongoose';
import { Mockgoose } from 'mock-mongoose';
import Post from '../../src/models/post';
import Category from '../../src/models/category';
import app from '../../src/server';

let should = chai.should();
let log = require('why-is-node-running');

const mockgoose = new Mockgoose(mongoose);

describe('Posts', () => {

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

  describe('/GET post', () => {
    it('it should GET the first 10 posts', async () => {
      const res = await chai.request(app).get('/post');
      res.should.have.status(200);
      res.body.should.be.a('array');
      res.body.length.should.be.eql(0);
    });
  });

  describe('/POST post', () => {
    it('it should not POST a post without title field', async () => {
      const post = {
        author: 'J.R.R. Tolkien',
        content: 'Lorem ipsum',
        tags: {
          name: 'Test',
        }
      };

      const res = await chai.request(app).post('/post').send(post);
      res.should.have.status(500);
      res.body.should.be.a('object');
      res.body.should.have.property('errors');
      res.body.errors.should.have.property('title');
      res.body.errors.title.should.have.property('kind').eql('required');
    });

    it('it should POST a post with minimal data', async () => {
      const post = {
        title: 'The Lord of the Rings',
        author: 'J.R.R. Tolkien',
      };

      const res = await chai.request(app).post('/post').send(post);
      res.should.have.status(201);
      res.body.should.be.a('object');
      res.body.should.have.property('success').eql(true);
      res.body.post.should.have.property('_id');
      res.body.post.should.have.property('title');
      res.body.post.should.have.property('author');
    });

    it('it should POST a post with all the data', async () => {
      const cat = await Category.create({
        name: 'Testing'
      });
      const post = {
        title: 'The Lord of the Rings',
        author: 'J.R.R. Tolkien',
        content: 'Lorem ipsum',
        categories: [ cat._id ],
        tags: [{
          name: 'Test',
        }]
      };

      const res = await chai.request(app).post('/post').send(post);
      res.should.have.status(201);
      res.body.should.be.a('object');
      res.body.should.have.property('success').eql(true);
      res.body.post.should.have.property('_id');
      res.body.post.should.have.property('title');
      res.body.post.should.have.property('author');
      res.body.post.should.have.property('content');
      res.body.post.should.have.property('tags');
      res.body.post.tags[0].should.have.property('name');
      res.body.post.should.have.property('categories');
      res.body.post.categories[0].should.have.property('name').eql(cat.name);
    });
  });

  describe('/GET/:id post', () => {
    it('it should GET a post by the given id', async () => {
      const post = await (new Post({
        title: 'The Lord of the Rings',
        author: 'J.R.R. Tolkien',
        content: 'Lorem ipsum',
        tags: [{
          name: 'Test',
        }]
      }).save());

      const res = await chai.request(app).get('/post/' + post.id).send();
      res.should.have.status(200);
      res.body.post.should.be.a('object');
      res.body.post.should.have.property('title');
      res.body.post.should.have.property('author');
      res.body.post.should.have.property('content');
      res.body.post.should.have.property('tags');
      res.body.post.should.have.property('_id').eql(post.id);
    });

    it('it should GET a 404 error for a non-existing post', async () => {
      const res = await chai.request(app).get('/post/non-existing-post').send();
      res.should.have.status(404);
    });
  });

  describe('/PUT/:id post', () => {
    it('it should UPDATE a post with the given id', async () => {
      const post = await (new Post({
        title: 'The Lord of the Rings',
        author: 'J.R.R. Tolkien',
        content: 'Lorem ipsum',
        tags: [{
          name: 'Test',
        }]
      }).save());

      const res = await chai.request(app)
        .put('/post/' + post.id)
        .send({
          title: 'The Chronicles of Narnia',
          author: 'C.S. Lewis',
          content: post.content,
          tags: [{
            name: 'Test'
          }]
        });

      res.should.have.status(200);
      res.body.should.be.a('object');
      res.body.should.have.property('success').eql(true);
      res.body.post.should.have.property('title').eql('The Chronicles of Narnia');
      res.body.post.should.have.property('author').eql('C.S. Lewis');
      res.body.post.should.have.property('content').eql('Lorem ipsum');
      res.body.post.should.have.property('tags');
      res.body.post.tags[0].should.have.property('name').eql('Test');
      res.body.post.should.have.property('_id').eql(post.id);
    });

    it('it should GET a 404 error for a non-existing post', async () => {
      const res = await chai.request(app)
        .put('/post/non-existing-post')
        .send({
          title: 'The Chronicles of Narnia',
          author: 'C.S. Lewis',
        });
      res.should.have.status(404);
    });
  });

  describe('/DELETE/:id post', () => {
    it('it should DELETE a post given the id', async () => {
      const post = await (new Post({
        title: 'The Lord of the Rings',
        author: 'J.R.R. Tolkien',
        content: 'Lorem ipsum',
        tags: [{
          name: 'Test',
        }]
      }).save());

      const res = await chai.request(app).delete('/post/' + post.id);
      res.should.have.status(200);
      res.body.should.be.a('object');
      res.body.should.have.property('success').eql(true);
    });

    it('it should GET a 404 error for a non-existing post', async () => {
      const res = await chai.request(app).delete('/post/non-existing-post');
      res.should.have.status(404);
    });
  });

  describe('/DELETE post', () => {
    it('it should not DELETE a whole post collection', async () => {
      const res = await chai.request(app).delete('/post/');
      res.should.have.status(405);
    });
  });
});
