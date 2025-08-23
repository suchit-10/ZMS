import mongoose, { Schema, Document } from "mongoose";

const DietItemSchema = new Schema({
  foodItem: { type: String, required: true },
  quantityInGrams: { type: Number, required: true },
  feedingTime: { type: String, required: true },
  preparationInstructions: { type: String },
  nutritionalNotes: { type: String },
});


const DietPlanSchema = new Schema({
  dietName: { type: String, required: true },
  ageCategory: { type: String, enum: ["adult", "senior"], default: "adult" },
  specialConditions: { type: String },
  totalCaloriesPerDay: { type: Number },
  feedingFrequencyPerDay: { type: Number },
  dietItems: [DietItemSchema],
});


const EnclosureSchema = new Schema({
  enclosureName: { type: String, required: true },
  enclosureType: { type: String, enum: ["indoor", "outdoor", "mixed"], required: true },
  areaSquareMeters: { type: Number },
  capacityMax: { type: Number },
  climateControlled: { type: Boolean, default: false },
  temperatureMinCelsius: { type: Number },
  temperatureMaxCelsius: { type: Number },
  humidityMinPercent: { type: Number },
  humidityMaxPercent: { type: Number },
  safetyLevel: { type: String, enum: ["restrictedAccess", "quarantine", "hospital"] },
  locationCoordinates: { type: String },
  constructionDate: { type: Date },
  lastMaintenanceDate: { type: Date },
  status: { type: String, enum: ["active", "maintenance", "closed"], default: "active" },
});


export interface IAnimal extends Document {
  name: string;
  species: string;
  sex: string;
  age: number;
  acquisitionDate: Date;
  acquisitionType: string;
  dateOfDeath?: Date;
  causeOfDeath?: string;
  distinguishingMarks?: string;
  images: string;
  microchipId?: string;
  weight:number;
  extraAttributes?: Record<string, any>;
  createdAt: Date;
  updatedAt: Date;

  enclosure: typeof EnclosureSchema;
  dietPlan: typeof DietPlanSchema;
}

const AnimalSchema = new Schema<IAnimal>({
  name: { type: String, required: true },
  species: { type: String, required: true },
  sex: { type: String, required: true },
  age: { type: Number, required: true },
  acquisitionDate: { type: Date, required: true },
  acquisitionType: { type: String, required: true },
  dateOfDeath: { type: Date },
  causeOfDeath: { type: String },
  distinguishingMarks: { type: String },
  images: { type: String},
  microchipId: { type: String, unique: true },
  weight:{type:Number,required:true},
  extraAttributes: { type: Schema.Types.Mixed },
  enclosure: { type: EnclosureSchema, required: true },
  dietPlan: { type: DietPlanSchema, required: true },
  
},{
  timestamps:true
});

export const Animal = mongoose.model<IAnimal>("Animal", AnimalSchema);
