import mongoose, { Schema, Document } from 'mongoose';

export interface IDietItem extends Document {
  _id: mongoose.Types.ObjectId;
  diet_plan_id: mongoose.Types.ObjectId;
  food_item: string;
  quantity_grams?: number;
  feeding_time?: string;
  preparation_instructions?: string;
  nutritional_notes?: string;
  createdAt: Date;
  updatedAt: Date;

  
  quantity_kg: number;
  quantity_pounds: number;
  is_morning_feeding: boolean;
  is_evening_feeding: boolean;
  
  
  convertQuantity(unit: 'kg' | 'lbs' | 'oz'): number;
  validateFeedingTime(): { valid: boolean; message?: string };
  getDietPlanDetails(): Promise<any>;
}

const DietItemSchema = new Schema<IDietItem>({
  diet_plan_id: {
    type: Schema.Types.ObjectId,
    ref: 'DietPlan',
    required: true,
    index: true
  },

  food_item: {
    type: String,
    required: true,
    trim: true,
    maxlength: 100,
    index: true,
    validate: {
      validator: function (v: string): boolean {
      return !!(v && v.trim().length > 0);
      },
      message: 'Food item name cannot be empty'
    }
  },

  quantity_grams: {
    type: Number,
    required: false,
    min: 0,
    max: 99999999.99,
    validate: {
      validator: function(v: number) {
        
        if (v === undefined || v === null) return true;
        return v >= 0 && Number.isFinite(v) && (v * 100) % 1 === 0;
      },
      message: 'Quantity must be a positive number with maximum 2 decimal places'
    }
  },

  feeding_time: {
    type: String,
    required: false,
    validate: {
      validator: function(v: string) {
        
        if (!v) return true;
        const timePattern = /^([0-1]?[0-9]|2[0-3]):[0-5][0-9](:[0-5][0-9])?$/;
        return timePattern.test(v);
      },
      message: 'Feeding time must be in HH:MM or HH:MM:SS format (24-hour)'
    }
  },

  preparation_instructions: {
    type: String,
    required: false,
    trim: true,
    maxlength: 2000
  },

  nutritional_notes: {
    type: String,
    required: false,
    trim: true,
    maxlength: 1000
  }
}, {
  timestamps: true,
  versionKey: false,
  collection: 'diet_items'
});


DietItemSchema.index({ diet_plan_id: 1, food_item: 1 });
DietItemSchema.index({ diet_plan_id: 1, feeding_time: 1 });
DietItemSchema.index({ food_item: 1, quantity_grams: -1 });
DietItemSchema.index({ feeding_time: 1 });


DietItemSchema.virtual('quantity_kg').get(function(this: IDietItem) {
  return this.quantity_grams ? this.quantity_grams / 1000 : 0;
});


DietItemSchema.virtual('quantity_pounds').get(function(this: IDietItem) {
  return this.quantity_grams ? this.quantity_grams * 0.00220462 : 0;
});


DietItemSchema.virtual('is_morning_feeding').get(function(this: IDietItem) {
  if (!this.feeding_time) return false;
  const hour = parseInt(this.feeding_time.split(':')[0]);
  return hour < 12;
});


DietItemSchema.virtual('is_evening_feeding').get(function(this: IDietItem) {
  if (!this.feeding_time) return false;
  const hour = parseInt(this.feeding_time.split(':')[0]);
  return hour >= 17;
});


DietItemSchema.methods.convertQuantity = function(this: IDietItem, unit: 'kg' | 'lbs' | 'oz'): number {
  if (!this.quantity_grams) return 0;
  
  switch (unit) {
    case 'kg':
      return this.quantity_grams / 1000;
    case 'lbs':
      return this.quantity_grams * 0.00220462;
    case 'oz':
      return this.quantity_grams * 0.035274;
    default:
      return this.quantity_grams;
  }
};


