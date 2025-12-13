export interface NextAppointment {
  patient: string;
  phone: string;
  date: string;
  time: string;
}

export interface DoctorStats {
  today: number;
  pending: number;
  completed: number;
  cancelled: number;
  totalInstantAppointments: number;
  totalScheduledAppointments: number;

  doctor: {
    name: string;
    image: string;
    speciality: string;
    phone: string;
    experience: number;
    email: string;
  };

  next?: {
    date: string;
    time: string;
    patient: string;
    phone: string;
    bookingType: "instant" | "scheduled";
  };
}

