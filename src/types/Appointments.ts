export type AppointmentStatus =
  | "booked"
  | "completed"
  | "cancelled"
  | "expired"
  | "pending";

export interface Appointment {
  _id: string;
  patientName: string;
  phoneNumber: string;
  doctorName: string;
  doctorId: string;
  doctorSpeciality: string;
  bookingType: "instant" | "scheduled";
  appointmentDate: string;
  appointmentTime: string;
  status: AppointmentStatus;
  hasReview?: boolean;
  reportUrl?: string;
  userId?: string | { _id: string };
  doctor?: { _id: string };
}
