

import mongoose, { Schema, Document } from 'mongoose';

export interface IMedicalRecord extends Document {
  _id: mongoose.Types.ObjectId;
  animal_id: mongoose.Types.ObjectId;
  examination_date: Date;
  examination_type: 'routine' | 'emergency' | 'follow_up' | 'pre_breeding' | 'quarantine';
  veterinarian_name: string;
  weight_kg?: number;
  temperature_celsius?: number;
  heart_rate_bpm?: number;
  respiratory_rate_per_min?: number;
  symptoms?: string;
  diagnosis?: string;
  treatment?: string;
  medications?: string;
  follow_up_required: boolean;
  follow_up_date?: Date;
  notes?: string;
  extra_attributes: Record<string, any>;
  createdAt: Date;
  updatedAt: Date;

  is_emergency_visit: boolean;
  is_overdue_followup: boolean;
  temperature_fahrenheit: number;
  bmi_status?: string;
  days_since_examination: number;
  

  convertTemperature(unit: 'F' | 'K'): number;
  validateVitalSigns(): { valid: boolean; messages: string[] };
  getAnimalDetails(): Promise<any>;
  scheduleFollowUp(date: Date): Promise<IMedicalRecord>;
  isVitalSignAbnormal(vitalSign: string): boolean;
}

