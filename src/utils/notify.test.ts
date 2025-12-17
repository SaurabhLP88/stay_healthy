import { sendNotification } from "./notify";
import { API_URL } from "../config";

/**
 * Mock global fetch
 */
global.fetch = jest.fn();

/**
 * Spy on window.dispatchEvent
 */
const dispatchEventSpy = jest.spyOn(window, "dispatchEvent");

describe("sendNotification", () => {
  const token = "fake-jwt-token";

  const doctor = {
    name: "Dr. Sharma",
    speciality: "Cardiology",
  };

  const appointmentData = {
    _id: "appt123",
    patientName: "Rahul Kumar",
    phoneNumber: "9999999999",
    appointmentDate: "2025-01-20",
    appointmentTime: "10:30 AM",
  };

  beforeEach(() => {
    jest.clearAllMocks();
  });

  it("should send notification and return created notification", async () => {
    const mockResponse = {
      notify: {
        _id: "notif123",
        title: "Appointment Booked",
        message: "mock-message",
        appointmentId: "appt123",
      },
    };

    (fetch as jest.Mock).mockResolvedValueOnce({
      json: jest.fn().mockResolvedValue(mockResponse),
    });

    const result = await sendNotification(
      token,
      doctor,
      appointmentData
    );

    // fetch called correctly
    expect(fetch).toHaveBeenCalledTimes(1);
    expect(fetch).toHaveBeenCalledWith(
      `${API_URL}/api/notifications`,
      expect.objectContaining({
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${token}`,
        },
      })
    );

    // correct response returned
    expect(result).toEqual(mockResponse.notify);

    // CustomEvent dispatched
    expect(dispatchEventSpy).toHaveBeenCalledTimes(1);
    expect(dispatchEventSpy.mock.calls[0][0].type).toBe("new-notification");
  });

  it("should handle response when backend returns notification directly", async () => {
    const mockResponse = {
      _id: "notif456",
      title: "Appointment Booked",
      appointmentId: "appt123",
    };

    (fetch as jest.Mock).mockResolvedValueOnce({
      json: jest.fn().mockResolvedValue(mockResponse),
    });

    const result = await sendNotification(
      token,
      doctor,
      appointmentData
    );

    expect(result).toEqual(mockResponse);
  });

  it("should use appointmentData.id if _id is missing", async () => {
    const dataWithIdOnly = {
      ...appointmentData,
      _id: undefined,
      id: "fallback-id",
    };

    (fetch as jest.Mock).mockResolvedValueOnce({
      json: jest.fn().mockResolvedValue({}),
    });

    await sendNotification(
      token,
      doctor,
      dataWithIdOnly
    );

    const body = JSON.parse(
      (fetch as jest.Mock).mock.calls[0][1].body
    );

    expect(body.appointmentId).toBe("fallback-id");
  });

  it("should return undefined and log error when fetch fails", async () => {
    const consoleSpy = jest
      .spyOn(console, "error")
      .mockImplementation(() => {});

    (fetch as jest.Mock).mockRejectedValueOnce(
      new Error("Network error")
    );

    const result = await sendNotification(
      token,
      doctor,
      appointmentData
    );

    expect(result).toBeUndefined();
    expect(consoleSpy).toHaveBeenCalled();

    consoleSpy.mockRestore();
  });

  it("should format date correctly in message (YYYY-MM-DD → DD/MM/YYYY)", async () => {
    (fetch as jest.Mock).mockResolvedValueOnce({
      json: jest.fn().mockResolvedValue({}),
    });

    await sendNotification(
      token,
      doctor,
      appointmentData
    );

    const body = JSON.parse(
      (fetch as jest.Mock).mock.calls[0][1].body
    );

    expect(body.message).toContain("20/01/2025");
  });
});
