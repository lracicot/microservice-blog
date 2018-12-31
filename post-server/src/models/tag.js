import mongoose from 'mongoose';
import slug from 'mongoose-slug-updater';
import timestamps from 'mongoose-timestamp';

mongoose.plugin(slug);

export const TagSchema = mongoose.Schema({
  name: { type: String, required: true },
  slug: { type: String, slug: 'name' },
});

TagSchema.plugin(timestamps);
