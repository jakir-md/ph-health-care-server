import { Prisma } from "@prisma/client";
import { IOptions, paginationHelper } from "../../helper/paginationHelper";
import { doctorSearchAbleFields } from "./doctor.constant";
import { prisma } from "../../shared/prisma";
import { IDoctorUpdateType } from "./doctor.interface";

const getAllDoctorsFromDb = async (filters: any, options: IOptions) => {
  const { page, limit, skip, sortOrder, sortBy } =
    paginationHelper.calculatePagination(options);
  const { searchTerm, specialties, ...filterData } = filters;

  const andConditions: Prisma.DoctorWhereInput[] = [];

  if (searchTerm) {
    andConditions.push({
      OR: doctorSearchAbleFields.map((field) => ({
        [field]: {
          contains: searchTerm,
          mode: "insensitive",
        },
      })),
    });
  }

  if (specialties && specialties.length) {
    andConditions.push({
      doctorSpecialties: {
        some: {
          specialities: {
            title: {
              contains: specialties,
              mode: "insensitive",
            },
          },
        },
      },
    });
  }

  if (Object.keys(filterData).length > 0) {
    andConditions.push({
      AND: Object.keys(filterData).map((item) => ({
        [item]: {
          equals: (filterData as any)[item],
        },
      })),
    });
  }

  const whereConditions =
    andConditions.length > 0 ? { AND: andConditions } : {};
  const result = await prisma.doctor.findMany({
    where: whereConditions,
    skip,
    take: limit,
    orderBy: {
      [sortBy]: sortOrder,
    },
    include: {
      doctorSpecialties: {
        include: {
          specialities: true,
        },
      },
    },
  });

  const total = await prisma.doctor.count({
    where: whereConditions,
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

const updateDoctorInDb = async (
  id: string,
  payload: Partial<IDoctorUpdateType>
) => {
  const doctor = await prisma.doctor.findUniqueOrThrow({
    where: {
      id: id,
    },
  });

  const { specialties, ...doctorInfo } = payload;

  if (specialties && specialties.length) {
    const deleteSpecialtyIds = specialties!.filter((item) => item.isDeleted);

    for (const specialty of deleteSpecialtyIds) {
      await prisma.doctorSpecialties.deleteMany({
        where: {
          doctorId: id,
          specialitiesId: specialty.specialtyId,
        },
      });
    }

    const createSpecialtyIds = specialties!.filter((item) => !item.isDeleted);
    for (const specialty of createSpecialtyIds) {
      await prisma.doctorSpecialties.create({
        data: {
          doctorId: id,
          specialitiesId: specialty.specialtyId,
        },
      });
    }
  }

  const updatedDoctorInfo = await prisma.doctor.update({
    where: {
      id: id,
    },
    data: doctorInfo,
    include: {
      doctorSpecialties: {
        include: {
          specialities: true,
        },
      },
    },
  });

  return updatedDoctorInfo;
};

export const doctorServices = {
  getAllDoctorsFromDb,
  updateDoctorInDb,
};
