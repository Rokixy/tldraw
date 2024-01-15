import { UnknownRecord } from './BaseRecord'
import { StoreSnapshot } from './Store'
import { SerializedSchema } from './StoreSchema'

export type Migration = StoreMigration | RecordMigration | _LegacyMigration_
type MigrationId = {
	sequenceId: string
	versionId: string
}

/**
 * Secret migration type for legacy migrations
 */
export type _LegacyMigration_ = {
	scope: '_legacy_'
	// versionId is human-readable e.g. 'add_isPrecise_to_arrow_bindings'
	// it needs to be unique to a particular 'sequence' of migrations (see below)
	versionId: string
	// eslint-disable-next-line deprecation/deprecation
	up(legacySerializedSchema: SerializedSchema, store: StoreSnapshot<UnknownRecord>): StoreSnapshot<UnknownRecord>
	// no down migrations for store-level migrations
}

/**
 * Store migrations operate on the entire store at once.
 * It does not support 'down' migrations because that would be prohibitively expensive
 * (and probably not even very useful) for the main use case i.e. allowing sync
 * server backwards compatibility
 */
export type StoreMigration = {
	scope: 'store'
	// if this migration needs to run after another migration from a different sequence, specify it here
	dependsOn?: MigrationId[]
	// versionId is human-readable e.g. 'add_isPrecise_to_arrow_bindings'
	// it needs to be unique to a particular 'sequence' of migrations (see below)
	versionId: string
	up(store: StoreSnapshot<UnknownRecord>): StoreSnapshot<UnknownRecord>
	// no down migrations for store-level migrations
}

/**
 * Record migrations operate on a single record at a time
 * They cannot create or delete records.
 * They are not scoped to a particular type or subtype, but are rather run for every record in the store.
 * It's up to them to check the record type/subtype and decide whether to do anything.
 */
export type RecordMigration = {
	scope: 'record'
	dependsOn?: MigrationId[]
	versionId: string
	up(record: UnknownRecord): UnknownRecord
	// allow down migrations
	down(record: UnknownRecord): UnknownRecord
}

// tldraw extensions that need to do migrations would provide a 'MigrationSequences' object
type MigrationSequence = {
	// the sequence ID uniquely identifies a sequence of migrations. it should
	// be human readable and ideally namespaced e.g. `com.tldraw/TLArrowShape`
	id: string
	migrations: Migration[]
}

export function defineMigrationSequence(id: string, migrations: Migration[]): MigrationSequence {
	return { id, migrations }
}

export function validateMigrationSequences(migrationSequences: Migration[]) {

}

export type MigrationRecord = {
	version: 0
	appliedMigrations: MigrationId[]
}

export type { MigrationSequence, Migration, MigrationId }