DietItemSchema.methods.validateFeedingTime = function(this: IDietItem): { valid: boolean; message?: string } {
  if (!this.feeding_time) {
    return { valid: true };
  }

  const timePattern = /^([0-1]?[0-9]|2[0-3]):([0-5][0-9])(:([0-5][0-9]))?$/;
  const match = this.feeding_time.match(timePattern);
  
  if (!match) {
    return {
      valid: false,
      message: 'Invalid time format. Use HH:MM or HH:MM:SS in 24-hour format'
    };
  }

  const hour = parseInt(match[1]);
  const minute = parseInt(match[2]);

  if (hour > 23 || minute > 59) {
    return {
      valid: false,
      message: 'Invalid time values. Hour must be 0-23, minutes must be 0-59'
    };
  }

  return { valid: true };
};


DietItemSchema.methods.getDietPlanDetails = async function(this: IDietItem) {
  return await this.populate({
    path: 'diet_plan_id',
    select: 'plan_name animal_id species dietary_requirements'
  });
};

DietItemSchema.statics.findByDietPlan = function(dietPlanId: mongoose.Types.ObjectId) {
  return this.find({ diet_plan_id: dietPlanId }).sort({ feeding_time: 1 });
};

DietItemSchema.statics.findByFoodItem = function(foodItem: string) {
  return this.find({ 
    food_item: new RegExp(foodItem, 'i') 
  }).sort({ quantity_grams: -1 });
};


DietItemSchema.statics.findByTimeRange = function(startTime: string, endTime: string) {
  return this.find({
    feeding_time: {
      $gte: startTime,
      $lte: endTime
    }
  }).sort({ feeding_time: 1 });
};


DietItemSchema.statics.findMorningFeedings = function() {
  return this.find({
    feeding_time: {
      $regex: '^(0[0-9]|1[0-1]):'
    }
  }).sort({ feeding_time: 1 });
};


DietItemSchema.statics.findEveningFeedings = function() {
  return this.find({
    feeding_time: {
      $regex: '^(1[7-9]|2[0-3]):'
    }
  }).sort({ feeding_time: 1 });
};

DietItemSchema.statics.findWithPreparation = function() {
  return this.find({
    preparation_instructions: { $exists: true, $ne: '' }
  });
};

DietItemSchema.statics.findByQuantityRange = function(minGrams: number, maxGrams: number) {
  return this.find({
    quantity_grams: {
      $gte: minGrams,
      $lte: maxGrams
    }
  }).sort({ quantity_grams: -1 });
};

DietItemSchema.statics.getTotalQuantityByPlan = function(dietPlanId: mongoose.Types.ObjectId) {
  return this.aggregate([
    { $match: { diet_plan_id: dietPlanId } },
    { 
      $group: {
        _id: '$diet_plan_id',
        total_grams: { $sum: '$quantity_grams' },
        item_count: { $sum: 1 },
        items: { $push: { food_item: '$food_item', quantity_grams: '$quantity_grams' } }
      }
    }
  ]);
};

DietItemSchema.statics.getFeedingSchedule = function(dietPlanId: mongoose.Types.ObjectId) {
  return this.find({ diet_plan_id: dietPlanId })
    .sort({ feeding_time: 1 })
    .select('food_item quantity_grams feeding_time preparation_instructions');
};

export interface IDietItemModel extends mongoose.Model<IDietItem> {
  findByDietPlan(dietPlanId: mongoose.Types.ObjectId): Promise<IDietItem[]>;
  findByFoodItem(foodItem: string): Promise<IDietItem[]>;
  findByTimeRange(startTime: string, endTime: string): Promise<IDietItem[]>;
  findMorningFeedings(): Promise<IDietItem[]>;
  findEveningFeedings(): Promise<IDietItem[]>;
  findWithPreparation(): Promise<IDietItem[]>;
  findByQuantityRange(minGrams: number, maxGrams: number): Promise<IDietItem[]>;
  getTotalQuantityByPlan(dietPlanId: mongoose.Types.ObjectId): Promise<any[]>;
  getFeedingSchedule(dietPlanId: mongoose.Types.ObjectId): Promise<IDietItem[]>;
}

export const DietItem = mongoose.model<IDietItem, IDietItemModel>('DietItem', DietItemSchema);
