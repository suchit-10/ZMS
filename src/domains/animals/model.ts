import mongoose, { Schema, Document } from 'mongoose';

export interface IAnimal extends Document {
  _id: mongoose.Types.ObjectId;
  name?: string;
  species: string;
  sex?: 'male' | 'female' | 'unknown';
  age?: number;
  acquisition_date: Date;
  acquisition_type?: 'birth' | 'purchase' | 'rescue' | 'donation' | 'transfer' | 'wild_capture' | 'other';
  date_of_death?: Date;
  cause_of_death?: string;
  distinguishing_marks?: string;
  images: string[];
  microchip_id?: string;
  extra_attributes: Record<string, any>;
  createdAt: Date;
  updatedAt: Date;
  
  
  is_deceased: boolean;
  calculated_age?: number;

  addImage(imageUrl: string): Promise<IAnimal>;
  removeImage(imageUrl: string): Promise<IAnimal>;
}

const AnimalSchema = new Schema<IAnimal>({
  name: {
    type: String,
    required: false,
    trim: true,
    maxlength: 100
  },

  species: {
    type: String,
    required: true,
    trim: true,
    maxlength: 50,
    index: true
  },

  sex: {
    type: String,
    enum: ['male', 'female', 'unknown'],
    required: false
  },

  age: {
    type: Number,
    min: 0,
    max: 200,
    required: false
  },

  acquisition_date: {
    type: Date,
    required: true,
    index: true
  },

  acquisition_type: {
    type: String,
    enum: ['birth', 'purchase', 'rescue', 'donation', 'transfer', 'wild_capture', 'other'],
    required: false,
    trim: true
  },

  date_of_death: {
    type: Date,
    required: false,
    validate: {
      validator: function(this: IAnimal, v: Date) {
        return !v || !this.acquisition_date || v >= this.acquisition_date;
      },
      message: 'Date of death cannot be before acquisition date'
    }
  },

  cause_of_death: {
    type: String,
    required: false,
    trim: true,
    maxlength: 500,
    validate: {
      validator: function(this: IAnimal, v: string): boolean {
        // Explicitly convert to boolean using !!
        return !v || !!this.date_of_death;
      },
      message: 'Cause of death can only be specified if date of death is provided'
    }
  },

  distinguishing_marks: {
    type: String,
    required: false,
    trim: true,
    maxlength: 1000
  },

  images: {
    type: [String],
    default: [],
    validate: {
      validator: function(v: string[]) {
        return v.every(url => {
          try {
            new URL(url);
            return true;
          } catch {
            return false;
          }
        });
      },
      message: 'All image entries must be valid URLs'
    }
  },

  microchip_id: {
    type: String,
    required: false,
    unique: true,
    sparse: true,
    trim: true,
    maxlength: 50,
    validate: {
      validator: function(v: string) {
        return !v || /^[0-9A-Fa-f]{10,15}$/.test(v);
      },
      message: 'Microchip ID must be 10-15 alphanumeric characters'
    }
  },

  extra_attributes: {
    type: Schema.Types.Mixed,
    default: {},
    validate: {
      validator: function(v: any) {
        return typeof v === 'object' && v !== null && !Array.isArray(v);
      },
      message: 'Extra attributes must be a valid JSON object'
    }
  }
}, {
  timestamps: true,
  versionKey: false,
  collection: 'animals'
});

AnimalSchema.index({ species: 1, acquisition_date: -1 });
AnimalSchema.index({ microchip_id: 1 }, { sparse: true });
AnimalSchema.index({ createdAt: -1 });
AnimalSchema.index({ 'extra_attributes.breed': 1 }, { sparse: true });

AnimalSchema.virtual('is_deceased').get(function(this: IAnimal) {
  return !!this.date_of_death;
});


AnimalSchema.virtual('calculated_age').get(function(this: IAnimal) {
  const birthDate = this.extra_attributes?.birth_date;
  if (birthDate) {
    const today = new Date();
    const birth = new Date(birthDate);
    const ageInMs = today.getTime() - birth.getTime();
    return Math.floor(ageInMs / (1000 * 60 * 60 * 24 * 365.25));
  }
  return this.age;
});


AnimalSchema.methods.addImage = async function(this: IAnimal, imageUrl: string): Promise<IAnimal> {
  if (!this.images.includes(imageUrl)) {
    this.images.push(imageUrl);
    return await this.save();
  }
  return this;
};


AnimalSchema.methods.removeImage = async function(this: IAnimal, imageUrl: string): Promise<IAnimal> {
  this.images = this.images.filter(img => img !== imageUrl);
  return await this.save();
};


AnimalSchema.statics.findByMicrochip = function(chipId: string) {
  return this.findOne({ microchip_id: chipId });
};


AnimalSchema.statics.findLiving = function() {
  return this.find({ date_of_death: { $exists: false } });
};


AnimalSchema.statics.findBySpecies = function(species: string) {
  return this.find({ species: new RegExp(species, 'i') });
};


export interface IAnimalModel extends mongoose.Model<IAnimal> {
  findByMicrochip(chipId: string): Promise<IAnimal | null>;
  findLiving(): Promise<IAnimal[]>;
  findBySpecies(species: string): Promise<IAnimal[]>;
}

export const Animal = mongoose.model<IAnimal, IAnimalModel>('Animal', AnimalSchema);
