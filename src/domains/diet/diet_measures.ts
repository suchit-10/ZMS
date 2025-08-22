import mongoose, { Schema, Document } from 'mongoose';

export interface IFeedingRecord extends Document {
  _id: mongoose.Types.ObjectId;
  animal_id: mongoose.Types.ObjectId;
  feeding_date: Date;
  feeding_time: string;
  diet_item_id?: mongoose.Types.ObjectId;
  quantity_given_grams?: number;
  quantity_consumed_grams?: number;
  fed_by_staff_id?: mongoose.Types.ObjectId;
  appetite_rating: 'excellent' | 'good' | 'fair' | 'poor' | 'refused';
  behavioral_notes?: string;
  createdAt: Date;
  updatedAt: Date;


  quantity_remaining_grams: number;
  consumption_percentage: number;

  getAnimalDetails(): Promise<any>;
  getDietItemDetails(): Promise<any>;
  isUnderfed(): boolean;
  recordConsumption(consumed: number): Promise<IFeedingRecord>;
}

const FeedingRecordSchema = new Schema<IFeedingRecord>({
  animal_id: {
    type: Schema.Types.ObjectId,
    ref: 'Animal',
    required: true,
    index: true
  },

  feeding_date: {
    type: Date,
    required: true,
    index: true
  },

  feeding_time: {
    type: String,
    required: true,
    match: /^([0-1]?[0-9]|2[0-3]):[0-5][0-9]$/,
  },

  diet_item_id: {
    type: Schema.Types.ObjectId,
    ref: 'DietItem',
    required: false,
    index: true
  },

  quantity_given_grams: {
    type: Number,
    min: 0.01,
    max: 99999.99,
    validate: {
      validator: function(v: number) {
        if (v === undefined || v === null) return true;
        return v > 0 && Number.isFinite(v) && (v * 100) % 1 === 0;
      },
      message: 'Quantity given must be positive with up to 2 decimal places'
    }
  },

  quantity_consumed_grams: {
    type: Number,
    min: 0,
    max: 99999.99,
    validate: {
      validator: function(this: IFeedingRecord, v: number) {
        if (v === undefined || v === null) return true;
        return v >= 0 && (!this.quantity_given_grams || v <= this.quantity_given_grams);
      },
      message: 'Quantity consumed cannot exceed quantity given'
    }
  },

  fed_by_staff_id: {
    type: Schema.Types.ObjectId,
    ref: 'Staff',
    required: false,
    index: true
  },

  appetite_rating: {
    type: String,
    enum: ['excellent', 'good', 'fair', 'poor', 'refused'],
    default: 'good',
    index: true
  },

  behavioral_notes: {
    type: String,
    trim: true,
    maxlength: 2000
  }

}, {
  timestamps: true,
  versionKey: false,
  collection: 'feeding_records'
});


FeedingRecordSchema.index({ animal_id: 1, feeding_date: -1 });
FeedingRecordSchema.index({ diet_item_id: 1, feeding_date: -1 });
FeedingRecordSchema.index({ fed_by_staff_id: 1, feeding_date: -1 });



FeedingRecordSchema.virtual('quantity_remaining_grams').get(function(this: IFeedingRecord) {
  if (!this.quantity_given_grams) return 0;
  return this.quantity_given_grams - (this.quantity_consumed_grams || 0);
});

FeedingRecordSchema.virtual('consumption_percentage').get(function(this: IFeedingRecord) {
  if (!this.quantity_given_grams || this.quantity_given_grams === 0) return 0;
  return Math.round(((this.quantity_consumed_grams || 0) / this.quantity_given_grams) * 100);
});



FeedingRecordSchema.methods.getAnimalDetails = async function(this: IFeedingRecord) {
  return await this.populate('animal_id', 'name species age sex microchip_id');
};

FeedingRecordSchema.methods.getDietItemDetails = async function(this: IFeedingRecord) {
  return await this.populate('diet_item_id', 'food_item quantity_grams nutritional_notes');
};

FeedingRecordSchema.methods.isUnderfed = function(this: IFeedingRecord): boolean {
  if (!this.quantity_given_grams || !this.quantity_consumed_grams) return false;
  return this.consumption_percentage < 50; 
};

FeedingRecordSchema.methods.recordConsumption = async function(this: IFeedingRecord, consumed: number) {
  this.quantity_consumed_grams = consumed;
  return await this.save();
};


FeedingRecordSchema.statics.findByAnimal = function(animalId: mongoose.Types.ObjectId) {
  return this.find({ animal_id: animalId }).sort({ feeding_date: -1, feeding_time: -1 });
};

FeedingRecordSchema.statics.findByDietItem = function(dietItemId: mongoose.Types.ObjectId) {
  return this.find({ diet_item_id: dietItemId }).sort({ feeding_date: -1 });
};

FeedingRecordSchema.statics.findByStaff = function(staffId: mongoose.Types.ObjectId) {
  return this.find({ fed_by_staff_id: staffId }).sort({ feeding_date: -1 });
};

FeedingRecordSchema.statics.findRecent = function(days: number = 7) {
  const cutoffDate = new Date();
  cutoffDate.setDate(cutoffDate.getDate() - days);
  return this.find({ feeding_date: { $gte: cutoffDate } }).sort({ feeding_date: -1 });
};

FeedingRecordSchema.statics.getConsumptionStats = function(animalId: mongoose.Types.ObjectId) {
  return this.aggregate([
    { $match: { animal_id: animalId } },
    {
      $group: {
        _id: '$animal_id',
        avg_consumption: { $avg: '$quantity_consumed_grams' },
        avg_consumption_pct: { 
          $avg: { 
            $cond: [
              { $gt: ['$quantity_given_grams', 0] },
              { $divide: ['$quantity_consumed_grams', '$quantity_given_grams'] },
              0
            ] 
          } 
        },
        total_meals: { $sum: 1 }
      }
    }
  ]);
};


export interface IFeedingRecordModel extends mongoose.Model<IFeedingRecord> {
  findByAnimal(animalId: mongoose.Types.ObjectId): Promise<IFeedingRecord[]>;
  findByDietItem(dietItemId: mongoose.Types.ObjectId): Promise<IFeedingRecord[]>;
  findByStaff(staffId: mongoose.Types.ObjectId): Promise<IFeedingRecord[]>;
  findRecent(days?: number): Promise<IFeedingRecord[]>;
  getConsumptionStats(animalId: mongoose.Types.ObjectId): Promise<any[]>;
}

export const FeedingRecord = mongoose.model<IFeedingRecord, IFeedingRecordModel>('FeedingRecord', FeedingRecordSchema);
