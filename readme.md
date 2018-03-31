# hauda

[![Build Status](https://travis-ci.org/kofno/hauda.svg?branch=master)](https://travis-ci.org/kofno/hauda)
[![semantic-release](https://img.shields.io/badge/%20%20%F0%9F%93%A6%F0%9F%9A%80-semantic--release-e10079.svg?style=plastic)](https://github.com/semantic-release/semantic-release)

> “hoard, store”
>
> Translated from Telerin

Synchronize a value in web storage using RxJS.

# Install

     yarn add hauda


# Usage

    import { StoredValueSubject } from 'hauda';
    import { storedValue, noValue } from 'hauda/Types';

    const watchedValue = new StoredValueSubject({ key: 'a-value' });

    watchedValue.subscribe(v => console.log(v));
    watchedValue.next(storedValue('foo'));
    watchedValue.next(noValue());



# Overview

Webstorage is a useful tool for persisting state in the users browser.
It is also useful for communicating between a user's different tabs and
windows (using localStorage). However, keeping the value on the current page
in sync with the value in localStorage AND and keeping all the open windows
in sync can be frustrating.

Hauda provides an RxJS Subject that can be observed for changes. Since it is
based on a BehaviorSubject, the last value in the stream is always available.

Internally, Hauda subscribes to a stream of events from web storage. It uses
this to track the changes in storage.

The current page can update the stream by pushing the `next` value into the
subject. Internally, this value will be written to storage.

Sometimes you might want to "mute" the value, so changes won't be reported.
Calling mute will stop the stream from updating, including not performing
updates to storage.

## localStorage and sessionStorage

localStorage is the default webstorage used in hauda. Instantiating the
subject with a `key` is all that is needed to configure it for localStorage.

Any other implementation of webstorage can be passed, and that storage
mechanism will be used. To use session storage:

    const sessionValue = new StoredValueSubject({key: 'a-value', storage: window.sessionStorage });

This will persist the value in sessions storage, rather then localStorage.
