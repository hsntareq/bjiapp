import 'reflect-metadata';
import { plainToInstance } from 'class-transformer';
import { validate } from 'class-validator';
import { CreatePersonalReportDto } from './create-personal-report.dto';

function makePayload(overrides: Partial<CreatePersonalReportDto> = {}) {
  return {
    date: '2026-04-22',
    quranStudy: true,
    haditsRead: 1,
    literature: 2,
    salahJamaat: 3,
    targetContactDawah: 0,
    targetContactWorker: 0,
    targetContactMember: 0,
    workerContact: 0,
    bookDistribution: 0,
    familyMeeting: false,
    socialWork: false,
    orgWorkHours: 1,
    orgWorkMinutes: 30,
    orgWorkSeconds: 15,
    safar: false,
    reportKeeping: true,
    selfCriticism: true,
    ...overrides,
  };
}

describe('CreatePersonalReportDto', () => {
  it('accepts salahJamaat values in the 0..5 range', async () => {
    const validValues = [0, 1, 5];

    for (const value of validValues) {
      const dto = plainToInstance(
        CreatePersonalReportDto,
        makePayload({ salahJamaat: value }),
      );
      const errors = await validate(dto);
      expect(errors).toHaveLength(0);
    }
  });

  it('rejects salahJamaat values outside the 0..5 range', async () => {
    const dto = plainToInstance(
      CreatePersonalReportDto,
      makePayload({ salahJamaat: 6 }),
    );
    const errors = await validate(dto);

    expect(errors.some((error) => error.property === 'salahJamaat')).toBe(true);
  });

  it('rejects malformed salahJamaat values', async () => {
    const dto = plainToInstance(
      CreatePersonalReportDto,
      makePayload({ salahJamaat: 'abc' as never }),
    );
    const errors = await validate(dto);

    expect(errors.some((error) => error.property === 'salahJamaat')).toBe(true);
  });
});
