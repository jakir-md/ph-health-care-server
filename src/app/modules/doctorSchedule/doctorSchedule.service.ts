import { prisma } from "../../shared/prisma";
import { IJWTUser } from "../types/common";

const addDoctorSchedule = async (
  user: IJWTUser,
  payload: {
    scheduleIds: string[];
  }
) => {
  const doctor = await prisma.doctor.findFirstOrThrow({
    where: {
      email: user?.email,
    },
  });

  const doctorScheduleData = payload.scheduleIds.map((scheduleId) => ({
    doctorId: doctor.id,
    scheduleId,
  }));

  return await prisma.doctorSchedules.createMany({
    data: doctorScheduleData,
  });
};
export const doctorScheduleServices = {
  addDoctorSchedule,
};
