import * as migration_20261113_131159_initial from './20261113_131159_initial';
import * as migration_20261113_131830_leads_phone_optional from './20261113_131830_leads_phone_optional';
import * as migration_20261113_131934_tracker from './20261113_131934_tracker';

export const migrations = [
  {
    up: migration_20261113_131159_initial.up,
    down: migration_20261113_131159_initial.down,
    name: '20261113_131159_initial',
  },
  {
    up: migration_20261113_131830_leads_phone_optional.up,
    down: migration_20261113_131830_leads_phone_optional.down,
    name: '20261113_131830_leads_phone_optional',
  },
  {
    up: migration_20261113_131934_tracker.up,
    down: migration_20261113_131934_tracker.down,
    name: '20261113_131934_tracker'
  },
];
