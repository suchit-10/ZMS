import mongoose, { Schema, Document } from 'mongoose';

export interface IDietPlan extends Document {
  _id: mongoose.Types.ObjectId;
  species_id: mongoose.Types.ObjectId;
  diet_name: string;
  age_category: 'infant' | 'juvenile' | 'adult' | 'senior';
  special_conditions?: string;
  total_calories_per_day?: number;
  feeding_frequency_per_day?: number;
  notes?: string;
  createdAt: Date;
  updatedAt: Date;

  calories_per_feeding: number;
  is_special_diet: boolean;
  is_high_frequency_feeding: boolean;
  
  calculateCaloriesPerFeeding(): number;
  validateNutritionalRequirements(): { valid: boolean; message?: string };
  getSpeciesDetails(): Promise<any>;
  getDietItems(): Promise<any[]>;
  addDietItem(itemData: any): Promise<any>;
}

const DietPlanSchema = new Schema<IDietPlan>({
  species_id: {
    type: Schema.Types.ObjectId,
    ref: 'Species',
    required: true,
    index: true
  },

  diet_name: {
    type: String,
    required: true,
    trim: true,
    maxlength: 100,
    index: true,
    validate: {
    validator: function(v: string): boolean {
    return !!(v && v.trim().length > 0);
    },
    message: 'Diet name cannot be empty'
    }
  },

  age_category: {
    type: String,
    enum: ['infant', 'juvenile', 'adult', 'senior'],
    default: 'adult',
    required: true,
    index: true
  },

  special_conditions: {
    type: String,
    required: false,
    trim: true,
    maxlength: 200,
    validate: {
      validator: function(v: string) {
        
        return !v || v.trim().length > 0;
      },
      message: 'Special conditions cannot be empty if provided'
    }
  },

  total_calories_per_day: {
    type: Number,
    required: false,
    min: 1,
    max: 50000,
    validate: {
      validator: function(v: number) {
        
        return !v || (Number.isInteger(v) && v > 0);
      },
      message: 'Total calories per day must be a positive integer'
    }
  },

  feeding_frequency_per_day: {
    type: Number,
    required: false,
    min: 1,
    max: 24,
    validate: {
      validator: function(v: number) {
        
        return !v || (Number.isInteger(v) && v >= 1 && v <= 24);
      },
      message: 'Feeding frequency must be between 1 and 24 times per day'
    }
  },

  notes: {
    type: String,
    required: false,
    trim: true,
    maxlength: 2000
  }
}, {
  timestamps: true,
  versionKey: false,
  collection: 'diet_plans'
});


DietPlanSchema.index({ species_id: 1, age_category: 1 });
DietPlanSchema.index({ diet_name: 1, age_category: 1 });
DietPlanSchema.index({ age_category: 1, total_calories_per_day: -1 });
DietPlanSchema.index({ feeding_frequency_per_day: 1 });


DietPlanSchema.virtual('calories_per_feeding').get(function(this: IDietPlan) {
  if (!this.total_calories_per_day || !this.feeding_frequency_per_day) return 0;
  return Math.round(this.total_calories_per_day / this.feeding_frequency_per_day);
});


DietPlanSchema.virtual('is_special_diet').get(function(this: IDietPlan) {
  return !!(this.special_conditions && this.special_conditions.trim().length > 0);
});


DietPlanSchema.virtual('is_high_frequency_feeding').get(function(this: IDietPlan) {
  return !!(this.feeding_frequency_per_day && this.feeding_frequency_per_day > 4);
});


DietPlanSchema.methods.calculateCaloriesPerFeeding = function(this: IDietPlan): number {
  if (!this.total_calories_per_day || !this.feeding_frequency_per_day) return 0;
  return Math.round(this.total_calories_per_day / this.feeding_frequency_per_day);
};


DietPlanSchema.methods.validateNutritionalRequirements = function(this: IDietPlan): { valid: boolean; message?: string } {

  const hasCalories = !!this.total_calories_per_day;
  const hasFrequency = !!this.feeding_frequency_per_day;
  
  if (hasCalories && !hasFrequency) {
    return {
      valid: false,
      message: 'Feeding frequency is required when total calories are specified'
    };
  }
  
  if (hasFrequency && !hasCalories) {
    return {
      valid: false,
      message: 'Total calories per day is required when feeding frequency is specified'
    };
  }

  
  if (hasCalories) {
    let minCalories = 50;
    let maxCalories = 10000;
    
    switch (this.age_category) {
      case 'infant':
        minCalories = 10;
        maxCalories = 1000;
        break;
      case 'juvenile':
        minCalories = 50;
        maxCalories = 5000;
        break;
      case 'adult':
        minCalories = 100;
        maxCalories = 15000;
        break;
      case 'senior':
        minCalories = 50;
        maxCalories = 8000;
        break;
    }
    
    if (this.total_calories_per_day! < minCalories || this.total_calories_per_day! > maxCalories) {
      return {
        valid: false,
        message: `Calories for ${this.age_category} should be between ${minCalories} and ${maxCalories}`
      };
    }
  }

  return { valid: true };
};


