/**
 * This file is part of dHealth dApps Framework shared under LGPL-3.0
 * Copyright (C) 2022-present dHealth Network, All rights reserved.
 *
 * @package     dHealth dApps Framework
 * @subpackage  Examples
 * @author      dHealth Network <devs@dhealth.foundation>
 * @license     LGPL-3.0
 */
class Storage {
  constructor(namespace, options = {}) {
    this.namespace = namespace;
    this.options = options;

    // Reads from browser localStorage
    const json = localStorage.getItem(this.namespace);

    // Initializes the database
    if (null === json) {
      this.born = true;
      this.data = {
        networkName: this.options.networkName,
        networkType: this.options.networkType,
        networkId: this.options.generationHash,
        networkEpoch: this.options.epochAdjustment,
        activeNodeId: this.options.nodeId,
        createdAt: new Date().valueOf(),
        collections: {}
      };

      this.persist();
    }
    // Or reads the database content
    else this.data = JSON.parse(json);

    // Fetches collection names
    this.collections = Object.keys(this.data.collections);
  }

  persist() {
    this.data.updatedAt = new Date().valueOf();
    localStorage.setItem(this.namespace, JSON.stringify(this.data));
  }

  sync() {
    this.data = JSON.parse(localStorage.getItem(this.namespace));
  }

  metadata(field, value = null) {
    this.sync();

    if (null === value && field in this.data) {
      return this.data[field]
    }
    else if (null === value) {
      return null;
    }

    this.data[field] = value;
    this.persist();
    return this.data[field];
  }

  dict(collection) {
    this.sync();

    if (! (collection in this.data.collections)) {
      return {};
    }

    return this.data.collections[collection].data;
  }

  collect(collection) {
    const dict = this.dict(collection);
    return Object.keys(dict).map(
      k => this.data.collections[collection].data[k]
    );
  }

  count(collection) {
    const dict = this.dict(collection);
    return Object.keys(dict).length;
  }

  push(collection, entry, schema = {pk: 'id'}) {
    if (! (schema.pk in entry)) {
      throw Error('Missing primary key value.');
    }

    // JiT collection creation
    if (! (collection in this.data.collections)) {
      this.data.collections[collection] = {
        primaryKey: schema.pk,
        data: {}
      };
    }

    // Reads primary key and re-assigns
    const primary = entry[schema.pk]
    this.data.collections[collection].data[primary] = entry;

    // Persist
    this.persist();

    // Return number of entries
    return Object.keys(this.data.collections[collection].data).length;
  }

  get(collection, pkv) {
    const dict = this.dict(collection);

    if (! (pkv in dict)) {
      throw Error('Item not found with primary key: ' + pkv);
    }

    return dict[pkv];
  }

  findByKey(collection, key, value) {
    return this.collect(collection).filter(
      e => e[key] === value
    );
  }

  mergeWithRequest(collection, entries, schema = {pk: 'id'}) {
    const dict = this.dict(collection),
          collected = this.collect(collection);

    // Merges "rows"
    entries = collected.concat(entries);

    // Merges "columns"
    entries = entries.map(p => {
      if (dict.hasOwnProperty(p[schema.pk])) {
        p = Object.assign({}, p, dict[p[schema.pk]]);
      }
      return p;
    });

    // Preserves uniqueness
    const unique = new Set();
    return entries.filter(e => {
      if (unique.has(e.publicKey)) {
        return false;
      }
      unique.add(e.publicKey);
      return true;
    });
  }
}

window.YourDLT = Object.assign({}, window.YourDLT ?? {}, {
  Storage,
});
