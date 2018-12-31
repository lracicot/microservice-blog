/* eslint-disable no-undef */
/* eslint-disable no-unused-vars */
// Ref: https://scotch.io/tutorials/test-a-node-restful-api-with-mocha-and-chai
import chai from 'chai';
import mongoose from 'mongoose';
import { Mockgoose } from 'mock-mongoose';
import Category from '../../src/models/category';
import Post from '../../src/models/post';
import app from '../../src/server';

let should = chai.should();
let log = require('why-is-node-running');

const mockgoose = new Mockgoose(mongoose);

describe('Category', () => {

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

  describe('/GET category', () => {
    it('it should GET all categories', async () => {
      const res = await chai.request(app).get('/category');
      res.should.have.status(200);
      res.body.should.be.a('array');
      res.body.length.should.be.eql(0);
    });
  });

  describe('/GET/:id/posts category', () => {
    it('it should GET all posts for a given category id', async () => {
      const category = await Category.create({
        name: 'Testing'
      });

      const postsPromises = [
        Post.create({
          title: 'The Lord of the Rings',
          author: 'J.R.R. Tolkien',
          categories: [ category._id ],
        }),
        Post.create({
          title: 'The Chronicles of Narnia',
          author: 'C.S. Lewis',
          categories: [ category._id ],
        })
      ];

      const posts = await Promise.all(postsPromises);

      const res = await chai.request(app).get(`/category/${category._id}/posts`);
      res.should.have.status(200);
      res.body.should.have.property('posts');
      res.body.posts.should.be.a('array');
      res.body.posts.length.should.be.eql(2);
    });
  });

  describe('/POST category', () => {
    it('it should not POST a category without name field', async () => {
      const category = {};

      const res = await chai.request(app).post('/category').send(category);
      res.should.have.status(500);
      res.body.should.be.a('object');
      res.body.should.have.property('errors');
      res.body.errors.should.have.property('name');
      res.body.errors.name.should.have.property('kind').eql('required');
    });

    it('it should POST a category', async () => {
      const category = {
        name: 'Testing'
      };

      const res = await chai.request(app).post('/category').send(category);
      res.should.have.status(201);
      res.body.should.be.a('object');
      res.body.should.have.property('success').eql(true);
      res.body.category.should.have.property('_id');
      res.body.category.should.have.property('name').eql('Testing');
    });

    it('it should POST a category with a parent', async () => {
      const parentCategory = await (new Category({
        name: 'Testing',
      }).save());

      const category = {
        name: 'Unit',
        parent: parentCategory._id
      };

      const res = await chai.request(app).post('/category').send(category);
      res.should.have.status(201);
      res.body.should.be.a('object');
      res.body.should.have.property('success').eql(true);
      res.body.category.should.have.property('_id');
      res.body.category.should.have.property('name').eql('Unit');
      res.body.category.should.have.property('parent');
      res.body.category.parent.should.have.property('name').eql('Testing');
    });
  });

  describe('/GET/:id category', () => {
    it('it should GET a category by the given id', async () => {
      const category = await Category.create({
        name: 'Testing'
      });

      const res = await chai.request(app).get(`/category/${category.id}`).send();
      res.should.have.status(200);
      res.body.category.should.be.a('object');
      res.body.category.should.have.property('_id');
      res.body.category.should.have.property('name').eql('Testing');
    });

    it('it should GET a 404 error for a non-existing category', async () => {
      const res = await chai.request(app).get('/category/non-existing-category').send();
      res.should.have.status(404);
    });
  });

  describe('/PUT/:id category', () => {
    it('it should UPDATE a category with the given id', async () => {
      const category = await (new Category({
        name: 'Testing'
      }).save());

      const res = await chai.request(app)
        .put(`/category/${category.id}`)
        .send({
          name: 'Test'
        });

      res.should.have.status(200);
      res.body.should.be.a('object');
      res.body.should.have.property('success').eql(true);
      res.body.category.should.have.property('name').eql('Test');
    });

    it('it should GET a 404 error for a non-existing category', async () => {
      const res = await chai.request(app)
        .put('/category/non-existing-category')
        .send({
          name: 'Test',
        });
      res.should.have.status(404);
    });
  });

  describe('/DELETE/:id category', () => {
    it('it should DELETE a category given the id', async () => {
      const category = await (new Category({
        name: 'Testing'
      }).save());

      const res = await chai.request(app).delete(`/category/${category.id}`);
      res.should.have.status(200);
      res.body.should.be.a('object');
      res.body.should.have.property('success').eql(true);
    });

    it('it should GET a 404 error for a non-existing category', async () => {
      const res = await chai.request(app).delete('/category/non-existing-category');
      res.should.have.status(404);
    });
  });

  describe('/DELETE category', () => {
    it('it should not DELETE a whole category collection', async () => {
      const res = await chai.request(app).delete('/category/');
      res.should.have.status(405);
    });
  });
});
