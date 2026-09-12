import { HttpStatus, ValidationPipe } from '@nestjs/common';
import { plainToInstance } from 'class-transformer';
import { validate } from 'class-validator';

import { CreateSupportTicketDto } from './create-support-ticket.dto';

const valid = {
  name: 'Alex Rivera',
  email: 'alex.rivera@example.com',
  message: 'I would like help understanding BlueRise Workforce.',
  consent: true,
};

async function validatePayload(payload: Record<string, unknown>) {
  const dto = plainToInstance(CreateSupportTicketDto, payload);
  return validate(dto);
}

describe('CreateSupportTicketDto', () => {
  it('accepts a complete valid ticket', async () => {
    expect(await validatePayload(valid)).toEqual([]);
  });

  it('accepts an omitted or blank phone number', async () => {
    expect(await validatePayload({ ...valid, phone: '' })).toEqual([]);
    expect(await validatePayload({ ...valid, phone: '   ' })).toEqual([]);
  });

  it('rejects an invalid email', async () => {
    const errors = await validatePayload({ ...valid, email: 'not-an-email' });
    expect(errors.map((error) => error.property)).toContain('email');
  });

  it('rejects missing required fields', async () => {
    const errors = await validatePayload({
      name: '',
      email: '',
      message: '',
      consent: false,
    });

    const properties = errors.map((error) => error.property).sort();
    expect(properties).toEqual(['consent', 'email', 'message', 'name']);
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
        { ...valid, conversation: ['secret'] },
        { type: 'body', metatype: CreateSupportTicketDto, data: '' },
      ),
    ).rejects.toMatchObject({ status: HttpStatus.UNPROCESSABLE_ENTITY });
  });
});
