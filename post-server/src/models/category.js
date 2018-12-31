import mongoose from 'mongoose';
import slug from 'mongoose-slug-updater';
import timestamps from 'mongoose-timestamp';

mongoose.plugin(slug);

export const CategorySchema = mongoose.Schema({
  name: { type: String, required: true },
  slug: { type: String, slug: 'name', unique: true },
  parent: { type: String, ref: 'Category' },
});

CategorySchema.virtual('posts', {
  ref: 'Post',
  localField: '_id',
  foreignField: 'categories'
});

CategorySchema.plugin(timestamps);

export default mongoose.model('Category', CategorySchema);
