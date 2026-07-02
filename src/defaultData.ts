import { DashboardData } from "./types";

export const defaultDashboardData: DashboardData = {
  period: "01/01/26 – 05/31/26",
  lastUpdated: new Date().toISOString(),
  patientDemographics: {
    ageGroups: [
      { group: "0-18", count: 1240 },
      { group: "19-35", count: 2150 },
      { group: "36-50", count: 3420 },
      { group: "51-65", count: 4890 },
      { group: "66+", count: 6120 }
    ],
    serviceTypes: [
      { service: "Emergency", count: 5800 },
      { service: "Cardiology", count: 2400 },
      { service: "Pediatrics", count: 1900 },
      { service: "Orthopedics", count: 3100 },
      { service: "General Surgery", count: 2800 },
      { service: "ICU", count: 1820 }
    ]
  },
  staffData: [
    { department: "Emergency", staffCount: 120, presenceRate: 88 },
    { department: "Cardiology", staffCount: 45, presenceRate: 94 },
    { department: "Pediatrics", staffCount: 35, presenceRate: 91 },
    { department: "Orthopedics", staffCount: 40, presenceRate: 86 },
    { department: "General Surgery", staffCount: 50, presenceRate: 89 },
    { department: "ICU", staffCount: 65, presenceRate: 84 }
  ],
  departmentPerformance: [
    { department: "Emergency", requestToAdmissionRate: 42, serviceAvailability: 81, satisfactionScore: 3.8 },
    { department: "Cardiology", requestToAdmissionRate: 78, serviceAvailability: 95, satisfactionScore: 4.6 },
    { department: "Pediatrics", requestToAdmissionRate: 60, serviceAvailability: 92, satisfactionScore: 4.5 },
    { department: "Orthopedics", requestToAdmissionRate: 68, serviceAvailability: 87, satisfactionScore: 4.1 },
    { department: "General Surgery", requestToAdmissionRate: 82, serviceAvailability: 89, satisfactionScore: 4.3 },
    { department: "ICU", requestToAdmissionRate: 91, serviceAvailability: 78, satisfactionScore: 3.9 }
  ],
  lengthOfStaySatisfaction: [
    { serviceType: "Emergency", averageLOS: 1.2, averageSatisfaction: 3.8 },
    { serviceType: "Cardiology", averageLOS: 6.8, averageSatisfaction: 4.6 },
    { serviceType: "Pediatrics", averageLOS: 3.1, averageSatisfaction: 4.5 },
    { serviceType: "Orthopedics", averageLOS: 5.4, averageSatisfaction: 4.1 },
    { serviceType: "General Surgery", averageLOS: 4.8, averageSatisfaction: 4.3 },
    { serviceType: "ICU", averageLOS: 8.5, averageSatisfaction: 3.9 }
  ],
  monthlyTrends: [
    {
      month: "January",
      requestToAdmissionRate: 65,
      serviceAvailability: 91,
      patientRequests: 3200,
      admissions: 2080,
      satisfactionScore: 4.3,
      averageLOS: 4.8,
      averageSatisfaction: 4.3,
      dischargeTrend: 1980,
      readmissionRate: 4.2
    },
    {
      month: "February",
      requestToAdmissionRate: 63,
      serviceAvailability: 89,
      patientRequests: 3400,
      admissions: 2140,
      satisfactionScore: 4.2,
      averageLOS: 4.9,
      averageSatisfaction: 4.2,
      dischargeTrend: 2050,
      readmissionRate: 4.5
    },
    {
      month: "March",
      requestToAdmissionRate: 60,
      serviceAvailability: 86,
      patientRequests: 3800,
      admissions: 2280,
      satisfactionScore: 4.0,
      averageLOS: 5.2,
      averageSatisfaction: 4.1,
      dischargeTrend: 2120,
      readmissionRate: 5.1
    },
    {
      month: "April",
      requestToAdmissionRate: 57,
      serviceAvailability: 83,
      patientRequests: 4100,
      admissions: 2337,
      satisfactionScore: 3.9,
      averageLOS: 5.5,
      averageSatisfaction: 3.9,
      dischargeTrend: 2210,
      readmissionRate: 5.8
    },
    {
      month: "May",
      requestToAdmissionRate: 55,
      serviceAvailability: 80,
      patientRequests: 4500,
      admissions: 2475,
      satisfactionScore: 3.8,
      averageLOS: 5.9,
      averageSatisfaction: 3.8,
      dischargeTrend: 2320,
      readmissionRate: 6.4
    }
  ]
};
