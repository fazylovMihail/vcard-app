#!/usr/bin/env -S node
import type { Contract as End } from '../../snapshots/98f7934452c6031079f7b7794995ee136f44f8dc35e7322bbfc68e5bba1ec9e2/contract';
import endContract from '../../snapshots/98f7934452c6031079f7b7794995ee136f44f8dc35e7322bbfc68e5bba1ec9e2/contract.json' with { type: 'json' };
import type { Contract as Start } from '../../snapshots/caf17f6d5e1df436bb5eb3530ece5067d7bc4a267e3fbe45be895838d1e6062a/contract';
import startContract from '../../snapshots/caf17f6d5e1df436bb5eb3530ece5067d7bc4a267e3fbe45be895838d1e6062a/contract.json' with { type: 'json' };
import { Migration, MigrationCLI } from '@prisma/orm-postgres/migration';

export default class M extends Migration<Start, End> {
  override readonly startContractJson = startContract;
  override readonly endContractJson = endContract;

  override get operations() {
    return [
      this.addPrimaryKey({
        schema: 'public',
        table: 'Project',
        constraint: 'Project_pkey',
        columns: ['id'],
      }),
    ];
  }
}

MigrationCLI.run(import.meta.url, M);
