import '@testing-library/jest-dom';
import { cleanup } from '@testing-library/react';
import axios from 'axios';

type Spies = {
  [key: string]: jest.SpyInstance
};

const spies: Spies = {
  get: jest.spyOn(axios, 'get'),
  patch: jest.spyOn(axios, 'patch'),
  post: jest.spyOn(axios, 'post'),
  delete: jest.spyOn(axios, 'delete'),
  options: jest.spyOn(axios, 'options'),
  request: jest.spyOn(axios, 'request')
};

beforeEach(() => {
  jest.resetAllMocks();
});

afterEach(() => {
  cleanup();

  for (const key in spies) {
    expect(spies[key], `Axios method ${key} must not be used in tests. You must mock the access to the HTTP API`)
      .not.toHaveBeenCalled();
  }
});
