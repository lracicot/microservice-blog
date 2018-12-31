import mongoose from 'mongoose';
import Post from '../models/post';

export async function getPost(req, res) {
  try {
    const post = await Post.findOne({ _id: req.params.key });

    if (!post) {
      return res.status(404).send();
    }

    res.json({ post });
  } catch (err) {
    return res.status(404).send();
  }
}

export async function deletePost(req, res) {
  try {
    await Post.deleteOne({ _id: req.params.key });
    res.status(200).send({ success: true });
  } catch (err) {
    return res.status(404).send();
  }
}

export async function listPosts(req, res, next) {
  try {
    const limit = req.query.limit ? parseInt(req.query.limit) : 10;
    const skip = req.query.skip ? parseInt(req.query.skip) : 0;

    const posts = await Post.find({}).limit(limit).skip(skip);
    res.json(posts);
  } catch (err) {
    next(err);
  }
}

export async function createPost(req, res) {
  try {
    const data = {
      title: req.body.title || '',
      author: req.body.author || '',
      content: req.body.content || undefined,
      tags: req.body.tags || undefined,
      categories: req.body.categories
        ? req.body.categories.map(cat => mongoose.Types.ObjectId(cat))
        : undefined,
    };
    const post = await Post.create(data);

    res.status(201).json({
      success: true,
      post: await Post.findOne(post._id).populate('categories')
    });
  } catch (err) {
    res.status(500).json(err);
  }
}

export async function updatePost(req, res) {
  try {
    const post = await Post.findOne({ _id: req.params.key });

    if (!post) {
      return res.status(404).send();
    }

    post.title = req.body.title ? req.body.title : post.title,
    post.author = req.body.author ? req.body.author : post.author,
    post.content = req.body.content ? req.body.content : post.content,
    post.tags = req.body.tags ? req.body.tags : post.tags,
    post.categories = req.body.categories ? req.body.categories : post.categories,
    post.save();

    res.status(200).send({
      success: true,
      post
    });
  } catch (err) {
    if (err instanceof mongoose.Error.CastError) {
      res.status(404).send();
    } else {
      res.status(500).json(err);
    }
  }
}
