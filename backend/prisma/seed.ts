import {
  ConfirmationStatus,
  CrewRole,
  EventStatus,
  EventType,
  Event,
  PrismaClient,
} from '@prisma/client';

const prisma = new PrismaClient();
const passwordHash =
  process.env.BOSS_PASSWORD_HASH ??
  '$2b$10$replace-with-a-real-hash';

const freelancerData = [
  ['Maria Santos', '09171234501', [CrewRole.PHOTOGRAPHER], ['weddings', 'portraits'], 4500, 'Cavite City', 14.4791, 120.897],
  ['Juan Dela Cruz', '09171234502', [CrewRole.VIDEOGRAPHER], ['cinematic video', 'editing'], 5000, 'Dasmarinas', 14.3294, 120.9367],
  ['Aira Reyes', '09171234503', [CrewRole.EDITOR], ['same-day edit', 'color grading'], 3500, 'Tagaytay', 14.1153, 120.9621],
  ['Paolo Garcia', '09171234504', [CrewRole.DRONE_OPERATOR, CrewRole.VIDEOGRAPHER], ['aerial video', ' FPV'], 5500, 'Santa Rosa', 14.3122, 121.1114],
  ['Liza Mendoza', '09171234505', [CrewRole.ASSISTANT], ['lighting setup', 'gear handling'], 3200, 'Calamba', 14.2117, 121.1653],
  ['Carlo Bautista', '09171234506', [CrewRole.PHOTOGRAPHER, CrewRole.EDITOR], ['events', 'photo albums'], 4600, 'Binan', 14.3039, 121.0781],
  ['Nina Ramos', '09171234507', [CrewRole.VIDEOGRAPHER], ['documentary coverage', 'audio'], 4800, 'Batangas City', 13.7565, 121.0583],
  ['Miguel Flores', '09171234508', [CrewRole.ASSISTANT, CrewRole.DRONE_OPERATOR], ['rigging', 'camera support'], 4300, 'Lipa', 13.9411, 121.1631],
  ['Bea Navarro', '09171234509', [CrewRole.PHOTOGRAPHER], ['events', 'photo albums'], 4600, 'Tanauan', 14.0863, 121.1493],
  ['Rico Aquino', '09171234510', [CrewRole.VIDEOGRAPHER, CrewRole.EDITOR], ['drone support', 'same-day edit'], 5500, 'Lucena', 13.9373, 121.6172],
  ['Joy Villanueva', '09171234511', [CrewRole.PHOTOGRAPHER], ['family portraits', 'lighting'], 3900, 'Tayabas', 14.0259, 121.5947],
  ['Anton Castillo', '09171234512', [CrewRole.ASSISTANT], ['stage management', 'registration'], 3600, 'Lucena', 13.9373, 121.6172],
  ['Celine Torres', '09171234513', [CrewRole.EDITOR], ['event reels', 'social cuts'], 3200, 'Imus', 14.4297, 120.9367],
  ['Dino Fernandez', '09171234514', [CrewRole.DRONE_OPERATOR], ['drone video', 'mapping'], 3800, 'Los Banos', 14.1709, 121.2418],
  ['Grace Manalo', '09171234515', [CrewRole.PHOTOGRAPHER, CrewRole.ASSISTANT], ['food styling', 'event details'], 4200, 'Nasugbu', 14.0667, 120.6333],
] as const;

