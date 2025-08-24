import mongoose, { Schema, Document } from 'mongoose';

export interface IAnimalTransfer extends Document {
  _id: mongoose.Types.ObjectId;
  animal_id: mongoose.Types.ObjectId;
  from_enclosure_id?: mongoose.Types.ObjectId;
  to_enclosure_id: mongoose.Types.ObjectId;
  transfer_date: Date;
  transfer_time?: string;
  reason?: string;
  authorized_by_staff_id?: mongoose.Types.ObjectId;
  notes?: string;
  createdAt: Date;
  updatedAt: Date;

  is_initial_placement: boolean;
  transfer_duration_days?: number;
  
  getTransferDetails(): Promise<{
    animal: any;
    from_enclosure?: any;
    to_enclosure: any;
    authorized_by?: any;
  }>;
  validateTransfer(): { valid: boolean; message?: string };
}

const AnimalTransferSchema = new Schema<IAnimalTransfer>({
  animal_id: {
    type: Schema.Types.ObjectId,
    ref: 'Animal',
    required: true,
    index: true
  },

  from_enclosure_id: {
    type: Schema.Types.ObjectId,
    ref: 'Enclosure',
    required: false,
    index: true
  },

  to_enclosure_id: {
    type: Schema.Types.ObjectId,
    ref: 'Enclosure',
    required: true,
    index: true,
    validate: {
      validator: function(this: IAnimalTransfer, v: mongoose.Types.ObjectId) {
        
        return !this.from_enclosure_id || !v.equals(this.from_enclosure_id);
      },
      message: 'Animal cannot be transferred to the same enclosure'
    }
  },

  transfer_date: {
    type: Date,
    required: true,
    index: true,
    validate: {
      validator: function(v: Date) {
        
        const today = new Date();
        today.setHours(23, 59, 59, 999);
        return v <= today;
      },
      message: 'Transfer date cannot be in the future'
    }
  },

  transfer_time: {
    type: String,
    required: false,
    validate: {
      validator: function(v: string) {
        if (!v) return true;
        const timePattern = /^([0-1]?[0-9]|2[0-3]):[0-5][0-9](:[0-5][0-9])?$/;
        return timePattern.test(v);
      },
      message: 'Transfer time must be in HH:MM or HH:MM:SS format'
    }
  },

  reason: {
    type: String,
    required: false,
    trim: true,
    maxlength: 200,
    enum: {
      values: [
        'routine_rotation',
        'medical_treatment',
        'behavioral_management',
        'breeding_program',
        'quarantine',
        'maintenance',
        'veterinary_care',
        'socialization',
        'enrichment',
        'emergency',
        'other'
      ],
      message: 'Invalid transfer reason'
    }
  },

  authorized_by_staff_id: {
    type: Schema.Types.ObjectId,
    ref: 'Staff', 
    required: false,
    index: true
  },

  notes: {
    type: String,
    required: false,
    trim: true,
    maxlength: 1000
  }
}, {
  timestamps: true,
  versionKey: false,
  collection: 'animal_transfers'
});


AnimalTransferSchema.index({ animal_id: 1, transfer_date: -1 });
AnimalTransferSchema.index({ from_enclosure_id: 1, transfer_date: -1 });
AnimalTransferSchema.index({ to_enclosure_id: 1, transfer_date: -1 });
AnimalTransferSchema.index({ authorized_by_staff_id: 1, transfer_date: -1 });
AnimalTransferSchema.index({ reason: 1, transfer_date: -1 });


AnimalTransferSchema.virtual('is_initial_placement').get(function(this: IAnimalTransfer) {
  return !this.from_enclosure_id;
});


AnimalTransferSchema.virtual('transfer_duration_days').get(function(this: IAnimalTransfer) {
  const today = new Date();
  const transferDate = new Date(this.transfer_date);
  const diffInMs = today.getTime() - transferDate.getTime();
  return Math.floor(diffInMs / (1000 * 60 * 60 * 24));
});


AnimalTransferSchema.methods.getTransferDetails = async function(this: IAnimalTransfer) {
  const populatedTransfer = await this.populate([
    { path: 'animal_id', select: 'name species microchip_id' },
    { path: 'from_enclosure_id', select: 'enclosure_name enclosure_type' },
    { path: 'to_enclosure_id', select: 'enclosure_name enclosure_type' },
    { path: 'authorized_by_staff_id', select: 'name employee_id' }
  ]);

  return {
    animal: populatedTransfer.animal_id,
    from_enclosure: populatedTransfer.from_enclosure_id,
    to_enclosure: populatedTransfer.to_enclosure_id,
    authorized_by: populatedTransfer.authorized_by_staff_id
  };
};


