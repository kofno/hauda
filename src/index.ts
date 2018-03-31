import { Observable } from 'rxjs/Observable';
import { BehaviorSubject } from 'rxjs/BehaviorSubject';
import 'rxjs/add/observable/fromEvent';
import 'rxjs/add/operator/filter';
import 'rxjs/add/operator/map';
import { StoredValue, unknown, storageError, storedValue, noValue } from './Types';
import storageAvailable from './StorageAvailable';
import { Subscription } from 'rxjs/Subscription';

export interface Options {
  key: string;
  storage?: Storage;
}

/**
 * An Observable BehaviorSubject that also wraps a value in web storage
 * somewhere.
 *
 * This value is also mute-able. When muted, the value won't change and won't
 * report changes that come from the storage events.
 */
export class StoredValueSubject extends BehaviorSubject<StoredValue> {
  constructor(options: Options) {
    super(unknown());
    this.muted = false;
    this.key = options.key;
    this.storage = options.storage || window.localStorage;
    super.next(this.getValueFromStorage());
    this.storage$ = this.storageStream();
    this.subscriptions.push(this.storage$.subscribe(v => super.next(v)));
  }

  /**
   * Put a stored value into storage and report the value to subscribers.
   *
   * StoredValue => will set a new value in storage
   * NoValue => Will remove the value from storage
   * Unknown => Pushed to subscribers, but no side effects
   * StorageError =>
   *
   * @param value
   */
  public next(value: StoredValue) {
    if (this.muted) return;
    switch (this.value.kind) {
      case 'storage-error':
      case 'unknown':
        super.next(value);
        break;
      default:
        this.writeValue(value);
        super.next(value);
    }
  }

  public unsubscribe() {
    this.subscriptions.forEach(s => s.unsubscribe());
    super.unsubscribe();
  }

  public mute() {
    this.muted = true;
  }

  public unmute() {
    super.next(this.getValueFromStorage());
    this.muted = false;
  }

  private getValueFromStorage(): StoredValue {
    if (!storageAvailable(this.storage)) return storageError('Storage is not available');
    const value = this.storage.getItem(this.key);
    return value ? storedValue(value) : noValue();
  }

  private storageStream(): Observable<StoredValue> {
    return Observable.fromEvent<StorageEvent>(window, 'storage')
      .filter(() => !this.muted)
      .filter(e => e.key === this.key)
      .map(e => e.newValue)
      .map(v => (v ? storedValue(v) : noValue()));
  }

  private writeValue(value: StoredValue) {
    switch (value.kind) {
      case 'no-value':
        this.storage.removeItem(this.key);
        break;
      case 'value':
        this.storage.setItem(this.key, value.value);
        break;
      default:
        break;
    }
  }

  private key: string;
  private storage: Storage;
  private storage$: Observable<StoredValue>;
  private subscriptions: Subscription[] = [];
  private muted: boolean;
}
