import { API_URL } from "../config";

export async function sendNotification(token, doctor, appointmentData, title = "Appointment Booked") {
  try {
    const message = `
      <p><b>Doctor:</b> ${doctor.name}</p>
      <p><b>Speciality:</b> ${doctor.speciality}</p>
      <p><b>Patient:</b> ${appointmentData.patientName}</p>
      <p><b>Phone:</b> ${appointmentData.phoneNumber}</p>
      <p><b>Date:</b> ${appointmentData.appointmentDate}</p>
      <p><b>Time:</b> ${appointmentData.appointmentTime}</p>
    `.trim();

    const res = await fetch(`${API_URL}/api/notifications`, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
        "Authorization": `Bearer ${token}`
      },
      body: JSON.stringify({ title, message })
    });

    const json = await res.json();
    const created = json.notify ?? json.notification ?? json;

    window.dispatchEvent(new CustomEvent("new-notification", { detail: created }));

    return created;
  } catch (err) {
    console.error("❌ Notification error:", err);
  }
}
