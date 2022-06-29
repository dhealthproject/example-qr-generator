/**
 * This file is part of dHealth dApps Framework shared under LGPL-3.0
 * Copyright (C) 2022-present dHealth Network, All rights reserved.
 *
 * @package     dHealth dApps Framework
 * @subpackage  Examples
 * @author      dHealth Network <devs@dhealth.foundation>
 * @license     LGPL-3.0
 */
 class Repository {
  static getNodeHealth(adapter) {
    const nodeHttp = adapter.createNodeRepository();
    return nodeHttp.getNodeHealth();
  }

  static getNodeInfo(adapter) {
    const nodeHttp = adapter.createNodeRepository();
    return nodeHttp.getNodeInfo()
  }

  static getNodeStorage(adapter) {
    const nodeHttp = adapter.createNodeRepository();
    return nodeHttp.getStorageInfo();
  }

  static getChainInfo(adapter) {
    const blockHttp = adapter.createChainRepository();
    return blockHttp.getChainInfo().subscribe(
      info => {
        console.log("chain info: ", info);
      });
  }

  static getNodesInfo(adapter) {
    const nodeHttp = adapter.createNodeRepository();
    return nodeHttp.getNodePeers();
  }

  static getChainStorage(adapter, animate = null) {
    const nodeHttp = adapter.createNodeRepository();
    return nodeHttp.getStorageInfo().subscribe(
      storage => console.log("storage info: ", storage)
    );
  }

  static getUnlockedAccounts(adapter) {
    const nodeHttp = adapter.createNodeRepository();
    return nodeHttp.getUnlockedAccount();
  }
}

window.YourDLT = Object.assign({}, window.YourDLT ?? {}, {
  Repository,
});
