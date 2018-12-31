import Post from '../models/post';

export async function getTagPosts(req, res) {
  try {
    const { slug } = req.params;
    const posts = await Post.find({ 'tags': { $elemMatch: { slug } } }).populate('posts');

    if (!posts) {
      return res.status(404).send();
    }

    res.json({ posts });
  } catch (err) {
    return res.status(404).send();
  }
}
