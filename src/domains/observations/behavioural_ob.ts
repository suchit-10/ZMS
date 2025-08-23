import mongoose, { Schema, Document } from "mongoose";

export interface IBehavioralObservation extends Document {
  _id: mongoose.Types.ObjectId;
  animal_id: mongoose.Types.ObjectId;
  observation_date: Date;
  observation_time: string; // stored as HH:MM[:SS]
  observer_staff_id?: mongoose.Types.ObjectId;
  behavior_category: 'feeding' | 'social' | 'reproductive' | 'aggressive' | 'play' | 'rest' | 'exploration' | 'abnormal';
  behavior_description: string;
  duration_minutes?: number;
  environmental_factors?: string;
  severity: "normal" | "concerning" | "critical";
  follow_up_required: boolean;
  createdAt: Date;
  updatedAt: Date;

  // Virtuals
  is_abnormal(): boolean;
  needs_follow_up(): boolean;

  // Methods
  getObservationDetails(): Promise<{
    animal: any;
    observer?: any;
  }>;
  validateObservation(): { valid: boolean; message?: string };
}

const BehavioralObservationSchema = new Schema<IBehavioralObservation>(
  {
    animal_id: {
      type: Schema.Types.ObjectId,
      ref: "Animal",
      required: true,
      index: true,
    },

    observation_date: {
      type: Date,
      required: true,
      index: true,
      validate: {
        validator: (v: Date) => v <= new Date(),
        message: "Observation date cannot be in the future",
      },
    },

    observation_time: {
      type: String,
      required: true,
      validate: {
        validator: (v: string) => {
          const timePattern =
            /^([0-1]?[0-9]|2[0-3]):[0-5][0-9](:[0-5][0-9])?$/;
          return timePattern.test(v);
        },
        message: "Observation time must be in HH:MM or HH:MM:SS format",
      },
    },

    observer_staff_id: {
      type: Schema.Types.ObjectId,
      ref: "Staff",
      required: false,
      index: true,
    },

    behavior_category: {
      type: String,
      enum: [
        "feeding",
        "social",
        "reproductive",
        "aggressive",
        "play",
        "rest",
        "exploration",
        "abnormal",
      ],
      required: true,
    },

    behavior_description: {
      type: String,
      required: true,
      trim: true,
    },

    duration_minutes: {
      type: Number,
      min: 0,
    },

    environmental_factors: {
      type: String,
      trim: true,
    },

    severity: {
      type: String,
      enum: ["normal", "concerning", "critical"],
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
BehavioralObservationSchema.index({ animal_id: 1, observation_date: -1 });
BehavioralObservationSchema.index({ observer_staff_id: 1, observation_date: -1 });
BehavioralObservationSchema.index({ behavior_category: 1, observation_date: -1 });
BehavioralObservationSchema.index({ severity: 1, observation_date: -1 });

// ✅ Virtuals
BehavioralObservationSchema.virtual("is_abnormal").get(function (this: IBehavioralObservation) {
  return this.behavior_category === "abnormal" || this.severity !== "normal";
});

BehavioralObservationSchema.virtual("needs_follow_up").get(function (this: IBehavioralObservation) {
  return this.follow_up_required || this.severity === "critical";
});

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

BehavioralObservationSchema.methods.validateObservation = function (
  this: IBehavioralObservation
): { valid: boolean; message?: string } {
  if (this.observation_date > new Date()) {
    return { valid: false, message: "Observation date cannot be in the future" };
  }
  if (!this.behavior_description || this.behavior_description.trim().length < 5) {
    return { valid: false, message: "Behavior description is too short" };
  }
  return { valid: true };
};

// ✅ Pre-save hook
BehavioralObservationSchema.pre("save", function (next) {
  const validation = this.validateObservation();
  if (!validation.valid) {
    return next(new Error(validation.message));
  }
  next();
});

// ✅ Static methods
BehavioralObservationSchema.statics.findByAnimal = function (animalId: mongoose.Types.ObjectId) {
  return this.find({ animal_id: animalId }).sort({ observation_date: -1 });
};

BehavioralObservationSchema.statics.findByStaff = function (staffId: mongoose.Types.ObjectId) {
  return this.find({ observer_staff_id: staffId }).sort({ observation_date: -1 });
};

BehavioralObservationSchema.statics.findByCategory = function (category: string) {
  return this.find({ behavior_category: category }).sort({ observation_date: -1 });
};

BehavioralObservationSchema.statics.findCritical = function () {
  return this.find({ severity: "critical" }).sort({ observation_date: -1 });
};

export interface IBehavioralObservationModel extends mongoose.Model<IBehavioralObservation> {
  findByAnimal(animalId: mongoose.Types.ObjectId): Promise<IBehavioralObservation[]>;
  findByStaff(staffId: mongoose.Types.ObjectId): Promise<IBehavioralObservation[]>;
  findByCategory(category: string): Promise<IBehavioralObservation[]>;
  findCritical(): Promise<IBehavioralObservation[]>;
}

export const BehavioralObservation = mongoose.model<IBehavioralObservation, IBehavioralObservationModel>(
  "BehavioralObservation",
  BehavioralObservationSchema
);
