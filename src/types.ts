export interface AgeGroupData {
  group: string;
  count: number;
}

export interface ServiceTypeVolume {
  service: string;
  count: number;
}

export interface PatientDemographics {
  ageGroups: AgeGroupData[];
  serviceTypes: ServiceTypeVolume[];
}

export interface StaffDepartmentData {
  department: string;
  staffCount: number;
  presenceRate: number; // e.g. 92 means 92%
}

export interface DepartmentPerformanceData {
  department: string;
  requestToAdmissionRate: number; // e.g. 75%
  serviceAvailability: number; // e.g. 90%
  satisfactionScore: number; // e.g. 4.2
}

export interface LengthOfStaySatisfactionData {
  serviceType: string;
  averageLOS: number; // e.g. 4.5 days
  averageSatisfaction: number; // e.g. 4.4
}

export interface MonthlyTrendData {
  month: string; // e.g. "January", "February"
  requestToAdmissionRate: number; // %
  serviceAvailability: number; // %
  patientRequests: number;
  admissions: number;
  satisfactionScore: number; // e.g. 1-5 scale or %
  averageLOS: number; // days
  averageSatisfaction: number; // 1-5 scale or %
  dischargeTrend: number; // count
  readmissionRate: number; // %
}

export interface DashboardData {
  period: string; // "01/01/26 – 05/31/26"
  lastUpdated: string;
  patientDemographics: PatientDemographics;
  staffData: StaffDepartmentData[];
  departmentPerformance: DepartmentPerformanceData[];
  lengthOfStaySatisfaction: LengthOfStaySatisfactionData[];
  monthlyTrends: MonthlyTrendData[];
}

export interface AIAnalysis {
  executiveSummary: string;
  redFlags: string[];
  possibleCauses: string[];
  recommendations: string[];
  keyIssuesMonthly: string;
}