async function main() {
  await prisma.assignment.deleteMany();
  await prisma.eventPosition.deleteMany();
  await prisma.event.deleteMany();
  await prisma.freelancerUnavailability.deleteMany();
  await prisma.freelancer.deleteMany();
  await prisma.client.deleteMany();
  await prisma.user.deleteMany();

  await prisma.user.create({
    data: {
      name: process.env.BOSS_NAME ?? 'CrewMatch Boss',
      email: process.env.BOSS_EMAIL ?? 'boss@crewmatch.ph',
      passwordHash,
    },
  });

  const clientData: Array<[string, string, string | undefined]> = [
    ['Harborlight Events', '09181234001', 'harborlight@example.com'],
    ['South Luzon Weddings', '09181234002', 'southluzon@example.com'],
    ['Batangas Business Group', '09181234003', undefined],
  ];
  const clients = await Promise.all(clientData.map(([name, phone, email]) =>
    prisma.client.create({ data: { name, phone, ...(email ? { email } : {}) } })));

  const crew = await Promise.all(freelancerData.map(
    ([fullName, phone, roles, skills, dailyRate, city, latitude, longitude]) =>
      prisma.freelancer.create({
        data: { fullName, phone, roles: [...roles], skills: [...skills], dailyRate, city, latitude, longitude },
      }),
  ));

  const samples = [
    ['Cavite Garden Wedding', 0, EventType.WEDDING, EventStatus.CONFIRMED, 'Tagaytay Garden', 'Tagaytay', '2026-03-14T08:00:00+08:00'],
    ['Laguna Startup Launch', 1, EventType.CORPORATE, EventStatus.DONE, 'Santa Rosa Convention Hall', 'Santa Rosa', '2026-03-14T12:00:00+08:00'],
    ['Batangas Beach Reception', 2, EventType.WEDDING, EventStatus.CONFIRMED, 'Nasugbu Beach Club', 'Nasugbu', '2026-04-04T10:00:00+08:00'],
    ['Quezon Town Fiesta', 0, EventType.OTHER, EventStatus.INQUIRY, 'Lucena Plaza', 'Lucena', '2026-04-18T08:00:00+08:00'],
    ['Cavite Corporate Night', 1, EventType.CORPORATE, EventStatus.CONFIRMED, 'Imus Events Center', 'Imus', '2026-05-09T15:00:00+08:00'],
    ['Laguna Debut Celebration', 2, EventType.DEBUT, EventStatus.INQUIRY, 'Calamba Pavilion', 'Calamba', '2026-05-23T16:00:00+08:00'],
    ['Batangas Product Expo', 0, EventType.CORPORATE, EventStatus.CANCELLED, 'Lipa Trade Hall', 'Lipa', '2026-06-06T08:00:00+08:00'],
    ['Quezon Charity Concert', 1, EventType.OTHER, EventStatus.CONFIRMED, 'Lucena City Auditorium', 'Lucena', '2026-06-20T14:00:00+08:00'],
  ] as const;

  const events: Event[] = [];
  for (let index = 0; index < samples.length; index += 1) {
    const [title, clientIndex, eventType, status, venueName, venueCity, start] = samples[index];
    const startAt = new Date(start);
    events.push(await prisma.event.create({
      data: {
        title, clientId: clients[clientIndex].id, eventType, status, startAt,
        endAt: new Date(startAt.getTime() + 8 * 60 * 60 * 1000),
        venueName, venueCity, guestCount: 80 + index * 25, hoursCovered: 8,
        packageName: 'Standard Crew Package',
        quotedPrice: 30000 + index * 2500,
        estimatedBudget: 35000 + index * 2500,
        positions: { create: [
          { role: CrewRole.PHOTOGRAPHER, requiredCount: 1 },
          { role: CrewRole.VIDEOGRAPHER, requiredCount: 1 },
          { role: CrewRole.ASSISTANT, requiredCount: 1 },
        ] },
      },
    }));
  }

  const positions = await prisma.eventPosition.findMany({ orderBy: { event: { startAt: 'asc' } } });
  for (let index = 0; index < positions.length; index += 1) {
    await prisma.assignment.create({
      data: {
        eventId: positions[index].eventId,
        positionId: positions[index].id,
        freelancerId: crew[index % crew.length].id,
        status: index < 10 ? ConfirmationStatus.CONFIRMED : ConfirmationStatus.PENDING,
        agreedRate: crew[index % crew.length].dailyRate,
      },
    });
  }

  // Maria is assigned to two overlapping events so conflict detection has sample data.
  const secondEventPosition = positions.find((position) => position.eventId === events[1].id);
  if (secondEventPosition) {
    await prisma.assignment.create({
      data: {
        eventId: events[1].id,
        positionId: secondEventPosition.id,
        freelancerId: crew[0].id,
        status: ConfirmationStatus.CONFIRMED,
        agreedRate: crew[0].dailyRate,
      },
    });
  }
}

main()
  .catch((error) => { console.error(error); process.exitCode = 1; })
  .finally(() => prisma.$disconnect());
