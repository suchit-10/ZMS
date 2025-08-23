

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
    index: true
  },

  examination_type: {
    type: String,
    required: true,
    index: true
  },

  veterinarian_name: {
    type: String,
    required: true,
    index: true
  },

  weight_kg: {
    type: Number,
    required: false
  },

  temperature_celsius: {
    type: Number,
    required: false
  },

  heart_rate_bpm: {
    type: Number,
    required: false
  },

  respiratory_rate_per_min: {
    type: Number,
    required: false
  },

  symptoms: {
    type: String,
    required: false
  },

  diagnosis: {
    type: String,
    required: false
  },

  treatment: {
    type: String,
    required: false
  },

  medications: {
    type: String,
    required: false
  },

  follow_up_required: {
    type: Boolean,
    default: false,
    index: true
  },

  follow_up_date: {
    type: Date,
    required: false,
  },

  notes: {
    type: String,
    required: false
  },

  extra_attributes: {
    type: Schema.Types.Mixed,
    default: {}
  }
}, {
  timestamps: true,
  versionKey: false,
  collection: 'medical_records'
});

MedicalRecordSchema.index({ animal_id: 1, examination_date: -1 });

export const MedicalRecord = mongoose.model<IMedicalRecord>('MedicalRecord', MedicalRecordSchema);
