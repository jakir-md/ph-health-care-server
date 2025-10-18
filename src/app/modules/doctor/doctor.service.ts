import { Prisma } from "@prisma/client";
import { IOptions, paginationHelper } from "../../helper/paginationHelper";
import { doctorSearchAbleFields } from "./doctor.constant";
import { prisma } from "../../shared/prisma";
import { IDoctorUpdateType } from "./doctor.interface";
import { ApiError } from "../../error/apiError";
import httpStatus from "http-status";
import { openai } from "../../helper/openRouter";
import { extractJsonFromMessage } from "../../helper/extractJSONFromResponse";

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

const getDoctorsAISuggestion = async (payload: { symptoms: string }) => {
  if (!(payload && payload.symptoms)) {
    throw new ApiError(httpStatus.BAD_REQUEST, "Symptoms are required.");
  }
  const doctors = await prisma.doctor.findMany({
    where: { isDeleted: false },
    include: {
      doctorSpecialties: {
        include: {
          specialities: true,
        },
      },
    },
  });

  const prompt = `
    You are a medical assistant AI. Based on the patient's symptoms, suggest the top 3 most suitable doctors.
    Each doctor has specialties and years of experience.
    Only suggest doctors who are relevant to the given symptoms.

    Symptoms: ${payload.symptoms}

    Here is the doctor list (in JSON):
    ${JSON.stringify(doctors, null, 2)}

    Return your response in JSON format with full individual doctor data. 
    `;

  console.log("Response is being generated..");
  const completion = await openai.chat.completions.create({
    model: "openai/gpt-oss-20b:free",
    messages: [
      {
        role: "system",
        content:
          "You are a helpful AI medical assistant that provides doctor suggestions.",
      },
      {
        role: "user",
        content: prompt,
      },
    ],
  });

  const result = extractJsonFromMessage(completion.choices[0].message);

  return result;
};

const getDoctorById = async (id: string) => {
  const doctor = await prisma.doctor.findFirstOrThrow({
    where: {
      id: id,
      isDeleted: false,
    },
    include: {
      doctorSpecialties: {
        include: {
          specialities: true,
        },
      },
      doctorSchedules: {
        include: {
          schedule: true,
        },
      },
    },
  });
  return doctor;
};


export const doctorServices = {
  getAllDoctorsFromDb,
  updateDoctorInDb,
  getDoctorsAISuggestion,
  getDoctorById,
};
