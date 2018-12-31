import mongoose from 'mongoose';
import Category from '../models/category';

export async function getCategory(req, res) {
  try {
    const category = await Category.findOne({ _id: req.params.key });

    if (!category) {
      return res.status(404).send();
    }

    res.json({ category });
  } catch (err) {
    return res.status(404).send();
  }
}

export async function deleteCategory(req, res) {
  try {
    await Category.deleteOne({ _id: req.params.key });
    res.status(200).send({ success: true });
  } catch (err) {
    return res.status(404).send();
  }
}

export async function listCategories(req, res, next) {
  try {
    const categories = await Category.find({});
    res.json(categories);
  } catch (err) {
    next(err);
  }
}

export async function createCategory(req, res) {
  try {
    const data = {
      name: req.body.name || '',
      parent: req.body.parent || undefined,
    };
    const category = await Category.create(data);

    res.status(201).json({
      success: true,
      category: await Category.findOne(category._id).populate('parent')
    });
  } catch (err) {
    res.status(500).json(err);
  }
}

export async function updateCategory(req, res) {
  try {
    const category = await Category.findOne({ _id: req.params.key });

    if (!category) {
      return res.status(404).send();
    }

    category.name = req.body.name ? req.body.name : category.name,
    category.parent = req.body.parent ? req.body.parent : category.parent,
    category.save();

    res.status(200).send({
      success: true,
      category
    });
  } catch (err) {
    if (err instanceof mongoose.Error.CastError) {
      res.status(404).send();
    } else {
      res.status(500).json(err);
    }
  }
}

export async function getCategoryPosts(req, res) {
  try {
    const category = await Category.findOne({ _id: req.params.key }).populate('posts');

    if (!category) {
      return res.status(404).send();
    }

    res.json({ posts: category.posts });
  } catch (err) {
    return res.status(404).send();
  }
}
