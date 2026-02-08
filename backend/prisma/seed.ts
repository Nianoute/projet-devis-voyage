import { PrismaClient } from '@prisma/client';

const prisma = new PrismaClient();

async function main() {
  // --- OptionType ---
  const optionTypes = await Promise.all([
    prisma.optionType.upsert({
      where: { id: 1 },
      update: {},
      create: { label: 'Assurance' },
    }),
    prisma.optionType.upsert({
      where: { id: 2 },
      update: {},
      create: { label: 'Équipement' },
    }),
    prisma.optionType.upsert({
      where: { id: 3 },
      update: {},
      create: { label: 'Extension' },
    }),
    prisma.optionType.upsert({
      where: { id: 4 },
      update: {},
      create: { label: 'Confort' },
    }),
  ]);
  console.log('OptionType créés:', optionTypes.length);

  // --- Option ---
  const options = await Promise.all([
    prisma.option.upsert({
      where: { id: 1 },
      update: {},
      create: {
        name: 'Assurance tous risques',
        description: 'Extension de garantie tous risques pour la moto',
        pricingModel: 'FIXED',
        optionTypeId: 1,
      },
    }),
    prisma.option.upsert({
      where: { id: 2 },
      update: {},
      create: {
        name: 'Casque Bluetooth',
        description: 'Location casque avec intercom Bluetooth',
        pricingModel: 'PER_WEEK',
        optionTypeId: 2,
      },
    }),
    prisma.option.upsert({
      where: { id: 3 },
      update: {},
      create: {
        name: 'Top case',
        description: 'Coffre arrière pour bagages',
        pricingModel: 'PER_WEEK',
        optionTypeId: 2,
      },
    }),
    prisma.option.upsert({
      where: { id: 4 },
      update: {},
      create: {
        name: 'Journée supplémentaire',
        description: 'Prolongation du voyage d\'une journée',
        pricingModel: 'FIXED',
        optionTypeId: 3,
      },
    }),
    prisma.option.upsert({
      where: { id: 5 },
      update: {},
      create: {
        name: 'Paiement en 3 fois',
        description: 'Étalement du paiement en 3 mensualités',
        pricingModel: 'PAYMENT_IN_3_INSTALLMENTS',
        optionTypeId: 4,
      },
    }),
  ]);
  console.log('Options créées:', options.length);

  // --- Vehicle ---
  const vehicles = await Promise.all([
    prisma.vehicle.upsert({
      where: { id: 1 },
      update: {},
      create: {
        brand: 'BMW',
        model: 'R 1250 GS',
        category: 'A',
      },
    }),
    prisma.vehicle.upsert({
      where: { id: 2 },
      update: {},
      create: {
        brand: 'BMW',
        model: 'F 850 GS',
        category: 'A2',
      },
    }),
    prisma.vehicle.upsert({
      where: { id: 3 },
      update: {},
      create: {
        brand: 'Honda',
        model: 'Africa Twin',
        category: 'A',
      },
    }),
    prisma.vehicle.upsert({
      where: { id: 4 },
      update: {},
      create: {
        brand: 'Triumph',
        model: 'Tiger 900',
        category: 'A',
      },
    }),
    prisma.vehicle.upsert({
      where: { id: 5 },
      update: {},
      create: {
        brand: 'KTM',
        model: '790 Adventure',
        category: 'A2',
      },
    }),
  ]);
  console.log('Véhicules créés:', vehicles.length);

  // --- Formula (Zeus, Poseidon, Athena) ---
  const formulaZeus = await prisma.formula.upsert({
    where: { id: 1 },
    update: {},
    create: {
      name: 'Zeus',
      description:
        'Voyage en groupe guidé et tout compris. Sur devis pour des groupes à partir de 6 motos',
    },
  });
  const formulaPoseidon = await prisma.formula.upsert({
    where: { id: 2 },
    update: {},
    create: {
      name: 'Poseidon',
      description:
        'Voyage à la carte entièrement organisé. 4.490 € / Solo - 4.790 € / Duo',
    },
  });
  const formulaAthena = await prisma.formula.upsert({
    where: { id: 3 },
    update: {},
    create: {
      name: 'Athena',
      description:
        'Voyage à la carte à organiser soi-même. À partir de 1590 €',
    },
  });
  console.log('Formules créées: Zeus, Poseidon, Athena');

  // --- Trip ---
  const trips = await Promise.all([
    prisma.trip.upsert({
      where: { id: 1 },
      update: {},
      create: {
        title: 'Grèce continentale - 7 jours',
        description: 'Circuit des sites antiques et des côtes égéennes',
        capacity: 12,
      },
    }),
    prisma.trip.upsert({
      where: { id: 2 },
      update: {},
      create: {
        title: 'Peloponnèse - 10 jours',
        description: 'Péninsule historique et routes côtières',
        capacity: 10,
      },
    }),
    prisma.trip.upsert({
      where: { id: 3 },
      update: {},
      create: {
        title: 'Épire et montagnes - 5 jours',
        description: 'Routes de montagne et villages traditionnels',
        capacity: 8,
      },
    }),
  ]);
  console.log('Voyages créés:', trips.length);

  // --- Liaison Trip <-> Formula (AvailableTripFormula) ---
  await prisma.availableTripFormula.createMany({
    data: [
      { tripId: 1, formulaId: 1 },
      { tripId: 1, formulaId: 2 },
      { tripId: 1, formulaId: 3 },
      { tripId: 2, formulaId: 1 },
      { tripId: 2, formulaId: 2 },
      { tripId: 2, formulaId: 3 },
      { tripId: 3, formulaId: 1 },
      { tripId: 3, formulaId: 2 },
      { tripId: 3, formulaId: 3 },
    ],
    skipDuplicates: true,
  });
  console.log('AvailableTripFormula: liaisons Trip-Formula créées');
}

main()
  .then(() => {
    console.log('Seed terminé avec succès.');
  })
  .catch((e) => {
    console.error('Erreur lors du seed:', e);
    process.exit(1);
  })
  .finally(async () => {
    await prisma.$disconnect();
  });
