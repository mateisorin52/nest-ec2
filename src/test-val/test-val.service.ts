import { Injectable } from '@nestjs/common';

@Injectable()
export class TestValService {
  users = [
    {
      id: '1',
      name: 'Valentin Matei',
      age: 26,
      occupation: 'Policeman',
      location: 'Bucharest',
    },
    {
      id: '2',
      name: 'Sorin Matei',
      age: 23,
      occupation: 'Software Developer',
      location: 'Bucharest',
    },
  ];
  getTestVal() {
    return this.users;
  }
  getTestValWithId(id: string) {
    return this.users.filter((user) => user.id === id)[0];
  }
}
