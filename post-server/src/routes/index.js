import * as PostController from '../controllers/post';
import * as CategoryController from '../controllers/category';
import * as TagController from '../controllers/tag';

function send405(req, res) {
  res.status(405).send();
}

const routes = (app) => {
  // Post item routes
  app.route('/post/:key').get(PostController.getPost);
  app.route('/post/:key').delete(PostController.deletePost);
  app.route('/post/:key').put(PostController.updatePost);
  app.route('/post/:key').patch(PostController.updatePost);

  // Postc cllection routes
  app.route('/post').get(PostController.listPosts);
  app.route('/post').post(PostController.createPost);
  app.route('/post').delete(send405);
  app.route('/post').put(send405);
  app.route('/post').patch(send405);

  // Category item routes
  app.route('/category/:key').get(CategoryController.getCategory);
  app.route('/category/:key/posts').get(CategoryController.getCategoryPosts);
  app.route('/category/:key').delete(CategoryController.deleteCategory);
  app.route('/category/:key').put(CategoryController.updateCategory);
  app.route('/category/:key').patch(CategoryController.updateCategory);

  // Category collection routes
  app.route('/category').get(CategoryController.listCategories);
  app.route('/category').post(CategoryController.createCategory);
  app.route('/category').delete(send405);
  app.route('/category').put(send405);
  app.route('/category').patch(send405);

  // Tag item routes
  app.route('/tag/:slug/posts').get(TagController.getTagPosts);
};

export default routes;
