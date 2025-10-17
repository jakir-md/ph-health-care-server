import { addHours, addMinutes, format } from "date-fns";
import { prisma } from "../../shared/prisma";
import { IOptions, paginationHelper } from "../../helper/paginationHelper";
import { Prisma } from "@prisma/client";
import { IJWTUser } from "../types/common";

const insertIntoDB = async (payload: any) => {
  const { startDate, endDate, startTime, endTime } = payload;
  const currentDate = new Date(startDate);
  const finalDate = new Date(endDate);
  const timeInterval = 30;

  const schedules = [];
  while (currentDate <= finalDate) {
    const todayStartTime = new Date(
      addMinutes(
        addHours(
          `${format(currentDate, "yyyy-MM-dd")}`,
          Number(startTime.split(":")[0])
        ),
        Number(startTime.split(":")[1])
      )
    );

    const todayEndTime = new Date(
      addMinutes(
        addHours(
          `${format(currentDate, "yyyy-MM-dd")}`,
          Number(endTime.split(":")[0])
        ),
        Number(endTime.split(":")[1])
      )
    );

    while (todayStartTime <= todayEndTime) {
      const slotStartDateTime = todayStartTime;
      const slotEndDateTime = addMinutes(todayStartTime, timeInterval);

      const scheduleData = {
        startDateTime: slotStartDateTime,
        endDateTime: slotEndDateTime,
      };

      const existingSchedule = await prisma.schedule.findFirst({
        where: scheduleData,
      });

      if (!existingSchedule) {
        const result = await prisma.schedule.create({
          data: scheduleData,
        });
        schedules.push(result);
      }

      todayStartTime.setMinutes(todayStartTime.getMinutes() + timeInterval);
    }

    currentDate.setDate(currentDate.getDate() + 1);
  }
  return schedules;
};

const schedulesForDoctor = async (
  user: IJWTUser,
  options: IOptions,
  fillters: any
) => {
  const { skip, page, limit, sortBy, sortOrder } =
    paginationHelper.calculatePagination(options);
  const { startDateTime, endDateTime } = fillters;

  const andConditions: Prisma.ScheduleWhereInput[] = [];
  if (startDateTime && endDateTime) {
    andConditions.push({
      AND: [
        {
          startDateTime: {
            gte: startDateTime,
          },
        },
        {
          endDateTime: {
            lte: endDateTime,
          },
        },
      ],
    });
  }

  const whereConditions: Prisma.ScheduleWhereInput =
    andConditions.length > 0
      ? {
          AND: andConditions,
        }
      : {};

  const doctorExistingSchedules = await prisma.doctorSchedules.findMany({
    where: {
      doctor: {
        email: user?.email,
      },
    },
    select: {
      scheduleId: true,
    },
  });

  //jei schedule gula age assign hoise tader id
  const existingScheduleIds = doctorExistingSchedules.map(
    (item) => item.scheduleId
  );

  const result = await prisma.schedule.findMany({
    where: {
      ...whereConditions,
      id: {
        notIn: existingScheduleIds,
      },
    },
    skip,
    take: limit,
    orderBy: {
      [sortBy]: sortOrder,
    },
  });

  const total = await prisma.schedule.count({
    where: {
      ...whereConditions,
      id: {
        notIn: existingScheduleIds,
      },
    },
  });
  return {
    data: result,
    meta: {
      page,
      limit,
      total,
    },
  };
};

const deleteSchedules = async (id: string) => {
  return await prisma.schedule.delete({
    where: {
      id: id,
    },
  });
};
export const ScheduleServices = {
  insertIntoDB,
  schedulesForDoctor,
  deleteSchedules,
};
