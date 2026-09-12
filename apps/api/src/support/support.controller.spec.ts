import { RequestMethod } from '@nestjs/common';
import { METHOD_METADATA, PATH_METADATA } from '@nestjs/common/constants';

import { SupportController } from './support.controller';

describe('SupportController routes', () => {
  it('exposes only POST ticket creation', () => {
    const handlers = Object.getOwnPropertyNames(SupportController.prototype).filter(
      (name) => name !== 'constructor',
    );

    expect(handlers).toEqual(['create']);
    expect(Reflect.getMetadata(PATH_METADATA, SupportController)).toBe('support/tickets');
    expect(Reflect.getMetadata(METHOD_METADATA, SupportController.prototype.create)).toBe(
      RequestMethod.POST,
    );
    expect(Reflect.getMetadata(PATH_METADATA, SupportController.prototype.create)).toBe(
      '/',
    );
  });

  it('does not expose a public listing or read endpoint', () => {
    const proto = SupportController.prototype;
    const listingNames = ['findAll', 'findOne', 'list', 'get', 'index'];

    for (const name of listingNames) {
      expect(Object.prototype.hasOwnProperty.call(proto, name)).toBe(false);
    }

    const methods = Object.getOwnPropertyNames(proto)
      .filter((name) => name !== 'constructor')
      .map((name) =>
        Reflect.getMetadata(METHOD_METADATA, proto[name as keyof typeof proto]),
      );

    expect(methods).not.toContain(RequestMethod.GET);
    expect(methods).not.toContain(RequestMethod.PUT);
    expect(methods).not.toContain(RequestMethod.PATCH);
    expect(methods).not.toContain(RequestMethod.DELETE);
  });
});
