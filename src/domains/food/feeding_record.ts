import mongoose, { Schema, Document } from 'mongoose';

export interface IFeedingRecord extends Document {
  _id: mongoose.Types.ObjectId;
  animal_id: mongoose.Types.ObjectId;
  feeding_at: Date;
  diet_item_id?: string;
  quantity_given_grams?: number;
  quantity_consumed_grams?: number;
  staff_id?: mongoose.Types.ObjectId;
  appetite_rating: 'excellent' | 'good' | 'fair' | 'poor' | 'refused';
  behavioral_notes?: string;
  createdAt: Date;
  updatedAt: Date;
}

const FeedingRecordSchema = new Schema<IFeedingRecord>({
  animal_id: {
    type: Schema.Types.ObjectId,
    ref: 'Animal',
    required: true,
    index: true
  },

  feeding_at: {
    type: Date,
    required: true,
    index: true
  },

  diet_item_id: {
    type: String,
    required: false,
    index: true
  },

  quantity_given_grams: {
    type: Number,
    required: false
  },

  quantity_consumed_grams: {
    type: Number,
    required: false
  },

  staff_id: {
    type: Schema.Types.ObjectId,
    ref: 'User',
    required: false,
    index: true
  },

  appetite_rating: {
    type: String,
    default: 'good',
    index: true
  },

  behavioral_notes: {
    type: String,
    required: false
  }

}, {
  timestamps: true,
  versionKey: false,
  collection: 'feeding_records'
});


FeedingRecordSchema.index({ animal_id: 1, feeding_at: -1 });
FeedingRecordSchema.index({ diet_item_id: 1, feeding_at: -1 });
FeedingRecordSchema.index({ staff_id: 1, feeding_at: -1 });


export const FeedingRecord = mongoose.model<IFeedingRecord>('FeedingRecord', FeedingRecordSchema);
