
import { Mandate } from "@/models/entities/Mandate";
export const AlphabeticalMandateSort = (mandates: Mandate[]) => {
  return mandates.slice().sort((a, b) => a.MandateName.localeCompare(b.MandateName));
};