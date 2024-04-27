import { PrismaClient, ServingUnit } from "@prisma/client";
import { UnitNotFound } from "../exceptions/UnitNotFound";
import { ConversionNotFound } from "../exceptions/ConversionNotFound";

const prisma = new PrismaClient();

export async function getUnits() {
  return await prisma.servingUnit.findMany();
}

export async function getUnitById(id: string) {
  return await prisma.servingUnit.findUnique({
    where: {
      id: id,
    },
  });
}

export async function createUnit(unit: Partial<ServingUnit>) {
  return await prisma.servingUnit.create({
    data: {
      name: unit.name,
      abbreviation: unit.abbreviation,
    },
  });
}

export async function updateUnit(id: string, unit: Partial<ServingUnit>) {
  return await prisma.servingUnit.update({
    where: {
      id: id,
    },
    data: {
      name: unit.name,
      abbreviation: unit.abbreviation,
    },
  });
}

export async function deleteUnit(id: string) {
  return await prisma.servingUnit.delete({
    where: {
      id: id,
    },
  });
}

export async function createConversion(
  fromUnitId: string,
  toUnitId: string,
  ratio: number
) {
  return await prisma.unitConversion.createMany({
    data: [
      {
        fromUnitId: fromUnitId,
        toUnitId: toUnitId,
        ratio: ratio,
      },
      {
        fromUnitId: toUnitId,
        toUnitId: fromUnitId,
        ratio: 1 / ratio,
      },
    ],
  });
}

export async function getUnitByAbbrev(abbreviation: string) {
  return await prisma.servingUnit.findFirst({
    where: {
      abbreviation: abbreviation,
    },
  });
}

export async function createConversionByAbbrevs(
  fromAbbrev: string,
  toAbbrev: string,
  ratio: number
) {
  const fromUnit = await getUnitByAbbrev(fromAbbrev);
  const toUnit = await getUnitByAbbrev(toAbbrev);
  if (!fromUnit || !toUnit) throw new UnitNotFound();
  return await createConversion(fromUnit.id, toUnit.id, ratio);
}

export async function getConversion(fromUnitId: string, toUnitId: string) {
  return await prisma.unitConversion.findFirst({
    where: {
      fromUnitId: fromUnitId,
      toUnitId: toUnitId,
    },
  });
}

export async function getConversionByAbbrevs(
  fromAbbrev: string,
  toAbbrev: string
) {
  const fromUnit = await getUnitByAbbrev(fromAbbrev);
  const toUnit = await getUnitByAbbrev(toAbbrev);
  if (!fromUnit || !toUnit) throw new UnitNotFound();
  const conversion = await getConversion(fromUnit.id, toUnit.id);
  if (!conversion) throw new ConversionNotFound();
  return conversion;
}

export async function updateConversion(
  fromUnitId: string,
  toUnitId: string,
  ratio: number
) {
  // Update fromUnitId -> toUnitId with ratio
  const conversion1 = await prisma.unitConversion.updateMany({
    where: {
      AND: [{ fromUnitId: fromUnitId }, { toUnitId: toUnitId }],
    },
    data: {
      ratio: ratio,
    },
  });

  // Update toUnitId -> fromUnitId with 1/ratio

  const conversion2 = await prisma.unitConversion.updateMany({
    where: {
      AND: [{ fromUnitId: toUnitId }, { toUnitId: fromUnitId }],
    },
    data: {
      ratio: 1 / ratio,
    },
  });

  return [conversion1, conversion2];
}

export async function deleteConversion(fromUnitId: string, toUnitId: string) {
  const conversion1 = await prisma.unitConversion.deleteMany({
    where: {
      AND: [{ fromUnitId: fromUnitId }, { toUnitId: toUnitId }],
    },
  });

  const conversion2 = await prisma.unitConversion.deleteMany({
    where: {
      AND: [{ fromUnitId: toUnitId }, { toUnitId: fromUnitId }],
    },
  });

  return [conversion1, conversion2];
}

export async function convert(
  fromUnitId: string,
  toUnitId: string,
  amount: number
) {
  if (fromUnitId === toUnitId) return amount;
  const conversion = await getConversion(fromUnitId, toUnitId);
  return amount * conversion?.ratio;
}

export async function convertByAbbrevs(
  fromAbbrev: string,
  toAbbrev: string,
  amount: number
) {
  const fromUnit = await getUnitByAbbrev(fromAbbrev);
  const toUnit = await getUnitByAbbrev(toAbbrev);
  if (!fromUnit || !toUnit) throw new UnitNotFound();
  return await convert(fromUnit.id, toUnit.id, amount);
}
