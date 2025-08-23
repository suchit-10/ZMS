export interface OnboardRequest {
  animal: {
    name: string;
    species: string;
    sex: string;
    age: number;
    acquisition_date: string;
    acquisition_type: string;
    identification?: {
      microchip_id?: string;
      tattoo?: string;
    };
    weight?: number;
  };
  enclosure: {
    enclosure_id: string;
    enclosure_name: string;
    enclosure_type: string;
    entry_date: string;
  };
  diet_plan: {
    diet_name: string;
    age_category: "infant" | "juvenile" | "adult" | "senior";
    special_conditions?: string;
    total_calories: number;
  };
  medical_record: {
    initial_checkup_date: string;
    veterinarian: {
      _id: string;
      name: string;
      employee_id: string;
    };
    notes?: string;
  };
}