DietPlanSchema.methods.getSpeciesDetails = async function(this: IDietPlan) {
  return await this.populate({
    path: 'species_id',
    select: 'species_name scientific_name dietary_type conservation_status'
  });
};


DietPlanSchema.methods.getDietItems = async function(this: IDietPlan) {
  const DietItem = mongoose.model('DietItem');
  return await DietItem.find({ diet_plan_id: this._id }).sort({ feeding_time: 1 });
};


DietPlanSchema.methods.addDietItem = async function(this: IDietPlan, itemData: any) {
  const DietItem = mongoose.model('DietItem');
  const dietItem = new DietItem({
    ...itemData,
    diet_plan_id: this._id
  });
  return await dietItem.save();
};


DietPlanSchema.pre('save', async function(next) {
  try {
    const validation = this.validateNutritionalRequirements();
    if (!validation.valid) {
      throw new Error(validation.message);
    }
    next();
  } catch (error) {
    next(error as Error);
  }
});


DietPlanSchema.statics.findBySpecies = function(speciesId: mongoose.Types.ObjectId) {
  return this.find({ species_id: speciesId }).sort({ age_category: 1 });
};


DietPlanSchema.statics.findByAgeCategory = function(ageCategory: string) {
  return this.find({ age_category: ageCategory }).sort({ diet_name: 1 });
};


DietPlanSchema.statics.findSpecialDiets = function() {
  return this.find({
    special_conditions: { $exists: true, $ne: '' }
  }).sort({ diet_name: 1 });
};


DietPlanSchema.statics.findHighCalorieDiets = function(minCalories: number = 5000) {
  return this.find({
    total_calories_per_day: { $gte: minCalories }
  }).sort({ total_calories_per_day: -1 });
};


DietPlanSchema.statics.findFrequentFeeding = function(minFrequency: number = 5) {
  return this.find({
    feeding_frequency_per_day: { $gte: minFrequency }
  }).sort({ feeding_frequency_per_day: -1 });
};


DietPlanSchema.statics.findByCalorieRange = function(minCalories: number, maxCalories: number) {
  return this.find({
    total_calories_per_day: {
      $gte: minCalories,
      $lte: maxCalories
    }
  }).sort({ total_calories_per_day: 1 });
};


DietPlanSchema.statics.getDietStatsBySpecies = function(speciesId: mongoose.Types.ObjectId) {
  return this.aggregate([
    { $match: { species_id: speciesId } },
    {
      $group: {
        _id: '$age_category',
        count: { $sum: 1 },
        avg_calories: { $avg: '$total_calories_per_day' },
        avg_frequency: { $avg: '$feeding_frequency_per_day' },
        special_diets: {
          $sum: {
            $cond: [{ $ne: ['$special_conditions', null] }, 1, 0]
          }
        }
      }
    },
    { $sort: { _id: 1 } }
  ]);
};


DietPlanSchema.statics.findCompleteNutritionalPlans = function() {
  return this.find({
    total_calories_per_day: { $exists: true, $ne: null },
    feeding_frequency_per_day: { $exists: true, $ne: null }
  }).sort({ diet_name: 1 });
};


DietPlanSchema.statics.searchByName = function(searchTerm: string) {
  return this.find({
    diet_name: new RegExp(searchTerm, 'i')
  }).sort({ diet_name: 1 });
};


export interface IDietPlanModel extends mongoose.Model<IDietPlan> {
  findBySpecies(speciesId: mongoose.Types.ObjectId): Promise<IDietPlan[]>;
  findByAgeCategory(ageCategory: string): Promise<IDietPlan[]>;
  findSpecialDiets(): Promise<IDietPlan[]>;
  findHighCalorieDiets(minCalories?: number): Promise<IDietPlan[]>;
  findFrequentFeeding(minFrequency?: number): Promise<IDietPlan[]>;
  findByCalorieRange(minCalories: number, maxCalories: number): Promise<IDietPlan[]>;
  getDietStatsBySpecies(speciesId: mongoose.Types.ObjectId): Promise<any[]>;
  findCompleteNutritionalPlans(): Promise<IDietPlan[]>;
  searchByName(searchTerm: string): Promise<IDietPlan[]>;
}

export const DietPlan = mongoose.model<IDietPlan, IDietPlanModel>('DietPlan', DietPlanSchema);