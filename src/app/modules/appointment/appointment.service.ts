import { prisma } from "../../shared/prisma";
import { IJWTUser } from "../types/common";
import { v4 as uuidv4 } from "uuid";

const createAppointment = async (
  user: IJWTUser,
  payload: {
    doctorId: string;
    scheduleId: string;
  }
) => {
  console.log({ doctorId: payload.doctorId, scheduleId: payload.scheduleId });
  const patient = await prisma.patient.findFirstOrThrow({
    where: {
      email: user?.email,
    },
  });
  const doctor = await prisma.doctor.findFirstOrThrow({
    where: {
      id: payload.doctorId,
      isDeleted: false,
    },
  });

  const schedule = await prisma.doctorSchedules.findFirstOrThrow({
    where: {
      scheduleId: payload.scheduleId,
      doctorId: payload.doctorId,
      isBooked: false,
    },
  });
  console.log(schedule);

  const apointmentData = {
    patientId: patient.id,
    scheduleId: payload.scheduleId,
    doctorId: doctor.id,
    videoCallingId: uuidv4(),
  };

  return await prisma.$transaction(async (tnx) => {
    const bookedAppointment = await tnx.appointment.create({
      data: apointmentData,
    });

    await tnx.doctorSchedules.update({
      where: {
        doctorId_scheduleId: {
          doctorId: payload.doctorId,
          scheduleId: payload.scheduleId,
        },
      },
      data: {
        isBooked: true,
      },
    });

    await tnx.payment.create({
      data: {
        appointmentId: bookedAppointment.id,
        amount: doctor.appointmentFee,
        transactionId: uuidv4(),
      },
    });
    return bookedAppointment;
  });
};

export const appointmentServices = {
  createAppointment,
};
