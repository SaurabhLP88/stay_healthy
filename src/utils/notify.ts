import { API_URL } from "../config";

export interface DoctorInfo {
  name: string;
  speciality: string;
}

export interface AppointmentNotificationData {
  _id?: string;
  id?: string;
  patientName: string;
  phoneNumber: string;
  appointmentDate: string;
  appointmentTime: string;
}

export interface NotificationResponse {
  _id?: string;
  title?: string;
  message?: string;
  appointmentId?: string;
  createdAt?: string;
}

const formatDate = (d: string): string => {
  if (!d) return "";

  // YYYY-MM-DD
  if (d.includes("-")) {
    const [year, month, day] = d.split("-");
    return `${day}/${month}/${year}`;
  }

  // MM/DD/YYYY
  if (d.includes("/")) {
    const [month, day, year] = d.split("/");
    return `${day}/${month}/${year}`;
  }

  return d;
};

export async function sendNotification(
  token: string,
  doctor: DoctorInfo,
  appointmentData: AppointmentNotificationData,
  title: string = "Appointment Booked"
): Promise<NotificationResponse | undefined> {
  try {
    const message = `
      <p><b>Doctor:</b> ${doctor.name}</p>
      <p><b>Speciality:</b> ${doctor.speciality}</p>
      <p><b>Patient:</b> ${appointmentData.patientName}</p>
      <p><b>Phone:</b> ${appointmentData.phoneNumber}</p>
      <p><b>Date:</b> ${formatDate(appointmentData.appointmentDate)}</p>
      <p><b>Time:</b> ${appointmentData.appointmentTime}</p>
    `.trim();

    const appointmentId =
      appointmentData._id ?? appointmentData.id ?? "";

    console.log("📤 Sending Notification →", {
      title,
      appointmentId,
      message
    });

    const res = await fetch(`${API_URL}/api/notifications`, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
        "Authorization": `Bearer ${token}`,
      },
      body: JSON.stringify({
        title,
        message,
        appointmentId,
      }),
    });

    const json = await res.json();
    const created: NotificationResponse =
      json.notify ?? json.notification ?? json;

    console.log("📥 Notification Created:", created);

    window.dispatchEvent(
      new CustomEvent<NotificationResponse>("new-notification", {
        detail: created,
      })
    );

    return created;
  } catch (err) {
    console.error("❌ Notification error:", err);
    return undefined;
  }
}
