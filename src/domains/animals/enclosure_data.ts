import mongoose, { Schema, Document } from 'mongoose';

export interface IEnclosure extends Document {
  _id: mongoose.Types.ObjectId;
  enclosure_name: string;
  enclosure_type: 'indoor' | 'outdoor' | 'mixed' | 'aquatic' | 'aviary';
  area_square_meters?: number;
  capacity_max?: number;
  climate_controlled: boolean;
  temperature_min_celsius?: number;
  temperature_max_celsius?: number;
  humidity_min_percent?: number;
  humidity_max_percent?: number;
  safety_level?: 'public_viewing' | 'restricted_access' | 'quarantine' | 'hospital';
  location_coordinates?: string;
  construction_date?: Date;
  last_maintenance_date?: Date;
  status: 'active' | 'maintenance' | 'closed';
  notes?: string;
  createdAt: Date;
  updatedAt: Date;

  needs_maintenance: boolean;
  is_operational: boolean;


  updateMaintenanceDate(): Promise<IEnclosure>;
  checkTemperatureRange(): { valid: boolean; message?: string };
  checkHumidityRange(): { valid: boolean; message?: string };
}

const EnclosureSchema = new Schema<IEnclosure>({
  enclosure_name: {
    type: String,
    required: true,
    trim: true,
    maxlength: 100,
    index: true
  },

  enclosure_type: {
    type: String,
    enum: ['indoor', 'outdoor', 'mixed', 'aquatic', 'aviary'],
    required: true,
    index: true
  },

  area_square_meters: {
    type: Number,
    min: 0,
    max: 999999.99,
    required: false
  },

  capacity_max: {
    type: Number,
    min: 0,
    required: false
  },

  climate_controlled: {
    type: Boolean,
    default: false,
    index: true
  },

  temperature_min_celsius: {
    type: Number,
    min: -50,
    max: 60,
    required: false,
    validate: {
      validator: function(this: IEnclosure, v: number) {
        
        return !v || !this.temperature_max_celsius || v <= this.temperature_max_celsius;
      },
      message: 'Minimum temperature must be less than or equal to maximum temperature'
    }
  },

  temperature_max_celsius: {
    type: Number,
    min: -50,
    max: 60,
    required: false,
    validate: {
      validator: function(this: IEnclosure, v: number) {
        return !v || !this.temperature_min_celsius || v >= this.temperature_min_celsius;
      },
      message: 'Maximum temperature must be greater than or equal to minimum temperature'
    }
  },

  humidity_min_percent: {
    type: Number,
    min: 0,
    max: 100,
    required: false,
    validate: {
      validator: function(this: IEnclosure, v: number) {
        return !v || !this.humidity_max_percent || v <= this.humidity_max_percent;
      },
      message: 'Minimum humidity must be less than or equal to maximum humidity'
    }
  },

  humidity_max_percent: {
    type: Number,
    min: 0,
    max: 100,
    required: false,
    validate: {
      validator: function(this: IEnclosure, v: number) {
        return !v || !this.humidity_min_percent || v >= this.humidity_min_percent;
      },
      message: 'Maximum humidity must be greater than or equal to minimum humidity'
    }
  },

  safety_level: {
    type: String,
    enum: ['public_viewing', 'restricted_access', 'quarantine', 'hospital'],
    required: false,
    index: true
  },

  location_coordinates: {
    type: String,
    required: false,
    trim: true,
    maxlength: 50,
    validate: {
      validator: function(v: string) {
        if (!v) return true;
        const coordPattern = /^-?\d+\.?\d*,-?\d+\.?\d*$/;
        return coordPattern.test(v);
      },
      message: 'Location coordinates must be in format: latitude,longitude'
    }
  },

  construction_date: {
    type: Date,
    required: false,
    validate: {
      validator: function(v: Date) {
        return !v || v <= new Date();
      },
      message: 'Construction date cannot be in the future'
    }
  },

  last_maintenance_date: {
    type: Date,
    required: false,
    validate: {
      validator: function(this: IEnclosure, v: Date) {
        return !v || !this.construction_date || v >= this.construction_date;
      },
      message: 'Last maintenance date cannot be before construction date'
    }
  },

  status: {
    type: String,
    enum: ['active', 'maintenance', 'closed'],
    default: 'active',
    index: true
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
  collection: 'enclosures'
});

EnclosureSchema.index({ enclosure_type: 1, status: 1 });
EnclosureSchema.index({ safety_level: 1, status: 1 });
EnclosureSchema.index({ climate_controlled: 1, enclosure_type: 1 });
EnclosureSchema.index({ last_maintenance_date: 1 });
EnclosureSchema.index({ construction_date: 1 });


EnclosureSchema.virtual('needs_maintenance').get(function(this: IEnclosure) {
  if (!this.last_maintenance_date) return true;
  const sixMonthsAgo = new Date();
  sixMonthsAgo.setMonth(sixMonthsAgo.getMonth() - 6);
  return this.last_maintenance_date < sixMonthsAgo;
});


EnclosureSchema.virtual('is_operational').get(function(this: IEnclosure) {
  return this.status === 'active';
});


EnclosureSchema.methods.updateMaintenanceDate = async function(this: IEnclosure): Promise<IEnclosure> {
  this.last_maintenance_date = new Date();
  return await this.save();
};


EnclosureSchema.methods.checkTemperatureRange = function(this: IEnclosure): { valid: boolean; message?: string } {
  if (!this.temperature_min_celsius || !this.temperature_max_celsius) {
    return { valid: true };
  }
  
  if (this.temperature_min_celsius > this.temperature_max_celsius) {
    return { 
      valid: false, 
      message: 'Minimum temperature cannot be greater than maximum temperature' 
    };
  }
  
  return { valid: true };
};


EnclosureSchema.methods.checkHumidityRange = function(this: IEnclosure): { valid: boolean; message?: string } {
  if (!this.humidity_min_percent || !this.humidity_max_percent) {
    return { valid: true };
  }
  
  if (this.humidity_min_percent > this.humidity_max_percent) {
    return { 
      valid: false, 
      message: 'Minimum humidity cannot be greater than maximum humidity' 
    };
  }
  
  return { valid: true };
};


EnclosureSchema.statics.findActive = function() {
  return this.find({ status: 'active' });
};

EnclosureSchema.statics.findByType = function(type: string) {
  return this.find({ enclosure_type: type });
};

EnclosureSchema.statics.findNeedingMaintenance = function() {
  const sixMonthsAgo = new Date();
  sixMonthsAgo.setMonth(sixMonthsAgo.getMonth() - 6);
  return this.find({
    $or: [
      { last_maintenance_date: { $lt: sixMonthsAgo } },
      { last_maintenance_date: { $exists: false } }
    ]
  });
};

EnclosureSchema.statics.findClimateControlled = function() {
  return this.find({ climate_controlled: true });
};

EnclosureSchema.statics.findBySafetyLevel = function(level: string) {
  return this.find({ safety_level: level });
};


export interface IEnclosureModel extends mongoose.Model<IEnclosure> {
  findActive(): Promise<IEnclosure[]>;
  findByType(type: string): Promise<IEnclosure[]>;
  findNeedingMaintenance(): Promise<IEnclosure[]>;
  findClimateControlled(): Promise<IEnclosure[]>;
  findBySafetyLevel(level: string): Promise<IEnclosure[]>;
}

export const Enclosure = mongoose.model<IEnclosure, IEnclosureModel>('Enclosure', EnclosureSchema);