AnimalTransferSchema.methods.validateTransfer = function(this: IAnimalTransfer): { valid: boolean; message?: string } {
  
  if (this.from_enclosure_id && this.to_enclosure_id.equals(this.from_enclosure_id)) {
    return {
      valid: false,
      message: 'Animal cannot be transferred to the same enclosure'
    };
  }

  const oneYearAgo = new Date();
  oneYearAgo.setFullYear(oneYearAgo.getFullYear() - 1);
  
  if (this.transfer_date < oneYearAgo) {
    return {
      valid: false,
      message: 'Transfer date cannot be more than one year in the past'
    };
  }

  return { valid: true };
};

AnimalTransferSchema.pre('save', async function(next) {
  try {
    const validation = this.validateTransfer();
    if (!validation.valid) {
      throw new Error(validation.message);
    }
    next();
  } catch (error) {
    next(error as Error);
  }
});

AnimalTransferSchema.statics.findByAnimal = function(animalId: mongoose.Types.ObjectId) {
  return this.find({ animal_id: animalId }).sort({ transfer_date: -1 });
};

AnimalTransferSchema.statics.findFromEnclosure = function(enclosureId: mongoose.Types.ObjectId) {
  return this.find({ from_enclosure_id: enclosureId }).sort({ transfer_date: -1 });
};

AnimalTransferSchema.statics.findToEnclosure = function(enclosureId: mongoose.Types.ObjectId) {
  return this.find({ to_enclosure_id: enclosureId }).sort({ transfer_date: -1 });
};

AnimalTransferSchema.statics.findRecent = function(days: number = 30) {
  const cutoffDate = new Date();
  cutoffDate.setDate(cutoffDate.getDate() - days);
  return this.find({ 
    transfer_date: { $gte: cutoffDate } 
  }).sort({ transfer_date: -1 });
};

AnimalTransferSchema.statics.findByReason = function(reason: string) {
  return this.find({ reason }).sort({ transfer_date: -1 });
};

AnimalTransferSchema.statics.findByStaff = function(staffId: mongoose.Types.ObjectId) {
  return this.find({ authorized_by_staff_id: staffId }).sort({ transfer_date: -1 });
};

AnimalTransferSchema.statics.getCurrentLocation = function(animalId: mongoose.Types.ObjectId) {
  return this.findOne({ animal_id: animalId })
    .sort({ transfer_date: -1, createdAt: -1 })
    .populate('to_enclosure_id', 'enclosure_name enclosure_type');
};

AnimalTransferSchema.statics.getTransferHistory = function(animalId: mongoose.Types.ObjectId) {
  return this.find({ animal_id: animalId })
    .sort({ transfer_date: -1 })
    .populate([
      { path: 'from_enclosure_id', select: 'enclosure_name enclosure_type' },
      { path: 'to_enclosure_id', select: 'enclosure_name enclosure_type' },
      { path: 'authorized_by_staff_id', select: 'name employee_id' }
    ]);
};

export interface IAnimalTransferModel extends mongoose.Model<IAnimalTransfer> {
  findByAnimal(animalId: mongoose.Types.ObjectId): Promise<IAnimalTransfer[]>;
  findFromEnclosure(enclosureId: mongoose.Types.ObjectId): Promise<IAnimalTransfer[]>;
  findToEnclosure(enclosureId: mongoose.Types.ObjectId): Promise<IAnimalTransfer[]>;
  findRecent(days?: number): Promise<IAnimalTransfer[]>;
  findByReason(reason: string): Promise<IAnimalTransfer[]>;
  findByStaff(staffId: mongoose.Types.ObjectId): Promise<IAnimalTransfer[]>;
  getCurrentLocation(animalId: mongoose.Types.ObjectId): Promise<IAnimalTransfer | null>;
  getTransferHistory(animalId: mongoose.Types.ObjectId): Promise<IAnimalTransfer[]>;
}

export const AnimalTransfer = mongoose.model<IAnimalTransfer, IAnimalTransferModel>('AnimalTransfer', AnimalTransferSchema);
