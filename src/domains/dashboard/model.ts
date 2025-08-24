import mongoose, { Schema, Document, Types } from 'mongoose';

export interface IAnimalOverview {
  totalAnimals: number;
  bySpecies: Record<string, number>;
  byHealthStatus: {
    healthy: number;
    sick: number;
    critical: number;
  };
  newlyOnboarded: {
    week: number;
    month: number;
  };
}

export interface IMedicalStatus {
  recentActivities: {
    animalId: Types.ObjectId;
    animalName: string;
    activityType: 'vaccination' | 'surgery' | 'healthAlert';
    timestamps: boolean;
  };
}

export interface IFeedingDiet {
  dailySchedules: {
    animalId: Types.ObjectId;
    animalName: string;
    feedingTime: Date;
    dietPlan: string;
    status: 'pending' | 'completed';
  };
  lowStockAlerts: {
    foodItem: string;
    currentStock: number;
  };
}

export interface IEnclosureStatus {
  totalEnclosures: number;
  occupied: number;
  available: number;
  temperatureAlerts?: {
    enclosureId: Types.ObjectId;
    currentTemp: number;
    minTemp: number;
    maxTemp: number;
  };
  safetyAlerts?: {
    enclosureId: Types.ObjectId;
    alertType: 'restrictedAccess' | 'breach';
    timestamps: boolean;
  };
}

export interface IActivitiesAlerts {
  recentActivities: {
    activityType: 'onboard' | 'transfer' | 'incident' | 'escape';
    animalId?: Types.ObjectId;
    animalName?: string;
    timestamps: boolean;
  };
  urgentAlerts: {
    alertType: 'injury' | 'diseaseOutbreak';
    animalId?: Types.ObjectId;
    animalName?: string;
    timestamps: boolean;
  };
}

export interface IZooDashboard extends Document {
  animalOverview: IAnimalOverview;
  medicalStatus: IMedicalStatus;
  feedingDiet: IFeedingDiet;
  enclosures: IEnclosureStatus;
  activitiesAlerts: IActivitiesAlerts;
  generatedAt: Date;
}

const AnimalOverviewSchema = new Schema<IAnimalOverview>({
  totalAnimals: { type: Number, required: true },
  bySpecies: { type: Map, of: Number, required: true },
  byHealthStatus: {
    healthy: { type: Number, required: true },
    sick: { type: Number, required: true },
    critical: { type: Number, required: true },
  },
  newlyOnboarded: {
    week: { type: Number, required: true },
    month: { type: Number, required: true },
  },
});

const MedicalStatusSchema = new Schema<IMedicalStatus>({
  recentActivities: {
    animalId: { type: Schema.Types.ObjectId, ref: 'Animal', required: true },
    animalName: { type: String, required: true },
    activityType: { type: String, enum: ['vaccination', 'surgery', 'healthAlert'], required: true },
    timestamps: { type: Boolean, default: true },
  },
});

const FeedingDietSchema = new Schema<IFeedingDiet>({
  dailySchedules: {
    animalId: { type: Schema.Types.ObjectId, ref: 'Animal', required: true },
    animalName: { type: String, required: true },
    feedingTime: { type: Date, required: true },
    dietPlan: { type: String, required: true },
    status: { type: String, enum: ['pending', 'completed'], required: true },
  },
  lowStockAlerts: {
    foodItem: { type: String, required: true },
    currentStock: { type: Number, required: true },
  },
});

const EnclosureStatusSchema = new Schema<IEnclosureStatus>({
  totalEnclosures: { type: Number, required: true },
  occupied: { type: Number, required: true },
  available: { type: Number, required: true },
  temperatureAlerts: {
    enclosureId: { type: Schema.Types.ObjectId, ref: 'Enclosure' },
    currentTemp: { type: Number },
    minTemp: { type: Number },
    maxTemp: { type: Number },
  },
  safetyAlerts: {
    enclosureId: { type: Schema.Types.ObjectId, ref: 'Enclosure' },
    alertType: { type: String, enum: ['restrictedAccess'] },
    timestamps: { type: Boolean, default: true },
  },
});

const ActivitiesAlertsSchema = new Schema<IActivitiesAlerts>({
  recentActivities: {
    activityType: { type: String, enum: ['onboard', 'transfer', 'incident', 'escape'], required: true },
    animalId: { type: Schema.Types.ObjectId, ref: 'Animal' },
    animalName: { type: String },
    timestamps: { type: Boolean, default: true },
  },
  urgentAlerts: {
    alertType: { type: String, enum: ['injury', 'diseaseOutbreak'], required: true },
    animalId: { type: Schema.Types.ObjectId, ref: 'Animal' },
    animalName: { type: String },
    timestamps: { type: Boolean, default: true },
  },
});

const ZooDashboardSchema = new Schema<IZooDashboard>({
  animalOverview: { type: AnimalOverviewSchema, required: true },
  medicalStatus: { type: MedicalStatusSchema, required: true },
  feedingDiet: { type: FeedingDietSchema, required: true },
  enclosures: { type: EnclosureStatusSchema, required: true },
  activitiesAlerts: { type: ActivitiesAlertsSchema, required: true },
  generatedAt: { type: Date, default: Date.now },
});

export const ZooDashboardModel = mongoose.model<IZooDashboard>('ZooDashboard', ZooDashboardSchema);
