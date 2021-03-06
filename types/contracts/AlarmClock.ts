/* Autogenerated file. Do not edit manually. */
/* tslint:disable */
/* eslint-disable */

import type BN from "bn.js";
import type { ContractOptions } from "web3-eth-contract";
import type { EventLog } from "web3-core";
import type { EventEmitter } from "events";
import type {
  Callback,
  PayableTransactionObject,
  NonPayableTransactionObject,
  BlockType,
  ContractEventLog,
  BaseContract,
} from "../types";

export interface EventOptions {
  filter?: object;
  fromBlock?: BlockType;
  topics?: string[];
}

export type OwnershipTransferred = ContractEventLog<{
  previousOwner: string;
  newOwner: string;
  0: string;
  1: string;
}>;

export interface AlarmClock extends BaseContract {
  constructor(
    jsonInterface: any[],
    address?: string,
    options?: ContractOptions
  ): AlarmClock;
  clone(): AlarmClock;
  methods: {
    getAlarm(): NonPayableTransactionObject<
      [boolean, string, string, string, string, string]
    >;

    owner(): NonPayableTransactionObject<string>;

    renounceOwnership(): NonPayableTransactionObject<void>;

    rescue(amount: number | string | BN): NonPayableTransactionObject<void>;

    resetSleepiness(): NonPayableTransactionObject<void>;

    setAlarm(
      tokenAmount: number | string | BN,
      nftId: number | string | BN,
      endAt: number | string | BN
    ): NonPayableTransactionObject<void>;

    setRewardAmount(
      _rewardAmount: number | string | BN
    ): NonPayableTransactionObject<void>;

    setSleepinessCost(
      _cost: number | string | BN
    ): NonPayableTransactionObject<void>;

    setSleepinessTime(
      _time: number | string | BN
    ): NonPayableTransactionObject<void>;

    setSlepTokenAddress(
      tokenAddress: string
    ): NonPayableTransactionObject<void>;

    setThreshold(
      _threshold: number | string | BN
    ): NonPayableTransactionObject<void>;

    setThresholdEnabled(
      _thresholdEnabled: boolean
    ): NonPayableTransactionObject<void>;

    stop(): NonPayableTransactionObject<void>;

    transferOwnership(newOwner: string): NonPayableTransactionObject<void>;
  };
  events: {
    OwnershipTransferred(cb?: Callback<OwnershipTransferred>): EventEmitter;
    OwnershipTransferred(
      options?: EventOptions,
      cb?: Callback<OwnershipTransferred>
    ): EventEmitter;

    allEvents(options?: EventOptions, cb?: Callback<EventLog>): EventEmitter;
  };

  once(event: "OwnershipTransferred", cb: Callback<OwnershipTransferred>): void;
  once(
    event: "OwnershipTransferred",
    options: EventOptions,
    cb: Callback<OwnershipTransferred>
  ): void;
}
