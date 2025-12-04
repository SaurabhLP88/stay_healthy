import { API_URL } from "../config";

export async function sendNotification(token, doctor, appointmentData, title = "Appointment Booked") {

   const formatDate = (d) => {
    if (!d) return "";

    // If input is YYYY-MM-DD
    if (d.includes("-")) {
      const [year, month, day] = d.split("-");
      return `${day}/${month}/${year}`;
    }

    // If input is MM/DD/YYYY
    if (d.includes("/")) {
      const [month, day, year] = d.split("/");
      return `${day}/${month}/${year}`;
    }

    return d;
  };

  try {
    const message = `
      <p><b>Doctor:</b> ${doctor.name}</p>
      <p><b>Speciality:</b> ${doctor.speciality}</p>
      <p><b>Patient:</b> ${appointmentData.patientName}</p>
      <p><b>Phone:</b> ${appointmentData.phoneNumber}</p>
      <p><b>Date:</b> ${formatDate(appointmentData.appointmentDate)}</p>
      <p><b>Time:</b> ${appointmentData.appointmentTime}</p>
    `.trim();

    console.log("📤 Sending Notification →", {
      title,
      appointmentId: appointmentData._id || appointmentData.id,
      message
    });

    const res = await fetch(`${API_URL}/api/notifications`, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
        "Authorization": `Bearer ${token}`
      },
      body: JSON.stringify({
        title,
        message,
        appointmentId: appointmentData._id || appointmentData.id
      })
    });

    const json = await res.json();
    const created = json.notify ?? json.notification ?? json;

    console.log("📥 Notification Created:", created);

    window.dispatchEvent(new CustomEvent("new-notification", { detail: created }));

    //alert(`Instant Appointment booked for ${appointmentData.patientName} with ${doctor.name}`);

    return created;
  } catch (err) {
    console.error("❌ Notification error:", err);
  }
}