const MedicalRecordSchema = new Schema<IMedicalRecord>({
  animal_id: {
    type: Schema.Types.ObjectId,
    ref: 'Animal',
    required: true,
    index: true
  },

  examination_date: {
    type: Date,
    required: true,
    index: true,
    validate: {
      validator: function(v: Date) {
        const today = new Date();
        today.setHours(23, 59, 59, 999);
        return v <= today;
      },
      message: 'Examination date cannot be in the future'
    }
  },

  examination_type: {
    type: String,
    enum: ['routine', 'emergency', 'follow_up', 'pre_breeding', 'quarantine'],
    required: true,
    index: true
  },

  veterinarian_name: {
    type: String,
    required: true,
    trim: true,
    maxlength: 100,
    index: true,
    validate: {
    validator: function(v: string): boolean {
    return !!(v && v.trim().length > 0);
    },
    message: 'Veterinarian name cannot be empty'
    }
  },

  weight_kg: {
    type: Number,
    required: false,
    min: 0.01,
    max: 9999.99,
    validate: {
      validator: function(v: number) {
        
        if (v === undefined || v === null) return true;
        return v > 0 && Number.isFinite(v) && (v * 100) % 1 === 0;
      },
      message: 'Weight must be a positive number with maximum 2 decimal places'
    }
  },

  temperature_celsius: {
    type: Number,
    required: false,
    min: 25.0,
    max: 50.0,
    validate: {
      validator: function(v: number) {
        
        if (v === undefined || v === null) return true;
        return v >= 25.0 && v <= 50.0 && Number.isFinite(v) && (v * 10) % 1 === 0;
      },
      message: 'Temperature must be between 25.0°C and 50.0°C with maximum 1 decimal place'
    }
  },

  heart_rate_bpm: {
    type: Number,
    required: false,
    min: 10,
    max: 1000,
    validate: {
      validator: function(v: number) {
        
        if (v === undefined || v === null) return true;
        return Number.isInteger(v) && v >= 10 && v <= 1000;
      },
      message: 'Heart rate must be an integer between 10 and 1000 BPM'
    }
  },

  respiratory_rate_per_min: {
    type: Number,
    required: false,
    min: 1,
    max: 200,
    validate: {
      validator: function(v: number) {
        if (v === undefined || v === null) return true;
        return Number.isInteger(v) && v >= 1 && v <= 200;
      },
      message: 'Respiratory rate must be an integer between 1 and 200 per minute'
    }
  },

  symptoms: {
    type: String,
    required: false,
    trim: true,
    maxlength: 2000
  },

  diagnosis: {
    type: String,
    required: false,
    trim: true,
    maxlength: 2000
  },

  treatment: {
    type: String,
    required: false,
    trim: true,
    maxlength: 2000
  },

  medications: {
    type: String,
    required: false,
    trim: true,
    maxlength: 1000
  },

  follow_up_required: {
    type: Boolean,
    default: false,
    index: true
  },

  follow_up_date: {
    type: Date,
    required: false,
    validate: {
      validator: function(this: IMedicalRecord, v: Date) {
        if (!v) return !this.follow_up_required;
        return this.follow_up_required && v > this.examination_date;
      },
      message: 'Follow-up date must be after examination date when follow-up is required'
    }
  },

  notes: {
    type: String,
    required: false,
    trim: true,
    maxlength: 3000
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
  collection: 'medical_records'
});

MedicalRecordSchema.index({ animal_id: 1, examination_date: -1 });
MedicalRecordSchema.index({ examination_type: 1, examination_date: -1 });
MedicalRecordSchema.index({ veterinarian_name: 1, examination_date: -1 });
MedicalRecordSchema.index({ follow_up_required: 1, follow_up_date: 1 });
MedicalRecordSchema.index({ follow_up_date: 1 }, { sparse: true });


MedicalRecordSchema.virtual('is_emergency_visit').get(function(this: IMedicalRecord) {
  return this.examination_type === 'emergency';
});


MedicalRecordSchema.virtual('is_overdue_followup').get(function(this: IMedicalRecord) {
  if (!this.follow_up_required || !this.follow_up_date) return false;
  return this.follow_up_date < new Date();
});


MedicalRecordSchema.virtual('temperature_fahrenheit').get(function(this: IMedicalRecord) {
  if (!this.temperature_celsius) return 0;
  return (this.temperature_celsius * 9/5) + 32;
});

MedicalRecordSchema.virtual('days_since_examination').get(function(this: IMedicalRecord) {
  const today = new Date();
  const examDate = new Date(this.examination_date);
  const diffInMs = today.getTime() - examDate.getTime();
  return Math.floor(diffInMs / (1000 * 60 * 60 * 24));
});

MedicalRecordSchema.methods.convertTemperature = function(this: IMedicalRecord, unit: 'F' | 'K'): number {
  if (!this.temperature_celsius) return 0;
  
  switch (unit) {
    case 'F':
      return (this.temperature_celsius * 9/5) + 32;
    case 'K':
      return this.temperature_celsius + 273.15;
    default:
      return this.temperature_celsius;
  }
};


MedicalRecordSchema.methods.validateVitalSigns = function(this: IMedicalRecord): { valid: boolean; messages: string[] } {
  const messages: string[] = [];
  
  
  if (this.temperature_celsius) {
    if (this.temperature_celsius < 36.0 || this.temperature_celsius > 42.0) {
      messages.push('Temperature may be abnormal for most mammals');
    }
  }
  
  
  if (this.heart_rate_bpm) {
    if (this.heart_rate_bpm < 40 || this.heart_rate_bpm > 300) {
      messages.push('Heart rate may be outside normal range for most animals');
    }
  }
  
  
  if (this.respiratory_rate_per_min) {
    if (this.respiratory_rate_per_min < 8 || this.respiratory_rate_per_min > 60) {
      messages.push('Respiratory rate may be abnormal for most mammals');
    }
  }
  
  return {
    valid: messages.length === 0,
    messages
  };
};


MedicalRecordSchema.methods.getAnimalDetails = async function(this: IMedicalRecord) {
  return await this.populate({
    path: 'animal_id',
    select: 'name species sex age microchip_id extra_attributes'
  });
};


MedicalRecordSchema.methods.scheduleFollowUp = async function(this: IMedicalRecord, date: Date): Promise<IMedicalRecord> {
  this.follow_up_required = true;
  this.follow_up_date = date;
  return await this.save();
};


MedicalRecordSchema.methods.isVitalSignAbnormal = function(this: IMedicalRecord, vitalSign: string): boolean {
  switch (vitalSign.toLowerCase()) {
    case 'temperature':
      return !!(this.temperature_celsius && (this.temperature_celsius < 36.0 || this.temperature_celsius > 42.0));
    case 'heart_rate':
      return !!(this.heart_rate_bpm && (this.heart_rate_bpm < 40 || this.heart_rate_bpm > 300));
    case 'respiratory_rate':
      return !!(this.respiratory_rate_per_min && (this.respiratory_rate_per_min < 8 || this.respiratory_rate_per_min > 60));
    default:
      return false;
  }
};


MedicalRecordSchema.pre('save', async function(next) {
  try {
    
    if (this.follow_up_required && !this.follow_up_date) {
      throw new Error('Follow-up date is required when follow-up is marked as required');
    }
    
    if (!this.follow_up_required && this.follow_up_date) {
      this.follow_up_date = undefined; 
    }
    
    next();
  } catch (error) {
    next(error as Error);
  }
});

MedicalRecordSchema.statics.findByAnimal = function(animalId: mongoose.Types.ObjectId) {
  return this.find({ animal_id: animalId }).sort({ examination_date: -1 });
};


MedicalRecordSchema.statics.findByExaminationType = function(type: string) {
  return this.find({ examination_type: type }).sort({ examination_date: -1 });
};


MedicalRecordSchema.statics.findEmergencyRecords = function() {
  return this.find({ examination_type: 'emergency' }).sort({ examination_date: -1 });
};


MedicalRecordSchema.statics.findRequiringFollowUp = function() {
  return this.find({ follow_up_required: true }).sort({ follow_up_date: 1 });
};


MedicalRecordSchema.statics.findOverdueFollowUps = function() {
  const today = new Date();
  return this.find({
    follow_up_required: true,
    follow_up_date: { $lt: today }
  }).sort({ follow_up_date: 1 });
};


MedicalRecordSchema.statics.findByVeterinarian = function(veterinarianName: string) {
  return this.find({ 
    veterinarian_name: new RegExp(veterinarianName, 'i') 
  }).sort({ examination_date: -1 });
};


MedicalRecordSchema.statics.findRecent = function(days: number = 30) {
  const cutoffDate = new Date();
  cutoffDate.setDate(cutoffDate.getDate() - days);
  return this.find({ 
    examination_date: { $gte: cutoffDate } 
  }).sort({ examination_date: -1 });
};


MedicalRecordSchema.statics.getMedicalHistory = function(animalId: mongoose.Types.ObjectId) {
  return this.find({ animal_id: animalId })
    .sort({ examination_date: -1 })
    .populate('animal_id', 'name species microchip_id');
};


MedicalRecordSchema.statics.findAbnormalVitals = function() {
  return this.find({
    $or: [
      { temperature_celsius: { $lt: 36.0 } },
      { temperature_celsius: { $gt: 42.0 } },
      { heart_rate_bpm: { $lt: 40 } },
      { heart_rate_bpm: { $gt: 300 } },
      { respiratory_rate_per_min: { $lt: 8 } },
      { respiratory_rate_per_min: { $gt: 60 } }
    ]
  }).sort({ examination_date: -1 });
};


MedicalRecordSchema.statics.getExaminationStats = function() {
  return this.aggregate([
    {
      $group: {
        _id: '$examination_type',
        count: { $sum: 1 },
        avg_weight: { $avg: '$weight_kg' },
        avg_temperature: { $avg: '$temperature_celsius' },
        avg_heart_rate: { $avg: '$heart_rate_bpm' },
        follow_ups_required: {
          $sum: { $cond: ['$follow_up_required', 1, 0] }
        }
      }
    },
    { $sort: { count: -1 } }
  ]);
};


export interface IMedicalRecordModel extends mongoose.Model<IMedicalRecord> {
  findByAnimal(animalId: mongoose.Types.ObjectId): Promise<IMedicalRecord[]>;
  findByExaminationType(type: string): Promise<IMedicalRecord[]>;
  findEmergencyRecords(): Promise<IMedicalRecord[]>;
  findRequiringFollowUp(): Promise<IMedicalRecord[]>;
  findOverdueFollowUps(): Promise<IMedicalRecord[]>;
  findByVeterinarian(veterinarianName: string): Promise<IMedicalRecord[]>;
  findRecent(days?: number): Promise<IMedicalRecord[]>;
  getMedicalHistory(animalId: mongoose.Types.ObjectId): Promise<IMedicalRecord[]>;
  findAbnormalVitals(): Promise<IMedicalRecord[]>;
  getExaminationStats(): Promise<any[]>;
}

export const MedicalRecord = mongoose.model<IMedicalRecord, IMedicalRecordModel>('MedicalRecord', MedicalRecordSchema);
