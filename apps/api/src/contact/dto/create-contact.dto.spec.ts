import { HttpStatus, ValidationPipe } from '@nestjs/common';
import { plainToInstance } from 'class-transformer';
import { validate } from 'class-validator';

import { CreateContactDto } from './create-contact.dto';

const valid = {
  firstName: 'Alex',
  lastName: 'Rivera',
  email: 'alex.rivera@example.com',
  subject: 'General Inquiry',
  message: 'I would like to learn about employer support.',
  consent: true,
};

async function validatePayload(payload: Record<string, unknown>) {
  const dto = plainToInstance(CreateContactDto, payload);
  return validate(dto);
}

describe('CreateContactDto', () => {
  it('accepts a complete valid submission', async () => {
    expect(await validatePayload(valid)).toEqual([]);
  });

  it('accepts an omitted or blank phone number', async () => {
    expect(await validatePayload({ ...valid, phone: '' })).toEqual([]);
    expect(await validatePayload({ ...valid, phone: '   ' })).toEqual([]);
  });

  it('rejects missing required fields and invalid values', async () => {
    const errors = await validatePayload({
      firstName: '',
      lastName: '',
      email: 'not-an-email',
      phone: 'abc',
      subject: 'Press',
      message: 'short',
      consent: false,
    });

    const properties = errors.map((error) => error.property).sort();
    expect(properties).toEqual([
      'consent',
      'email',
      'firstName',
      'lastName',
      'message',
      'phone',
      'subject',
    ]);
  });

  it('rejects unknown properties through the API validation pipe', async () => {
    const pipe = new ValidationPipe({
      whitelist: true,
      forbidNonWhitelisted: true,
      transform: true,
      errorHttpStatusCode: HttpStatus.UNPROCESSABLE_ENTITY,
    });

    await expect(
      pipe.transform(
        { ...valid, captcha: 'BR-24' },
        { type: 'body', metatype: CreateContactDto, data: '' },
      ),
    ).rejects.toMatchObject({ status: HttpStatus.UNPROCESSABLE_ENTITY });
  });
});
