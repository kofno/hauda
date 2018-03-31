/**
 * A value exists in storage
 */
export interface Value {
  kind: 'value';
  value: string;
}

export const storedValue = (v: string): StoredValue => ({
  kind: 'value',
  value: v,
});

/**
 * No value exists in storage
 */
export interface NoValue {
  kind: 'no-value';
}

export const noValue = (): StoredValue => ({
  kind: 'no-value',
});

/**
 * Storage isn't available or there is an error accessing storage
 */
export interface StorageError {
  kind: 'storage-error';
  message: string;
}

export const storageError = (message: string): StoredValue => ({
  kind: 'storage-error',
  message,
});

export interface Unknown {
  kind: 'unknown';
}

export const unknown = (): StoredValue => ({ kind: 'unknown' });

/**
 * The possible states of the stored value
 */
export type StoredValue = Value | NoValue | StorageError | Unknown;
