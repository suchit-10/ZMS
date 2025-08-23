import mongoose, { Schema, Document } from "mongoose";

export interface IBehavioralObservation extends Document {
  _id: mongoose.Types.ObjectId;
  animal_id: mongoose.Types.ObjectId;
  observation_at: Date; // stored as HH:MM[:SS]
  observer_staff_id?: mongoose.Types.ObjectId;
  behavior_category: 'feeding' | 'social' | 'reproductive' | 'aggressive' | 'play' | 'rest' | 'exploration' | 'abnormal';
  behavior_description: string;
  duration_minutes?: number;
  environmental_factors?: string;
  severity: "normal" | "concerning" | "critical";
  follow_up_required: boolean;
  createdAt: Date;
  updatedAt: Date;

  // Methods
  getObservationDetails(): Promise<{
    animal: any;
    observer?: any;
  }>;
}

const BehavioralObservationSchema = new Schema<IBehavioralObservation>(
  {
    animal_id: {
      type: Schema.Types.ObjectId,
      ref: "Animal",
      required: true,
      index: true,
    },

    observation_at: {
      type: Date,
      required: true,
      index: true,
    },

    observer_staff_id: {
      type: Schema.Types.ObjectId,
      ref: "User",
      required: false,
      index: true,
    },

    behavior_category: {
      type: String,
      required: true,
    },

    behavior_description: {
      type: String,
      required: true,
    },

    duration_minutes: {
      type: Number,
    },

    environmental_factors: {
      type: String,
    },

    severity: {
      type: String,
      default: "normal",
    },

    follow_up_required: {
      type: Boolean,
      default: false,
    },
  },
  {
    timestamps: true,
    versionKey: false,
    collection: "behavioral_observations",
  }
);

// 🔎 Indexes
BehavioralObservationSchema.index({ animal_id: 1, observation_at: -1 });
BehavioralObservationSchema.index({ observer_staff_id: 1, observation_at: -1 });
BehavioralObservationSchema.index({ behavior_category: 1, observation_at: -1 });
BehavioralObservationSchema.index({ severity: 1, observation_at: -1 });


// ✅ Methods
BehavioralObservationSchema.methods.getObservationDetails = async function (this: IBehavioralObservation) {
  const populated = await this.populate([
    { path: "animal_id", select: "name species microchip_id" },
    { path: "observer_staff_id", select: "name employee_id role" },
  ]);

  return {
    animal: populated.animal_id,
    observer: populated.observer_staff_id,
  };
};


export const BehavioralObservation = mongoose.model<IBehavioralObservation>(
  "BehavioralObservation",
  BehavioralObservationSchema
);
