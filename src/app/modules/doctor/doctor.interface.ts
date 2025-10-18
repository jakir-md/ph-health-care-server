import { Gender } from "@prisma/client";

export type IDoctorUpdateType = {
  name: string;
  email: string;
  contactNumber: string;
  gender: Gender;
  address: string;
  registrationNumber: string;
  experience: number;
  appointmentFee: number;
  qualification: string;
  currentWorkingPlace: string;
  designation: string;
  isDeleted: boolean;
  specialties: {
    specialtyId: string;
    isDeleted?: boolean;
  }[];
};
