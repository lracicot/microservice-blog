import mongoose from 'mongoose';
import slug from 'mongoose-slug-updater';
import timestamps from 'mongoose-timestamp';
import { TagSchema } from './tag';

mongoose.plugin(slug);

const PostSchema = mongoose.Schema({
  title: { type: String, required: true },
  slug: { type: String, slug: 'title', unique: true },
  author: { type: String, required: true },
  content: String,
  tags: [ TagSchema ],
  categories: [ { type: mongoose.Schema.Types.ObjectId, ref: 'Category' } ],
});


PostSchema.plugin(timestamps);

export default mongoose.model('Post', PostSchema);
