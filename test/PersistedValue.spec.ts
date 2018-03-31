import { StoredValueSubject } from '../src';
import { storedValue, noValue } from '../src/Types';
import { just, nothing } from 'maybeasy';

describe('Reading values', () => {
  beforeEach(() => {
    window.localStorage.setItem('booger', 'blaster');
  });

  afterEach(() => {
    window.localStorage.removeItem('booger');
  });

  it('from localStorage', done => {
    const booger = new StoredValueSubject({ key: 'booger' });
    expect(booger.value).toEqual(storedValue('blaster'));
    done();
  });
});

describe('Writing values', () => {
  it('to localStore', done => {
    const booger = new StoredValueSubject({ key: 'booger' });
    booger.next(storedValue('blaster'));
    expect(window.localStorage.getItem('booger')).toEqual('blaster');

    booger.next(noValue());
    expect(window.localStorage.getItem('booger')).toBeNull();
    done();
  });
});
