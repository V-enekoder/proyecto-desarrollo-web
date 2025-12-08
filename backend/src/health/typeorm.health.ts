import { Injectable, Scope } from "@nestjs/common";
import { ModuleRef } from "@nestjs/core";
import {
  HealthIndicatorResult,
  HealthIndicatorService,
} from "@nestjs/terminus";
import { performance } from "node:perf_hooks";
import { setTimeout } from "node:timers/promises";
import * as TypeOrm from "typeorm";

export interface TypeOrmPingCheckSettings {
  dataSource?: TypeOrm.DataSource;
  timeout?: number;
}

@Injectable({ scope: Scope.TRANSIENT })
export class TypeOrmHealthIndicator {
  constructor(
    private readonly moduleRef: ModuleRef,
    private readonly healthIndicatorService: HealthIndicatorService,
  ) {}

  /** Returns the connection of the current DI context */
  private getContextConnection(): TypeOrm.DataSource | null {
    try {
      return this.moduleRef.get(TypeOrm.DataSource, { strict: false });
    } catch {
      return null;
    }
  }

  private async pingDb(connection: TypeOrm.DataSource, timeout: number) {
    const check: Promise<any> = connection.query("SELECT 1");
    const controller = new AbortController();
    const { signal } = controller;
    await Promise.race([
      check,
      setTimeout(timeout, undefined, { signal }).then(() => {
        throw new PromiseTimeoutError(`timeout of ${timeout}ms exceeded`);
      }),
    ]);
    controller.abort();
  }

  /**
   * Checks if responds in (default) 1000ms and returns a result object
   * corresponding to the result
   *
   * @example
   *   typeOrmHealthIndicator.pingCheck("database", { timeout: 1500 });
   *
   * @param key The key which will be used for the result object
   * @param options The options for the ping
   */
  async pingCheck<Key extends string>(
    key: Key,
    options: TypeOrmPingCheckSettings = {},
  ): Promise<HealthIndicatorResult<Key>> {
    const check = this.healthIndicatorService.check(key);

    const connection: TypeOrm.DataSource | null =
      options.dataSource || this.getContextConnection();
    const timeout = options.timeout || 1000;

    if (!connection) {
      return check.down("Connection provider not found in application context");
    }

    let duration: number;
    try {
      const start = performance.now();
      await this.pingDb(connection, timeout);
      duration = performance.now() - start;
    } catch (err) {
      if (err instanceof PromiseTimeoutError) {
        return check.down(`timeout of ${timeout}ms exceeded`);
      }

      return check.down();
    }

    return check.up({ responseTimeMs: duration });
  }
}

class PromiseTimeoutError extends Error {}
